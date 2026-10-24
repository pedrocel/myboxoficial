import fs from 'node:fs/promises'
import path from 'node:path'
import { canManageUnit, fail, requireProfile, type App, type Deps } from '../app.ts'

const MAX_BYTES = 5 * 1024 * 1024
const TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}
const SLUG = /^[a-z0-9-]+$/

/** Fotos da galeria das unidades, gravadas no volume em data/files/units/<slug>/. */
export function registerUploadRoutes(app: App, deps: Deps) {
  const root = path.resolve(deps.config.storageDir)
  const publicPrefix = `${deps.config.publicBaseUrl}/files/`

  app.post('/uploads/units/:slug', async (c) => {
    const profile = requireProfile(c)
    const slug = c.req.param('slug')
    if (!SLUG.test(slug) || !canManageUnit(profile, slug)) fail(403, 'sem_permissao')

    const body = await c.req.parseBody()
    const file = body.file
    if (!(file instanceof File)) fail(400, 'arquivo_obrigatorio')
    const ext = TYPES[(file as File).type]
    if (!ext) fail(400, 'formato_nao_suportado')
    if ((file as File).size > MAX_BYTES) fail(413, 'arquivo_grande_demais')

    const relative = `units/${slug}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`
    await fs.mkdir(path.join(root, 'units', slug), { recursive: true })
    await fs.writeFile(path.join(root, relative), Buffer.from(await (file as File).arrayBuffer()))
    return c.json({ url: publicPrefix + relative }, 201)
  })

  app.delete('/uploads', async (c) => {
    const profile = requireProfile(c)
    const url = c.req.query('url') ?? ''
    if (!url.startsWith(publicPrefix)) return c.json({ ok: true })
    const relative = url.slice(publicPrefix.length)
    const match = /^units\/([a-z0-9-]+)\/[\w.-]+$/.exec(relative)
    if (!match || !canManageUnit(profile, match[1])) fail(403, 'sem_permissao')
    await fs.rm(path.join(root, relative), { force: true })
    return c.json({ ok: true })
  })

  app.get('/files/*', async (c) => {
    const relative = decodeURIComponent(c.req.path.slice('/files/'.length))
    const full = path.resolve(root, relative)
    // Nada fora da pasta de arquivos, nem com ../ no caminho.
    if (!full.startsWith(root + path.sep)) fail(404, 'nao_encontrado')
    const ext = path.extname(full).slice(1)
    const type = Object.entries(TYPES).find(([, e]) => e === ext)?.[0]
    if (!type) fail(404, 'nao_encontrado')
    try {
      const data = await fs.readFile(full)
      return c.body(data, 200, { 'Content-Type': type!, 'Cache-Control': 'public, max-age=31536000, immutable' })
    } catch {
      return fail(404, 'nao_encontrado')
    }
  })
}

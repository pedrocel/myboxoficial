import { canManageUnit, fail, readJson, requireProfile, type App, type Deps } from '../app.ts'
import { newId, nowIso } from '../db.ts'
import { createRateLimiter } from '../rateLimit.ts'
import { toUnit, UNIT_EDITABLE, unitColumnValue, type UnitRow } from '../rows.ts'

/** Colunas que so o admin muda: tirar a unidade do ar e trocar o nome e decisao da rede. */
const ADMIN_ONLY = new Set(['status', 'is_public', 'name'])

export function registerUnitRoutes(app: App, deps: Deps) {
  const { db } = deps
  const visitLimiter = createRateLimiter(60, 60_000)

  const findUnit = (slug: string) => db.prepare('SELECT * FROM units WHERE slug = ?').get(slug) as UnitRow | undefined

  // Publico: o site lista todas e esconde as desativadas; o painel do admin precisa das duas.
  app.get('/units', (c) => {
    const rows = db.prepare('SELECT * FROM units ORDER BY name').all() as UnitRow[]
    return c.json(rows.map(toUnit))
  })

  app.get('/units/:slug', (c) => {
    const row = findUnit(c.req.param('slug'))
    if (!row) fail(404, 'unidade_nao_encontrada')
    return c.json(toUnit(row!))
  })

  app.patch('/units/:slug', async (c) => {
    const profile = requireProfile(c)
    const slug = c.req.param('slug')
    if (!canManageUnit(profile, slug)) fail(403, 'sem_permissao')
    if (!findUnit(slug)) fail(404, 'unidade_nao_encontrada')

    const body = await readJson<Record<string, unknown>>(c)
    const columns = UNIT_EDITABLE.filter((col) => col in body && (profile.role === 'admin' || !ADMIN_ONLY.has(col)))
    if (!columns.length) fail(400, 'nada_para_atualizar')

    const sets = [...columns.map((col) => `${col} = ?`), 'updated_at = ?'].join(', ')
    const values = [...columns.map((col) => unitColumnValue(col, body[col])), nowIso(), slug]
    db.prepare(`UPDATE units SET ${sets} WHERE slug = ?`).run(...values)
    return c.json(toUnit(findUnit(slug)!))
  })

  // Visita na pagina da unidade: anonimo, por isso com limite por IP.
  app.post('/units/:slug/visits', async (c) => {
    const slug = c.req.param('slug')
    if (!visitLimiter.allow(deps.clientIp(c))) return c.json({ ok: true })
    if (!findUnit(slug)) fail(404, 'unidade_nao_encontrada')
    const body = await readJson<{ path?: string; referrer?: string }>(c).catch(() => ({}) as Record<string, string>)
    db.prepare('INSERT INTO unit_visits (id, unit_slug, path, referrer, created_at) VALUES (?, ?, ?, ?, ?)').run(
      newId(),
      slug,
      String(body.path ?? '').slice(0, 300) || null,
      String(body.referrer ?? '').slice(0, 500) || null,
      nowIso(),
    )
    db.prepare('UPDATE units SET visits_count = visits_count + 1 WHERE slug = ?').run(slug)
    return c.json({ ok: true }, 201)
  })

  app.get('/units/:slug/visits', (c) => {
    const profile = requireProfile(c)
    const slug = c.req.param('slug')
    if (!canManageUnit(profile, slug)) fail(403, 'sem_permissao')
    const limit = Math.min(Number(c.req.query('limit') ?? 50) || 50, 500)
    const rows = db
      .prepare('SELECT * FROM unit_visits WHERE unit_slug = ? ORDER BY created_at DESC LIMIT ?')
      .all(slug, limit)
    return c.json(rows)
  })
}

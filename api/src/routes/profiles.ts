import { deleteProfileSessions, hashPassword, randomPassword, verifyPassword } from '../auth.ts'
import { fail, readJson, requireProfile, requireRole, type App, type Deps } from '../app.ts'
import { newId, nowIso } from '../db.ts'
import { toProfile, type ProfileRow, type Role } from '../rows.ts'
import { MIN_PASSWORD } from './bookings.ts'

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

export function registerProfileRoutes(app: App, deps: Deps) {
  const { db } = deps
  const findRow = (id: string) => db.prepare('SELECT * FROM profiles WHERE id = ?').get(id) as ProfileRow | undefined

  app.get('/profiles', requireRole('admin'), (c) => {
    const rows = db.prepare('SELECT * FROM profiles ORDER BY created_at DESC').all() as ProfileRow[]
    return c.json(rows.map(toProfile))
  })

  app.patch('/profiles/me', async (c) => {
    const profile = requireProfile(c)
    const { full_name, phone } = await readJson<{ full_name?: string; phone?: string }>(c)
    db.prepare('UPDATE profiles SET full_name = ?, phone = ?, updated_at = ? WHERE id = ?').run(
      (full_name ?? profile.full_name ?? '').trim() || null,
      (phone ?? profile.phone ?? '').trim() || null,
      nowIso(),
      profile.id,
    )
    return c.json(toProfile(findRow(profile.id)!))
  })

  app.post('/profiles/me/password', async (c) => {
    const profile = requireProfile(c)
    const { current, password } = await readJson<{ current?: string; password?: string }>(c)
    if (!password || password.length < MIN_PASSWORD) fail(400, 'senha_curta')
    if (!(await verifyPassword(current ?? '', findRow(profile.id)!.password_hash))) fail(401, 'senha_atual_incorreta')
    db.prepare('UPDATE profiles SET password_hash = ?, updated_at = ? WHERE id = ?').run(
      await hashPassword(password!),
      nowIso(),
      profile.id,
    )
    return c.json({ ok: true })
  })

  app.get('/profiles/:id', (c) => {
    const profile = requireProfile(c)
    const id = c.req.param('id')
    if (profile.role !== 'admin' && profile.id !== id) fail(403, 'sem_permissao')
    const row = findRow(id)
    if (!row) fail(404, 'usuario_nao_encontrado')
    return c.json(toProfile(row!))
  })

  /** Admin cadastra dono ou outro admin. A senha volta uma vez so, para repassar. */
  app.post('/profiles', requireRole('admin'), async (c) => {
    const body = await readJson<{ email?: string; full_name?: string; role?: Role; unit_slug?: string }>(c)
    const email = (body.email ?? '').trim().toLowerCase()
    const role = body.role ?? 'owner'
    if (!EMAIL.test(email) || !['admin', 'owner'].includes(role)) fail(400, 'dados_invalidos')
    if (role === 'owner' && !db.prepare('SELECT 1 FROM units WHERE slug = ?').get(body.unit_slug ?? '')) fail(400, 'unidade_invalida')
    if (db.prepare('SELECT 1 FROM profiles WHERE email = ?').get(email)) fail(409, 'email_ja_cadastrado')

    const password = randomPassword()
    const id = newId()
    const now = nowIso()
    db.prepare(
      `INSERT INTO profiles (id, email, password_hash, full_name, role, unit_slug, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(id, email, await hashPassword(password), body.full_name?.trim() || null, role, role === 'owner' ? body.unit_slug! : null, now, now)
    if (role === 'owner') db.prepare('UPDATE units SET owner_id = ? WHERE slug = ?').run(id, body.unit_slug!)
    return c.json({ profile: toProfile(findRow(id)!), password }, 201)
  })

  app.post('/profiles/:id/reset-password', requireRole('admin'), async (c) => {
    const id = c.req.param('id')
    if (!findRow(id)) fail(404, 'usuario_nao_encontrado')
    const password = randomPassword()
    db.prepare('UPDATE profiles SET password_hash = ?, updated_at = ? WHERE id = ?').run(await hashPassword(password), nowIso(), id)
    // Senha nova derruba as sessoes antigas: quem tinha a senha anterior sai.
    deleteProfileSessions(db, id)
    return c.json({ password })
  })
}

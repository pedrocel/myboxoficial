import { createHash, randomBytes } from 'node:crypto'
import { createSession, deleteProfileSessions, hashPassword } from '../auth.ts'
import { fail, readJson, type App, type Deps } from '../app.ts'
import { passwordEmail } from '../email.ts'
import { nowIso } from '../db.ts'
import { createRateLimiter } from '../rateLimit.ts'
import { toProfile, type ProfileRow } from '../rows.ts'
import { startSession } from './auth.ts'

/*
 * Primeiro acesso e "esqueci a senha". Os donos das unidades sao cadastrados sem senha;
 * no primeiro acesso pedem o link, recebem o e-mail e criam a senha. A resposta e sempre
 * a mesma, exista ou nao o e-mail, para ninguem descobrir quem tem conta.
 */

const TOKEN_HOURS = 24
const hashToken = (token: string) => createHash('sha256').update(token).digest('hex')

type TokenRow = { id: string; profile_id: string; app: 'painel' | 'games'; expires_at: string; used_at: string | null }

export function registerPasswordRoutes(app: App, deps: Deps) {
  const { db, config } = deps
  const ipLimiter = createRateLimiter(10, 60 * 60_000)
  const emailLimiter = createRateLimiter(3, 60 * 60_000)

  function validToken(token: string) {
    const row = db.prepare('SELECT * FROM password_tokens WHERE id = ?').get(hashToken(token)) as TokenRow | undefined
    if (!row || row.used_at || row.expires_at <= nowIso()) return null
    return row
  }

  app.post('/auth/password/request', async (c) => {
    if (!ipLimiter.allow(deps.clientIp(c))) fail(429, 'muitas_tentativas')
    const body = await readJson<{ email?: string; app?: string }>(c)
    const email = body.email?.trim().toLowerCase() ?? ''
    const target = body.app === 'games' ? 'games' : 'painel'
    if (!email) fail(400, 'email_invalido')

    const profile = db.prepare('SELECT * FROM profiles WHERE email = ?').get(email) as ProfileRow | undefined
    if (profile && emailLimiter.allow(email)) {
      const token = randomBytes(32).toString('base64url')
      const now = new Date()
      db.prepare('INSERT INTO password_tokens (id, profile_id, app, created_at, expires_at) VALUES (?, ?, ?, ?, ?)').run(
        hashToken(token),
        profile.id,
        target,
        now.toISOString(),
        new Date(now.getTime() + TOKEN_HOURS * 3_600_000).toISOString(),
      )
      const unit = profile.unit_slug
        ? (db.prepare('SELECT name FROM units WHERE slug = ?').get(profile.unit_slug) as { name: string } | undefined)
        : undefined
      const base = target === 'games' ? config.gamesUrl : config.siteUrl
      const message = passwordEmail({
        to: profile.email,
        name: profile.full_name,
        unitName: profile.role === 'owner' ? (unit?.name ?? null) : null,
        firstAccess: !profile.password_hash,
        app: target,
        url: `${base}/criar-senha?token=${token}`,
        hours: TOKEN_HOURS,
      })
      // Falha do provedor nao muda a resposta (nem revela o e-mail); fica no log.
      await deps.sendEmail(message).catch((err) => console.error('[email] falhou:', err))
    }
    return c.json({ ok: true })
  })

  app.get('/auth/password/check', (c) => {
    const row = validToken(c.req.query('token') ?? '')
    if (!row) fail(404, 'link_invalido')
    const profile = db.prepare('SELECT email, full_name, password_hash FROM profiles WHERE id = ?').get(row!.profile_id) as {
      email: string
      full_name: string | null
      password_hash: string | null
    }
    return c.json({ email: profile.email, name: profile.full_name, first_access: !profile.password_hash })
  })

  app.post('/auth/password/set', async (c) => {
    const { token, password } = await readJson<{ token?: string; password?: string }>(c)
    if ((password ?? '').length < 8) fail(400, 'senha_curta')
    const row = validToken(token ?? '')
    if (!row) fail(404, 'link_invalido')

    const now = nowIso()
    db.prepare('UPDATE profiles SET password_hash = ?, updated_at = ? WHERE id = ?').run(await hashPassword(password!), now, row!.profile_id)
    // Usa este link e invalida os outros pendentes; derruba sessoes antigas.
    db.prepare('UPDATE password_tokens SET used_at = ? WHERE profile_id = ? AND used_at IS NULL').run(now, row!.profile_id)
    deleteProfileSessions(db, row!.profile_id)

    startSession(c, deps, row!.profile_id)
    const profile = toProfile(db.prepare('SELECT * FROM profiles WHERE id = ?').get(row!.profile_id) as ProfileRow)
    return c.json({ profile, token: createSession(db, profile.id).token })
  })
}

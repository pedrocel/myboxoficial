import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import type { Context } from 'hono'
import { createSession, deleteSession, SESSION_COOKIE, verifyPassword } from '../auth.ts'
import { fail, readJson, requireProfile, type App, type Deps, type Env } from '../app.ts'
import { toProfile, type ProfileRow } from '../rows.ts'
import { createRateLimiter } from '../rateLimit.ts'

export function startSession(c: Context<Env>, deps: Deps, profileId: string) {
  const { token, expiresAt } = createSession(deps.db, profileId)
  setCookie(c, SESSION_COOKIE, token, {
    httpOnly: true,
    secure: deps.config.secureCookies,
    // Site e API ficam no mesmo dominio (myboxoficial.com.br), entao Lax basta.
    sameSite: 'Lax',
    path: '/',
    expires: expiresAt,
  })
}

export function registerAuthRoutes(app: App, deps: Deps) {
  const { db } = deps
  // 10 tentativas por minuto por IP: segura forca bruta sem atrapalhar quem errou a senha.
  const loginLimiter = createRateLimiter(10, 60_000)

  app.post('/auth/login', async (c) => {
    if (!loginLimiter.allow(deps.clientIp(c))) fail(429, 'muitas_tentativas')
    const { email, password } = await readJson<{ email?: string; password?: string }>(c)
    if (!email || !password) fail(400, 'email_e_senha_obrigatorios')

    const row = db.prepare('SELECT * FROM profiles WHERE email = ?').get(email!.trim().toLowerCase()) as
      | ProfileRow
      | undefined
    const ok = await verifyPassword(password!, row?.password_hash ?? null)
    if (!row || !ok) fail(401, 'credenciais_invalidas')

    startSession(c, deps, row!.id)
    return c.json({ profile: toProfile(row!) })
  })

  app.post('/auth/logout', (c) => {
    const token = getCookie(c, SESSION_COOKIE)
    if (token) deleteSession(db, token)
    deleteCookie(c, SESSION_COOKIE, { path: '/', secure: deps.config.secureCookies })
    return c.json({ ok: true })
  })

  app.get('/auth/me', (c) => c.json({ profile: requireProfile(c) }))
}

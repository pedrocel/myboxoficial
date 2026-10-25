import { Hono, type Context, type MiddlewareHandler } from 'hono'
import { cors } from 'hono/cors'
import { getCookie } from 'hono/cookie'
import { HTTPException } from 'hono/http-exception'
import { findSessionProfileId, SESSION_COOKIE } from './auth.ts'
import type { Config } from './config.ts'
import type { Db } from './db.ts'
import type { SendEmail } from './email.ts'
import { registerPasswordRoutes } from './routes/password.ts'
import { toProfile, type Profile, type ProfileRow } from './rows.ts'
import { registerAuthRoutes } from './routes/auth.ts'
import { registerGameRoutes } from './routes/games.ts'
import { registerBookingRoutes } from './routes/bookings.ts'
import { registerLeadRoutes } from './routes/leads.ts'
import { registerProfileRoutes } from './routes/profiles.ts'
import { registerUnitRoutes } from './routes/units.ts'
import { registerUploadRoutes } from './routes/uploads.ts'

export type Env = { Variables: { profile: Profile | null } }
export type App = Hono<Env>

export type Deps = {
  config: Config
  db: Db
  /** Endereco de quem chamou: atras do Caddy vem do X-Forwarded-For. */
  clientIp: (c: Context) => string
  sendEmail: SendEmail
}

export function buildApp(deps: Deps): App {
  const { config, db } = deps
  const app = new Hono<Env>()

  app.use(
    '*',
    cors({
      origin: (origin) => (config.allowedOrigins.includes(origin) ? origin : null),
      credentials: true,
      allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'X-Lead-Token', 'Authorization'],
      maxAge: 86400,
    }),
  )

  // Quem esta logado, se alguem estiver. Cada rota decide o que exigir.
  app.use('*', async (c, next) => {
    // Site usa o cookie; o app (iOS) manda o mesmo token no Authorization.
    const bearer = c.req.header('authorization')?.match(/^Bearer (.+)$/)?.[1]
    const token = bearer ?? getCookie(c, SESSION_COOKIE)
    const profileId = token ? findSessionProfileId(db, token) : undefined
    const row = profileId ? (db.prepare('SELECT * FROM profiles WHERE id = ?').get(profileId) as ProfileRow | undefined) : undefined
    c.set('profile', row ? toProfile(row) : null)
    await next()
  })

  app.get('/health', (c) => c.json({ ok: true }))

  registerAuthRoutes(app, deps)
  registerUnitRoutes(app, deps)
  registerBookingRoutes(app, deps)
  registerProfileRoutes(app, deps)
  registerLeadRoutes(app, deps)
  registerUploadRoutes(app, deps)
  registerGameRoutes(app, deps)
  registerPasswordRoutes(app, deps)

  app.notFound((c) => c.json({ error: 'nao_encontrado' }, 404))
  app.onError((err, c) => {
    if (err instanceof HTTPException) return c.json({ error: err.message }, err.status)
    console.error(err)
    return c.json({ error: 'erro_interno' }, 500)
  })

  return app
}

/* Controle de acesso: o que antes eram as policies (RLS) do Supabase. */

export const fail = (status: 400 | 401 | 403 | 404 | 409 | 413 | 429, error: string): never => {
  throw new HTTPException(status, { message: error })
}

export function requireProfile(c: Context<Env>): Profile {
  return c.get('profile') ?? fail(401, 'nao_autenticado')
}

export const requireRole =
  (...roles: Profile['role'][]): MiddlewareHandler<Env> =>
  async (c, next) => {
    const profile = requireProfile(c)
    if (!roles.includes(profile.role)) fail(403, 'sem_permissao')
    await next()
  }

/** Admin ve tudo; dono so a propria unidade. */
export function canManageUnit(profile: Profile, slug: string) {
  return profile.role === 'admin' || (profile.role === 'owner' && profile.unit_slug === slug)
}

export async function readJson<T>(c: Context): Promise<T> {
  try {
    return (await c.req.json()) as T
  } catch {
    return fail(400, 'json_invalido')
  }
}

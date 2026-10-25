import { randomInt } from 'node:crypto'
import { createSession, deleteProfileSessions, deleteSession, hashPassword, verifyPassword } from '../auth.ts'
import { canManageUnit, fail, readJson, requireProfile, type App, type Deps } from '../app.ts'
import { newId, nowIso } from '../db.ts'
import { createRateLimiter } from '../rateLimit.ts'
import { toProfile, type Profile, type ProfileRow } from '../rows.ts'

/*
 * My Box Games. O dono da unidade e o anfitriao: compartilha o codigo da unidade, aprova ou
 * reprova os alunos (ou liga a aprovacao automatica). Aluno aprovado faz check-in e lanca o
 * resultado do WOD; isso pontua o aluno e a unidade no ranking.
 * O app usa o token no Authorization (site e iOS), por isso login e cadastro devolvem o token.
 */

export type WodType = 'fortime' | 'amrap'
export type Wod = { id: string; title: string; type: WodType; description: string; time_cap_min: number; movements: string[] }

/** WODs da rede, em rodizio diario. O id leva a data para o ranking ser do dia. */
const WODS: Omit<Wod, 'id'>[] = [
  { title: 'Fran', type: 'fortime', description: '21-15-9, cap de 10 min.', time_cap_min: 10, movements: ['Thrusters (43/29 kg)', 'Pull-ups'] },
  { title: 'Cindy', type: 'amrap', description: 'AMRAP 20 min. Conte os rounds.', time_cap_min: 20, movements: ['5 Pull-ups', '10 Push-ups', '15 Air squats'] },
  { title: 'Helen', type: 'fortime', description: '3 rounds, cap de 15 min.', time_cap_min: 15, movements: ['400 m Run', '21 KB swings (24/16 kg)', '12 Pull-ups'] },
  { title: 'Box Wars', type: 'amrap', description: 'AMRAP 12 min. Conte os rounds.', time_cap_min: 12, movements: ['10 Wall balls', '10 Box jumps', '10 Burpees'] },
  { title: 'Grace', type: 'fortime', description: '30 reps, cap de 8 min.', time_cap_min: 8, movements: ['30 Clean & Jerks (61/43 kg)'] },
]

const SAO_PAULO_OFFSET_MS = 3 * 3_600_000
export const todayKey = (now = Date.now()) => new Date(now - SAO_PAULO_OFFSET_MS).toISOString().slice(0, 10)

export function wodFor(day: string): Wod {
  const index = Math.floor(Date.parse(day) / 86_400_000) % WODS.length
  return { id: `wod-${day}`, ...WODS[index] }
}

/** Pontos: check-in vale 1, resultado vale 3. Unidade soma os pontos dos alunos aprovados. */
const POINTS = { checkin: 1, result: 3 }

// Sem letras que se confundem (0/O, 1/I) para o aluno digitar o codigo sem errar.
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const newCode = () => Array.from({ length: 6 }, () => CODE_ALPHABET[randomInt(CODE_ALPHABET.length)]).join('')

type GameUnitRow = { unit_slug: string; join_code: string; auto_approve: number; updated_at: string }
type MemberRow = { id: string; profile_id: string; unit_slug: string; status: 'pending' | 'approved' | 'rejected'; created_at: string; decided_at: string | null }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function registerGameRoutes(app: App, deps: Deps) {
  const { db } = deps
  const authLimiter = createRateLimiter(10, 60_000)
  const joinLimiter = createRateLimiter(10, 60_000)

  /** Cada unidade ganha codigo na primeira vez que alguem precisa dele. */
  function gameUnit(slug: string): GameUnitRow {
    const found = db.prepare('SELECT * FROM game_units WHERE unit_slug = ?').get(slug) as GameUnitRow | undefined
    if (found) return found
    for (;;) {
      const code = newCode()
      if (db.prepare('SELECT 1 FROM game_units WHERE join_code = ?').get(code)) continue
      db.prepare('INSERT INTO game_units (unit_slug, join_code, auto_approve, updated_at) VALUES (?, ?, 0, ?)').run(slug, code, nowIso())
      return gameUnit(slug)
    }
  }

  const unitName = (slug: string) =>
    (db.prepare('SELECT name, cidade, estado FROM units WHERE slug = ?').get(slug) as { name: string; cidade: string | null; estado: string | null } | undefined) ?? null

  const membershipOf = (profileId: string) =>
    db.prepare('SELECT * FROM game_members WHERE profile_id = ?').get(profileId) as MemberRow | undefined

  function requireApproved(profile: Profile): MemberRow {
    const member = membershipOf(profile.id)
    if (!member || member.status !== 'approved') fail(403, 'aguardando_aprovacao')
    return member!
  }

  function requireHost(c: Parameters<typeof requireProfile>[0], slug: string) {
    const profile = requireProfile(c)
    if (!canManageUnit(profile, slug)) fail(403, 'sem_permissao')
    if (!unitName(slug)) fail(404, 'unidade_nao_encontrada')
    return profile
  }

  const session = (profileId: string) => {
    const row = db.prepare('SELECT * FROM profiles WHERE id = ?').get(profileId) as ProfileRow
    return { token: createSession(db, profileId).token, profile: toProfile(row) }
  }

  /* Conta */

  app.post('/games/auth/register', async (c) => {
    if (!authLimiter.allow(deps.clientIp(c))) fail(429, 'muitas_tentativas')
    const body = await readJson<{ name?: string; email?: string; password?: string; phone?: string; accept_terms?: boolean }>(c)
    const name = body.name?.trim() ?? ''
    const email = body.email?.trim().toLowerCase() ?? ''
    if (name.length < 2) fail(400, 'nome_obrigatorio')
    if (!EMAIL_RE.test(email)) fail(400, 'email_invalido')
    if ((body.password ?? '').length < 8) fail(400, 'senha_curta')
    if (body.accept_terms !== true) fail(400, 'aceite_os_termos')

    const existing = db.prepare('SELECT * FROM profiles WHERE email = ?').get(email) as ProfileRow | undefined
    if (existing?.password_hash) fail(409, 'email_ja_cadastrado')

    const now = nowIso()
    const hash = await hashPassword(body.password!)
    let id = existing?.id
    if (existing) {
      // Aluno que so agendou aula experimental (sem senha) vira conta do Games.
      db.prepare('UPDATE profiles SET password_hash = ?, full_name = ?, phone = COALESCE(?, phone), terms_accepted_at = ?, updated_at = ? WHERE id = ?')
        .run(hash, name.slice(0, 120), body.phone?.trim() || null, now, now, existing.id)
    } else {
      id = newId()
      db.prepare(
        `INSERT INTO profiles (id, email, password_hash, full_name, phone, role, terms_accepted_at, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, 'student', ?, ?, ?)`,
      ).run(id, email, hash, name.slice(0, 120), body.phone?.trim() || null, now, now, now)
    }
    return c.json(session(id!), 201)
  })

  app.post('/games/auth/login', async (c) => {
    if (!authLimiter.allow(deps.clientIp(c))) fail(429, 'muitas_tentativas')
    const { email, password } = await readJson<{ email?: string; password?: string }>(c)
    if (!email || !password) fail(400, 'email_e_senha_obrigatorios')
    const row = db.prepare('SELECT * FROM profiles WHERE email = ?').get(email!.trim().toLowerCase()) as ProfileRow | undefined
    const ok = await verifyPassword(password!, row?.password_hash ?? null)
    if (!row || !ok) fail(401, 'credenciais_invalidas')
    return c.json(session(row!.id))
  })

  app.post('/games/auth/logout', (c) => {
    const token = c.req.header('authorization')?.match(/^Bearer (.+)$/)?.[1]
    if (token) deleteSession(db, token)
    return c.json({ ok: true })
  })

  app.get('/games/me', (c) => {
    const profile = requireProfile(c)
    const member = membershipOf(profile.id)
    const hostOf = profile.role === 'owner' && profile.unit_slug ? profile.unit_slug : null
    return c.json({
      profile,
      membership: member ? { ...member, unit: { slug: member.unit_slug, ...unitName(member.unit_slug) } } : null,
      host_unit: hostOf ? { slug: hostOf, ...unitName(hostOf) } : null,
    })
  })

  // Exigencia da App Store: o aluno apaga a propria conta pelo app.
  app.delete('/games/me', async (c) => {
    const profile = requireProfile(c)
    if (profile.role !== 'student') fail(403, 'conta_de_unidade_fale_com_a_rede')
    const { password } = await readJson<{ password?: string }>(c)
    const row = db.prepare('SELECT password_hash FROM profiles WHERE id = ?').get(profile.id) as { password_hash: string | null }
    if (!(await verifyPassword(password ?? '', row.password_hash))) fail(401, 'senha_incorreta')
    deleteProfileSessions(db, profile.id)
    db.prepare('UPDATE bookings SET student_id = NULL WHERE student_id = ?').run(profile.id)
    db.prepare('DELETE FROM profiles WHERE id = ?').run(profile.id)
    return c.json({ ok: true })
  })

  /* Aluno entra na unidade pelo codigo */

  app.post('/games/join', async (c) => {
    const profile = requireProfile(c)
    if (!joinLimiter.allow(profile.id)) fail(429, 'muitas_tentativas')
    if (profile.role !== 'student') fail(403, 'so_alunos_entram_por_codigo')
    const code = (await readJson<{ code?: string }>(c)).code?.trim().toUpperCase() ?? ''
    const unit = db.prepare('SELECT * FROM game_units WHERE join_code = ?').get(code) as GameUnitRow | undefined
    if (!unit) fail(404, 'codigo_invalido')
    const info = db.prepare('SELECT status FROM units WHERE slug = ?').get(unit!.unit_slug) as { status: number }
    if (!info.status) fail(404, 'codigo_invalido')

    const current = membershipOf(profile.id)
    if (current?.status === 'approved' && current.unit_slug === unit!.unit_slug) return c.json(current)

    const status = unit!.auto_approve ? 'approved' : 'pending'
    const now = nowIso()
    db.prepare('DELETE FROM game_members WHERE profile_id = ?').run(profile.id)
    db.prepare('INSERT INTO game_members (id, profile_id, unit_slug, status, created_at, decided_at) VALUES (?, ?, ?, ?, ?, ?)').run(
      newId(),
      profile.id,
      unit!.unit_slug,
      status,
      now,
      status === 'approved' ? now : null,
    )
    return c.json(membershipOf(profile.id), 201)
  })

  /* Anfitriao (dono da unidade) */

  app.get('/games/host/:slug', (c) => {
    const slug = c.req.param('slug')
    requireHost(c, slug)
    const unit = gameUnit(slug)
    const members = db
      .prepare(
        `SELECT m.id, m.status, m.created_at, m.decided_at, p.full_name, p.email, p.phone
         FROM game_members m JOIN profiles p ON p.id = m.profile_id
         WHERE m.unit_slug = ? ORDER BY m.status = 'pending' DESC, m.created_at DESC`,
      )
      .all(slug)
    return c.json({ unit: { slug, ...unitName(slug) }, join_code: unit.join_code, auto_approve: Boolean(unit.auto_approve), members })
  })

  app.patch('/games/host/:slug', async (c) => {
    const slug = c.req.param('slug')
    requireHost(c, slug)
    gameUnit(slug)
    const { auto_approve } = await readJson<{ auto_approve?: boolean }>(c)
    if (typeof auto_approve !== 'boolean') fail(400, 'nada_para_atualizar')
    db.prepare('UPDATE game_units SET auto_approve = ?, updated_at = ? WHERE unit_slug = ?').run(auto_approve ? 1 : 0, nowIso(), slug)
    // Ligar a aprovacao automatica libera quem ja estava esperando.
    if (auto_approve) {
      db.prepare("UPDATE game_members SET status = 'approved', decided_at = ? WHERE unit_slug = ? AND status = 'pending'").run(nowIso(), slug)
    }
    return c.json({ ok: true })
  })

  app.post('/games/host/:slug/code', (c) => {
    const slug = c.req.param('slug')
    requireHost(c, slug)
    gameUnit(slug)
    let code = newCode()
    while (db.prepare('SELECT 1 FROM game_units WHERE join_code = ?').get(code)) code = newCode()
    db.prepare('UPDATE game_units SET join_code = ?, updated_at = ? WHERE unit_slug = ?').run(code, nowIso(), slug)
    return c.json({ join_code: code })
  })

  app.post('/games/host/:slug/members/:id', async (c) => {
    const slug = c.req.param('slug')
    const host = requireHost(c, slug)
    const { status } = await readJson<{ status?: string }>(c)
    if (status !== 'approved' && status !== 'rejected') fail(400, 'status_invalido')
    const result = db
      .prepare('UPDATE game_members SET status = ?, decided_at = ?, decided_by = ? WHERE id = ? AND unit_slug = ?')
      .run(status!, nowIso(), host.id, c.req.param('id'), slug)
    if (!result.changes) fail(404, 'aluno_nao_encontrado')
    return c.json({ ok: true })
  })

  /* Jogo */

  app.get('/games/wod/today', (c) => c.json(wodFor(todayKey())))

  app.get('/games/progress', (c) => {
    const profile = requireProfile(c)
    const checkins = (db.prepare('SELECT day FROM game_checkins WHERE profile_id = ? ORDER BY day DESC LIMIT 400').all(profile.id) as { day: string }[]).map((r) => r.day)
    const results = db.prepare('SELECT wod_id, score, rx, created_at FROM game_results WHERE profile_id = ? ORDER BY created_at DESC LIMIT 100').all(profile.id) as {
      wod_id: string
      score: number
      rx: number
      created_at: string
    }[]
    return c.json({ checkins, results: results.map((r) => ({ ...r, rx: Boolean(r.rx) })), today: todayKey() })
  })

  app.post('/games/checkin', (c) => {
    const profile = requireProfile(c)
    const member = requireApproved(profile)
    db.prepare('INSERT OR IGNORE INTO game_checkins (profile_id, unit_slug, day, created_at) VALUES (?, ?, ?, ?)').run(profile.id, member.unit_slug, todayKey(), nowIso())
    return c.json({ ok: true, day: todayKey() }, 201)
  })

  app.post('/games/results', async (c) => {
    const profile = requireProfile(c)
    const member = requireApproved(profile)
    const body = await readJson<{ score?: number; rx?: boolean }>(c)
    const wod = wodFor(todayKey())
    const score = Number(body.score)
    const max = wod.type === 'fortime' ? wod.time_cap_min * 60 : 500
    if (!Number.isInteger(score) || score <= 0 || score > max) fail(400, 'resultado_invalido')
    db.prepare(
      `INSERT INTO game_results (id, profile_id, unit_slug, wod_id, score, rx, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT (profile_id, wod_id) DO UPDATE SET score = excluded.score, rx = excluded.rx, created_at = excluded.created_at`,
    ).run(newId(), profile.id, member.unit_slug, wod.id, score, body.rx === false ? 0 : 1, nowIso())
    return c.json({ ok: true }, 201)
  })

  /* Ranking (publico) */

  app.get('/games/ranking/units', (c) => {
    const days = Math.min(Math.max(Number(c.req.query('days') ?? 30) || 30, 1), 365)
    const since = todayKey(Date.now() - days * 86_400_000)
    const rows = db
      .prepare(
        `SELECT u.slug, u.name, u.cidade, u.estado,
           (SELECT COUNT(*) FROM game_members m WHERE m.unit_slug = u.slug AND m.status = 'approved') AS athletes,
           (SELECT COUNT(*) FROM game_checkins k JOIN game_members m ON m.profile_id = k.profile_id AND m.unit_slug = k.unit_slug AND m.status = 'approved'
              WHERE k.unit_slug = u.slug AND k.day >= ?) AS checkins,
           (SELECT COUNT(*) FROM game_results r JOIN game_members m ON m.profile_id = r.profile_id AND m.unit_slug = r.unit_slug AND m.status = 'approved'
              WHERE r.unit_slug = u.slug AND substr(r.wod_id, 5) >= ?) AS results
         FROM units u WHERE u.status = 1`,
      )
      .all(since, since) as { slug: string; name: string; athletes: number; checkins: number; results: number }[]
    const ranked = rows
      .map((r) => ({ ...r, points: r.checkins * POINTS.checkin + r.results * POINTS.result }))
      .filter((r) => r.athletes > 0)
      .sort((a, b) => b.points - a.points || b.athletes - a.athletes || a.name.localeCompare(b.name))
    return c.json(ranked)
  })

  app.get('/games/ranking/wod', (c) => {
    const wod = wodFor(todayKey())
    const unit = c.req.query('unit')
    const rows = db
      .prepare(
        `SELECT r.score, r.rx, p.full_name, u.name AS unit_name, u.slug AS unit_slug, r.profile_id
         FROM game_results r
         JOIN game_members m ON m.profile_id = r.profile_id AND m.status = 'approved'
         JOIN profiles p ON p.id = r.profile_id
         JOIN units u ON u.slug = r.unit_slug
         WHERE r.wod_id = ? ${unit ? 'AND r.unit_slug = ?' : ''}
         ORDER BY r.rx DESC, ${wod.type === 'fortime' ? 'r.score ASC' : 'r.score DESC'}
         LIMIT 200`,
      )
      .all(...(unit ? [wod.id, unit] : [wod.id])) as { score: number; rx: number; full_name: string | null; unit_name: string; unit_slug: string; profile_id: string }[]
    const me = c.get('profile')?.id
    return c.json({
      wod,
      rows: rows.map(({ profile_id, full_name, rx, ...r }) => ({
        ...r,
        rx: Boolean(rx),
        // Ranking e publico: so o primeiro nome e a inicial do sobrenome.
        name: shortName(full_name),
        me: profile_id === me,
      })),
    })
  })
}

function shortName(full: string | null) {
  const parts = (full ?? 'Atleta').trim().split(/\s+/)
  return parts.length > 1 ? `${parts[0]} ${parts.at(-1)![0]}.` : parts[0]
}

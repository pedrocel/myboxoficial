import { hashPassword, verifyPassword } from '../auth.ts'
import { canManageUnit, fail, readJson, requireProfile, type App, type Deps } from '../app.ts'
import { newId, nowIso } from '../db.ts'
import { createRateLimiter } from '../rateLimit.ts'
import type { ProfileRow } from '../rows.ts'
import { startSession } from './auth.ts'

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
const STATUSES = ['pending', 'confirmed', 'cancelled', 'completed']
export const MIN_PASSWORD = 8

type NewBooking = {
  unit_slug?: string
  nome?: string
  email?: string
  telefone?: string
  data?: string
  horario?: string
  modalidade?: string
  /** Opcional: com senha, o aluno ganha acesso ao painel na hora. */
  password?: string
}

export function registerBookingRoutes(app: App, deps: Deps) {
  const { db } = deps
  const bookingLimiter = createRateLimiter(10, 10 * 60_000)

  app.post('/bookings', async (c) => {
    if (!bookingLimiter.allow(deps.clientIp(c))) fail(429, 'muitas_tentativas')
    const b = await readJson<NewBooking>(c)
    const email = (b.email ?? '').trim().toLowerCase()
    const nome = (b.nome ?? '').trim()
    const telefone = (b.telefone ?? '').trim()
    if (!b.unit_slug || !nome || !EMAIL.test(email) || !telefone) fail(400, 'campos_obrigatorios')
    if (!/^\d{4}-\d{2}-\d{2}$/.test(b.data ?? '') || !/^\d{2}:\d{2}/.test(b.horario ?? '')) fail(400, 'data_ou_horario_invalido')
    if (!db.prepare('SELECT 1 FROM units WHERE slug = ? AND status = 1').get(b.unit_slug!)) fail(404, 'unidade_nao_encontrada')
    if (b.password && b.password.length < MIN_PASSWORD) fail(400, 'senha_curta')

    let student = db.prepare('SELECT * FROM profiles WHERE email = ?').get(email) as ProfileRow | undefined
    // created: conta nova; logged_in: senha conferiu; exists: ja tem conta, entra pelo /entrar.
    let account: 'none' | 'created' | 'logged_in' | 'exists' = 'none'

    if (!student && b.password) {
      const id = newId()
      const now = nowIso()
      db.prepare(
        `INSERT INTO profiles (id, email, password_hash, full_name, phone, role, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, 'student', ?, ?)`,
      ).run(id, email, await hashPassword(b.password), nome, telefone, now, now)
      student = db.prepare('SELECT * FROM profiles WHERE id = ?').get(id) as ProfileRow
      account = 'created'
    } else if (student) {
      account = b.password && (await verifyPassword(b.password, student.password_hash)) ? 'logged_in' : 'exists'
    }

    const id = newId()
    db.prepare(
      `INSERT INTO bookings (id, unit_slug, student_id, student_name, student_email, student_phone,
         booking_date, booking_time, modalidade, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      id,
      b.unit_slug!,
      student?.id ?? null,
      nome,
      email,
      telefone,
      b.data!,
      b.horario!.slice(0, 5),
      (b.modalidade ?? 'Aula Experimental').slice(0, 80),
      nowIso(),
    )

    if (student && (account === 'created' || account === 'logged_in')) startSession(c, deps, student.id)
    return c.json({ booking: db.prepare('SELECT * FROM bookings WHERE id = ?').get(id), account }, 201)
  })

  /**
   * Lista conforme quem pede: admin ve tudo (pode filtrar por unidade ou aluno),
   * dono so a propria unidade, aluno so os proprios agendamentos.
   */
  app.get('/bookings', (c) => {
    const profile = requireProfile(c)
    const where: string[] = []
    const params: string[] = []

    const studentFilter = (id: string, email: string) => {
      where.push('(student_id = ? OR student_email = ?)')
      params.push(id, email)
    }

    if (profile.role === 'student') {
      studentFilter(profile.id, profile.email)
    } else {
      const unit = profile.role === 'owner' ? profile.unit_slug : c.req.query('unit')
      if (profile.role === 'owner' && !unit) return c.json([])
      if (unit) {
        where.push('unit_slug = ?')
        params.push(unit)
      }
      const studentId = c.req.query('student')
      if (studentId && profile.role === 'admin') {
        const s = db.prepare('SELECT id, email FROM profiles WHERE id = ?').get(studentId) as
          | { id: string; email: string }
          | undefined
        if (!s) return c.json([])
        studentFilter(s.id, s.email)
      }
    }

    const order = c.req.query('order') === 'booking_date' ? 'booking_date, booking_time' : 'created_at'
    const dir = c.req.query('dir') === 'asc' ? 'ASC' : 'DESC'
    const limit = Math.min(Number(c.req.query('limit') ?? 1000) || 1000, 5000)
    const sql = `SELECT * FROM bookings ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
      ORDER BY ${order.split(', ').map((col) => `${col} ${dir}`).join(', ')} LIMIT ?`
    return c.json(db.prepare(sql).all(...params, limit))
  })

  app.patch('/bookings/:id', async (c) => {
    const profile = requireProfile(c)
    const booking = db.prepare('SELECT unit_slug FROM bookings WHERE id = ?').get(c.req.param('id')) as
      | { unit_slug: string }
      | undefined
    if (!booking) fail(404, 'agendamento_nao_encontrado')
    if (!canManageUnit(profile, booking!.unit_slug)) fail(403, 'sem_permissao')
    const { status } = await readJson<{ status?: string }>(c)
    if (!status || !STATUSES.includes(status)) fail(400, 'status_invalido')
    db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(status!, c.req.param('id'))
    return c.json(db.prepare('SELECT * FROM bookings WHERE id = ?').get(c.req.param('id')))
  })
}

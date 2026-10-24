import { timingSafeEqual } from 'node:crypto'
import type { Context } from 'hono'
import { fail, readJson, requireRole, type App, type Deps } from '../app.ts'
import { newId, nowIso } from '../db.ts'
import { toLeadEmail } from '../rows.ts'

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
const STATUSES = ['novo', 'contatado', 'qualificado', 'negociacao', 'fechado', 'perdido']

/** Campos que a landing manda; os obrigatorios sao conferidos a parte. */
const LEAD_FIELDS = [
  'nome', 'email', 'telefone', 'cidade', 'investimento', 'estado', 'profissao', 'possui_empresa', 'prazo',
  'instagram', 'mensagem', 'origem', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'gclid', 'pagina', 'referrer',
] as const

export function registerLeadRoutes(app: App, deps: Deps) {
  const { db, config } = deps

  /** So a landing de franquia (servidor) grava leads: ela guarda o token e manda o e-mail. */
  const requireLeadToken = (c: Context) => {
    const sent = Buffer.from(c.req.header('X-Lead-Token') ?? '')
    const expected = Buffer.from(config.leadApiToken)
    if (sent.length !== expected.length || !timingSafeEqual(sent, expected)) fail(401, 'token_invalido')
  }

  // Upsert por e-mail, como a landing ja fazia no Supabase.
  app.post('/leads', async (c) => {
    requireLeadToken(c)
    const body = await readJson<Record<string, unknown>>(c)
    const lead = Object.fromEntries(
      LEAD_FIELDS.map((f) => [f, typeof body[f] === 'string' ? (body[f] as string).trim().slice(0, 2000) || null : null]),
    ) as Record<(typeof LEAD_FIELDS)[number], string | null>
    lead.email = lead.email?.toLowerCase() ?? null
    if (!lead.nome || !lead.email || !EMAIL.test(lead.email) || !lead.telefone || !lead.cidade || !lead.investimento) {
      fail(400, 'campos_obrigatorios')
    }

    const existing = db.prepare('SELECT id FROM leads WHERE email = ?').get(lead.email) as { id: string } | undefined
    const now = nowIso()
    if (existing) {
      const cols = LEAD_FIELDS.filter((f) => f !== 'email')
      db.prepare(`UPDATE leads SET ${cols.map((f) => `${f} = ?`).join(', ')}, updated_at = ? WHERE id = ?`).run(
        ...cols.map((f) => lead[f]),
        now,
        existing.id,
      )
    } else {
      db.prepare(
        `INSERT INTO leads (id, ${LEAD_FIELDS.join(', ')}, created_at, updated_at)
         VALUES (?, ${LEAD_FIELDS.map(() => '?').join(', ')}, ?, ?)`,
      ).run(newId(), ...LEAD_FIELDS.map((f) => lead[f]), now, now)
    }
    const saved = db.prepare('SELECT * FROM leads WHERE email = ?').get(lead.email)
    return c.json({ lead: saved, atualizado: Boolean(existing) }, existing ? 200 : 201)
  })

  // Quem recebe o aviso por e-mail; lista editada no painel (Configuracoes).
  app.get('/leads/recipients', (c) => {
    requireLeadToken(c)
    const rows = db.prepare('SELECT email FROM lead_emails WHERE ativo = 1 ORDER BY created_at').all() as { email: string }[]
    return c.json({ emails: rows.map((r) => r.email) })
  })

  app.get('/leads', requireRole('admin'), (c) => c.json(db.prepare('SELECT * FROM leads ORDER BY created_at DESC').all()))

  app.get('/leads/:id', requireRole('admin'), (c) => {
    const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(c.req.param('id'))
    if (!lead) fail(404, 'lead_nao_encontrado')
    return c.json(lead)
  })

  app.patch('/leads/:id', requireRole('admin'), async (c) => {
    const { status } = await readJson<{ status?: string }>(c)
    if (!status || !STATUSES.includes(status)) fail(400, 'status_invalido')
    const result = db.prepare('UPDATE leads SET status = ?, updated_at = ? WHERE id = ?').run(status!, nowIso(), c.req.param('id'))
    if (!result.changes) fail(404, 'lead_nao_encontrado')
    return c.json(db.prepare('SELECT * FROM leads WHERE id = ?').get(c.req.param('id')))
  })

  /* E-mails que recebem os leads (tela Configuracoes do admin). */

  app.get('/lead-emails', requireRole('admin'), (c) =>
    c.json(db.prepare('SELECT * FROM lead_emails ORDER BY created_at').all().map(toLeadEmail)),
  )

  app.post('/lead-emails', requireRole('admin'), async (c) => {
    const { email, nome } = await readJson<{ email?: string; nome?: string }>(c)
    const normalized = (email ?? '').trim().toLowerCase()
    if (!EMAIL.test(normalized)) fail(400, 'email_invalido')
    if (db.prepare('SELECT 1 FROM lead_emails WHERE email = ?').get(normalized)) fail(409, 'email_ja_cadastrado')
    const id = newId()
    db.prepare('INSERT INTO lead_emails (id, email, nome, ativo, created_at) VALUES (?, ?, ?, 1, ?)').run(
      id,
      normalized,
      nome?.trim() || null,
      nowIso(),
    )
    return c.json(toLeadEmail(db.prepare('SELECT * FROM lead_emails WHERE id = ?').get(id)!), 201)
  })

  app.patch('/lead-emails/:id', requireRole('admin'), async (c) => {
    const { ativo } = await readJson<{ ativo?: boolean }>(c)
    if (typeof ativo !== 'boolean') fail(400, 'ativo_obrigatorio')
    const result = db.prepare('UPDATE lead_emails SET ativo = ? WHERE id = ?').run(ativo ? 1 : 0, c.req.param('id'))
    if (!result.changes) fail(404, 'email_nao_encontrado')
    return c.json({ ok: true })
  })

  app.delete('/lead-emails/:id', requireRole('admin'), (c) => {
    db.prepare('DELETE FROM lead_emails WHERE id = ?').run(c.req.param('id'))
    return c.json({ ok: true })
  })
}

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { hashPassword } from '../src/auth.ts'
import { buildApp } from '../src/app.ts'
import type { Config } from '../src/config.ts'
import { newId, nowIso, openDatabase } from '../src/db.ts'

const config: Config = {
  port: 0,
  host: '127.0.0.1',
  databasePath: ':memory:',
  storageDir: '/tmp/mybox-api-test-files',
  publicBaseUrl: 'http://api.test',
  allowedOrigins: ['http://site.test'],
  leadApiToken: 'token-de-teste',
  resendApiKey: '',
  emailFrom: 'test@test',
  siteUrl: 'http://site.test',
  gamesUrl: 'http://games.test',
  secureCookies: false,
  trustProxy: false,
}

async function setup() {
  const db = openDatabase(':memory:')
  const now = nowIso()
  for (const slug of ['unidade-a', 'unidade-b']) {
    db.prepare('INSERT INTO units (slug, name, created_at, updated_at) VALUES (?, ?, ?, ?)').run(slug, slug, now, now)
  }
  db.prepare('INSERT INTO profiles (id, email, password_hash, role, unit_slug, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
    newId(), 'dono-a@test.com', await hashPassword('senha-forte-1'), 'owner', 'unidade-a', now, now,
  )
  const app = buildApp({ config, db, clientIp: () => '127.0.0.1', sendEmail: async () => {} })
  const call = async (path: string, init: RequestInit & { token?: string; json?: unknown } = {}) => {
    const res = await app.request(path, {
      method: init.method ?? (init.json ? 'POST' : 'GET'),
      body: init.json ? JSON.stringify(init.json) : undefined,
      headers: { 'Content-Type': 'application/json', ...(init.token ? { Authorization: `Bearer ${init.token}` } : {}) },
    })
    return { status: res.status, body: (await res.json()) as any }
  }
  const login = async (email: string) => (await call('/games/auth/login', { json: { email, password: 'senha-forte-1' } })).body.token as string
  const register = async (email: string) =>
    (await call('/games/auth/register', { json: { name: 'Aluno Teste', email, password: 'senha-forte-1', accept_terms: true } })).body.token as string
  return { call, login, register }
}

test('cadastro exige aceite dos termos e nao duplica e-mail', async () => {
  const { call, register } = await setup()
  const sem = await call('/games/auth/register', { json: { name: 'A B', email: 'x@test.com', password: 'senha-forte-1' } })
  assert.equal(sem.status, 400)
  await register('x@test.com')
  assert.equal((await call('/games/auth/register', { json: { name: 'A B', email: 'x@test.com', password: 'senha-forte-1', accept_terms: true } })).status, 409)
})

test('aluno entra por codigo, anfitriao aprova e a unidade pontua no ranking', async () => {
  const { call, login, register } = await setup()
  const host = await login('dono-a@test.com')
  const panel = await call('/games/host/unidade-a', { token: host })
  assert.equal(panel.status, 200)
  assert.equal((await call('/games/host/unidade-b', { token: host })).status, 403)

  const aluno = await register('aluno@test.com')
  assert.equal((await call('/games/join', { token: aluno, json: { code: 'ERRADO' } })).status, 404)
  const join = await call('/games/join', { token: aluno, json: { code: panel.body.join_code.toLowerCase() } })
  assert.equal(join.body.status, 'pending')
  assert.equal((await call('/games/checkin', { token: aluno, method: 'POST' })).status, 403)

  const pending = (await call('/games/host/unidade-a', { token: host })).body.members[0]
  assert.equal((await call(`/games/host/unidade-a/members/${pending.id}`, { token: host, json: { status: 'approved' } })).status, 200)

  assert.equal((await call('/games/checkin', { token: aluno, method: 'POST' })).status, 201)
  assert.equal((await call('/games/results', { token: aluno, json: { score: 300, rx: true } })).status, 201)
  const ranking = await call('/games/ranking/units')
  assert.equal(ranking.body[0].slug, 'unidade-a')
  assert.equal(ranking.body[0].points, 4)
  const wod = await call('/games/ranking/wod', { token: aluno })
  assert.equal(wod.body.rows[0].name, 'Aluno T.')
  assert.equal(wod.body.rows[0].me, true)
})

test('aprovacao automatica libera na hora e aluno apaga a propria conta', async () => {
  const { call, login, register } = await setup()
  const host = await login('dono-a@test.com')
  const { join_code } = (await call('/games/host/unidade-a', { token: host })).body
  await call('/games/host/unidade-a', { token: host, method: 'PATCH', json: { auto_approve: true } })
  const aluno = await register('auto@test.com')
  assert.equal((await call('/games/join', { token: aluno, json: { code: join_code } })).body.status, 'approved')

  assert.equal((await call('/games/me', { token: aluno, method: 'DELETE', json: { password: 'errada' } })).status, 401)
  assert.equal((await call('/games/me', { token: aluno, method: 'DELETE', json: { password: 'senha-forte-1' } })).status, 200)
  assert.equal((await call('/games/me', { token: aluno })).status, 401)
  assert.equal((await call('/games/me', { token: host, method: 'DELETE', json: { password: 'senha-forte-1' } })).status, 403)
})

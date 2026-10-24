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
  secureCookies: false,
  trustProxy: false,
}

async function setup() {
  const db = openDatabase(':memory:')
  const now = nowIso()
  for (const slug of ['unidade-a', 'unidade-b']) {
    db.prepare('INSERT INTO units (slug, name, created_at, updated_at) VALUES (?, ?, ?, ?)').run(slug, slug, now, now)
  }
  const addUser = async (email: string, role: string, unit: string | null) =>
    db
      .prepare('INSERT INTO profiles (id, email, password_hash, role, unit_slug, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(newId(), email, await hashPassword('senha-forte-1'), role, unit, now, now)
  await addUser('admin@test.com', 'admin', null)
  await addUser('dono-a@test.com', 'owner', 'unidade-a')

  const app = buildApp({ config, db, clientIp: () => '127.0.0.1' })
  const call = (path: string, init: RequestInit & { cookie?: string } = {}) =>
    app.request(path, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...(init.cookie ? { Cookie: init.cookie } : {}), ...init.headers },
    })
  const login = async (email: string, password = 'senha-forte-1') => {
    const res = await call('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
    assert.equal(res.status, 200)
    return res.headers.get('set-cookie')!.split(';')[0]
  }
  return { db, call, login }
}

const booking = (unit: string, extra: Record<string, string> = {}) =>
  JSON.stringify({ unit_slug: unit, nome: 'Aluno', email: 'aluno@test.com', telefone: '11999999999', data: '2026-11-01', horario: '07:00', ...extra })

test('login errado nao entra e /auth/me exige sessao', async () => {
  const { call } = await setup()
  const bad = await call('/auth/login', { method: 'POST', body: JSON.stringify({ email: 'admin@test.com', password: 'x' }) })
  assert.equal(bad.status, 401)
  assert.equal((await call('/auth/me')).status, 401)
})

test('agendamento com senha cria o aluno, loga e ele so ve os proprios', async () => {
  const { call } = await setup()
  const res = await call('/bookings', { method: 'POST', body: booking('unidade-a', { password: 'senha-do-aluno' }) })
  assert.equal(res.status, 201)
  assert.equal((await res.json()).account, 'created')
  const cookie = res.headers.get('set-cookie')!.split(';')[0]

  await call('/bookings', { method: 'POST', body: booking('unidade-b', { email: 'outro@test.com' }) })
  const mine = (await (await call('/bookings', { cookie })).json()) as unknown[]
  assert.equal(mine.length, 1)
  assert.equal((await (await call('/auth/me', { cookie })).json()).profile.role, 'student')
})

test('dono so ve e altera a propria unidade', async () => {
  const { call, login } = await setup()
  await call('/bookings', { method: 'POST', body: booking('unidade-a') })
  await call('/bookings', { method: 'POST', body: booking('unidade-b') })
  const cookie = await login('dono-a@test.com')

  const list = (await (await call('/bookings?unit=unidade-b', { cookie })).json()) as { unit_slug: string; id: string }[]
  assert.deepEqual([...new Set(list.map((b) => b.unit_slug))], ['unidade-a'])

  assert.equal((await call('/units/unidade-b', { method: 'PATCH', cookie, body: JSON.stringify({ telefone: '1' }) })).status, 403)
  const ok = await call('/units/unidade-a', { method: 'PATCH', cookie, body: JSON.stringify({ telefone: '1', status: false }) })
  assert.equal(ok.status, 200)
  const unit = await ok.json()
  assert.equal(unit.telefone, '1')
  assert.equal(unit.status, true, 'dono nao desativa a unidade')
  assert.equal((await call('/profiles', { cookie })).status, 403)
  assert.equal((await call(`/bookings/${list[0].id}`, { method: 'PATCH', cookie, body: JSON.stringify({ status: 'confirmed' }) })).status, 200)
})

test('leads so entram com o token e fazem upsert por e-mail', async () => {
  const { call, login } = await setup()
  const lead = JSON.stringify({ nome: 'Fulano', email: 'Lead@Test.com', telefone: '1', cidade: 'X', investimento: '200k-400k' })
  assert.equal((await call('/leads', { method: 'POST', body: lead })).status, 401)
  const headers = { 'X-Lead-Token': 'token-de-teste' }
  assert.equal((await call('/leads', { method: 'POST', body: lead, headers })).status, 201)
  const again = await call('/leads', { method: 'POST', body: lead, headers })
  assert.equal((await again.json()).atualizado, true)

  const cookie = await login('admin@test.com')
  const leads = (await (await call('/leads', { cookie })).json()) as { email: string }[]
  assert.deepEqual(leads.map((l) => l.email), ['lead@test.com'])
})

/**
 * Tarefas de administracao, rodadas no servidor (dentro do container):
 *
 *   npm run admin -- seed-units <units.json>       carrega/atualiza as unidades
 *   npm run admin -- create-admin <email> [nome]   cria um admin e mostra a senha
 *   npm run admin -- create-owners                 cria um dono por unidade (sem senha: criam no primeiro acesso)
 *   npm run admin -- reset-password <email>        gera senha nova para alguem
 */
import fs from 'node:fs'
import { deleteProfileSessions, hashPassword, randomPassword } from '../src/auth.ts'
import { loadConfig } from '../src/config.ts'
import { newId, nowIso, openDatabase } from '../src/db.ts'

const config = loadConfig()
const db = openDatabase(config.databasePath)
const [command, ...args] = process.argv.slice(2)
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

type JsonUnit = {
  name: string
  razao_social?: string
  url_page: string
  cidade?: string
  estado?: string
  nome_dono?: string
  telefone?: string
  whatsapp?: string
  email?: string
  como_chegar?: string
  logradouro?: string
  numero?: string
  cep?: string
  is_public?: boolean
  status?: boolean
  image_background?: string
  lat?: number
  lng?: number
}

async function createProfile(email: string, fullName: string | null, role: 'admin' | 'owner', unitSlug: string | null, withPassword = true) {
  const password = withPassword ? randomPassword() : null
  const id = newId()
  const now = nowIso()
  db.prepare(
    `INSERT INTO profiles (id, email, password_hash, full_name, role, unit_slug, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(id, email, password ? await hashPassword(password) : null, fullName, role, unitSlug, now, now)
  return { id, password }
}

switch (command) {
  case 'seed-units': {
    const units = JSON.parse(fs.readFileSync(args[0], 'utf8')) as JsonUnit[]
    const now = nowIso()
    const upsert = db.prepare(
      `INSERT INTO units (slug, name, razao_social, cidade, estado, nome_dono, telefone, email, whatsapp, como_chegar,
         logradouro, numero, cep, lat, lng, image_background, is_public, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(slug) DO UPDATE SET
         name = excluded.name, razao_social = excluded.razao_social, cidade = excluded.cidade, estado = excluded.estado,
         nome_dono = excluded.nome_dono, telefone = excluded.telefone, email = excluded.email, whatsapp = excluded.whatsapp,
         como_chegar = excluded.como_chegar, logradouro = excluded.logradouro, numero = excluded.numero, cep = excluded.cep,
         lat = COALESCE(excluded.lat, units.lat), lng = COALESCE(excluded.lng, units.lng), updated_at = excluded.updated_at`,
    )
    db.exec('BEGIN')
    for (const u of units) {
      upsert.run(
        u.url_page, u.name, u.razao_social ?? null, u.cidade ?? null, u.estado ?? null, u.nome_dono ?? null,
        u.telefone ?? null, u.email ?? null, u.whatsapp ?? null, u.como_chegar ?? null, u.logradouro ?? null,
        u.numero ?? null, u.cep ?? null, u.lat ?? null, u.lng ?? null, u.image_background ?? null,
        u.is_public === false ? 0 : 1, u.status === false ? 0 : 1, now, now,
      )
    }
    db.exec('COMMIT')
    console.log(`${units.length} unidades carregadas.`)
    break
  }

  case 'create-admin': {
    const email = (args[0] ?? '').toLowerCase()
    if (!EMAIL.test(email)) throw new Error('Uso: create-admin <email> [nome]')
    if (db.prepare('SELECT 1 FROM profiles WHERE email = ?').get(email)) throw new Error(`${email} ja existe`)
    const { password } = await createProfile(email, args.slice(1).join(' ') || null, 'admin', null)
    console.log(`Admin criado: ${email}\nSenha: ${password}`)
    break
  }

  case 'create-owners': {
    const units = db.prepare('SELECT slug, name, email, nome_dono FROM units WHERE owner_id IS NULL ORDER BY name').all() as {
      slug: string
      name: string
      email: string | null
      nome_dono: string | null
    }[]
    const lines = ['unidade;email']
    for (const unit of units) {
      const email = unit.email?.trim().toLowerCase() ?? ''
      // Sem e-mail valido, ou com e-mail ja usado por outra unidade, fica para o admin cadastrar a mao.
      if (!EMAIL.test(email) || db.prepare('SELECT 1 FROM profiles WHERE email = ?').get(email)) continue
      // Sem senha: o dono cria a dele no primeiro acesso, pelo link que chega por e-mail.
      const { id } = await createProfile(email, unit.nome_dono, 'owner', unit.slug, false)
      db.prepare('UPDATE units SET owner_id = ? WHERE slug = ?').run(id, unit.slug)
      lines.push(`${unit.name};${email}`)
    }
    console.log(lines.join('\n'))
    console.error(`\n${lines.length - 1} donos criados.`)
    break
  }

  case 'reset-password': {
    const row = db.prepare('SELECT id FROM profiles WHERE email = ?').get((args[0] ?? '').toLowerCase()) as { id: string } | undefined
    if (!row) throw new Error('Usuario nao encontrado')
    const password = randomPassword()
    db.prepare('UPDATE profiles SET password_hash = ?, updated_at = ? WHERE id = ?').run(await hashPassword(password), nowIso(), row.id)
    deleteProfileSessions(db, row.id)
    console.log(`Senha nova: ${password}`)
    break
  }

  default:
    console.log('Comandos: seed-units <arquivo>, create-admin <email> [nome], create-owners, reset-password <email>')
}

db.close()

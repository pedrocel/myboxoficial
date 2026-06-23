/**
 * Cria usuário owner para cada unidade com e-mail válido.
 * Senha padrão: "{Nome da Unidade} 2026"
 */
import { writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'
import { loadEnv } from './load-env.mjs'

loadEnv()

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const url = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceKey) {
  console.error('Defina VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env')
  process.exit(1)
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

function ownerPassword(name) {
  return `${name.trim()} 2026`
}

function isValidEmail(email) {
  return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const { data: units, error } = await admin.from('units').select('slug, name, email, owner_id').order('name')

if (error) {
  console.error('Erro:', error.message)
  process.exit(1)
}

let created = 0
let skipped = 0
let updated = 0

const { data: existingUsers } = await admin.auth.admin.listUsers({ perPage: 1000 })
const usersByEmail = new Map((existingUsers?.users ?? []).map((u) => [u.email?.toLowerCase(), u]))

for (const unit of units ?? []) {
  if (!isValidEmail(unit.email)) {
    skipped++
    continue
  }

  const email = unit.email.toLowerCase()
  const password = ownerPassword(unit.name)
  let userId = usersByEmail.get(email)?.id

  if (!userId) {
    const { data, error: createErr } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: unit.name,
        role: 'owner',
        unit_slug: unit.slug,
      },
    })
    if (createErr) {
      console.warn(`⚠ ${unit.name}: ${createErr.message}`)
      skipped++
      continue
    }
    userId = data.user.id
    usersByEmail.set(email, data.user)
    created++
    console.log(`✓ Criado: ${email} | senha: ${password}`)
  } else {
    await admin.auth.admin.updateUserById(userId, {
      password,
      user_metadata: { full_name: unit.name, role: 'owner', unit_slug: unit.slug },
    })
    updated++
  }

  await admin.from('profiles').update({
    role: 'owner',
    full_name: unit.name,
    unit_slug: unit.slug,
    email,
  }).eq('id', userId)

  await admin.from('units').update({ owner_id: userId }).eq('slug', unit.slug)
}

console.log(`\nConcluído: ${created} criados, ${updated} atualizados, ${skipped} ignorados (sem e-mail)`)

// Salvar credenciais em arquivo local (gitignored)
const credPath = join(root, 'owners-credentials.txt')
const lines = ['# Senha padrão: {Nome da Unidade} 2026', '']
for (const unit of units ?? []) {
  if (isValidEmail(unit.email)) {
    lines.push(`${unit.email} | ${ownerPassword(unit.name)} | ${unit.name}`)
  }
}
writeFileSync(credPath, lines.join('\n'))
console.log(`\nCredenciais salvas em owners-credentials.txt (não commitado)`)

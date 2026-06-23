import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'
import { getSupabaseConfig, loadEnv } from './load-env.mjs'

loadEnv()
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const { url, publishableKey, serviceKey } = getSupabaseConfig()

if (!url || !publishableKey) {
  console.error('Defina VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY no .env')
  process.exit(1)
}

const client = createClient(url, publishableKey)
const tables = ['units', 'profiles', 'bookings', 'unit_visits']

console.log('=== Supabase Cloud Status ===\n')
console.log('URL:', url)

for (const table of tables) {
  const { count, error } = await client.from(table).select('*', { count: 'exact', head: true })
  if (error) console.log(`${table}: ERRO — ${error.message}`)
  else console.log(`${table}: OK (${count ?? 0} registros)`)
}

if (serviceKey) {
  console.log('\n=== Rodando setup com service role ===')
  const { execSync } = await import('node:child_process')
  execSync('node scripts/setup-supabase.mjs', { cwd: root, stdio: 'inherit', env: process.env })
} else {
  console.log('\n⚠ SUPABASE_SERVICE_ROLE_KEY não definida — pulei seed de unidades/usuários demo')
  console.log('  Adicione em .env (Settings → API → service_role) e rode: npm run setup:supabase')
}

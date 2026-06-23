/**
 * Importa unidades de src/data/units.json para o Supabase.
 * Uso: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run seed:units
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { createClient } from '@supabase/supabase-js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const units = JSON.parse(readFileSync(join(__dirname, '../src/data/units.json'), 'utf8'))

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) {
  console.error('Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(url, key)

const rows = units.map((u) => ({
  slug: u.url_page,
  name: u.name,
  razao_social: u.razao_social ?? null,
  cidade: u.cidade ?? null,
  estado: u.estado ?? null,
  nome_dono: u.nome_dono ?? null,
  telefone: u.telefone ?? null,
  email: u.email ?? null,
  whatsapp: u.whatsapp ?? null,
  como_chegar: u.como_chegar ?? null,
  logradouro: u.logradouro ?? null,
  numero: u.numero ?? null,
  cep: u.cep ?? null,
  lat: u.lat ?? null,
  lng: u.lng ?? null,
  image_background: u.image_background ?? null,
  is_public: u.is_public ?? true,
  status: u.status ?? true,
}))

const { error } = await supabase.from('units').upsert(rows, { onConflict: 'slug' })

if (error) {
  console.error('Erro:', error.message)
  process.exit(1)
}

console.log(`✓ ${rows.length} unidades importadas`)

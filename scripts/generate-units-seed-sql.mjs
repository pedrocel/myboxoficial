/**
 * Gera supabase/seeds/units.sql a partir de units.json
 * Execute no SQL Editor do Supabase ou via: npm run seed:units:sql
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const units = JSON.parse(readFileSync(join(root, 'src/data/units.json'), 'utf8'))

function esc(v) {
  if (v == null) return 'null'
  return `'${String(v).replace(/'/g, "''")}'`
}

const values = units.map((u) => {
  const cols = [
    esc(u.url_page),
    esc(u.name),
    esc(u.razao_social ?? null),
    esc(u.cidade ?? null),
    esc(u.estado ?? null),
    esc(u.nome_dono ?? null),
    esc(u.telefone ?? null),
    esc(u.email ?? null),
    esc(u.whatsapp ?? null),
    esc(u.como_chegar ?? null),
    esc(u.logradouro ?? null),
    esc(u.numero ?? null),
    esc(u.cep ?? null),
    u.lat ?? 'null',
    u.lng ?? 'null',
    esc(u.image_background ?? null),
    u.is_public ?? true,
    u.status ?? true,
  ]
  return `(${cols.join(', ')})`
})

const sql = `-- Seed: ${units.length} unidades My Box
insert into public.units (
  slug, name, razao_social, cidade, estado, nome_dono,
  telefone, email, whatsapp, como_chegar, logradouro, numero, cep,
  lat, lng, image_background, is_public, status
) values
${values.join(',\n')}
on conflict (slug) do update set
  name = excluded.name,
  razao_social = excluded.razao_social,
  cidade = excluded.cidade,
  estado = excluded.estado,
  nome_dono = excluded.nome_dono,
  telefone = excluded.telefone,
  email = excluded.email,
  whatsapp = excluded.whatsapp,
  como_chegar = excluded.como_chegar,
  logradouro = excluded.logradouro,
  numero = excluded.numero,
  cep = excluded.cep,
  lat = excluded.lat,
  lng = excluded.lng,
  image_background = excluded.image_background,
  is_public = excluded.is_public,
  status = excluded.status,
  updated_at = now();
`

const outDir = join(root, 'supabase/seeds')
mkdirSync(outDir, { recursive: true })
writeFileSync(join(outDir, 'units.sql'), sql)
console.log(`✓ Gerado supabase/seeds/units.sql (${units.length} unidades)`)

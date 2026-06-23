/**
 * Adiciona lat/lng em units.json via Nominatim (OpenStreetMap).
 * Rodar: node scripts/geocode-units.mjs
 * Respeita 1 req/s (política do Nominatim).
 */
import { readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const unitsPath = join(__dirname, '../src/data/units.json')

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function geocode(query) {
  const url = `https://nominatim.openstreetmap.org/search?${new URLSearchParams({
    q: query,
    format: 'json',
    limit: '1',
    countrycodes: 'br',
  })}`

  const res = await fetch(url, {
    headers: { 'User-Agent': 'MyBoxOficial/1.0 (contact: unidade.mybox@gmail.com)' },
  })
  const data = await res.json()
  if (data?.[0]) {
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
  }
  return null
}

const units = JSON.parse(readFileSync(unitsPath, 'utf8'))
let updated = 0

for (let i = 0; i < units.length; i++) {
  const unit = units[i]
  if (unit.lat != null && unit.lng != null) {
    console.log(`[${i + 1}/${units.length}] ${unit.name} — já geocodificado`)
    continue
  }

  const query = `${unit.como_chegar}, ${unit.cidade}, ${unit.estado}, Brasil`
  process.stdout.write(`[${i + 1}/${units.length}] ${unit.name}... `)

  const coords = await geocode(query)
  if (coords) {
    unit.lat = coords.lat
    unit.lng = coords.lng
    updated++
    console.log(`${coords.lat}, ${coords.lng}`)
  } else {
    const fallback = await geocode(`${unit.cidade}, ${unit.estado}, Brasil`)
    if (fallback) {
      unit.lat = fallback.lat
      unit.lng = fallback.lng
      updated++
      console.log(`cidade: ${fallback.lat}, ${fallback.lng}`)
    } else {
      console.log('não encontrado')
    }
  }

  await sleep(1100)
}

writeFileSync(unitsPath, JSON.stringify(units, null, 2) + '\n', 'utf8')
console.log(`\nConcluído: ${updated} coordenadas adicionadas.`)

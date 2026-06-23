import type { DbUnit } from '../types/database'

export function buildUnitAddress(unit: Pick<DbUnit, 'logradouro' | 'numero' | 'cep' | 'cidade' | 'estado' | 'como_chegar'> & { como_chegar?: string | null }) {
  const parts = [
    unit.logradouro,
    unit.numero,
    unit.como_chegar,
    unit.cidade,
    unit.estado,
    unit.cep,
    'Brasil',
  ].filter(Boolean)
  return parts.join(', ')
}

export async function geocodeAddress(query: string): Promise<{ lat: number; lng: number } | null> {
  if (!query.trim()) return null
  const url = `https://nominatim.openstreetmap.org/search?${new URLSearchParams({
    q: query,
    format: 'json',
    limit: '1',
    countrycodes: 'br',
  })}`

  const res = await fetch(url, {
    headers: { 'User-Agent': 'MyBoxOficial/1.0 (contact: unidade.mybox@gmail.com)' },
  })
  if (!res.ok) return null
  const data = (await res.json()) as { lat: string; lon: string }[]
  if (!data?.[0]) return null
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
}

export async function geocodeUnit(unit: DbUnit): Promise<{ lat: number; lng: number } | null> {
  const full = buildUnitAddress(unit)
  const coords = await geocodeAddress(full)
  if (coords) return coords
  if (unit.cidade && unit.estado) {
    return geocodeAddress(`${unit.cidade}, ${unit.estado}, Brasil`)
  }
  return null
}

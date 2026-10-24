/*
 * Funcoes puras sobre uma lista de unidades. Quem carrega a lista e o
 * units-source.ts (banco, com o units.json de reserva); aqui nada le dados.
 */
import type { Unit } from '../types/unit'
import { getFallbackCoords } from './brazil-states'
import { getDistanceKm } from './geo'

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'

export function findUnitBySlug(units: Unit[], slug: string): Unit | undefined {
  return units.find((u) => u.url_page === slug)
}

export function searchUnits(units: Unit[], query: string): Unit[] {
  const term = query.toLowerCase().trim()
  if (!term) return units

  return units.filter(
    (unit) =>
      unit.name.toLowerCase().includes(term) ||
      unit.cidade.toLowerCase().includes(term) ||
      unit.estado.toLowerCase().includes(term) ||
      unit.logradouro.toLowerCase().includes(term) ||
      unit.como_chegar.toLowerCase().includes(term),
  )
}

export function getUnitImage(unit: Unit): string {
  return unit.image_background || DEFAULT_IMAGE
}

export function getUnitAddress(unit: Unit): string {
  const parts = [unit.logradouro, unit.numero, unit.cidade, unit.estado].filter(Boolean)
  return parts.join(', ')
}

export function getFullAddress(unit: Unit): string {
  if (unit.logradouro && unit.numero && unit.cidade && unit.estado) {
    return `${unit.logradouro}, ${unit.numero} - ${unit.cidade} - ${unit.estado}`
  }
  return unit.como_chegar || 'Endereço não disponível'
}

export function getWhatsAppUrl(unit: Unit): string | null {
  const digits = unit.whatsapp?.replace(/[^0-9]/g, '')
  if (!digits) return null
  return `https://wa.me/55${digits}`
}

export function getMapEmbedUrl(unit: Unit): string {
  const address = encodeURIComponent(getFullAddress(unit))
  return `https://maps.google.com/maps?q=${address}&t=&z=15&ie=UTF8&iwloc=&output=embed`
}

export function getUnitCoords(unit: Unit, indexInState = 0): [number, number] {
  if (unit.lat != null && unit.lng != null) {
    return [unit.lat, unit.lng]
  }
  return getFallbackCoords(unit.estado, indexInState)
}

export function getStatesFromUnits(units: Unit[]): string[] {
  return [...new Set(units.map((u) => u.estado))].sort()
}

export type UnitWithDistance = Unit & { distanceKm: number }

export function sortUnitsByDistance(
  unitList: Unit[],
  userLat: number,
  userLng: number,
): UnitWithDistance[] {
  return unitList
    .map((unit, i) => {
      const [lat, lng] = getUnitCoords(unit, i)
      const distanceKm = getDistanceKm(userLat, userLng, lat, lng)
      return { ...unit, distanceKm }
    })
    .sort((a, b) => a.distanceKm - b.distanceKm)
}

export const STATE_NAMES: Record<string, string> = {
  AC: 'Acre', AL: 'Alagoas', AM: 'Amazonas', AP: 'Amapá', BA: 'Bahia', CE: 'Ceará', DF: 'Distrito Federal',
  ES: 'Espírito Santo', GO: 'Goiás', MA: 'Maranhão', MG: 'Minas Gerais', MS: 'Mato Grosso do Sul',
  MT: 'Mato Grosso', PA: 'Pará', PB: 'Paraíba', PE: 'Pernambuco', PI: 'Piauí', PR: 'Paraná',
  RJ: 'Rio de Janeiro', RN: 'Rio Grande do Norte', RO: 'Rondônia', RR: 'Roraima', RS: 'Rio Grande do Sul',
  SC: 'Santa Catarina', SE: 'Sergipe', SP: 'São Paulo', TO: 'Tocantins',
}

export type StateGroup = { uf: string; name: string; units: Unit[] }

/** Unidades por estado, do estado com mais unidades para o com menos. */
export function groupUnitsByState(units: Unit[]): StateGroup[] {
  const map = new Map<string, Unit[]>()
  for (const unit of units) map.set(unit.estado, [...(map.get(unit.estado) ?? []), unit])
  return [...map.entries()]
    .map(([uf, list]) => ({
      uf,
      name: STATE_NAMES[uf] ?? uf,
      units: list.sort((a, b) => a.cidade.localeCompare(b.cidade, 'pt-BR') || a.name.localeCompare(b.name, 'pt-BR')),
    }))
    .sort((a, b) => b.units.length - a.units.length || a.name.localeCompare(b.name, 'pt-BR'))
}

/** Cidades com unidade, sem repetir, em ordem alfabetica. */
export function getUnitCities(units: Unit[]): string[] {
  return [...new Set(units.map((u) => u.cidade.trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt-BR'))
}

export function pluralUnits(count: number) {
  return `${count} ${count === 1 ? 'unidade' : 'unidades'}`
}

/** Rua e numero, sem cidade: o cartao ja mostra a cidade acima. */
export function getStreetAddress(unit: Unit): string {
  return [unit.logradouro, unit.numero].filter(Boolean).join(', ') || unit.como_chegar
}

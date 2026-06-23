import type { Unit } from '../types/unit'
import unitsData from '../data/units.json'
import { getFallbackCoords } from './brazil-states'
import { getDistanceKm } from './geo'

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'

const units = (unitsData as Unit[]).filter((u) => u.status)

export function getAllUnits(): Unit[] {
  return units
}

export function getUnitBySlug(slug: string): Unit | undefined {
  return units.find((u) => u.url_page === slug)
}

export function searchUnits(query: string): Unit[] {
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

export function filterUnitsByState(estado: string): Unit[] {
  return units.filter((u) => u.estado === estado.toUpperCase())
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

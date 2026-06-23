import type { DbUnit } from '../types/database'

export type HorarioSlot = { id: string; activity: string; hours: string }

export type UnitHorario = {
  id: string
  label: string
  slots: HorarioSlot[]
}

/** @deprecated formato legado — migrado automaticamente em parseHorarios */
export type LegacyUnitHorario = { dia: string; musc: string; cross: string }

export type UnitModalidade = {
  id: string
  icon: string
  title: string
  desc: string
  color: string
  enabled: boolean
}

let slotCounter = 0
export function newHorarioId() {
  slotCounter += 1
  return `h-${Date.now()}-${slotCounter}`
}

export const DEFAULT_HORARIOS: UnitHorario[] = [
  {
    id: 'default-weekday',
    label: 'Segunda — Sexta',
    slots: [
      { id: 's1', activity: 'Musculação', hours: '06h — 23h' },
      { id: 's2', activity: 'Cross / Coletivas', hours: '06h, 07h, 08h, 12h, 18h, 19h, 20h' },
    ],
  },
  {
    id: 'default-saturday',
    label: 'Sábado',
    slots: [
      { id: 's3', activity: 'Musculação', hours: '08h — 18h' },
      { id: 's4', activity: 'Cross / Coletivas', hours: '09h, 10h, 11h' },
    ],
  },
  {
    id: 'default-sunday',
    label: 'Domingo',
    slots: [
      { id: 's5', activity: 'Musculação', hours: '09h — 15h' },
      { id: 's6', activity: 'Cross / Coletivas', hours: '10h, 11h' },
    ],
  },
]

export const DEFAULT_MODALIDADES: UnitModalidade[] = [
  { id: 'musc', icon: 'fa-dumbbell', title: 'Musculação', desc: 'Equipamentos de última geração em um ambiente que motiva seus resultados.', color: 'from-emerald-500/20 to-emerald-600/5', enabled: true },
  { id: 'cross', icon: 'fa-running', title: 'Cross Training', desc: 'Metodologia própria validada por mais de um milhão de alunos no Brasil.', color: 'from-green-500/20 to-green-600/5', enabled: true },
  { id: 'coletiva', icon: 'fa-users', title: 'Aulas Coletivas', desc: 'Comunidade, energia e variedade para você nunca enjoar do treino.', color: 'from-lime-500/20 to-lime-600/5', enabled: true },
  { id: 'coffee', icon: 'fa-coffee', title: 'My Coffee', desc: 'Café especial antes ou depois do treino. Conceito de shopping fitness.', color: 'from-amber-500/20 to-amber-600/5', enabled: true },
]

export const FALLBACK_GALLERY = [
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
  'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80',
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
]

function isLegacyHorario(item: unknown): item is LegacyUnitHorario {
  return typeof item === 'object' && item !== null && 'dia' in item && 'musc' in item
}

function isNewHorario(item: unknown): item is UnitHorario {
  return typeof item === 'object' && item !== null && 'label' in item && 'slots' in item
}

function migrateLegacy(item: LegacyUnitHorario, index: number): UnitHorario {
  const slots: HorarioSlot[] = []
  if (item.musc?.trim()) slots.push({ id: newHorarioId(), activity: 'Musculação', hours: item.musc })
  if (item.cross?.trim()) slots.push({ id: newHorarioId(), activity: 'Cross / Coletivas', hours: item.cross })
  return { id: `legacy-${index}`, label: item.dia, slots }
}

export function parseHorarios(raw: unknown): UnitHorario[] {
  if (!Array.isArray(raw) || !raw.length) return DEFAULT_HORARIOS
  if (isNewHorario(raw[0])) return raw as UnitHorario[]
  if (isLegacyHorario(raw[0])) return (raw as LegacyUnitHorario[]).map(migrateLegacy)
  return DEFAULT_HORARIOS
}

export function parseModalidades(raw: unknown): UnitModalidade[] {
  if (Array.isArray(raw) && raw.length) return raw as UnitModalidade[]
  return DEFAULT_MODALIDADES
}

export function getUnitHorarios(unit: DbUnit | null | undefined): UnitHorario[] {
  return parseHorarios(unit?.horarios)
}

export function getUnitModalidades(unit: DbUnit | null | undefined): UnitModalidade[] {
  return parseModalidades(unit?.modalidades).filter((m) => m.enabled)
}

export function getUnitGallery(unit: DbUnit | null | undefined, fallbackHero?: string): string[] {
  const imgs = unit?.gallery_images?.filter(Boolean) ?? []
  const hero = unit?.hero_image || unit?.image_background || fallbackHero
  if (hero && !imgs.includes(hero)) return [hero, ...imgs]
  if (imgs.length) return imgs
  if (hero) return [hero, ...FALLBACK_GALLERY]
  return FALLBACK_GALLERY
}

export function ownerDefaultPassword(unitName: string): string {
  return `${unitName.trim()} 2026`
}

export function createEmptyHorario(): UnitHorario {
  return {
    id: newHorarioId(),
    label: 'Novo período',
    slots: [{ id: newHorarioId(), activity: 'Musculação', hours: '08h — 18h' }],
  }
}

export function createEmptySlot(): HorarioSlot {
  return { id: newHorarioId(), activity: 'Nova atividade', hours: '08h — 12h' }
}

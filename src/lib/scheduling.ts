import type { UnitHorario } from './unit-settings'

const DAY_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MONTH_NAMES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

export type AvailableDate = {
  value: string // YYYY-MM-DD
  dayName: string
  dayNum: number
  month: string
  isToday: boolean
  isTomorrow: boolean
}

export function getAvailableDates(count = 14): AvailableDate[] {
  const dates: AvailableDate[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < count; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    const value = d.toISOString().split('T')[0]
    dates.push({
      value,
      dayName: DAY_NAMES[d.getDay()],
      dayNum: d.getDate(),
      month: MONTH_NAMES[d.getMonth()],
      isToday: i === 0,
      isTomorrow: i === 1,
    })
  }
  return dates
}

export type TimeSlot = {
  value: string
  label: string
  period: 'manha' | 'tarde' | 'noite'
}

const WEEKDAY_SLOTS: TimeSlot[] = [
  { value: '06:00', label: '06:00', period: 'manha' },
  { value: '07:00', label: '07:00', period: 'manha' },
  { value: '08:00', label: '08:00', period: 'manha' },
  { value: '09:00', label: '09:00', period: 'manha' },
  { value: '10:00', label: '10:00', period: 'manha' },
  { value: '12:00', label: '12:00', period: 'tarde' },
  { value: '14:00', label: '14:00', period: 'tarde' },
  { value: '16:00', label: '16:00', period: 'tarde' },
  { value: '18:00', label: '18:00', period: 'noite' },
  { value: '19:00', label: '19:00', period: 'noite' },
  { value: '20:00', label: '20:00', period: 'noite' },
  { value: '21:00', label: '21:00', period: 'noite' },
  { value: '22:00', label: '22:00', period: 'noite' },
  { value: '23:00', label: '23:00', period: 'noite' },
]

const WEEKEND_SLOTS: TimeSlot[] = [
  { value: '08:00', label: '08:00', period: 'manha' },
  { value: '09:00', label: '09:00', period: 'manha' },
  { value: '10:00', label: '10:00', period: 'manha' },
  { value: '11:00', label: '11:00', period: 'manha' },
  { value: '14:00', label: '14:00', period: 'tarde' },
  { value: '16:00', label: '16:00', period: 'tarde' },
]

/** Fallback quando a unidade não tem horários configurados */
export function getTimeSlotsForDate(dateStr: string): TimeSlot[] {
  const d = new Date(dateStr + 'T12:00:00')
  const day = d.getDay()
  return day === 0 || day === 6 ? WEEKEND_SLOTS : WEEKDAY_SLOTS
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function horarioMatchesDate(label: string, date: Date): boolean {
  const day = date.getDay()
  const n = normalizeText(label)

  const hasSegunda = n.includes('segunda')
  const hasSexta = n.includes('sexta') || /\bseg\s*[-–—a]\s*sex\b/.test(n)

  if (hasSegunda && hasSexta) return day >= 1 && day <= 5
  if (n.includes('sabado')) return day === 6
  if (n.includes('domingo')) return day === 0

  const singleDays: [string, number][] = [
    ['segunda', 1],
    ['terca', 2],
    ['quarta', 3],
    ['quinta', 4],
    ['sexta', 5],
  ]
  for (const [name, num] of singleDays) {
    if (n.includes(name)) return day === num
  }

  return false
}

/** Extrai hora (0–23) e minuto de strings como "06h", "06:30", "23h" */
function parseHourMinute(token: string): { hour: number; minute: number } | null {
  const t = token.trim().toLowerCase().replace(/\s/g, '')
  const hMatch = t.match(/^(\d{1,2})h(?:(\d{2}))?$/)
  if (hMatch) return { hour: parseInt(hMatch[1], 10), minute: hMatch[2] ? parseInt(hMatch[2], 10) : 0 }

  const colonMatch = t.match(/^(\d{1,2}):(\d{2})$/)
  if (colonMatch) return { hour: parseInt(colonMatch[1], 10), minute: parseInt(colonMatch[2], 10) }

  return null
}

function toTimeValue(hour: number, minute: number): string {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

function periodForHour(hour: number): TimeSlot['period'] {
  if (hour < 12) return 'manha'
  if (hour < 18) return 'tarde'
  return 'noite'
}

/** Converte texto de horário do painel em lista de HH:MM */
export function parseHoursString(hours: string): string[] {
  const raw = hours.trim()
  if (!raw) return []

  if (!raw.includes(',') && /[-–—]/.test(raw)) {
    const [startPart, endPart] = raw.split(/\s*[-–—]\s*/)
    const start = parseHourMinute(startPart)
    const end = parseHourMinute(endPart)
    if (start && end) {
      const times: string[] = []
      for (let h = start.hour; h <= end.hour; h++) {
        times.push(toTimeValue(h, h === start.hour ? start.minute : 0))
      }
      return times
    }
  }

  return raw
    .split(/[,;]+/)
    .map((part) => parseHourMinute(part.trim()))
    .filter((p): p is { hour: number; minute: number } => p !== null)
    .map(({ hour, minute }) => toTimeValue(hour, minute))
}

function activityMatchesModalidade(activity: string, modalidadeId: string): boolean {
  const a = normalizeText(activity)
  switch (modalidadeId) {
    case 'cross':
      return /cross|coletiv/.test(a)
    case 'musculacao':
      return /muscul/.test(a)
    case 'coletiva':
      return /coletiv|cross/.test(a)
    case 'experimental':
    default:
      return true
  }
}

function timesToSlots(times: string[]): TimeSlot[] {
  const unique = [...new Set(times)].sort()
  return unique.map((value) => ({
    value,
    label: value,
    period: periodForHour(parseInt(value.split(':')[0], 10)),
  }))
}

function filterPastSlots(slots: TimeSlot[], dateStr: string): TimeSlot[] {
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]
  if (dateStr !== todayStr) return slots

  const nowMinutes = today.getHours() * 60 + today.getMinutes()
  return slots.filter((s) => {
    const [h, m] = s.value.split(':').map(Number)
    return h * 60 + m > nowMinutes
  })
}

/** Horários de agendamento com base na configuração do dono da unidade */
export function getTimeSlotsFromUnitHorarios(
  dateStr: string,
  horarios: UnitHorario[],
  modalidadeId = 'experimental',
): TimeSlot[] {
  const date = new Date(dateStr + 'T12:00:00')
  const matching = horarios.filter((h) => horarioMatchesDate(h.label, date))

  if (!matching.length) {
    return filterPastSlots(getTimeSlotsForDate(dateStr), dateStr)
  }

  const times: string[] = []
  for (const block of matching) {
    for (const slot of block.slots) {
      if (!activityMatchesModalidade(slot.activity, modalidadeId)) continue
      times.push(...parseHoursString(slot.hours))
    }
  }

  if (!times.length) {
    return filterPastSlots(getTimeSlotsForDate(dateStr), dateStr)
  }

  return filterPastSlots(timesToSlots(times), dateStr)
}

export const MODALIDADES_AGENDA = [
  { id: 'experimental', label: 'Aula Experimental', icon: 'fa-star' },
  { id: 'cross', label: 'Cross Training', icon: 'fa-running' },
  { id: 'musculacao', label: 'Musculação', icon: 'fa-dumbbell' },
  { id: 'coletiva', label: 'Aula Coletiva', icon: 'fa-users' },
]

export const PERIOD_LABELS = {
  manha: 'Manhã',
  tarde: 'Tarde',
  noite: 'Noite',
} as const

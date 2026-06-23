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
]

const WEEKEND_SLOTS: TimeSlot[] = [
  { value: '08:00', label: '08:00', period: 'manha' },
  { value: '09:00', label: '09:00', period: 'manha' },
  { value: '10:00', label: '10:00', period: 'manha' },
  { value: '11:00', label: '11:00', period: 'manha' },
  { value: '14:00', label: '14:00', period: 'tarde' },
  { value: '16:00', label: '16:00', period: 'tarde' },
]

export function getTimeSlotsForDate(dateStr: string): TimeSlot[] {
  const d = new Date(dateStr + 'T12:00:00')
  const day = d.getDay()
  return day === 0 || day === 6 ? WEEKEND_SLOTS : WEEKDAY_SLOTS
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

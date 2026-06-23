import { useEffect, useState } from 'react'
import { PanelLayout } from '../../../components/panel/PanelLayout'
import { StatCard } from '../../../components/panel/StatCard'
import { BookingsTable } from '../../../components/panel/BookingsTable'
import { useAuth } from '../../../contexts/AuthContext'
import { supabase } from '../../../lib/supabase'
import type { Booking, DbUnit } from '../../../types/database'

const OWNER_NAV = [
  { to: '/painel/unidade', label: 'Dashboard', icon: 'fa-chart-pie' },
  { to: '/painel/unidade/agendamentos', label: 'Aulas agendadas', icon: 'fa-calendar-check' },
  { to: '/painel/unidade/alunos', label: 'Alunos', icon: 'fa-users' },
  { to: '/painel/unidade/visitas', label: 'Visitas', icon: 'fa-eye' },
  { to: '/painel/unidade/editar', label: 'Minha unidade', icon: 'fa-edit' },
]

export function OwnerDashboardPage() {
  const { profile } = useAuth()
  const [unit, setUnit] = useState<DbUnit | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])

  const slug = profile?.unit_slug

  useEffect(() => {
    if (!supabase || !slug) return
    supabase.from('units').select('*').eq('slug', slug).single().then(({ data }) => {
      if (data) setUnit(data as DbUnit)
    })
    supabase
      .from('bookings')
      .select('*')
      .eq('unit_slug', slug)
      .order('booking_date', { ascending: true })
      .limit(5)
      .then(({ data }) => {
        if (data) setBookings(data as Booking[])
      })
  }, [slug])

  const pending = bookings.filter((b) => b.status === 'pending').length
  const students = new Set(bookings.map((b) => b.student_email)).size

  return (
    <PanelLayout
      title={unit?.name ?? 'Minha unidade'}
      subtitle={unit ? `${unit.cidade} — ${unit.estado}` : 'Carregando...'}
      nav={OWNER_NAV}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard icon="fa-calendar-check" label="Agendamentos" value={bookings.length} color="green" />
        <StatCard icon="fa-clock" label="Pendentes" value={pending} color="gold" />
        <StatCard icon="fa-users" label="Alunos únicos" value={students} color="blue" />
        <StatCard icon="fa-eye" label="Visitas à página" value={unit?.visits_count ?? 0} color="dark" />
      </div>

      <h2 className="text-lg font-black text-mydark mb-4">Próximas aulas</h2>
      <BookingsTable bookings={bookings} />
    </PanelLayout>
  )
}

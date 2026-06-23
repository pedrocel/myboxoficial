import { useEffect, useState } from 'react'
import { PanelLayout } from '../../../components/panel/PanelLayout'
import { StatCard } from '../../../components/panel/StatCard'
import { BookingsTable } from '../../../components/panel/BookingsTable'
import { supabase } from '../../../lib/supabase'
import type { Booking, DbUnit, Profile } from '../../../types/database'

const ADMIN_NAV = [
  { to: '/painel/admin', label: 'Dashboard', icon: 'fa-chart-pie' },
  { to: '/painel/admin/unidades', label: 'Unidades', icon: 'fa-store' },
  { to: '/painel/admin/agendamentos', label: 'Agendamentos', icon: 'fa-calendar-check' },
  { to: '/painel/admin/usuarios', label: 'Usuários', icon: 'fa-users' },
]

export function AdminDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [units, setUnits] = useState<DbUnit[]>([])
  const [users, setUsers] = useState<Profile[]>([])
  const [visits, setVisits] = useState(0)

  useEffect(() => {
    if (!supabase) return
    supabase.from('bookings').select('*').order('created_at', { ascending: false }).limit(5).then(({ data }) => {
      if (data) setBookings(data as Booking[])
    })
    supabase.from('units').select('*').then(({ data }) => {
      if (data) {
        setUnits(data as DbUnit[])
        setVisits((data as DbUnit[]).reduce((s, u) => s + (u.visits_count ?? 0), 0))
      }
    })
    supabase.from('profiles').select('*').then(({ data }) => {
      if (data) setUsers(data as Profile[])
    })
  }, [])

  const pending = bookings.filter((b) => b.status === 'pending').length

  return (
    <PanelLayout title="Administração" subtitle="Visão geral do sistema My Box" nav={ADMIN_NAV}>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard icon="fa-store" label="Unidades cadastradas" value={units.length} color="green" />
        <StatCard icon="fa-calendar-check" label="Agendamentos recentes" value={bookings.length} color="blue" />
        <StatCard icon="fa-users" label="Usuários no sistema" value={users.length} color="dark" />
        <StatCard icon="fa-eye" label="Visitas às unidades" value={visits} color="gold" trend="Total acumulado" />
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-black text-mydark">Últimos agendamentos</h2>
        {pending > 0 && (
          <span className="text-xs font-bold bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
            {pending} pendente{pending > 1 ? 's' : ''}
          </span>
        )}
      </div>
      <BookingsTable bookings={bookings} showUnit />
    </PanelLayout>
  )
}

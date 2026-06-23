import { useEffect, useState } from 'react'
import { Store, CalendarCheck, Users, Eye } from 'lucide-react'
import { PanelLayout } from '../../../components/panel/PanelLayout'
import { StatCard } from '../../../components/panel/StatCard'
import { BookingsTable } from '../../../components/panel/BookingsTable'
import { Badge } from '../../../components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { ADMIN_NAV } from '../../../lib/panel-nav'
import { supabase } from '../../../lib/supabase'
import type { Booking, DbUnit, Profile } from '../../../types/database'

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
        <StatCard icon={Store} label="Unidades cadastradas" value={units.length} />
        <StatCard icon={CalendarCheck} label="Agendamentos recentes" value={bookings.length} variant="blue" />
        <StatCard icon={Users} label="Usuários no sistema" value={users.length} variant="muted" />
        <StatCard icon={Eye} label="Visitas às unidades" value={visits} variant="gold" trend="Total acumulado" />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Últimos agendamentos</CardTitle>
          {pending > 0 && <Badge variant="secondary">{pending} pendente{pending > 1 ? 's' : ''}</Badge>}
        </CardHeader>
        <CardContent>
          <BookingsTable bookings={bookings} showUnit />
        </CardContent>
      </Card>
    </PanelLayout>
  )
}

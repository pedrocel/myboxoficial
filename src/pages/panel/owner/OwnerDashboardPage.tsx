import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  CalendarCheck,
  Clock,
  Eye,
  Calendar,
  ChevronRight,
  Palette,
  Users,
} from 'lucide-react'
import { PanelLayout } from '../../../components/panel/PanelLayout'
import { StatCard } from '../../../components/panel/StatCard'
import { BookingsTable } from '../../../components/panel/BookingsTable'
import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { useAuth } from '../../../contexts/AuthContext'
import { OWNER_NAV } from '../../../lib/panel-nav'
import { supabase } from '../../../lib/supabase'
import { getUnitGallery, getUnitModalidades } from '../../../lib/unit-settings'
import type { Booking, DbUnit, UnitVisit } from '../../../types/database'

export function OwnerDashboardPage() {
  const { profile } = useAuth()
  const [unit, setUnit] = useState<DbUnit | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [visits, setVisits] = useState<UnitVisit[]>([])
  const slug = profile?.unit_slug

  useEffect(() => {
    if (!supabase || !slug) return
    supabase.from('units').select('*').eq('slug', slug).single().then(({ data }) => {
      if (data) setUnit(data as DbUnit)
    })
    supabase.from('bookings').select('*').eq('unit_slug', slug).order('booking_date', { ascending: true }).then(({ data }) => {
      if (data) setBookings(data as Booking[])
    })
    supabase.from('unit_visits').select('*').eq('unit_slug', slug).order('created_at', { ascending: false }).limit(5).then(({ data }) => {
      if (data) setVisits(data as UnitVisit[])
    })
  }, [slug])

  const stats = useMemo(() => {
    const pending = bookings.filter((b) => b.status === 'pending').length
    const today = new Date().toISOString().slice(0, 10)
    const todayBookings = bookings.filter((b) => b.booking_date === today).length
    const students = new Set(bookings.map((b) => b.student_email)).size
    return { pending, todayBookings, students }
  }, [bookings])

  const hero = unit ? getUnitGallery(unit)[0] : null
  const mods = getUnitModalidades(unit)

  const quickActions = [
    { to: '/painel/unidade/agendamentos', icon: CalendarCheck, label: 'Agendamentos' },
    { to: '/painel/unidade/alunos', icon: Users, label: 'Meus alunos' },
    { to: '/painel/unidade/personalizar', icon: Palette, label: 'Personalizar' },
    { to: '/painel/unidade/visitas', icon: Eye, label: 'Visitas' },
  ]

  return (
    <PanelLayout title={unit?.name ?? 'Minha unidade'} subtitle={unit ? `${unit.cidade} — ${unit.estado}` : 'Carregando...'} nav={OWNER_NAV}>
      {hero && (
        <Card className="mb-8 overflow-hidden border-0">
          <div className="relative h-44 md:h-56">
            <img src={hero} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-transparent" />
            <div className="absolute inset-0 flex items-end justify-between p-6">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Painel da unidade</p>
                <p className="text-foreground font-bold text-2xl">{unit?.name}</p>
              </div>
              <Button asChild>
                <Link to="/painel/unidade/personalizar">
                  <Palette className="h-4 w-4" />
                  Personalizar
                </Link>
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Eye} label="Visitas à página" value={unit?.visits_count ?? 0} />
        <StatCard icon={Calendar} label="Agendamentos hoje" value={stats.todayBookings} variant="blue" />
        <StatCard icon={Clock} label="Pendentes" value={stats.pending} variant="gold" />
        <StatCard icon={Users} label="Alunos" value={stats.students} variant="muted" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ações rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {quickActions.map((a) => {
              const Icon = a.icon
              return (
                <Link
                  key={a.to}
                  to={a.to}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent transition group"
                >
                  <span className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="font-medium text-sm text-foreground flex-1">{a.label}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              )
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Modalidades ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {mods.map((m) => (
                <Badge key={m.id} variant="success">
                  <i className={`fas ${m.icon} mr-1`} />
                  {m.title}
                </Badge>
              ))}
              {!mods.length && <p className="text-sm text-muted-foreground">Configure em Personalizar</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Últimas visitas</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {visits.map((v) => (
                <li key={v.id} className="flex justify-between text-muted-foreground">
                  <span>{new Date(v.created_at).toLocaleDateString('pt-BR')}</span>
                  <span className="text-xs truncate max-w-[120px]">{v.referrer || 'Direto'}</span>
                </li>
              ))}
              {!visits.length && <li className="text-muted-foreground">Nenhuma visita ainda</li>}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Próximos agendamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <BookingsTable bookings={bookings.slice(0, 5)} />
        </CardContent>
      </Card>
    </PanelLayout>
  )
}

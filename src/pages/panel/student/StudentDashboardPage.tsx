import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { CalendarCheck, Clock, List, User, Dumbbell, MapPin } from 'lucide-react'
import { PanelLayout } from '../../../components/panel/PanelLayout'
import { StatCard } from '../../../components/panel/StatCard'
import { BookingsTable } from '../../../components/panel/BookingsTable'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { useAuth } from '../../../contexts/AuthContext'
import { STUDENT_NAV } from '../../../lib/panel-nav'
import { supabase } from '../../../lib/supabase'
import type { Booking } from '../../../types/database'

export function StudentDashboardPage() {
  const { profile, user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])

  useEffect(() => {
    if (!supabase || !user) return
    const email = profile?.email ?? user.email ?? ''
    supabase
      .from('bookings')
      .select('*')
      .or(`student_id.eq.${user.id},student_email.eq.${email}`)
      .order('booking_date', { ascending: true })
      .then(({ data }) => {
        if (data) setBookings(data as Booking[])
      })
  }, [user, profile])

  const upcoming = useMemo(
    () => bookings.filter((b) => (b.status === 'pending' || b.status === 'confirmed') && b.booking_date >= new Date().toISOString().slice(0, 10)),
    [bookings],
  )

  const next = upcoming[0]

  const shortcuts = [
    { to: '/painel/aluno/agendamentos', icon: List, title: 'Histórico', desc: 'Todos os seus agendamentos' },
    { to: '/painel/aluno/perfil', icon: User, title: 'Meu perfil', desc: 'Atualize seus dados' },
    { to: '/unidades-preview', icon: Dumbbell, title: 'Unidades', desc: 'Explore a rede My Box' },
  ]

  return (
    <PanelLayout
      title={`Olá, ${profile?.full_name?.split(' ')[0] ?? 'Aluno'}!`}
      subtitle="Seu portal My Box"
      nav={STUDENT_NAV}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2 overflow-hidden border-primary/20 bg-gradient-to-br from-primary/20 via-primary/10 to-background">
          <CardContent className="p-8 relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">Próxima aula</p>
            {next ? (
              <>
                <h2 className="text-3xl font-bold text-foreground mb-2">{next.modalidade}</h2>
                <p className="text-muted-foreground text-lg flex items-center gap-4 flex-wrap">
                  <span className="flex items-center gap-2">
                    <CalendarCheck className="h-4 w-4 text-primary" />
                    {new Date(next.booking_date + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    {next.booking_time?.slice(0, 5)}
                  </span>
                </p>
                <p className="text-muted-foreground text-sm mt-2">{next.unit_slug.replace(/-/g, ' ')}</p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-foreground mb-2">Nenhuma aula agendada</h2>
                <p className="text-muted-foreground mb-6">Encontre a My Box mais próxima e agende sua experimental grátis!</p>
              </>
            )}
            <Button asChild className="mt-6">
              <Link to="/unidades-preview">
                <MapPin className="h-4 w-4" />
                Agendar aula
              </Link>
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <StatCard icon={CalendarCheck} label="Total agendamentos" value={bookings.length} />
          <StatCard icon={Clock} label="Próximas aulas" value={upcoming.length} variant="blue" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {shortcuts.map((c) => {
          const Icon = c.icon
          return (
            <Link key={c.to} to={c.to}>
              <Card className="h-full hover:border-primary/30 hover:shadow-md transition group">
                <CardContent className="p-5">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="font-bold text-foreground">{c.title}</p>
                  <p className="text-sm text-muted-foreground">{c.desc}</p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Seus agendamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <BookingsTable bookings={bookings} showUnit />
        </CardContent>
      </Card>
    </PanelLayout>
  )
}

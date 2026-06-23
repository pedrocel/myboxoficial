import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { PanelLayout } from '../../../components/panel/PanelLayout'
import { StatCard } from '../../../components/panel/StatCard'
import { BookingsTable } from '../../../components/panel/BookingsTable'
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

  return (
    <PanelLayout
      title={`Olá, ${profile?.full_name?.split(' ')[0] ?? 'Aluno'}!`}
      subtitle="Seu portal My Box"
      nav={STUDENT_NAV}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-gradient-to-br from-mygreen via-green-600 to-mydark rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-mygreen/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <p className="text-green-100 text-sm font-semibold uppercase tracking-wider mb-2">Próxima aula</p>
          {next ? (
            <>
              <h2 className="text-3xl font-black mb-2">{next.modalidade}</h2>
              <p className="text-green-100 text-lg flex items-center gap-4 flex-wrap">
                <span><i className="fas fa-calendar mr-2" />{new Date(next.booking_date + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                <span><i className="fas fa-clock mr-2" />{next.booking_time?.slice(0, 5)}</span>
              </p>
              <p className="text-white/80 text-sm mt-2">{next.unit_slug.replace(/-/g, ' ')}</p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-black mb-2">Nenhuma aula agendada</h2>
              <p className="text-green-100 mb-6">Encontre a My Box mais próxima e agende sua experimental grátis!</p>
            </>
          )}
          <Link to="/unidades-preview" className="inline-flex items-center gap-2 mt-6 bg-white text-mygreen font-bold px-6 py-3 rounded-xl hover:bg-green-50 transition shadow-lg">
            <i className="fas fa-map-marker-alt" /> Agendar aula
          </Link>
        </div>

        <div className="space-y-4">
          <StatCard icon="fa-calendar-check" label="Total agendamentos" value={bookings.length} color="green" />
          <StatCard icon="fa-clock" label="Próximas aulas" value={upcoming.length} color="blue" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { to: '/painel/aluno/agendamentos', icon: 'fa-list', title: 'Histórico', desc: 'Todos os seus agendamentos' },
          { to: '/painel/aluno/perfil', icon: 'fa-user-edit', title: 'Meu perfil', desc: 'Atualize seus dados' },
          { to: '/unidades-preview', icon: 'fa-dumbbell', title: 'Unidades', desc: 'Explore a rede My Box' },
        ].map((c) => (
          <Link key={c.to} to={c.to} className="bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md hover:border-mygreen/30 transition group">
            <div className="w-11 h-11 rounded-xl bg-green-50 text-mygreen flex items-center justify-center mb-3 group-hover:bg-mygreen group-hover:text-white transition">
              <i className={`fas ${c.icon}`} />
            </div>
            <p className="font-black text-mydark">{c.title}</p>
            <p className="text-sm text-gray-500">{c.desc}</p>
          </Link>
        ))}
      </div>

      <h3 className="font-black text-mydark mb-4">Seus agendamentos</h3>
      <BookingsTable bookings={bookings} showUnit />
    </PanelLayout>
  )
}

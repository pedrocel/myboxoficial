import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PanelLayout } from '../../../components/panel/PanelLayout'
import { StatCard } from '../../../components/panel/StatCard'
import { BookingsTable } from '../../../components/panel/BookingsTable'
import { useAuth } from '../../../contexts/AuthContext'
import { supabase } from '../../../lib/supabase'
import type { Booking } from '../../../types/database'

const STUDENT_NAV = [
  { to: '/painel/aluno', label: 'Início', icon: 'fa-home' },
  { to: '/painel/aluno/agendamentos', label: 'Meus agendamentos', icon: 'fa-calendar-check' },
  { to: '/painel/aluno/perfil', label: 'Meu perfil', icon: 'fa-user' },
]

export function StudentDashboardPage() {
  const { profile, user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])

  useEffect(() => {
    if (!supabase || !user) return
    const email = profile?.email ?? user.email
    supabase
      .from('bookings')
      .select('*')
      .or(`student_id.eq.${user.id},student_email.eq.${email}`)
      .order('booking_date', { ascending: true })
      .then(({ data }) => {
        if (data) setBookings(data as Booking[])
      })
  }, [user, profile])

  const upcoming = bookings.filter((b) => b.status === 'pending' || b.status === 'confirmed').length

  return (
    <PanelLayout
      title={`Olá, ${profile?.full_name?.split(' ')[0] ?? 'Aluno'}!`}
      subtitle="Bem-vindo ao seu portal My Box"
      nav={STUDENT_NAV}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon="fa-calendar-check" label="Total de agendamentos" value={bookings.length} color="green" />
        <StatCard icon="fa-clock" label="Próximas aulas" value={upcoming} color="blue" />
        <StatCard icon="fa-dumbbell" label="Modalidades" value={new Set(bookings.map((b) => b.modalidade)).size} color="gold" />
      </div>

      <div className="bg-gradient-to-br from-mygreen to-green-600 rounded-2xl p-8 text-white mb-8 shadow-xl shadow-mygreen/20">
        <h2 className="text-xl font-black mb-2">Quer agendar outra aula?</h2>
        <p className="text-green-100 text-sm mb-5">Encontre a unidade My Box mais próxima de você.</p>
        <Link
          to="/unidades-preview"
          className="inline-flex items-center gap-2 bg-white text-mygreen font-bold px-6 py-3 rounded-xl hover:bg-green-50 transition"
        >
          <i className="fas fa-map-marker-alt" />
          Ver unidades
        </Link>
      </div>

      <h2 className="text-lg font-black text-mydark mb-4">Seus agendamentos</h2>
      <BookingsTable bookings={bookings} showUnit />
    </PanelLayout>
  )
}

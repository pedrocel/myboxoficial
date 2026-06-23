import { useEffect, useState } from 'react'
import { PanelLayout } from '../../../components/panel/PanelLayout'
import { BookingsTable } from '../../../components/panel/BookingsTable'
import { useAuth } from '../../../contexts/AuthContext'
import { supabase } from '../../../lib/supabase'
import type { Booking } from '../../../types/database'

const STUDENT_NAV = [
  { to: '/painel/aluno', label: 'Início', icon: 'fa-home' },
  { to: '/painel/aluno/agendamentos', label: 'Meus agendamentos', icon: 'fa-calendar-check' },
  { to: '/painel/aluno/perfil', label: 'Meu perfil', icon: 'fa-user' },
]

export function StudentBookingsPage() {
  const { profile, user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])

  useEffect(() => {
    if (!supabase || !user) return
    const email = profile?.email ?? user.email
    supabase
      .from('bookings')
      .select('*')
      .or(`student_id.eq.${user.id},student_email.eq.${email}`)
      .order('booking_date', { ascending: false })
      .then(({ data }) => {
        if (data) setBookings(data as Booking[])
      })
  }, [user, profile])

  return (
    <PanelLayout title="Meus agendamentos" subtitle="Histórico completo das suas aulas" nav={STUDENT_NAV}>
      <BookingsTable bookings={bookings} showUnit />
    </PanelLayout>
  )
}

import { useEffect, useState } from 'react'
import { PanelLayout } from '../../../components/panel/PanelLayout'
import { BookingsTable } from '../../../components/panel/BookingsTable'
import { useAuth } from '../../../contexts/AuthContext'
import { updateBookingStatus } from '../../../lib/bookings'
import { supabase } from '../../../lib/supabase'
import type { Booking, BookingStatus } from '../../../types/database'

const OWNER_NAV = [
  { to: '/painel/unidade', label: 'Dashboard', icon: 'fa-chart-pie' },
  { to: '/painel/unidade/agendamentos', label: 'Aulas agendadas', icon: 'fa-calendar-check' },
  { to: '/painel/unidade/alunos', label: 'Alunos', icon: 'fa-users' },
  { to: '/painel/unidade/visitas', label: 'Visitas', icon: 'fa-eye' },
  { to: '/painel/unidade/editar', label: 'Minha unidade', icon: 'fa-edit' },
]

export function OwnerBookingsPage() {
  const { profile } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const slug = profile?.unit_slug

  useEffect(() => {
    if (!supabase || !slug) return
    supabase
      .from('bookings')
      .select('*')
      .eq('unit_slug', slug)
      .order('booking_date', { ascending: true })
      .then(({ data }) => {
        if (data) setBookings(data as Booking[])
      })
  }, [slug])

  const handleStatus = async (id: string, status: BookingStatus) => {
    await updateBookingStatus(id, status)
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)))
  }

  return (
    <PanelLayout title="Aulas agendadas" subtitle="Gerencie os agendamentos da sua unidade" nav={OWNER_NAV}>
      <BookingsTable bookings={bookings} onStatusChange={handleStatus} />
    </PanelLayout>
  )
}

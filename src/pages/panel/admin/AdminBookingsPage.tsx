import { useEffect, useState } from 'react'
import { PanelLayout } from '../../../components/panel/PanelLayout'
import { BookingsTable } from '../../../components/panel/BookingsTable'
import { updateBookingStatus } from '../../../lib/bookings'
import { supabase } from '../../../lib/supabase'
import type { Booking, BookingStatus } from '../../../types/database'

import { ADMIN_NAV } from '../../../lib/panel-nav'
export function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])

  const load = () => {
    if (!supabase) return
    supabase
      .from('bookings')
      .select('*')
      .order('booking_date', { ascending: true })
      .then(({ data }) => {
        if (data) setBookings(data as Booking[])
      })
  }

  useEffect(load, [])

  const handleStatus = async (id: string, status: BookingStatus) => {
    await updateBookingStatus(id, status)
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)))
  }

  return (
    <PanelLayout title="Agendamentos" subtitle="Todas as aulas agendadas no sistema" nav={ADMIN_NAV}>
      <BookingsTable bookings={bookings} showUnit onStatusChange={handleStatus} />
    </PanelLayout>
  )
}

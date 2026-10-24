import { useEffect, useState } from 'react'
import { PanelLayout } from '../../../components/panel/PanelLayout'
import { BookingsTable } from '../../../components/panel/BookingsTable'
import { updateBookingStatus } from '../../../lib/bookings'
import { api } from '../../../lib/api'
import type { Booking, BookingStatus } from '../../../types/database'

import { ADMIN_NAV } from '../../../lib/panel-nav'
export function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])

  const load = () => {
    api.get<Booking[]>('/bookings?order=booking_date&dir=asc').then(setBookings).catch(() => {})
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

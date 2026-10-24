import { useEffect, useState } from 'react'
import { PanelLayout } from '../../../components/panel/PanelLayout'
import { BookingsTable } from '../../../components/panel/BookingsTable'
import { useAuth } from '../../../contexts/AuthContext'
import { updateBookingStatus } from '../../../lib/bookings'
import { api } from '../../../lib/api'
import type { Booking, BookingStatus } from '../../../types/database'

import { OWNER_NAV } from '../../../lib/panel-nav'
export function OwnerBookingsPage() {
  const { profile } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const slug = profile?.unit_slug

  useEffect(() => {
    if (!slug) return
    api.get<Booking[]>('/bookings?order=booking_date&dir=asc').then(setBookings).catch(() => {})
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

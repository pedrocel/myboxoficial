import { useEffect, useState } from 'react'
import { PanelLayout } from '../../../components/panel/PanelLayout'
import { BookingsTable } from '../../../components/panel/BookingsTable'
import { useAuth } from '../../../contexts/AuthContext'
import { api } from '../../../lib/api'
import type { Booking } from '../../../types/database'

import { STUDENT_NAV } from '../../../lib/panel-nav'
export function StudentBookingsPage() {
  const { profile, user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])

  useEffect(() => {
    if (!user) return
    api.get<Booking[]>('/bookings?order=booking_date&dir=desc').then(setBookings).catch(() => {})
  }, [user, profile])

  return (
    <PanelLayout title="Meus agendamentos" subtitle="Histórico completo das suas aulas" nav={STUDENT_NAV}>
      <BookingsTable bookings={bookings} showUnit />
    </PanelLayout>
  )
}

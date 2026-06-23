import { useEffect, useState } from 'react'
import { PanelLayout } from '../../../components/panel/PanelLayout'
import { BookingsTable } from '../../../components/panel/BookingsTable'
import { useAuth } from '../../../contexts/AuthContext'
import { updateBookingStatus } from '../../../lib/bookings'
import { supabase } from '../../../lib/supabase'
import type { Booking, BookingStatus } from '../../../types/database'

import { OWNER_NAV } from '../../../lib/panel-nav'
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

import { useEffect, useState, useMemo } from 'react'
import { PanelLayout } from '../../../components/panel/PanelLayout'
import { useAuth } from '../../../contexts/AuthContext'
import { supabase } from '../../../lib/supabase'
import type { Booking } from '../../../types/database'

import { OWNER_NAV } from '../../../lib/panel-nav'
type StudentRow = {
  email: string
  name: string
  phone: string
  bookings: number
  lastBooking: string
}

export function OwnerStudentsPage() {
  const { profile } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const slug = profile?.unit_slug

  useEffect(() => {
    if (!supabase || !slug) return
    supabase.from('bookings').select('*').eq('unit_slug', slug).then(({ data }) => {
      if (data) setBookings(data as Booking[])
    })
  }, [slug])

  const students = useMemo(() => {
    const map = new Map<string, StudentRow>()
    bookings.forEach((b) => {
      const existing = map.get(b.student_email)
      if (existing) {
        existing.bookings++
        if (b.booking_date > existing.lastBooking) existing.lastBooking = b.booking_date
      } else {
        map.set(b.student_email, {
          email: b.student_email,
          name: b.student_name,
          phone: b.student_phone,
          bookings: 1,
          lastBooking: b.booking_date,
        })
      }
    })
    return Array.from(map.values()).sort((a, b) => b.lastBooking.localeCompare(a.lastBooking))
  }, [bookings])

  return (
    <PanelLayout title="Alunos" subtitle="Pessoas que agendaram na sua unidade" nav={OWNER_NAV}>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {students.map((s) => (
          <div key={s.email} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full gradient-green flex items-center justify-center text-white font-bold text-lg shrink-0">
                {s.name[0]?.toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-black text-mydark truncate">{s.name}</h3>
                <p className="text-xs text-gray-400 truncate">{s.email}</p>
                <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                  <span><i className="fas fa-calendar mr-1" />{s.bookings} agendamento{s.bookings > 1 ? 's' : ''}</span>
                  <span>Último: {new Date(s.lastBooking + 'T12:00:00').toLocaleDateString('pt-BR')}</span>
                </div>
                <a
                  href={`https://wa.me/55${s.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-4 text-sm font-bold text-green-600 hover:text-green-700"
                >
                  <i className="fab fa-whatsapp" />
                  Contatar
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!students.length && (
        <div className="text-center py-16 text-gray-400">
          <i className="fas fa-users text-4xl mb-4" />
          <p>Nenhum aluno ainda. Compartilhe o link da sua unidade!</p>
        </div>
      )}
    </PanelLayout>
  )
}

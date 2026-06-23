import { useEffect, useState, useMemo } from 'react'
import { Calendar, Users } from 'lucide-react'
import { PanelLayout } from '../../../components/panel/PanelLayout'
import { Card, CardContent } from '../../../components/ui/card'
import { useAuth } from '../../../contexts/AuthContext'
import { supabase } from '../../../lib/supabase'
import { OWNER_NAV } from '../../../lib/panel-nav'
import type { Booking } from '../../../types/database'

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
          <Card key={s.email} className="hover:border-primary/30 hover:shadow-md transition">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full gradient-green flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {s.name[0]?.toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-foreground truncate">{s.name}</h3>
                  <p className="text-xs text-muted-foreground truncate">{s.email}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{s.bookings} agendamento{s.bookings > 1 ? 's' : ''}</span>
                    <span>Último: {new Date(s.lastBooking + 'T12:00:00').toLocaleDateString('pt-BR')}</span>
                  </div>
                  <a
                    href={`https://wa.me/55${s.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-primary hover:text-primary/80"
                  >
                    <i className="fab fa-whatsapp" />
                    Contatar
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!students.length && (
        <div className="text-center py-16 text-muted-foreground">
          <Users className="h-12 w-12 mx-auto mb-4 opacity-40" />
          <p>Nenhum aluno ainda. Compartilhe o link da sua unidade!</p>
        </div>
      )}
    </PanelLayout>
  )
}

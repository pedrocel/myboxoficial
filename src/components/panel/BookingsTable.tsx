import type { Booking, BookingStatus } from '../../types/database'
import { CalendarX } from 'lucide-react'
import { Badge } from '../ui/badge'
import { Card } from '../ui/card'

const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: 'Pendente',
  confirmed: 'Confirmado',
  cancelled: 'Cancelado',
  completed: 'Realizado',
}

const STATUS_VARIANT: Record<BookingStatus, 'secondary' | 'success' | 'destructive' | 'outline'> = {
  pending: 'secondary',
  confirmed: 'success',
  cancelled: 'destructive',
  completed: 'outline',
}

type Props = {
  bookings: Booking[]
  showUnit?: boolean
  onStatusChange?: (id: string, status: BookingStatus) => void
}

export function BookingsTable({ bookings, showUnit, onStatusChange }: Props) {
  if (!bookings.length) {
    return (
      <Card className="p-12 text-center">
        <CalendarX className="h-10 w-10 text-muted-foreground/40 mx-auto mb-4" />
        <p className="text-muted-foreground font-medium">Nenhum agendamento encontrado</p>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <th className="px-6 py-4">Aluno</th>
              {showUnit && <th className="px-6 py-4">Unidade</th>}
              <th className="px-6 py-4">Modalidade</th>
              <th className="px-6 py-4">Data / Hora</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Contato</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {bookings.map((b) => (
              <tr key={b.id} className="hover:bg-muted/30 transition">
                <td className="px-6 py-4">
                  <p className="font-semibold text-foreground">{b.student_name}</p>
                  <p className="text-xs text-muted-foreground">{b.student_email}</p>
                </td>
                {showUnit && (
                  <td className="px-6 py-4 text-muted-foreground font-medium">{b.unit_slug}</td>
                )}
                <td className="px-6 py-4 text-muted-foreground">{b.modalidade}</td>
                <td className="px-6 py-4">
                  <p className="font-semibold text-foreground">
                    {new Date(b.booking_date + 'T12:00:00').toLocaleDateString('pt-BR')}
                  </p>
                  <p className="text-xs text-muted-foreground">{b.booking_time?.slice(0, 5)}</p>
                </td>
                <td className="px-6 py-4">
                  {onStatusChange ? (
                    <select
                      value={b.status}
                      onChange={(e) => onStatusChange(b.id, e.target.value as BookingStatus)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-full border border-input bg-background cursor-pointer"
                    >
                      {Object.entries(STATUS_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </select>
                  ) : (
                    <Badge variant={STATUS_VARIANT[b.status]}>{STATUS_LABELS[b.status]}</Badge>
                  )}
                </td>
                <td className="px-6 py-4">
                  <a
                    href={`https://wa.me/55${b.student_phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 font-semibold text-xs flex items-center gap-1"
                  >
                    <i className="fab fa-whatsapp" />
                    WhatsApp
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

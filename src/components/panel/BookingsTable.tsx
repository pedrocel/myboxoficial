import type { Booking, BookingStatus } from '../../types/database'

const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: 'Pendente',
  confirmed: 'Confirmado',
  cancelled: 'Cancelado',
  completed: 'Realizado',
}

const STATUS_COLORS: Record<BookingStatus, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-gray-100 text-gray-600',
}

type Props = {
  bookings: Booking[]
  showUnit?: boolean
  onStatusChange?: (id: string, status: BookingStatus) => void
}

export function BookingsTable({ bookings, showUnit, onStatusChange }: Props) {
  if (!bookings.length) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
        <i className="fas fa-calendar-times text-4xl text-gray-200 mb-4" />
        <p className="text-gray-500 font-medium">Nenhum agendamento encontrado</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
              <th className="px-6 py-4">Aluno</th>
              {showUnit && <th className="px-6 py-4">Unidade</th>}
              <th className="px-6 py-4">Modalidade</th>
              <th className="px-6 py-4">Data / Hora</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Contato</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {bookings.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50/50 transition">
                <td className="px-6 py-4">
                  <p className="font-bold text-mydark">{b.student_name}</p>
                  <p className="text-xs text-gray-400">{b.student_email}</p>
                </td>
                {showUnit && (
                  <td className="px-6 py-4 text-gray-600 font-medium">{b.unit_slug}</td>
                )}
                <td className="px-6 py-4 text-gray-600">{b.modalidade}</td>
                <td className="px-6 py-4">
                  <p className="font-semibold text-mydark">
                    {new Date(b.booking_date + 'T12:00:00').toLocaleDateString('pt-BR')}
                  </p>
                  <p className="text-xs text-gray-400">{b.booking_time?.slice(0, 5)}</p>
                </td>
                <td className="px-6 py-4">
                  {onStatusChange ? (
                    <select
                      value={b.status}
                      onChange={(e) => onStatusChange(b.id, e.target.value as BookingStatus)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full border-0 cursor-pointer ${STATUS_COLORS[b.status]}`}
                    >
                      {Object.entries(STATUS_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </select>
                  ) : (
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${STATUS_COLORS[b.status]}`}>
                      {STATUS_LABELS[b.status]}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <a
                    href={`https://wa.me/55${b.student_phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 font-semibold text-xs flex items-center gap-1"
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
    </div>
  )
}

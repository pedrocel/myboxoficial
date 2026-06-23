import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { PanelLayout } from '../../../components/panel/PanelLayout'
import { StatCard } from '../../../components/panel/StatCard'
import { BookingsTable } from '../../../components/panel/BookingsTable'
import { useAuth } from '../../../contexts/AuthContext'
import { OWNER_NAV } from '../../../lib/panel-nav'
import { supabase } from '../../../lib/supabase'
import { getUnitGallery, getUnitModalidades } from '../../../lib/unit-settings'
import type { Booking, DbUnit, UnitVisit } from '../../../types/database'

export function OwnerDashboardPage() {
  const { profile } = useAuth()
  const [unit, setUnit] = useState<DbUnit | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [visits, setVisits] = useState<UnitVisit[]>([])
  const slug = profile?.unit_slug

  useEffect(() => {
    if (!supabase || !slug) return
    supabase.from('units').select('*').eq('slug', slug).single().then(({ data }) => {
      if (data) setUnit(data as DbUnit)
    })
    supabase.from('bookings').select('*').eq('unit_slug', slug).order('booking_date', { ascending: true }).then(({ data }) => {
      if (data) setBookings(data as Booking[])
    })
    supabase.from('unit_visits').select('*').eq('unit_slug', slug).order('created_at', { ascending: false }).limit(5).then(({ data }) => {
      if (data) setVisits(data as UnitVisit[])
    })
  }, [slug])

  const stats = useMemo(() => {
    const pending = bookings.filter((b) => b.status === 'pending').length
    const today = new Date().toISOString().slice(0, 10)
    const todayBookings = bookings.filter((b) => b.booking_date === today).length
    const students = new Set(bookings.map((b) => b.student_email)).size
    return { pending, todayBookings, students }
  }, [bookings])

  const hero = unit ? getUnitGallery(unit)[0] : null
  const mods = getUnitModalidades(unit)

  return (
    <PanelLayout title={unit?.name ?? 'Minha unidade'} subtitle={unit ? `${unit.cidade} — ${unit.estado}` : 'Carregando...'} nav={OWNER_NAV}>
      {hero && (
        <div className="relative rounded-3xl overflow-hidden mb-8 h-40 md:h-52">
          <img src={hero} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-mydark/90 to-mydark/30" />
          <div className="absolute inset-0 flex items-end justify-between p-6">
            <div>
              <p className="text-white/70 text-sm">Painel da unidade</p>
              <p className="text-white font-black text-2xl">{unit?.name}</p>
            </div>
            <Link to="/painel/unidade/personalizar" className="bg-mygreen hover:bg-green-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow-lg transition">
              <i className="fas fa-palette mr-2" />Personalizar
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="fa-eye" label="Visitas à página" value={unit?.visits_count ?? 0} color="green" />
        <StatCard icon="fa-calendar-day" label="Agendamentos hoje" value={stats.todayBookings} color="blue" />
        <StatCard icon="fa-clock" label="Pendentes" value={stats.pending} color="gold" />
        <StatCard icon="fa-users" label="Alunos" value={stats.students} color="dark" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl border p-6 shadow-sm">
          <h3 className="font-black text-mydark mb-4">Ações rápidas</h3>
          <div className="space-y-2">
            {[
              { to: '/painel/unidade/agendamentos', icon: 'fa-calendar-check', label: 'Ver agendamentos' },
              { to: '/painel/unidade/alunos', icon: 'fa-users', label: 'Meus alunos' },
              { to: '/painel/unidade/personalizar', icon: 'fa-images', label: 'Editar galeria' },
              { to: '/painel/unidade/visitas', icon: 'fa-chart-line', label: 'Relatório de visitas' },
            ].map((a) => (
              <Link key={a.to} to={a.to} className="flex items-center gap-3 p-3 rounded-xl hover:bg-green-50 transition group">
                <span className="w-9 h-9 rounded-lg bg-gray-100 group-hover:bg-mygreen group-hover:text-white flex items-center justify-center text-mygreen transition">
                  <i className={`fas ${a.icon} text-sm`} />
                </span>
                <span className="font-semibold text-sm text-mydark">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border p-6 shadow-sm">
          <h3 className="font-black text-mydark mb-4">Modalidades ativas</h3>
          <div className="flex flex-wrap gap-2">
            {mods.map((m) => (
              <span key={m.id} className="text-xs font-bold px-3 py-1.5 rounded-full bg-green-50 text-mygreen">
                <i className={`fas ${m.icon} mr-1`} />{m.title}
              </span>
            ))}
            {!mods.length && <p className="text-sm text-gray-400">Configure em Personalizar</p>}
          </div>
        </div>

        <div className="bg-white rounded-2xl border p-6 shadow-sm">
          <h3 className="font-black text-mydark mb-4">Últimas visitas</h3>
          <ul className="space-y-2 text-sm">
            {visits.map((v) => (
              <li key={v.id} className="flex justify-between text-gray-600">
                <span>{new Date(v.created_at).toLocaleDateString('pt-BR')}</span>
                <span className="text-gray-400 text-xs truncate max-w-[120px]">{v.referrer || 'Direto'}</span>
              </li>
            ))}
            {!visits.length && <li className="text-gray-400">Nenhuma visita ainda</li>}
          </ul>
        </div>
      </div>

      <h3 className="font-black text-mydark mb-4">Próximos agendamentos</h3>
      <BookingsTable bookings={bookings.slice(0, 5)} />
    </PanelLayout>
  )
}

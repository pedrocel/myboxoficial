import { CalendarCheck, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { PanelLayout } from '../../../components/panel/PanelLayout'
import { StatCard } from '../../../components/panel/StatCard'
import { BookingsTable } from '../../../components/panel/BookingsTable'
import { ADMIN_NAV } from '../../../lib/panel-nav'
import { supabase } from '../../../lib/supabase'
import { ownerDefaultPassword } from '../../../lib/unit-settings'
import type { Booking, DbUnit, Profile } from '../../../types/database'

const ROLE_LABELS = { admin: 'Administrador', owner: 'Dono da unidade', student: 'Aluno' }

export function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [unit, setUnit] = useState<DbUnit | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])

  useEffect(() => {
    if (!supabase || !id) return
    ;(async () => {
      const { data: p } = await supabase.from('profiles').select('*').eq('id', id).single()
      if (!p) return
      const prof = p as Profile
      setProfile(prof)
      if (prof.unit_slug) {
        const { data: u } = await supabase.from('units').select('*').eq('slug', prof.unit_slug).single()
        if (u) setUnit(u as DbUnit)
      }
      const { data: b } = await supabase
        .from('bookings')
        .select('*')
        .or(`student_id.eq.${id},student_email.eq.${prof.email}`)
        .order('created_at', { ascending: false })
      if (b) setBookings(b as Booking[])
    })()
  }, [id])

  if (!id) return <Navigate to="/painel/admin/usuarios" replace />

  if (!profile) {
    return (
      <PanelLayout title="Usuário" nav={ADMIN_NAV}>
        <div className="flex justify-center py-20"><i className="fas fa-spinner fa-spin text-mygreen text-3xl" /></div>
      </PanelLayout>
    )
  }

  return (
    <PanelLayout title={profile.full_name ?? profile.email} subtitle={ROLE_LABELS[profile.role]} nav={ADMIN_NAV}>
      <Link to="/painel/admin/usuarios" className="text-sm text-gray-500 hover:text-mygreen flex items-center gap-1 mb-6">
        <i className="fas fa-arrow-left" /> Usuários
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1 bg-white rounded-2xl border p-6 shadow-sm">
          <div className="flex flex-col items-center text-center pb-6 border-b">
            <div className="w-20 h-20 rounded-2xl gradient-green flex items-center justify-center text-white font-black text-3xl mb-4 shadow-lg">
              {(profile.full_name ?? profile.email)[0]?.toUpperCase()}
            </div>
            <h2 className="text-xl font-black text-mydark">{profile.full_name ?? '—'}</h2>
            <p className="text-gray-500 text-sm">{profile.email}</p>
            <span className="mt-2 text-xs font-bold uppercase tracking-wider text-mygreen bg-green-50 px-3 py-1 rounded-full">
              {ROLE_LABELS[profile.role]}
            </span>
          </div>
          <div className="pt-6 space-y-4 text-sm">
            {profile.phone && (
              <div><p className="text-[10px] text-gray-400 uppercase font-bold">Telefone</p><p className="font-semibold">{profile.phone}</p></div>
            )}
            <div><p className="text-[10px] text-gray-400 uppercase font-bold">Cadastro</p><p className="font-semibold">{new Date(profile.created_at).toLocaleDateString('pt-BR')}</p></div>
            <div><p className="text-[10px] text-gray-400 uppercase font-bold">ID</p><p className="font-mono text-xs text-gray-500 break-all">{profile.id}</p></div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {profile.role === 'owner' && unit && (
            <div className="bg-white rounded-2xl border p-6 shadow-sm">
              <h3 className="font-black text-mydark mb-4">Unidade vinculada</h3>
              <Link to={`/painel/admin/unidades/${unit.slug}`} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-green-50 transition group">
                <div className="w-12 h-12 rounded-xl gradient-green flex items-center justify-center text-white font-bold">{unit.name[0]}</div>
                <div className="flex-1">
                  <p className="font-bold group-hover:text-mygreen">{unit.name}</p>
                  <p className="text-sm text-gray-500">{unit.cidade} — {unit.estado}</p>
                </div>
                <i className="fas fa-arrow-right text-mygreen" />
              </Link>
              <p className="text-xs text-gray-400 mt-3">Senha padrão owner: <code className="bg-gray-100 px-1 rounded">{ownerDefaultPassword(unit.name)}</code></p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <StatCard icon={CalendarCheck} label="Agendamentos" value={bookings.length} />
            <StatCard icon={Clock} label="Pendentes" value={bookings.filter((b) => b.status === 'pending').length} variant="gold" />
          </div>

          {profile.role === 'student' && (
            <>
              <h3 className="font-black text-mydark">Agendamentos do aluno</h3>
              <BookingsTable bookings={bookings} showUnit />
            </>
          )}
        </div>
      </div>
    </PanelLayout>
  )
}

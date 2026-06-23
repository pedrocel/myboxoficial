import { useEffect, useState, useMemo } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { Eye, CalendarCheck, Clock, Users } from 'lucide-react'
import { PanelLayout } from '../../../components/panel/PanelLayout'
import { StatCard } from '../../../components/panel/StatCard'
import { BookingsTable } from '../../../components/panel/BookingsTable'
import { UnitCustomizeEditor, buildUnitUpdatePayload } from '../../../components/panel/UnitCustomizeEditor'
import { ADMIN_NAV } from '../../../lib/panel-nav'
import { supabase } from '../../../lib/supabase'
import { getUnitGallery, getUnitModalidades, ownerDefaultPassword } from '../../../lib/unit-settings'
import { geocodeUnit } from '../../../lib/geocode'
import { STATE_NAMES } from '../../../lib/brazil-states'
import type { Booking, DbUnit, Profile, UnitVisit } from '../../../types/database'

export function AdminUnitDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [unit, setUnit] = useState<DbUnit | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [visits, setVisits] = useState<UnitVisit[]>([])
  const [owner, setOwner] = useState<Profile | null>(null)
  const [tab, setTab] = useState<'overview' | 'edit'>('overview')

  useEffect(() => {
    if (!supabase || !slug) return
    supabase.from('units').select('*').eq('slug', slug).single().then(({ data }) => {
      if (data) {
        const u = data as DbUnit
        setUnit(u)
        if (u.owner_id && supabase) {
          supabase.from('profiles').select('*').eq('id', u.owner_id).single().then(({ data: p }) => {
            if (p) setOwner(p as Profile)
          })
        }
      }
    })
    supabase.from('bookings').select('*').eq('unit_slug', slug).order('created_at', { ascending: false }).limit(10).then(({ data }) => {
      if (data) setBookings(data as Booking[])
    })
    supabase.from('unit_visits').select('*').eq('unit_slug', slug).order('created_at', { ascending: false }).limit(15).then(({ data }) => {
      if (data) setVisits(data as UnitVisit[])
    })
  }, [slug])

  const stats = useMemo(() => {
    const pending = bookings.filter((b) => b.status === 'pending').length
    const students = new Set(bookings.map((b) => b.student_email)).size
    const weekVisits = visits.filter((v) => {
      const d = new Date(v.created_at)
      return (Date.now() - d.getTime()) / 86400000 <= 7
    }).length
    return { pending, students, weekVisits }
  }, [bookings, visits])

  if (!slug) return <Navigate to="/painel/admin/unidades" replace />

  if (!unit) {
    return (
      <PanelLayout title="Unidade" subtitle="Carregando..." nav={ADMIN_NAV}>
        <div className="flex justify-center py-20"><i className="fas fa-spinner fa-spin text-mygreen text-3xl" /></div>
      </PanelLayout>
    )
  }

  const hero = getUnitGallery(unit)[0]
  const mods = getUnitModalidades(unit)

  const saveUnit = async (updated: DbUnit) => {
    if (!supabase) return { error: 'Sem conexão' }
    let toSave = { ...updated }
    const coords = await geocodeUnit(toSave)
    if (coords) toSave = { ...toSave, lat: coords.lat, lng: coords.lng }
    const { error } = await supabase.from('units').update(buildUnitUpdatePayload(toSave)).eq('slug', slug)
    if (!error) setUnit(toSave)
    return { error: error?.message }
  }

  return (
    <PanelLayout title={unit.name} subtitle={`${unit.cidade} — ${STATE_NAMES[unit.estado ?? ''] ?? unit.estado}`} nav={ADMIN_NAV}>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Link to="/painel/admin/unidades" className="text-sm text-gray-500 hover:text-mygreen flex items-center gap-1">
          <i className="fas fa-arrow-left" /> Unidades
        </Link>
        <div className="flex gap-2 ml-auto">
          <button type="button" onClick={() => setTab('overview')} className={`px-4 py-2 rounded-xl text-sm font-bold ${tab === 'overview' ? 'bg-mygreen text-white' : 'bg-white border'}`}>
            Dashboard
          </button>
          <button type="button" onClick={() => setTab('edit')} className={`px-4 py-2 rounded-xl text-sm font-bold ${tab === 'edit' ? 'bg-mygreen text-white' : 'bg-white border'}`}>
            Editar unidade
          </button>
          <Link to={`/unidades-preview/${slug}`} target="_blank" className="px-4 py-2 rounded-xl text-sm font-bold bg-gray-100 text-mydark hover:bg-gray-200 flex items-center gap-2">
            <i className="fas fa-external-link-alt" /> Página pública
          </Link>
        </div>
      </div>

      {tab === 'overview' ? (
        <>
          <div className="relative rounded-3xl overflow-hidden mb-8 h-48 md:h-56">
            <img src={hero} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-mydark/90 via-mydark/50 to-transparent" />
            <div className="absolute inset-0 flex items-end p-6 md:p-8">
              <div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${unit.status ? 'bg-mygreen text-white' : 'bg-red-500 text-white'}`}>
                    {unit.status ? 'Ativa' : 'Inativa'}
                  </span>
                  {unit.is_public && <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/20 text-white">Pública</span>}
                </div>
                <p className="text-white/70 text-sm max-w-lg">{unit.description || unit.como_chegar || 'Sem descrição'}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={Eye} label="Visitas totais" value={unit.visits_count ?? 0} trend={`${stats.weekVisits} esta semana`} />
            <StatCard icon={CalendarCheck} label="Agendamentos" value={bookings.length} variant="blue" />
            <StatCard icon={Clock} label="Pendentes" value={stats.pending} variant="gold" />
            <StatCard icon={Users} label="Alunos únicos" value={stats.students} variant="muted" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-1 bg-white rounded-2xl border p-6 shadow-sm space-y-4">
              <h3 className="font-black text-mydark flex items-center gap-2"><i className="fas fa-address-card text-mygreen" /> Contato</h3>
              {[
                ['Telefone', unit.telefone, 'fa-phone'],
                ['WhatsApp', unit.whatsapp, 'fa-whatsapp'],
                ['E-mail', unit.email, 'fa-envelope'],
                ['Dono', unit.nome_dono, 'fa-user-tie'],
              ].map(([l, v, icon]) => v && (
                <div key={l as string} className="flex items-start gap-3 text-sm">
                  <i className={`fas ${icon} text-mygreen mt-0.5 w-4`} />
                  <div><p className="text-[10px] text-gray-400 uppercase font-bold">{l}</p><p className="font-semibold text-mydark">{v}</p></div>
                </div>
              ))}
              <div className="pt-3 border-t">
                <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Endereço</p>
                <p className="text-sm text-gray-600">{[unit.logradouro, unit.numero, unit.cidade, unit.estado].filter(Boolean).join(', ')}</p>
              </div>
            </div>

            <div className="lg:col-span-1 bg-white rounded-2xl border p-6 shadow-sm">
              <h3 className="font-black text-mydark mb-4 flex items-center gap-2"><i className="fas fa-user-shield text-mygreen" /> Dono da unidade</h3>
              {owner ? (
                <Link to={`/painel/admin/usuarios/${owner.id}`} className="block p-4 bg-gray-50 rounded-xl hover:bg-green-50 transition group">
                  <p className="font-bold text-mydark group-hover:text-mygreen">{owner.full_name}</p>
                  <p className="text-sm text-gray-500">{owner.email}</p>
                  <p className="text-xs text-mygreen mt-2 font-semibold">Ver perfil →</p>
                </Link>
              ) : (
                <div className="p-4 bg-amber-50 rounded-xl text-sm text-amber-800">
                  <p className="font-bold mb-1">Sem owner vinculado</p>
                  <p className="text-xs">Rode <code>npm run owners:create</code></p>
                  {unit.email && <p className="text-xs mt-2">Senha padrão: <strong>{ownerDefaultPassword(unit.name)}</strong></p>}
                </div>
              )}
            </div>

            <div className="lg:col-span-1 bg-white rounded-2xl border p-6 shadow-sm">
              <h3 className="font-black text-mydark mb-4 flex items-center gap-2"><i className="fas fa-dumbbell text-mygreen" /> Modalidades</h3>
              <div className="flex flex-wrap gap-2">
                {mods.map((m) => (
                  <span key={m.id} className="text-xs font-bold px-3 py-1.5 rounded-full bg-green-50 text-mygreen border border-mygreen/20">
                    <i className={`fas ${m.icon} mr-1`} />{m.title}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-4">{unit.gallery_images?.length ?? 0} imagens na galeria</p>
            </div>
          </div>

          <h3 className="font-black text-mydark mb-4">Últimos agendamentos</h3>
          <BookingsTable bookings={bookings} />

          <h3 className="font-black text-mydark mb-4 mt-8">Visitas recentes</h3>
          <div className="bg-white rounded-2xl border overflow-hidden">
            <table className="w-full text-sm">
              <tbody className="divide-y">
                {visits.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{new Date(v.created_at).toLocaleString('pt-BR')}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{v.referrer || 'Direto'}</td>
                  </tr>
                ))}
                {!visits.length && <tr><td colSpan={2} className="px-4 py-8 text-center text-gray-400">Nenhuma visita registrada</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <UnitCustomizeEditor unit={unit} onSave={saveUnit} />
      )}
    </PanelLayout>
  )
}

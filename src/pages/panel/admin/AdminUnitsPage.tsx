import { useEffect, useState } from 'react'
import { PanelLayout } from '../../../components/panel/PanelLayout'
import { supabase } from '../../../lib/supabase'
import type { DbUnit } from '../../../types/database'
import { STATE_NAMES } from '../../../lib/brazil-states'

const ADMIN_NAV = [
  { to: '/painel/admin', label: 'Dashboard', icon: 'fa-chart-pie' },
  { to: '/painel/admin/unidades', label: 'Unidades', icon: 'fa-store' },
  { to: '/painel/admin/agendamentos', label: 'Agendamentos', icon: 'fa-calendar-check' },
  { to: '/painel/admin/usuarios', label: 'Usuários', icon: 'fa-users' },
]

export function AdminUnitsPage() {
  const [units, setUnits] = useState<DbUnit[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!supabase) return
    supabase.from('units').select('*').order('name').then(({ data }) => {
      if (data) setUnits(data as DbUnit[])
    })
  }, [])

  const filtered = units.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.cidade?.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <PanelLayout title="Unidades" subtitle="Todas as academias do sistema" nav={ADMIN_NAV}>
      <div className="mb-6">
        <div className="relative max-w-md">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar unidade ou cidade..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-mygreen"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((unit) => (
          <div
            key={unit.slug}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition group"
          >
            <div className="h-32 bg-gradient-to-br from-mygreen/20 to-mydark/10 relative">
              {unit.image_background && (
                <img src={unit.image_background} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" />
              )}
              <div className="absolute bottom-3 left-4">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${unit.status ? 'bg-mygreen text-white' : 'bg-red-500 text-white'}`}>
                  {unit.status ? 'Ativa' : 'Inativa'}
                </span>
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-black text-mydark group-hover:text-mygreen transition">{unit.name}</h3>
              <p className="text-sm text-gray-500 mt-1">
                {unit.cidade} — {STATE_NAMES[unit.estado ?? ''] ?? unit.estado}
              </p>
              <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
                <span><i className="fas fa-eye mr-1" />{unit.visits_count ?? 0} visitas</span>
                {unit.email && <span><i className="fas fa-envelope mr-1" />{unit.email}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {!filtered.length && (
        <div className="text-center py-16 text-gray-400">
          <i className="fas fa-store text-4xl mb-4" />
          <p>Nenhuma unidade encontrada. Execute o seed do Supabase.</p>
        </div>
      )}
    </PanelLayout>
  )
}

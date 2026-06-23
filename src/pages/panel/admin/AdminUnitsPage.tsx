import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { PanelLayout } from '../../../components/panel/PanelLayout'
import { StatCard } from '../../../components/panel/StatCard'
import { ADMIN_NAV } from '../../../lib/panel-nav'
import { supabase } from '../../../lib/supabase'
import { getUnitGallery } from '../../../lib/unit-settings'
import { STATE_NAMES } from '../../../lib/brazil-states'
import type { DbUnit } from '../../../types/database'

export function AdminUnitsPage() {
  const [units, setUnits] = useState<DbUnit[]>([])
  const [search, setSearch] = useState('')
  const [estado, setEstado] = useState('')

  useEffect(() => {
    if (!supabase) return
    supabase.from('units').select('*').order('name').then(({ data }) => {
      if (data) setUnits(data as DbUnit[])
    })
  }, [])

  const estados = useMemo(() => [...new Set(units.map((u) => u.estado).filter(Boolean))].sort(), [units])

  const filtered = units.filter((u) => {
    const q = search.toLowerCase()
    const matchSearch = !q || u.name.toLowerCase().includes(q) || u.cidade?.toLowerCase().includes(q)
    const matchEstado = !estado || u.estado === estado
    return matchSearch && matchEstado
  })

  const totalVisits = units.reduce((s, u) => s + (u.visits_count ?? 0), 0)

  return (
    <PanelLayout title="Unidades" subtitle={`${units.length} academias na rede My Box`} nav={ADMIN_NAV}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="fa-store" label="Total unidades" value={units.length} color="green" />
        <StatCard icon="fa-check-circle" label="Ativas" value={units.filter((u) => u.status).length} color="blue" />
        <StatCard icon="fa-eye" label="Visitas totais" value={totalVisits} color="gold" />
        <StatCard icon="fa-map" label="Estados" value={estados.length} color="dark" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar unidade ou cidade..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-mygreen shadow-sm"
          />
        </div>
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          className="px-4 py-3 bg-white border border-gray-100 rounded-xl text-sm font-semibold shadow-sm"
        >
          <option value="">Todos os estados</option>
          {estados.map((e) => (
            <option key={e} value={e!}>{STATE_NAMES[e!] ?? e}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((unit) => {
          const hero = getUnitGallery(unit)[0]
          return (
            <Link
              key={unit.slug}
              to={`/painel/admin/unidades/${unit.slug}`}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-mygreen/30 transition-all group"
            >
              <div className="h-36 relative overflow-hidden">
                <img src={hero} alt="" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-3 right-3 flex gap-1.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${unit.status ? 'bg-mygreen text-white' : 'bg-red-500 text-white'}`}>
                    {unit.status ? 'Ativa' : 'Inativa'}
                  </span>
                </div>
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="font-black text-white text-lg leading-tight">{unit.name}</h3>
                  <p className="text-white/80 text-xs mt-0.5">{unit.cidade} — {STATE_NAMES[unit.estado ?? ''] ?? unit.estado}</p>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between text-xs">
                <span className="text-gray-500"><i className="fas fa-eye text-mygreen mr-1" />{unit.visits_count ?? 0} visitas</span>
                <span className="text-mygreen font-bold group-hover:translate-x-1 transition inline-flex items-center gap-1">
                  Ver dashboard <i className="fas fa-arrow-right" />
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </PanelLayout>
  )
}

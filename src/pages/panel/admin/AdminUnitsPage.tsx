import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Store, CheckCircle, Eye, Map, Search, ArrowRight } from 'lucide-react'
import { PanelLayout } from '../../../components/panel/PanelLayout'
import { StatCard } from '../../../components/panel/StatCard'
import { Input } from '../../../components/ui/input'
import { Badge } from '../../../components/ui/badge'
import { Card } from '../../../components/ui/card'
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
        <StatCard icon={Store} label="Total unidades" value={units.length} />
        <StatCard icon={CheckCircle} label="Ativas" value={units.filter((u) => u.status).length} variant="blue" />
        <StatCard icon={Eye} label="Visitas totais" value={totalVisits} variant="gold" />
        <StatCard icon={Map} label="Estados" value={estados.length} variant="muted" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar unidade ou cidade..."
            className="pl-10"
          />
        </div>
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          className="px-4 py-2 h-10 bg-background border border-input rounded-xl text-sm font-medium"
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
            <Link key={unit.slug} to={`/painel/admin/unidades/${unit.slug}`}>
              <Card className="overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all group h-full">
                <div className="h-36 relative overflow-hidden">
                  <img src={hero} alt="" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute top-3 right-3">
                    <Badge variant={unit.status ? 'default' : 'destructive'}>{unit.status ? 'Ativa' : 'Inativa'}</Badge>
                  </div>
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="font-bold text-white text-lg leading-tight">{unit.name}</h3>
                    <p className="text-white/80 text-xs mt-0.5">{unit.cidade} — {STATE_NAMES[unit.estado ?? ''] ?? unit.estado}</p>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5 text-primary" />
                    {unit.visits_count ?? 0} visitas
                  </span>
                  <span className="text-primary font-semibold group-hover:translate-x-1 transition inline-flex items-center gap-1">
                    Ver dashboard <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Card>
            </Link>
          )
        })}
      </div>
    </PanelLayout>
  )
}

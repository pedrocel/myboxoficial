import { useEffect, useState } from 'react'
import { Eye, Sun, CalendarDays } from 'lucide-react'
import { PanelLayout } from '../../../components/panel/PanelLayout'
import { StatCard } from '../../../components/panel/StatCard'
import { Card } from '../../../components/ui/card'
import { useAuth } from '../../../contexts/AuthContext'
import { supabase } from '../../../lib/supabase'
import { OWNER_NAV } from '../../../lib/panel-nav'
import type { UnitVisit } from '../../../types/database'

export function OwnerVisitsPage() {
  const { profile } = useAuth()
  const [visits, setVisits] = useState<UnitVisit[]>([])
  const slug = profile?.unit_slug

  useEffect(() => {
    if (!supabase || !slug) return
    supabase
      .from('unit_visits')
      .select('*')
      .eq('unit_slug', slug)
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (data) setVisits(data as UnitVisit[])
      })
  }, [slug])

  const today = visits.filter((v) => {
    const d = new Date(v.created_at)
    const now = new Date()
    return d.toDateString() === now.toDateString()
  }).length

  const week = visits.filter((v) => {
    const d = new Date(v.created_at)
    const now = new Date()
    const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
    return diff <= 7
  }).length

  return (
    <PanelLayout title="Visitas" subtitle="Quem visualizou a página da sua unidade" nav={OWNER_NAV}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon={Eye} label="Total registrado" value={visits.length} />
        <StatCard icon={Sun} label="Hoje" value={today} variant="gold" />
        <StatCard icon={CalendarDays} label="Últimos 7 dias" value={week} variant="blue" />
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <th className="px-6 py-4">Data / Hora</th>
              <th className="px-6 py-4">Página</th>
              <th className="px-6 py-4">Origem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {visits.map((v) => (
              <tr key={v.id} className="hover:bg-muted/30 transition">
                <td className="px-6 py-4 font-medium text-foreground">
                  {new Date(v.created_at).toLocaleString('pt-BR')}
                </td>
                <td className="px-6 py-4 text-muted-foreground text-xs">{v.path ?? '—'}</td>
                <td className="px-6 py-4 text-muted-foreground text-xs truncate max-w-[200px]">
                  {v.referrer || 'Direto'}
                </td>
              </tr>
            ))}
            {!visits.length && (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-muted-foreground">
                  Nenhuma visita registrada ainda
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </PanelLayout>
  )
}

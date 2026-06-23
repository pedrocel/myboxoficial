import { useEffect, useState } from 'react'
import { PanelLayout } from '../../../components/panel/PanelLayout'
import { StatCard } from '../../../components/panel/StatCard'
import { useAuth } from '../../../contexts/AuthContext'
import { supabase } from '../../../lib/supabase'
import type { UnitVisit } from '../../../types/database'

import { OWNER_NAV } from '../../../lib/panel-nav'
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
        <StatCard icon="fa-eye" label="Total registrado" value={visits.length} color="green" />
        <StatCard icon="fa-sun" label="Hoje" value={today} color="gold" />
        <StatCard icon="fa-calendar-week" label="Últimos 7 dias" value={week} color="blue" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
              <th className="px-6 py-4">Data / Hora</th>
              <th className="px-6 py-4">Página</th>
              <th className="px-6 py-4">Origem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {visits.map((v) => (
              <tr key={v.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 font-medium text-mydark">
                  {new Date(v.created_at).toLocaleString('pt-BR')}
                </td>
                <td className="px-6 py-4 text-gray-500 text-xs">{v.path ?? '—'}</td>
                <td className="px-6 py-4 text-gray-400 text-xs truncate max-w-[200px]">
                  {v.referrer || 'Direto'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PanelLayout>
  )
}

import { useEffect, useState } from 'react'
import { PanelLayout } from '../../../components/panel/PanelLayout'
import { UnitCustomizeEditor, buildUnitUpdatePayload } from '../../../components/panel/UnitCustomizeEditor'
import { useAuth } from '../../../contexts/AuthContext'
import { OWNER_NAV } from '../../../lib/panel-nav'
import { supabase } from '../../../lib/supabase'
import type { DbUnit } from '../../../types/database'

export function OwnerPersonalizePage() {
  const { profile } = useAuth()
  const [unit, setUnit] = useState<DbUnit | null>(null)
  const slug = profile?.unit_slug

  useEffect(() => {
    if (!supabase || !slug) return
    supabase.from('units').select('*').eq('slug', slug).single().then(({ data }) => {
      if (data) setUnit(data as DbUnit)
    })
  }, [slug])

  const saveUnit = async (updated: DbUnit) => {
    if (!supabase || !slug) return { error: 'Sem conexão' }
    const { error } = await supabase.from('units').update(buildUnitUpdatePayload(updated)).eq('slug', slug)
    if (!error) setUnit(updated)
    return { error: error?.message }
  }

  if (!unit) {
    return (
      <PanelLayout title="Personalizar" subtitle="Carregando..." nav={OWNER_NAV}>
        <div className="flex justify-center py-20"><i className="fas fa-spinner fa-spin text-mygreen text-3xl" /></div>
      </PanelLayout>
    )
  }

  return (
    <PanelLayout
      title="Personalizar unidade"
      subtitle="Galeria, horários, modalidades, mapa e dados da página pública"
      nav={OWNER_NAV}
    >
      <UnitCustomizeEditor unit={unit} onSave={saveUnit} />
    </PanelLayout>
  )
}

import { useEffect, useState } from 'react'
import { PanelLayout } from '../../../components/panel/PanelLayout'
import { UnitCustomizeEditor, buildUnitUpdatePayload } from '../../../components/panel/UnitCustomizeEditor'
import { useAuth } from '../../../contexts/AuthContext'
import { OWNER_NAV } from '../../../lib/panel-nav'
import { geocodeUnit } from '../../../lib/geocode'
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

    let toSave = { ...updated }
    const coords = await geocodeUnit(toSave)
    if (coords) {
      toSave = { ...toSave, lat: coords.lat, lng: coords.lng }
    }

    const { error } = await supabase.from('units').update(buildUnitUpdatePayload(toSave)).eq('slug', slug)
    if (!error) setUnit(toSave)
    return { error: error?.message }
  }

  if (!unit) {
    return (
      <PanelLayout title="Personalizar" subtitle="Carregando..." nav={OWNER_NAV}>
        <div className="flex justify-center py-20 text-primary">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </PanelLayout>
    )
  }

  return (
    <PanelLayout
      title="Personalizar unidade"
      subtitle="Endereço, galeria, horários e modalidades da página pública"
      nav={OWNER_NAV}
    >
      <UnitCustomizeEditor unit={unit} onSave={saveUnit} />
    </PanelLayout>
  )
}

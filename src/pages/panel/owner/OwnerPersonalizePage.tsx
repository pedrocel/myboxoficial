import { useEffect, useState } from 'react'
import { PanelLayout } from '../../../components/panel/PanelLayout'
import { UnitCustomizeEditor, buildUnitUpdatePayload } from '../../../components/panel/UnitCustomizeEditor'
import { useAuth } from '../../../contexts/AuthContext'
import { OWNER_NAV } from '../../../lib/panel-nav'
import { geocodeUnit } from '../../../lib/geocode'
import { api, attempt } from '../../../lib/api'
import type { DbUnit } from '../../../types/database'

export function OwnerPersonalizePage() {
  const { profile } = useAuth()
  const [unit, setUnit] = useState<DbUnit | null>(null)
  const slug = profile?.unit_slug

  useEffect(() => {
    if (!slug) return
    api.get<DbUnit>(`/units/${slug}`).then(setUnit).catch(() => {})
  }, [slug])

  const saveUnit = async (updated: DbUnit) => {
    if (!slug) return { error: 'Sem unidade vinculada' }

    let toSave = { ...updated }
    const coords = await geocodeUnit(toSave)
    if (coords) {
      toSave = { ...toSave, lat: coords.lat, lng: coords.lng }
    }

    const { error } = await attempt(api.patch(`/units/${slug}`, buildUnitUpdatePayload(toSave)))
    if (!error) setUnit(toSave)
    return { error: error ?? undefined }
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

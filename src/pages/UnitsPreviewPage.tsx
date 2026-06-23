import { useMemo, useState, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { UnitsListHeader } from '../components/units/UnitsListHeader'
import { UnitsListFooter } from '../components/units/UnitsListFooter'
import { UnitsMap } from '../components/units-preview/UnitsMap'
import { UnitsPreviewList } from '../components/units-preview/UnitsPreviewList'
import { LocationSearchBar } from '../components/units-preview/LocationSearchBar'
import { NearbyUnitBanner } from '../components/units-preview/NearbyUnitBanner'
import {
  getAllUnits,
  searchUnits,
  getUnitBySlug,
  getUnitCoords,
  getStatesFromUnits,
  sortUnitsByDistance,
} from '../lib/units'
import { STATE_NAMES } from '../lib/brazil-states'
import { useGeolocation } from '../hooks/useGeolocation'

export function UnitsPreviewPage() {
  const allUnits = useMemo(() => getAllUnits(), [])
  const states = useMemo(() => getStatesFromUnits(allUnits), [allUnits])
  const { coords, loading: locating, error: geoError, requestLocation, clearLocation } = useGeolocation()

  const [query, setQuery] = useState('')
  const [activeState, setActiveState] = useState<string | null>(null)
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const [showNearbyBanner, setShowNearbyBanner] = useState(true)

  const baseFiltered = useMemo(() => {
    let list = query ? searchUnits(query) : allUnits
    if (activeState) list = list.filter((u) => u.estado === activeState)
    return list
  }, [allUnits, query, activeState])

  const sortedWithDistance = useMemo(() => {
    if (!coords) return baseFiltered.map((u) => ({ unit: u, distanceKm: undefined as number | undefined }))
    const sorted = sortUnitsByDistance(baseFiltered, coords[0], coords[1])
    return sorted.map((u) => ({ unit: u, distanceKm: u.distanceKm }))
  }, [baseFiltered, coords])

  const filteredUnits = sortedWithDistance.map((x) => x.unit)
  const distances = useMemo(() => {
    const map: Record<string, number> = {}
    sortedWithDistance.forEach(({ unit, distanceKm }) => {
      if (distanceKm != null) map[unit.url_page] = distanceKm
    })
    return map
  }, [sortedWithDistance])

  const nearestSlug = coords && filteredUnits.length > 0 ? filteredUnits[0].url_page : null
  const nearestUnit = nearestSlug ? sortedWithDistance[0] : null

  useEffect(() => {
    if (coords && nearestSlug && !selectedSlug) {
      setSelectedSlug(nearestSlug)
    }
  }, [coords, nearestSlug, selectedSlug])

  const flyToCoords = useMemo(() => {
    if (selectedSlug) {
      const unit = getUnitBySlug(selectedSlug)
      if (unit) {
        const idx = filteredUnits.findIndex((u) => u.url_page === selectedSlug)
        return getUnitCoords(unit, idx >= 0 ? idx : 0)
      }
    }
    return coords
  }, [selectedSlug, filteredUnits, coords])

  const handleSelect = useCallback((slug: string) => {
    setSelectedSlug(slug)
  }, [])

  const handleLocate = useCallback(() => {
    setQuery('')
    setActiveState(null)
    requestLocation()
  }, [requestLocation])

  const handleClearLocation = useCallback(() => {
    clearLocation()
    setSelectedSlug(null)
    setShowNearbyBanner(true)
  }, [clearLocation])

  const statsByState = useMemo(() => {
    const counts: Record<string, number> = {}
    allUnits.forEach((u) => {
      counts[u.estado] = (counts[u.estado] ?? 0) + 1
    })
    return counts
  }, [allUnits])

  return (
    <div className="bg-gray-50 font-sans min-h-screen flex flex-col">
      <UnitsListHeader />

      <div className="bg-gradient-to-r from-mydark to-gray-800 text-white">
        <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="bg-mygold text-mydark text-xs font-bold px-2 py-0.5 rounded">PREVIEW</span>
            <span>Nova experiência de busca — versão para avaliação do cliente</span>
          </div>
          <Link to="/unidades" className="text-sm text-gray-300 hover:text-white underline shrink-0">
            Ver versão atual →
          </Link>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6 flex-1 flex flex-col gap-6">
        <section>
          <h1 className="text-3xl md:text-4xl font-bold text-mydark mb-2">
            Encontre sua <span className="text-mygreen">My Box</span>
          </h1>
          <p className="text-gray-600 mb-6 max-w-2xl">
            Use sua localização para descobrir a unidade mais próxima ou explore o mapa interativo com todas as
            academias pelo Brasil.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <p className="text-3xl font-bold text-mygreen">{allUnits.length}</p>
              <p className="text-sm text-gray-500">Unidades</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <p className="text-3xl font-bold text-mygreen">{states.length}</p>
              <p className="text-sm text-gray-500">Estados</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <p className="text-3xl font-bold text-mygreen">+50k</p>
              <p className="text-sm text-gray-500">Alunos</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <p className="text-3xl font-bold text-mygreen">GPS</p>
              <p className="text-sm text-gray-500">Busca por proximidade</p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <LocationSearchBar
            query={query}
            onQueryChange={setQuery}
            onLocate={handleLocate}
            locating={locating}
            hasLocation={!!coords}
            onClearLocation={handleClearLocation}
            geoError={geoError}
          />

          {coords && nearestUnit && showNearbyBanner && nearestUnit.distanceKm != null && (
            <NearbyUnitBanner
              unit={{ ...nearestUnit.unit, distanceKm: nearestUnit.distanceKm }}
              onDismiss={() => setShowNearbyBanner(false)}
            />
          )}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveState(null)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                activeState === null ? 'bg-mygreen text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-mygreen'
              }`}
            >
              Todos ({allUnits.length})
            </button>
            {states.map((uf) => (
              <button
                key={uf}
                type="button"
                onClick={() => setActiveState(activeState === uf ? null : uf)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  activeState === uf ? 'bg-mygreen text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-mygreen'
                }`}
              >
                {uf} ({statsByState[uf]})
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500">
            {filteredUnits.length} unidade{filteredUnits.length !== 1 ? 's' : ''} encontrada
            {activeState ? ` em ${STATE_NAMES[activeState] ?? activeState}` : ''}
            {coords ? ' · ordenadas por distância' : ''}
          </p>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-5 gap-6 flex-1 min-h-0">
          <div className="lg:col-span-3 h-[45vh] lg:h-[calc(100vh-22rem)] lg:min-h-[480px] sticky lg:top-20">
            <UnitsMap
              units={filteredUnits}
              selectedSlug={selectedSlug}
              nearestSlug={nearestSlug}
              flyToCoords={flyToCoords}
              userLocation={coords}
              distances={distances}
              onSelectUnit={handleSelect}
            />
          </div>
          <div className="lg:col-span-2 flex flex-col min-h-[300px] lg:max-h-[calc(100vh-22rem)]">
            <h2 className="text-lg font-bold text-mydark mb-3 shrink-0">
              {coords ? 'Unidades por proximidade' : 'Lista de unidades'}
            </h2>
            <div className="overflow-y-auto flex-1 pr-1 custom-scrollbar">
              <UnitsPreviewList
                units={filteredUnits}
                selectedSlug={selectedSlug}
                nearestSlug={nearestSlug}
                distances={distances}
                onSelect={handleSelect}
              />
            </div>
          </div>
        </section>
      </main>

      <UnitsListFooter />
    </div>
  )
}

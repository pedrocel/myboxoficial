import { useMemo, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { UnitsListHeader } from '../components/units/UnitsListHeader'
import { UnitsListFooter } from '../components/units/UnitsListFooter'
import { UnitsMap } from '../components/units-preview/UnitsMap'
import { UnitsPreviewList } from '../components/units-preview/UnitsPreviewList'
import { getAllUnits, searchUnits, getUnitBySlug, getUnitCoords, getStatesFromUnits } from '../lib/units'
import { STATE_NAMES } from '../lib/brazil-states'

export function UnitsPreviewPage() {
  const allUnits = useMemo(() => getAllUnits(), [])
  const states = useMemo(() => getStatesFromUnits(allUnits), [allUnits])

  const [query, setQuery] = useState('')
  const [activeState, setActiveState] = useState<string | null>(null)
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)

  const filteredUnits = useMemo(() => {
    let list = query ? searchUnits(query) : allUnits
    if (activeState) {
      list = list.filter((u) => u.estado === activeState)
    }
    return list
  }, [allUnits, query, activeState])

  const flyToCoords = useMemo(() => {
    if (!selectedSlug) return null
    const unit = getUnitBySlug(selectedSlug)
    if (!unit) return null
    const idx = filteredUnits.findIndex((u) => u.url_page === selectedSlug)
    return getUnitCoords(unit, idx >= 0 ? idx : 0)
  }, [selectedSlug, filteredUnits])

  const handleSelect = useCallback((slug: string) => {
    setSelectedSlug(slug)
  }, [])

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

      {/* Banner preview */}
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
        {/* Hero stats */}
        <section>
          <h1 className="text-3xl md:text-4xl font-bold text-mydark mb-2">
            Encontre sua <span className="text-mygreen">My Box</span>
          </h1>
          <p className="text-gray-600 mb-6 max-w-2xl">
            Explore nosso mapa interativo com todas as unidades pelo Brasil. Clique em um pin ou na lista para
            localizar a academia mais perto de você.
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
              <p className="text-3xl font-bold text-mygreen">BR</p>
              <p className="text-sm text-gray-500">Todo o país</p>
            </div>
          </div>
        </section>

        {/* Search + state filters */}
        <section className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por cidade, bairro ou nome da unidade..."
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-mygreen bg-white shadow-sm"
            />
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
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
          </p>
        </section>

        {/* Map + list split */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-6 flex-1 min-h-0">
          <div className="lg:col-span-3 h-[45vh] lg:h-[calc(100vh-22rem)] lg:min-h-[480px] sticky lg:top-20">
            <UnitsMap
              units={filteredUnits}
              selectedSlug={selectedSlug}
              flyToCoords={flyToCoords}
              onSelectUnit={handleSelect}
            />
          </div>
          <div className="lg:col-span-2 flex flex-col min-h-[300px] lg:max-h-[calc(100vh-22rem)]">
            <h2 className="text-lg font-bold text-mydark mb-3 shrink-0">Lista de unidades</h2>
            <div className="overflow-y-auto flex-1 pr-1 custom-scrollbar">
              <UnitsPreviewList
                units={filteredUnits}
                selectedSlug={selectedSlug}
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

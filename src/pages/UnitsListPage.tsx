import { useState, useMemo } from 'react'
import { UnitsListHeader } from '../components/units/UnitsListHeader'
import { UnitsListFooter } from '../components/units/UnitsListFooter'
import { UnitsSearchBar } from '../components/units/UnitsSearchBar'
import { UnitCard } from '../components/units/UnitCard'
import { AgendamentosModal } from '../components/units/AgendamentosModal'
import { getAllUnits, searchUnits } from '../lib/units'
import { useAOS } from '../hooks/useAOS'

const ITEMS_PER_PAGE = 6

export function UnitsListPage() {
  useAOS()

  const allUnits = useMemo(() => getAllUnits(), [])
  const [filteredUnits, setFilteredUnits] = useState(allUnits)
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)
  const [agendamentosOpen, setAgendamentosOpen] = useState(false)

  const visibleUnits = filteredUnits.slice(0, visibleCount)
  const hasMore = visibleCount < filteredUnits.length

  const handleSearch = (query: string) => {
    const results = query ? searchUnits(query) : allUnits
    setFilteredUnits(results)
    setVisibleCount(ITEMS_PER_PAGE)
  }

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE)
  }

  const handleReset = () => {
    setFilteredUnits(allUnits)
    setVisibleCount(ITEMS_PER_PAGE)
  }

  return (
    <div className="bg-white font-sans min-h-screen flex flex-col">
      <UnitsListHeader />
      <main className="container mx-auto px-4 py-8 flex-1">
        <UnitsSearchBar
          onSearch={handleSearch}
          onOpenAgendamentos={() => setAgendamentosOpen(true)}
          unitsCount={filteredUnits.length}
        />

        <section>
          <h2 className="text-xl font-bold text-mydark mb-6">Unidades My Box</h2>

          {visibleUnits.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <i className="fas fa-search text-gray-300 text-5xl mb-4" />
              <p className="text-gray-500 text-center">Nenhuma unidade encontrada com os critérios selecionados.</p>
              <button
                type="button"
                onClick={handleReset}
                className="mt-4 text-mygreen hover:text-green-700 font-medium flex items-center"
              >
                <i className="fas fa-redo-alt mr-2" /> Limpar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleUnits.map((unit) => (
                <UnitCard key={unit.url_page} unit={unit} />
              ))}
            </div>
          )}

          {hasMore && visibleUnits.length > 0 && (
            <div className="text-center mt-10">
              <button
                type="button"
                onClick={handleLoadMore}
                className="border border-gray-300 text-mydark hover:bg-gray-100 font-medium py-2 px-8 rounded-md transition"
              >
                Ver mais
              </button>
            </div>
          )}
        </section>
      </main>

      <UnitsListFooter />

      <a
        href="https://wa.me/5519999622428"
        className="fixed bottom-6 right-6 bg-green-500 text-white rounded-full p-3 shadow-lg z-40 hover:bg-green-600 transition"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
      >
        <i className="fab fa-whatsapp text-2xl" />
      </a>

      <AgendamentosModal open={agendamentosOpen} onClose={() => setAgendamentosOpen(false)} />
    </div>
  )
}

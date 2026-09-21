import { useState } from 'react'
import { UnitsListHeader } from '../components/units/UnitsListHeader'
import { UnitsListFooter } from '../components/units/UnitsListFooter'
import { UnitsSearchBar } from '../components/units/UnitsSearchBar'
import { UnitCard } from '../components/units/UnitCard'
import { AgendamentosModal } from '../components/units/AgendamentosModal'
import { searchUnits } from '../lib/units'
import { useUnits } from '../hooks/useUnits'
import { useAOS } from '../hooks/useAOS'

const ITEMS_PER_PAGE = 6

export function UnitsListPage() {
  useAOS()

  const { units: allUnits, carregando } = useUnits()
  const [busca, setBusca] = useState('')
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)
  const [agendamentosOpen, setAgendamentosOpen] = useState(false)

  // A lista chega do banco depois do primeiro render, entao o filtro e derivado.
  const filteredUnits = busca ? searchUnits(allUnits, busca) : allUnits
  const visibleUnits = filteredUnits.slice(0, visibleCount)
  const hasMore = visibleCount < filteredUnits.length

  const handleSearch = (query: string) => {
    setBusca(query)
    setVisibleCount(ITEMS_PER_PAGE)
  }

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE)
  }

  const handleReset = () => {
    setBusca('')
    setVisibleCount(ITEMS_PER_PAGE)
  }

  return (
    <div className="bg-background font-sans min-h-screen flex flex-col text-foreground">
      <UnitsListHeader />
      <main className="container mx-auto px-4 py-8 flex-1">
        <UnitsSearchBar
          onSearch={handleSearch}
          onOpenAgendamentos={() => setAgendamentosOpen(true)}
          unitsCount={filteredUnits.length}
        />

        <section>
          <h2 className="text-xl font-bold text-foreground mb-6">Unidades My Box</h2>

          {carregando ? (
            <div className="flex justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : visibleUnits.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <i className="fas fa-search text-muted-foreground/50 text-5xl mb-4" />
              <p className="text-muted-foreground text-center">Nenhuma unidade encontrada com os critérios selecionados.</p>
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
                className="border border-border text-foreground hover:bg-muted font-medium py-2 px-8 rounded-md transition"
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

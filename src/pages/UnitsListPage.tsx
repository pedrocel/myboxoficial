import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { SiteLayout } from '../components/site/SiteLayout'
import { stagger } from '../components/site/stagger'
import { UnitCard } from '../components/units/UnitCard'
import { getUnitCities, groupUnitsByState, pluralUnits, searchUnits } from '../lib/units'
import { useUnits } from '../hooks/useUnits'

export function UnitsListPage() {
  const { units: allUnits, carregando } = useUnits()
  const [params, setParams] = useSearchParams()
  const busca = params.get('q') ?? ''
  const uf = params.get('uf') ?? ''

  // Busca e estado ficam na URL, entao links como /unidades?uf=SP ja chegam filtrados.
  const update = (next: { q?: string; uf?: string }) => {
    const q = next.q ?? busca
    const estado = next.uf ?? uf
    setParams({ ...(q ? { q } : {}), ...(estado ? { uf: estado } : {}) }, { replace: true, preventScrollReset: true })
  }

  const allStates = groupUnitsByState(allUnits).sort((a, b) => a.uf.localeCompare(b.uf))
  const filtered = searchUnits(allUnits, busca).filter((u) => !uf || u.estado === uf)
  const groups = groupUnitsByState(filtered)
  const cities = getUnitCities(allUnits).length

  return (
    <SiteLayout solidHeader>
      <section className="border-b pt-16 pb-12 lg:pt-24">
        <div className="shell">
          <h1 className="display display-lg max-w-[14ch]" data-reveal>
            E aí, onde você quer treinar?
          </h1>
          <p className="lede mt-6" data-reveal style={stagger(1)}>
            {carregando
              ? 'Busque pela sua cidade e fale direto com a equipe.'
              : `${allUnits.length} unidades em ${cities} cidades de ${allStates.length} estados. Busque pela sua cidade e fale direto com a equipe.`}
          </p>
          <form
            role="search"
            className="mt-10 max-w-2xl"
            data-reveal
            style={stagger(2)}
            onSubmit={(e) => e.preventDefault()}
          >
            <label htmlFor="unit-search" className="text-sm font-medium text-muted-foreground">
              Cidade, bairro, endereço ou nome da unidade
            </label>
            <div className="relative mt-3">
              <Search
                size={20}
                className="pointer-events-none absolute top-1/2 left-5 -translate-y-1/2 text-subtle"
                aria-hidden
              />
              <input
                id="unit-search"
                type="search"
                className="input pl-13"
                placeholder="Ex.: Porto Alegre"
                autoComplete="off"
                value={busca}
                onChange={(e) => update({ q: e.target.value })}
              />
            </div>
          </form>
          <div
            className="mt-6 flex flex-wrap gap-2"
            role="group"
            aria-label="Filtrar por estado"
            data-reveal
            style={stagger(3)}
          >
            <button type="button" className="chip" aria-pressed={!uf} onClick={() => update({ uf: '' })}>
              Todos
            </button>
            {allStates.map((state) => (
              <button
                key={state.uf}
                type="button"
                className="chip"
                aria-pressed={uf === state.uf}
                title={state.name}
                onClick={() => update({ uf: state.uf })}
              >
                {state.uf}
                <span className="text-xs tabular-nums opacity-70">{state.units.length}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="shell">
          {carregando ? (
            <div className="flex justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-xl border-2 border-primary border-t-transparent" />
            </div>
          ) : (
            <>
              <p className="text-sm text-subtle" aria-live="polite">
                {filtered.length === 1 ? '1 unidade encontrada' : `${filtered.length} unidades encontradas`}
              </p>
              {groups.length === 0 && (
                <div className="mt-8 rounded-media border bg-card p-8">
                  <p className="display display-sm">Nenhuma unidade encontrada.</p>
                  <p className="mt-3 text-muted-foreground">Tente outra cidade ou bairro, ou veja todas as unidades.</p>
                  <button type="button" className="btn btn-ghost mt-6" onClick={() => setParams({}, { replace: true })}>
                    Limpar busca
                  </button>
                </div>
              )}
              {groups.map((group) => (
                <div key={group.uf} className="mt-12 first-of-type:mt-8">
                  <h2 className="flex items-baseline gap-3 border-b pb-4">
                    <span className="display display-sm">{group.name}</span>
                    <span className="text-sm text-subtle tabular-nums" aria-label={pluralUnits(group.units.length)}>
                      {group.units.length}
                    </span>
                  </h2>
                  <ul className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {group.units.map((unit) => (
                      <li key={unit.url_page}>
                        <UnitCard unit={unit} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </>
          )}
        </div>
      </section>
    </SiteLayout>
  )
}

import { useState } from 'react'

type Props = {
  onSearch: (query: string) => void
  onOpenAgendamentos: () => void
  unitsCount: number
}

export function UnitsSearchBar({ onSearch, onOpenAgendamentos, unitsCount }: Props) {
  const [query, setQuery] = useState('')

  const handleSearch = () => onSearch(query)

  return (
    <section className="mb-8">
      <h1 className="text-2xl font-bold text-mydark mb-4">E aí, onde você quer treinar?</h1>
      <div className="relative search-input-wrapper">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Digite sua cidade, bairro ou endereço para localizar"
          className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mygreen"
        />
        <button
          type="button"
          onClick={handleSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-mygreen"
          aria-label="Buscar"
        >
          <i className="fas fa-search" />
        </button>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <p className="text-sm text-gray-500">{unitsCount} unidades encontradas</p>
        <button
          type="button"
          onClick={onOpenAgendamentos}
          className="bg-mygreen hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition duration-300 flex items-center justify-center sm:ml-auto"
        >
          <i className="fas fa-calendar-check mr-2" /> Consultar Agendamentos
        </button>
      </div>
    </section>
  )
}

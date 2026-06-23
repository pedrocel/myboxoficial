type Props = {
  query: string
  onQueryChange: (q: string) => void
  onLocate: () => void
  locating: boolean
  hasLocation: boolean
  onClearLocation: () => void
  geoError: string | null
}

export function LocationSearchBar({
  query,
  onQueryChange,
  onLocate,
  locating,
  hasLocation,
  onClearLocation,
  geoError,
}: Props) {
  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Buscar por cidade, bairro ou nome da unidade..."
            className="w-full px-4 py-3 pl-10 pr-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-mygreen bg-white shadow-sm"
          />
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        <button
          type="button"
          onClick={hasLocation ? onClearLocation : onLocate}
          disabled={locating}
          className={`shrink-0 flex items-center justify-center gap-2 font-semibold py-3 px-5 rounded-xl transition shadow-sm ${
            hasLocation
              ? 'bg-mydark text-white hover:bg-gray-800'
              : 'bg-mygreen text-white hover:bg-green-600'
          } disabled:opacity-60`}
        >
          {locating ? (
            <>
              <i className="fas fa-spinner fa-spin" />
              Localizando...
            </>
          ) : hasLocation ? (
            <>
              <i className="fas fa-times" />
              Limpar localização
            </>
          ) : (
            <>
              <i className="fas fa-location-crosshairs" />
              Usar minha localização
            </>
          )}
        </button>
      </div>
      {geoError && (
        <p className="text-sm text-red-600 flex items-center gap-2">
          <i className="fas fa-exclamation-circle" />
          {geoError}
        </p>
      )}
      {hasLocation && !geoError && (
        <p className="text-sm text-mygreen flex items-center gap-2">
          <i className="fas fa-check-circle" />
          Localização ativa — unidades ordenadas da mais próxima à mais distante
        </p>
      )}
    </div>
  )
}

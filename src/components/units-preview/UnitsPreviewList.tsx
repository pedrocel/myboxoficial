import { Link } from 'react-router-dom'
import type { Unit } from '../../types/unit'
import { getUnitImage } from '../../lib/units'
import { STATE_NAMES } from '../../lib/brazil-states'

type Props = {
  units: Unit[]
  selectedSlug: string | null
  onSelect: (slug: string) => void
  onHover?: (slug: string | null) => void
}

export function UnitsPreviewList({ units, selectedSlug, onSelect, onHover }: Props) {
  if (units.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <i className="fas fa-search text-gray-300 text-4xl mb-3" />
        <p className="text-gray-500">Nenhuma unidade encontrada.</p>
      </div>
    )
  }

  return (
    <ul className="space-y-3">
      {units.map((unit) => {
        const isSelected = unit.url_page === selectedSlug
        return (
          <li key={unit.url_page}>
            <button
              type="button"
              onClick={() => onSelect(unit.url_page)}
              onMouseEnter={() => onHover?.(unit.url_page)}
              onMouseLeave={() => onHover?.(null)}
              className={`w-full text-left rounded-lg border overflow-hidden transition-all ${
                isSelected
                  ? 'border-mygreen shadow-md ring-2 ring-mygreen/30'
                  : 'border-gray-200 hover:border-mygreen/50 hover:shadow-sm'
              }`}
            >
              <div className="flex gap-3 p-3">
                <img
                  src={getUnitImage(unit)}
                  alt=""
                  className="w-16 h-16 rounded-md object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-mydark truncate">{unit.name}</p>
                  <p className="text-sm text-gray-500 truncate">
                    {unit.cidade} — {STATE_NAMES[unit.estado] ?? unit.estado}
                  </p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{unit.como_chegar}</p>
                </div>
                <Link
                  to={`/unidades/${unit.url_page}`}
                  onClick={(e) => e.stopPropagation()}
                  className="shrink-0 self-center text-mygreen hover:text-green-700 text-sm font-medium px-2"
                  title="Abrir página da unidade"
                >
                  <i className="fas fa-external-link-alt" />
                </Link>
              </div>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

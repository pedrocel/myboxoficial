import { Link } from 'react-router-dom'
import type { Unit } from '../../types/unit'
import { getUnitImage } from '../../lib/units'
import { formatDistance } from '../../lib/geo'
import { STATE_NAMES } from '../../lib/brazil-states'

type Props = {
  units: Unit[]
  selectedSlug: string | null
  nearestSlug?: string | null
  distances?: Record<string, number>
  onSelect: (slug: string) => void
  detailBasePath?: string
}

export function UnitsPreviewList({
  units,
  selectedSlug,
  nearestSlug,
  distances = {},
  onSelect,
  detailBasePath = '/unidades-preview',
}: Props) {
  if (units.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <i className="fas fa-search text-muted-foreground/40 text-4xl mb-3" />
        <p className="text-muted-foreground">Nenhuma unidade encontrada.</p>
      </div>
    )
  }

  return (
    <ul className="space-y-3">
      {units.map((unit) => {
        const isSelected = unit.url_page === selectedSlug
        const isNearest = unit.url_page === nearestSlug
        const dist = distances[unit.url_page]

        return (
          <li key={unit.url_page}>
            <button
              type="button"
              onClick={() => onSelect(unit.url_page)}
              className={`w-full text-left rounded-xl border overflow-hidden transition-all bg-card ${
                isSelected
                  ? 'border-primary shadow-md ring-2 ring-primary/30'
                  : 'border-border hover:border-primary/50 hover:shadow-sm'
              }`}
            >
              <div className="flex gap-3 p-3">
                <div className="relative shrink-0">
                  <img src={getUnitImage(unit)} alt="" className="w-16 h-16 rounded-lg object-cover" />
                  {isNearest && (
                    <span className="absolute -top-1 -right-1 bg-mygold text-mydark text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow">
                      #
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-foreground truncate">{unit.name}</p>
                    {dist != null && (
                      <span className="shrink-0 text-xs font-semibold text-primary bg-primary/15 px-2 py-0.5 rounded-full">
                        {formatDistance(dist)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {unit.cidade} — {STATE_NAMES[unit.estado] ?? unit.estado}
                  </p>
                  {isNearest && (
                    <p className="text-xs text-mygold font-medium mt-0.5">
                      <i className="fas fa-star mr-1" />
                      Mais próxima de você
                    </p>
                  )}
                </div>
                <Link
                  to={`${detailBasePath}/${unit.url_page}`}
                  onClick={(e) => e.stopPropagation()}
                  className="shrink-0 self-center bg-primary/15 text-primary hover:bg-primary hover:text-primary-foreground w-9 h-9 rounded-full flex items-center justify-center transition"
                  title="Ver detalhes"
                >
                  <i className="fas fa-arrow-right text-sm" />
                </Link>
              </div>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

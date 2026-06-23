import { Link } from 'react-router-dom'
import type { UnitWithDistance } from '../../lib/units'
import { formatDistance } from '../../lib/geo'
import { getUnitImage, getWhatsAppUrl } from '../../lib/units'

type Props = {
  unit: UnitWithDistance
  onDismiss?: () => void
}

export function NearbyUnitBanner({ unit, onDismiss }: Props) {
  const whatsapp = getWhatsAppUrl(unit)

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-mygreen to-green-700 text-white shadow-lg">
      <div className="absolute inset-0 opacity-20">
        <img src={getUnitImage(unit)} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="relative p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
            <i className="fas fa-location-arrow text-2xl" />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-green-100 font-medium">Unidade mais próxima de você</p>
            <p className="text-xl font-bold truncate">{unit.name}</p>
            <p className="text-green-100 text-sm">
              {unit.cidade} - {unit.estado} · <strong>{formatDistance(unit.distanceKm)}</strong>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <Link
            to={`/unidades-preview/${unit.url_page}`}
            className="bg-white text-mygreen font-bold py-2.5 px-5 rounded-full hover:bg-green-50 transition text-sm"
          >
            Ver unidade
          </Link>
          {whatsapp && (
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/20 hover:bg-white/30 font-medium py-2.5 px-5 rounded-full transition text-sm border border-white/30"
            >
              <i className="fab fa-whatsapp mr-1" /> WhatsApp
            </a>
          )}
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="absolute top-3 right-3 text-white/70 hover:text-white"
            aria-label="Fechar"
          >
            <i className="fas fa-times" />
          </button>
        )}
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'
import type { Unit } from '../../types/unit'
import { getUnitImage } from '../../lib/units'

export function UnitCard({ unit }: { unit: Unit }) {
  const address = [unit.logradouro, unit.numero, unit.cidade, unit.estado].filter(Boolean).join(', ')

  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden card-hover-effect">
      <div className="relative h-40">
        <img src={getUnitImage(unit)} className="w-full h-full object-cover" alt={unit.name} />
        {unit.is_public && (
          <div className="absolute top-2 left-2 bg-mygreen text-white px-2 py-1 rounded-md text-xs font-bold">
            PREMIUM
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-mydark mb-1">{unit.name}</h3>
        <p className="text-gray-600 text-sm mb-3">{address}</p>
        <Link
          to={`/unidades/${unit.url_page}`}
          className="block w-full bg-mygreen hover:bg-green-600 text-white text-center font-medium py-2 px-4 rounded-md transition mt-3 text-sm"
        >
          Ver Unidade
        </Link>
      </div>
    </div>
  )
}

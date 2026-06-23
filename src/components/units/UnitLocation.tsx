import type { Unit } from '../../types/unit'
import { getFullAddress, getMapEmbedUrl } from '../../lib/units'

export function UnitLocation({ unit }: { unit: Unit }) {
  return (
    <div id="contato" className="bg-white rounded-xl shadow-xl overflow-hidden mb-8" data-aos="fade-left">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-mydark">Localização</h2>
      </div>
      <iframe
        src={getMapEmbedUrl(unit)}
        width="100%"
        height="300"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        title={`Mapa - ${unit.name}`}
      />
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
            <i className="fas fa-map-marker-alt text-mygreen" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Endereço</p>
            <p className="font-bold text-mydark">{getFullAddress(unit)}</p>
          </div>
        </div>
        {unit.como_chegar && (
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
              <i className="fas fa-subway text-mygreen" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Como Chegar</p>
              <p className="font-bold text-mydark">{unit.como_chegar}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

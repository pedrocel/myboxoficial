import { useEffect } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet.markercluster'
import type { Unit } from '../../types/unit'
import { getUnitCoords } from '../../lib/units'

type UnitWithCoords = Unit & { coords: [number, number] }

function FlyToUnit({ coords, zoom }: { coords: [number, number] | null; zoom?: number }) {
  const map = useMap()
  useEffect(() => {
    if (coords) {
      map.flyTo(coords, zoom ?? 14, { duration: 0.8 })
    }
  }, [map, coords, zoom])
  return null
}

function MarkerClusterLayer({
  units,
  selectedSlug,
  onSelect,
}: {
  units: UnitWithCoords[]
  selectedSlug: string | null
  onSelect: (slug: string) => void
}) {
  const map = useMap()

  useEffect(() => {
    const group = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
    })

    units.forEach((unit) => {
      const isSelected = unit.url_page === selectedSlug
      const icon = L.divIcon({
        className: '',
        html: `<div class="mybox-marker" style="width:${isSelected ? 18 : 14}px;height:${isSelected ? 18 : 14}px;${isSelected ? 'background:#ffc107;border-color:#fff;' : ''}"></div>`,
        iconSize: [isSelected ? 18 : 14, isSelected ? 18 : 14],
        iconAnchor: [7, 7],
      })

      const marker = L.marker(unit.coords, { icon })
      marker.bindPopup(
        `<div style="min-width:180px">
          <strong>${unit.name}</strong><br/>
          <span style="color:#666;font-size:13px">${unit.cidade} - ${unit.estado}</span><br/>
          <a href="/unidades/${unit.url_page}" style="color:#6aa921;font-weight:600;font-size:13px;margin-top:6px;display:inline-block">Ver unidade →</a>
        </div>`,
      )
      marker.on('click', () => onSelect(unit.url_page))
      group.addLayer(marker)
    })

    map.addLayer(group)
    return () => {
      map.removeLayer(group)
    }
  }, [map, units, selectedSlug, onSelect])

  return null
}

type Props = {
  units: Unit[]
  selectedSlug: string | null
  flyToCoords: [number, number] | null
  onSelectUnit: (slug: string) => void
}

export function UnitsMap({ units, selectedSlug, flyToCoords, onSelectUnit }: Props) {
  const unitsWithCoords: UnitWithCoords[] = units.map((unit, i) => ({
    ...unit,
    coords: getUnitCoords(unit, i),
  }))

  const brazilCenter: [number, number] = [-14.24, -51.93]

  return (
    <div className="relative h-full min-h-[320px] rounded-xl overflow-hidden shadow-lg border border-gray-200">
      <MapContainer
        center={brazilCenter}
        zoom={4}
        className="h-full w-full"
        scrollWheelZoom
        style={{ minHeight: '320px', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterLayer units={unitsWithCoords} selectedSlug={selectedSlug} onSelect={onSelectUnit} />
        <FlyToUnit coords={flyToCoords} />
      </MapContainer>

      <div className="absolute top-3 left-3 z-[1000] bg-white/95 backdrop-blur px-3 py-2 rounded-lg shadow text-sm font-medium text-mydark">
        <i className="fas fa-map-marker-alt text-mygreen mr-1" />
        {units.length} unidades no mapa
      </div>
    </div>
  )
}
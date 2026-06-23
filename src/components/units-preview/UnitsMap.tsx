import { useEffect } from 'react'
import { MapContainer, TileLayer, useMap, CircleMarker } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet.markercluster'
import type { Unit } from '../../types/unit'
import { getUnitCoords } from '../../lib/units'

type UnitWithCoords = Unit & { coords: [number, number]; distanceKm?: number }

function FlyToUnit({ coords, zoom }: { coords: [number, number] | null; zoom?: number }) {
  const map = useMap()
  useEffect(() => {
    if (coords) {
      map.flyTo(coords, zoom ?? 14, { duration: 0.8 })
    }
  }, [map, coords, zoom])
  return null
}

function UserLocationMarker({ coords }: { coords: [number, number] }) {
  return (
    <CircleMarker
      center={coords}
      radius={10}
      pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.9, weight: 3 }}
    />
  )
}

function MarkerClusterLayer({
  units,
  selectedSlug,
  nearestSlug,
  onSelect,
  detailBasePath,
}: {
  units: UnitWithCoords[]
  selectedSlug: string | null
  nearestSlug: string | null
  onSelect: (slug: string) => void
  detailBasePath: string
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
      const isNearest = unit.url_page === nearestSlug
      const size = isSelected || isNearest ? 18 : 14
      const color = isNearest ? '#ffc107' : isSelected ? '#ffc107' : '#6aa921'

      const icon = L.divIcon({
        className: '',
        html: `<div class="mybox-marker" style="width:${size}px;height:${size}px;background:${color};border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.35);border-radius:50%;"></div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      })

      const marker = L.marker(unit.coords, { icon })
      const distLabel =
        unit.distanceKm != null
          ? `<br/><span style="color:#6aa921;font-size:12px;font-weight:600">${unit.distanceKm < 1 ? Math.round(unit.distanceKm * 1000) + ' m' : unit.distanceKm.toFixed(1) + ' km'}</span>`
          : ''

      marker.bindPopup(
        `<div style="min-width:180px">
          <strong>${unit.name}</strong>${isNearest ? ' <span style="background:#ffc107;color:#262626;font-size:10px;padding:2px 6px;border-radius:4px;font-weight:bold">MAIS PRÓXIMA</span>' : ''}<br/>
          <span style="color:#666;font-size:13px">${unit.cidade} - ${unit.estado}</span>${distLabel}<br/>
          <a href="${detailBasePath}/${unit.url_page}" style="color:#6aa921;font-weight:600;font-size:13px;margin-top:6px;display:inline-block">Ver unidade →</a>
        </div>`,
      )
      marker.on('click', () => onSelect(unit.url_page))
      group.addLayer(marker)
    })

    map.addLayer(group)
    return () => {
      map.removeLayer(group)
    }
  }, [map, units, selectedSlug, nearestSlug, onSelect, detailBasePath])

  return null
}

type Props = {
  units: Unit[]
  selectedSlug: string | null
  nearestSlug?: string | null
  flyToCoords: [number, number] | null
  userLocation?: [number, number] | null
  distances?: Record<string, number>
  onSelectUnit: (slug: string) => void
  detailBasePath?: string
}

export function UnitsMap({
  units,
  selectedSlug,
  nearestSlug = null,
  flyToCoords,
  userLocation = null,
  distances = {},
  onSelectUnit,
  detailBasePath = '/unidades-preview',
}: Props) {
  const unitsWithCoords: UnitWithCoords[] = units.map((unit, i) => ({
    ...unit,
    coords: getUnitCoords(unit, i),
    distanceKm: distances[unit.url_page],
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
        <MarkerClusterLayer
          units={unitsWithCoords}
          selectedSlug={selectedSlug}
          nearestSlug={nearestSlug}
          onSelect={onSelectUnit}
          detailBasePath={detailBasePath}
        />
        {userLocation && <UserLocationMarker coords={userLocation} />}
        <FlyToUnit coords={flyToCoords} zoom={userLocation ? 11 : 14} />
      </MapContainer>

      <div className="absolute top-3 left-3 z-[1000] bg-white/95 backdrop-blur px-3 py-2 rounded-lg shadow text-sm font-medium text-mydark">
        <i className="fas fa-map-marker-alt text-mygreen mr-1" />
        {units.length} unidades no mapa
      </div>
      {userLocation && (
        <div className="absolute top-3 right-3 z-[1000] bg-blue-500 text-white px-3 py-1.5 rounded-lg shadow text-xs font-medium flex items-center gap-1">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          Você está aqui
        </div>
      )}
    </div>
  )
}

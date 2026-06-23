import { useState, useCallback } from 'react'

type GeoState = {
  loading: boolean
  error: string | null
  coords: [number, number] | null
}

export function useGeolocation() {
  const [state, setState] = useState<GeoState>({
    loading: false,
    error: null,
    coords: null,
  })

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState({ loading: false, error: 'Seu navegador não suporta geolocalização.', coords: null })
      return
    }

    setState((s) => ({ ...s, loading: true, error: null }))

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          loading: false,
          error: null,
          coords: [pos.coords.latitude, pos.coords.longitude],
        })
      },
      (err) => {
        const messages: Record<number, string> = {
          1: 'Permissão de localização negada. Ative nas configurações do navegador.',
          2: 'Não foi possível obter sua localização.',
          3: 'Tempo esgotado ao buscar localização.',
        }
        setState({
          loading: false,
          error: messages[err.code] ?? 'Erro ao obter localização.',
          coords: null,
        })
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
    )
  }, [])

  const clearLocation = useCallback(() => {
    setState({ loading: false, error: null, coords: null })
  }, [])

  return { ...state, requestLocation, clearLocation }
}

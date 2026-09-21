import { useEffect, useState } from 'react'
import { loadUnits } from '../lib/units-source'
import type { Unit } from '../types/unit'

/**
 * Unidades ativas para as paginas publicas. `carregando` fica true so na
 * primeira consulta da sessao; depois vem do cache de units-source.
 */
export function useUnits() {
  const [unidades, setUnidades] = useState<Unit[] | null>(null)

  useEffect(() => {
    let ativo = true
    loadUnits().then((lista) => {
      if (ativo) setUnidades(lista)
    })
    return () => {
      ativo = false
    }
  }, [])

  return { units: unidades ?? [], carregando: unidades === null }
}

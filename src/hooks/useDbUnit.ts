import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import type { DbUnit } from '../types/database'

export function useDbUnit(slug: string | undefined) {
  const [unit, setUnit] = useState<DbUnit | null>(null)
  const [loading, setLoading] = useState(Boolean(slug))

  useEffect(() => {
    if (!slug) {
      setUnit(null)
      setLoading(false)
      return
    }
    setLoading(true)
    api
      .get<DbUnit>(`/units/${encodeURIComponent(slug)}`)
      .then(setUnit)
      .catch(() => setUnit(null))
      .finally(() => setLoading(false))
  }, [slug])

  return { unit, loading }
}

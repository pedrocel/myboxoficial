import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
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
    if (!supabase) {
      setLoading(false)
      return
    }
    setLoading(true)
    supabase
      .from('units')
      .select('*')
      .eq('slug', slug)
      .single()
      .then(({ data }) => {
        if (data) setUnit(data as DbUnit)
        setLoading(false)
      })
  }, [slug])

  return { unit, loading }
}

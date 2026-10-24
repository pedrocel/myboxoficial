/** Limite simples em memoria (janela fixa por chave). Um processo so, entao basta. */
export function createRateLimiter(max: number, windowMs: number) {
  const hits = new Map<string, { count: number; resetAt: number }>()

  return {
    allow(key: string): boolean {
      const now = Date.now()
      const entry = hits.get(key)
      if (!entry || entry.resetAt <= now) {
        hits.set(key, { count: 1, resetAt: now + windowMs })
        if (hits.size > 10_000) {
          for (const [k, v] of hits) if (v.resetAt <= now) hits.delete(k)
        }
        return true
      }
      entry.count++
      return entry.count <= max
    },
  }
}

import { api } from './api'

export async function trackUnitVisit(unitSlug: string, path?: string) {
  try {
    await api.post(`/units/${encodeURIComponent(unitSlug)}/visits`, {
      path: path ?? window.location.pathname,
      referrer: document.referrer || null,
    })
  } catch {
    // silencioso — analytics não deve quebrar a página
  }
}

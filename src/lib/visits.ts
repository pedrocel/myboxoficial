import { supabase } from './supabase'

export async function trackUnitVisit(unitSlug: string, path?: string) {
  if (!supabase) return
  try {
    await supabase.from('unit_visits').insert({
      unit_slug: unitSlug,
      path: path ?? window.location.pathname,
      referrer: document.referrer || null,
    })
  } catch {
    // silencioso — analytics não deve quebrar a página
  }
}

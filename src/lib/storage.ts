import { supabase, supabaseUrl } from './supabase'

const BUCKET = 'unit-gallery'

export function getGalleryPublicUrl(path: string): string {
  if (!supabaseUrl) return path
  return `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${path}`
}

export async function uploadUnitImage(unitSlug: string, file: File): Promise<{ url: string | null; error?: string }> {
  if (!supabase) return { url: null, error: 'Supabase não configurado' }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `${unitSlug}/${Date.now()}.${ext}`

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (error) return { url: null, error: error.message }
  return { url: getGalleryPublicUrl(path) }
}

export async function deleteUnitImage(publicUrl: string, unitSlug: string): Promise<{ error?: string }> {
  if (!supabase || !supabaseUrl) return { error: 'Supabase não configurado' }

  const prefix = `/storage/v1/object/public/${BUCKET}/`
  const idx = publicUrl.indexOf(prefix)
  if (idx === -1) return {}
  const path = publicUrl.slice(idx + prefix.length)
  if (!path.startsWith(`${unitSlug}/`)) return { error: 'Imagem inválida' }

  const { error } = await supabase.storage.from(BUCKET).remove([path])
  return { error: error?.message }
}

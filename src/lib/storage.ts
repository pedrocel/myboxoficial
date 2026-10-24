import { api, attempt } from './api'

/** Fotos da galeria ficam no servidor da API (data/files/units/<slug>/). */
export async function uploadUnitImage(unitSlug: string, file: File): Promise<{ url: string | null; error?: string }> {
  const form = new FormData()
  form.append('file', file)
  const { data, error } = await attempt(api.post<{ url: string }>(`/uploads/units/${encodeURIComponent(unitSlug)}`, form))
  return { url: data?.url ?? null, error: error ?? undefined }
}

export async function deleteUnitImage(publicUrl: string): Promise<{ error?: string }> {
  const { error } = await attempt(api.delete(`/uploads?url=${encodeURIComponent(publicUrl)}`))
  return { error: error ?? undefined }
}

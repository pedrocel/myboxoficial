/**
 * Conversao entre as linhas do SQLite e o formato que o painel ja usava com o Supabase:
 * booleanos de verdade e JSON ja decodificado. Assim os tipos do frontend nao mudam.
 */

export type Role = 'admin' | 'owner' | 'student'

export type ProfileRow = {
  id: string
  email: string
  password_hash: string | null
  full_name: string | null
  phone: string | null
  role: Role
  unit_slug: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export type Profile = Omit<ProfileRow, 'password_hash'>

export function toProfile(row: ProfileRow): Profile {
  const { password_hash: _, ...profile } = row
  return profile
}

export type UnitRow = Record<string, unknown> & {
  slug: string
  gallery_images: string
  horarios: string | null
  modalidades: string | null
  is_public: number
  status: number
}

const parseJson = (value: string | null, fallback: unknown) => {
  if (value == null) return fallback
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

export function toUnit(row: UnitRow) {
  return {
    ...row,
    gallery_images: parseJson(row.gallery_images, []),
    horarios: parseJson(row.horarios, null),
    modalidades: parseJson(row.modalidades, null),
    is_public: Boolean(row.is_public),
    status: Boolean(row.status),
  }
}

/** Colunas que o painel pode alterar numa unidade; o resto e so do sistema. */
export const UNIT_EDITABLE = [
  'name',
  'razao_social',
  'cidade',
  'estado',
  'nome_dono',
  'telefone',
  'email',
  'whatsapp',
  'como_chegar',
  'logradouro',
  'numero',
  'cep',
  'lat',
  'lng',
  'image_background',
  'gallery_images',
  'horarios',
  'modalidades',
  'hero_image',
  'description',
  'is_public',
  'status',
] as const

export const UNIT_JSON = new Set(['gallery_images', 'horarios', 'modalidades'])
export const UNIT_BOOL = new Set(['is_public', 'status'])

/** Valor de uma coluna da unidade no formato que o SQLite aceita. */
export function unitColumnValue(column: string, value: unknown): string | number | null {
  if (value === undefined || value === null) return null
  if (UNIT_JSON.has(column)) return JSON.stringify(value)
  if (UNIT_BOOL.has(column)) return value ? 1 : 0
  if (typeof value === 'number') return value
  return String(value)
}

export const toLeadEmail = (row: Record<string, unknown>) => ({ ...row, ativo: Boolean(row.ativo) })

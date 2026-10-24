import { api, attempt } from './api'

export type CreateBookingInput = {
  unitSlug: string
  nome: string
  email: string
  telefone: string
  data: string
  horario: string
  modalidade: string
  /** Opcional: com senha o aluno ganha acesso ao painel e ja sai logado. */
  password?: string
}

/** created: conta nova; logged_in: ja tinha conta e a senha conferiu; exists: ja tinha conta. */
export type BookingAccount = 'none' | 'created' | 'logged_in' | 'exists'

export type CreateBookingResult = {
  ok: boolean
  account: BookingAccount
  error?: string
}

export async function createBooking(input: CreateBookingInput): Promise<CreateBookingResult> {
  const { data, error } = await attempt(
    api.post<{ account: BookingAccount }>('/bookings', {
      unit_slug: input.unitSlug,
      nome: input.nome,
      email: input.email,
      telefone: input.telefone,
      data: input.data,
      horario: input.horario,
      modalidade: input.modalidade,
      password: input.password || undefined,
    }),
  )
  if (error || !data) return { ok: false, account: 'none', error: error ?? undefined }
  return { ok: true, account: data.account }
}

export async function updateBookingStatus(id: string, status: string) {
  const { error } = await attempt(api.patch(`/bookings/${id}`, { status }))
  return { error }
}

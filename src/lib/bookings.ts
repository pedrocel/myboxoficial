import { supabase } from './supabase'

export type CreateBookingInput = {
  unitSlug: string
  nome: string
  email: string
  telefone: string
  data: string
  horario: string
  modalidade: string
}

export type CreateBookingResult = {
  ok: boolean
  accessEmailSent: boolean
  error?: string
}

export async function createBookingWithStudentAccess(input: CreateBookingInput): Promise<CreateBookingResult> {
  if (!supabase) {
    return { ok: false, accessEmailSent: false, error: 'Sistema indisponível no momento.' }
  }

  const { error: bookingError } = await supabase.from('bookings').insert({
    unit_slug: input.unitSlug,
    student_name: input.nome,
    student_email: input.email,
    student_phone: input.telefone,
    booking_date: input.data,
    booking_time: input.horario,
    modalidade: input.modalidade,
    status: 'pending',
  })

  if (bookingError) {
    return { ok: false, accessEmailSent: false, error: bookingError.message }
  }

  const { error: otpError } = await supabase.auth.signInWithOtp({
    email: input.email,
    options: {
      data: {
        full_name: input.nome,
        phone: input.telefone,
        role: 'student',
      },
      emailRedirectTo: `${window.location.origin}/entrar`,
    },
  })

  return {
    ok: true,
    accessEmailSent: !otpError,
    error: otpError?.message,
  }
}

export async function updateBookingStatus(id: string, status: string) {
  if (!supabase) return { error: 'Supabase não configurado' }
  const { error } = await supabase.from('bookings').update({ status }).eq('id', id)
  return { error: error?.message ?? null }
}

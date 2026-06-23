import { useState, useEffect, useMemo } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import type { Unit } from '../../types/unit'
import { getUnitImage } from '../../lib/units'
import { createBookingWithStudentAccess } from '../../lib/bookings'
import {
  getAvailableDates,
  getTimeSlotsForDate,
  MODALIDADES_AGENDA,
  PERIOD_LABELS,
  type TimeSlot,
} from '../../lib/scheduling'

type Props = {
  unit: Unit
  open: boolean
  onClose: () => void
}

export function AgendamentoModalPremium({ unit, open, onClose }: Props) {
  const dates = useMemo(() => getAvailableDates(14), [])
  const [step, setStep] = useState<1 | 2>(1)
  const [selectedDate, setSelectedDate] = useState(dates[1]?.value ?? dates[0].value)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [modalidade, setModalidade] = useState('experimental')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [accessEmailSent, setAccessEmailSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')

  const timeSlots = useMemo(() => getTimeSlotsForDate(selectedDate), [selectedDate])

  const slotsByPeriod = useMemo(() => {
    const groups: Record<string, TimeSlot[]> = { manha: [], tarde: [], noite: [] }
    timeSlots.forEach((s) => groups[s.period].push(s))
    return groups
  }, [timeSlots])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      setStep(1)
      setSelectedTime(null)
      setSuccess(false)
      setError(null)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    setSelectedTime(null)
  }, [selectedDate])

  if (!open) return null

  const selectedDateObj = dates.find((d) => d.value === selectedDate)
  const selectedMod = MODALIDADES_AGENDA.find((m) => m.id === modalidade)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!selectedTime) {
      setError('Selecione um horário para continuar.')
      return
    }
    setError(null)
    setLoading(true)

    const payload = {
      nome,
      email,
      telefone,
      data: selectedDate,
      horario: selectedTime,
      modalidade: selectedMod?.label ?? 'Aula Experimental',
      unidade: unit.name,
    }

    try {
      const result = await createBookingWithStudentAccess({
        unitSlug: unit.url_page,
        nome,
        email,
        telefone,
        data: selectedDate,
        horario: selectedTime,
        modalidade: selectedMod?.label ?? 'Aula Experimental',
      })

      if (!result.ok) {
        const apiUrl = import.meta.env.VITE_API_URL
        if (apiUrl) {
          const response = await fetch(`${apiUrl}/agendar-aula`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ ...payload, unidade: unit.name }),
          })
          if (!response.ok) throw new Error('Erro ao agendar')
        } else {
          throw new Error(result.error ?? 'Erro ao agendar')
        }
      }

      setAccessEmailSent(result.accessEmailSent)
      setSuccess(true)
    } catch {
      setError('Não foi possível confirmar. Tente pelo WhatsApp.')
    } finally {
      setLoading(false)
    }
  }

  const handleWhatsApp = () => {
    const digits = unit.whatsapp?.replace(/[^0-9]/g, '')
    if (!digits) return
    const msg = encodeURIComponent(
      `Olá! Gostaria de agendar uma ${selectedMod?.label ?? 'aula experimental'} na ${unit.name}.\n` +
        `Data: ${selectedDateObj?.dayNum}/${selectedDateObj?.month}\nHorário: ${selectedTime}\nNome: ${nome}`,
    )
    window.open(`https://wa.me/55${digits}?text=${msg}`, '_blank')
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-mydark/70 backdrop-blur-sm modal-backdrop" onClick={onClose} />

      <div className="relative w-full sm:max-w-lg max-h-[95vh] sm:max-h-[90vh] flex flex-col bg-white sm:rounded-3xl shadow-2xl overflow-hidden modal-panel">
        {/* Header */}
        <div className="relative shrink-0 overflow-hidden">
          <img src={getUnitImage(unit)} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-mydark/90 via-mydark/75 to-mygreen/80" />
          <div className="relative px-6 pt-6 pb-5">
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition backdrop-blur"
              aria-label="Fechar"
            >
              <i className="fas fa-times" />
            </button>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-mygreen text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                Grátis
              </span>
              <span className="text-white/70 text-xs">Aula experimental</span>
            </div>
            <h2 className="text-2xl font-bold text-white pr-10">{unit.name}</h2>
            <p className="text-white/75 text-sm mt-1">
              <i className="fas fa-map-marker-alt text-mygreen mr-1" />
              {unit.cidade} — {unit.estado}
            </p>

            {/* Steps */}
            {!success && (
              <div className="flex gap-2 mt-5">
                {([1, 2] as const).map((s) => (
                  <div key={s} className="flex-1 flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                        step >= s ? 'bg-mygreen text-white' : 'bg-white/20 text-white/60'
                      }`}
                    >
                      {step > s ? <i className="fas fa-check text-[10px]" /> : s}
                    </div>
                    <span className={`text-xs font-medium hidden sm:block ${step >= s ? 'text-white' : 'text-white/50'}`}>
                      {s === 1 ? 'Horário' : 'Seus dados'}
                    </span>
                    {s === 1 && <div className={`flex-1 h-0.5 rounded ${step > 1 ? 'bg-mygreen' : 'bg-white/20'}`} />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {success ? (
            <div className="p-8 text-center">
              <div className="w-20 h-20 rounded-full gradient-green flex items-center justify-center mx-auto mb-5 shadow-lg shadow-mygreen/30">
                <i className="fas fa-check text-white text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-mydark mb-2">Agendamento solicitado!</h3>
              <p className="text-gray-500 mb-2">
                {selectedMod?.label} · {selectedDateObj?.dayNum} {selectedDateObj?.month} às {selectedTime}
              </p>
              <p className="text-gray-400 text-sm mb-4">A unidade entrará em contato para confirmar.</p>
              {accessEmailSent && (
                <div className="bg-green-50 border border-mygreen/20 rounded-2xl p-4 mb-6 text-left">
                  <p className="text-sm font-bold text-mydark flex items-center gap-2">
                    <i className="fas fa-envelope text-mygreen" />
                    Acesso ao portal do aluno
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Enviamos um link para <strong>{email}</strong>. Use-o para entrar e acompanhar seus agendamentos.
                  </p>
                  <Link
                    to="/entrar"
                    className="inline-flex items-center gap-1.5 mt-3 text-sm font-bold text-mygreen hover:text-green-600"
                  >
                    Ir para o login
                    <i className="fas fa-arrow-right text-xs" />
                  </Link>
                </div>
              )}
              <div className="space-y-3">
                {unit.whatsapp && (
                  <button
                    type="button"
                    onClick={handleWhatsApp}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-2xl transition flex items-center justify-center gap-2"
                  >
                    <i className="fab fa-whatsapp text-lg" />
                    Confirmar pelo WhatsApp
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full border-2 border-gray-200 text-mydark font-bold py-3 rounded-2xl hover:border-mygreen transition"
                >
                  Fechar
                </button>
              </div>
            </div>
          ) : step === 1 ? (
            <div className="p-6 space-y-6">
              {/* Modalidade */}
              <div>
                <p className="text-sm font-bold text-mydark mb-3 flex items-center gap-2">
                  <i className="fas fa-dumbbell text-mygreen" />
                  Escolha a modalidade
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {MODALIDADES_AGENDA.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setModalidade(m.id)}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border-2 text-left transition ${
                        modalidade === m.id
                          ? 'border-mygreen bg-green-50 text-mydark'
                          : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200'
                      }`}
                    >
                      <i className={`fas ${m.icon} ${modalidade === m.id ? 'text-mygreen' : 'text-gray-400'}`} />
                      <span className="text-sm font-semibold leading-tight">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Data */}
              <div>
                <p className="text-sm font-bold text-mydark mb-3 flex items-center gap-2">
                  <i className="fas fa-calendar-alt text-mygreen" />
                  Escolha o dia
                </p>
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                  {dates.map((d) => (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => setSelectedDate(d.value)}
                      className={`shrink-0 flex flex-col items-center w-16 py-3 rounded-2xl border-2 transition ${
                        selectedDate === d.value
                          ? 'border-mygreen bg-mygreen text-white shadow-md shadow-mygreen/30'
                          : 'border-gray-100 bg-white text-mydark hover:border-mygreen/40'
                      }`}
                    >
                      <span className={`text-[10px] font-semibold uppercase ${selectedDate === d.value ? 'text-green-100' : 'text-gray-400'}`}>
                        {d.isToday ? 'Hoje' : d.isTomorrow ? 'Amanhã' : d.dayName}
                      </span>
                      <span className="text-xl font-bold leading-none mt-1">{d.dayNum}</span>
                      <span className={`text-[10px] mt-0.5 ${selectedDate === d.value ? 'text-green-100' : 'text-gray-400'}`}>
                        {d.month}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Horários */}
              <div>
                <p className="text-sm font-bold text-mydark mb-3 flex items-center gap-2">
                  <i className="fas fa-clock text-mygreen" />
                  Escolha o horário
                </p>
                {(['manha', 'tarde', 'noite'] as const).map((period) => {
                  const slots = slotsByPeriod[period]
                  if (!slots.length) return null
                  return (
                    <div key={period} className="mb-4">
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">
                        {PERIOD_LABELS[period]}
                      </p>
                      <div className="grid grid-cols-4 gap-2">
                        {slots.map((slot) => (
                          <button
                            key={slot.value}
                            type="button"
                            onClick={() => setSelectedTime(slot.value)}
                            className={`py-2.5 rounded-xl text-sm font-bold transition ${
                              selectedTime === slot.value
                                ? 'bg-mygreen text-white shadow-md shadow-mygreen/25 scale-105'
                                : 'bg-gray-50 text-mydark border border-gray-100 hover:border-mygreen/50 hover:bg-green-50'
                            }`}
                          >
                            {slot.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <form id="agendamento-form" onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Resumo */}
              <div className="bg-green-50 border border-mygreen/20 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-green flex items-center justify-center shrink-0">
                  <i className={`fas ${selectedMod?.icon ?? 'fa-star'} text-white`} />
                </div>
                <div>
                  <p className="font-bold text-mydark text-sm">{selectedMod?.label}</p>
                  <p className="text-mygreen text-sm font-medium">
                    {selectedDateObj?.dayNum} {selectedDateObj?.month} · {selectedTime ?? '—'}
                  </p>
                </div>
                <button type="button" onClick={() => setStep(1)} className="ml-auto text-xs text-gray-400 hover:text-mygreen font-medium">
                  Alterar
                </button>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Nome completo"
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-mygreen focus:bg-white transition"
                  />
                </div>
                <div className="relative">
                  <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Seu melhor e-mail"
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-mygreen focus:bg-white transition"
                  />
                </div>
                <div className="relative">
                  <i className="fas fa-phone absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input
                    type="tel"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="WhatsApp / telefone"
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-mygreen focus:bg-white transition"
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-sm flex items-center gap-2 bg-red-50 px-4 py-3 rounded-xl">
                  <i className="fas fa-exclamation-circle" />
                  {error}
                </p>
              )}
            </form>
          )}
        </div>

        {/* Footer CTA */}
        {!success && (
          <div className="shrink-0 p-4 border-t border-gray-100 bg-white">
            {step === 1 ? (
              <button
                type="button"
                disabled={!selectedTime}
                onClick={() => {
                  if (!selectedTime) {
                    setError('Selecione um horário')
                    return
                  }
                  setError(null)
                  setStep(2)
                }}
                className="w-full bg-mygreen hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition shadow-lg shadow-mygreen/25 flex items-center justify-center gap-2"
              >
                Continuar
                <i className="fas fa-arrow-right" />
              </button>
            ) : (
              <button
                type="submit"
                form="agendamento-form"
                disabled={loading}
                className="w-full bg-mygreen hover:bg-green-600 disabled:opacity-60 text-white font-bold py-4 rounded-2xl transition shadow-lg shadow-mygreen/25 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin" />
                    Confirmando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-calendar-check" />
                    Confirmar agendamento
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

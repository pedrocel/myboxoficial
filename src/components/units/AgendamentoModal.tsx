import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CircleCheck, X } from 'lucide-react'
import type { Unit } from '../../types/unit'
import { createBooking, type BookingAccount } from '../../lib/bookings'
import { useAuth } from '../../contexts/AuthContext'
import { getWhatsAppUrl } from '../../lib/units'
import { SocialIcon } from '../site/SocialIcon'

type Props = {
  unit: Unit
  open: boolean
  onClose: () => void
}

const today = () => new Date().toISOString().slice(0, 10)

/**
 * Agendamento da aula experimental: grava na API (aparece no painel da unidade)
 * e, com senha, ja cria o acesso do aluno ao painel.
 */
export function AgendamentoModal({ unit, open, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const { refreshProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<{ account: BookingAccount; email: string } | null>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  const close = () => {
    setDone(null)
    setError(null)
    onClose()
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const form = new FormData(e.currentTarget)
    const password = String(form.get('password') ?? '')
    if (password && password.length < 8) {
      setError('A senha precisa de pelo menos 8 caracteres.')
      return
    }

    setLoading(true)
    const email = String(form.get('email') ?? '').trim()
    const result = await createBooking({
      unitSlug: unit.url_page,
      nome: String(form.get('nome') ?? ''),
      email,
      telefone: String(form.get('telefone') ?? ''),
      data: String(form.get('data') ?? ''),
      horario: String(form.get('horario') ?? ''),
      modalidade: 'Aula Experimental',
      password: password || undefined,
    })
    setLoading(false)

    if (!result.ok) {
      setError(result.error ?? 'Não foi possível agendar. Tente de novo ou fale pelo WhatsApp.')
      return
    }
    if (result.account === 'created' || result.account === 'logged_in') await refreshProfile()
    setDone({ account: result.account, email })
  }

  const whatsappUrl = getWhatsAppUrl(unit)

  return (
    <dialog
      ref={dialogRef}
      onClose={close}
      aria-labelledby="agendamento-titulo"
      className="m-auto w-[min(34rem,calc(100%-2rem))] max-h-[90dvh] overflow-y-auto rounded-media border bg-card p-0 text-foreground backdrop:bg-night/70 backdrop:backdrop-blur-sm"
    >
      <div className="flex items-start justify-between gap-4 border-b p-6 sm:p-8">
        <div>
          <p className="eyebrow">{unit.name}</p>
          <h2 id="agendamento-titulo" className="display display-sm mt-3">
            Agendar aula experimental
          </h2>
        </div>
        <button
          type="button"
          onClick={close}
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-border-strong"
          aria-label="Fechar"
        >
          <X size={18} aria-hidden />
        </button>
      </div>

      {done ? (
        <div className="grid gap-6 p-6 sm:p-8">
          <span className="inline-flex size-14 items-center justify-center rounded-full bg-primary/15 text-brand">
            <CircleCheck size={26} aria-hidden />
          </span>
          <div>
            <p className="display display-sm">Agendamento enviado.</p>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              A unidade vai entrar em contato para confirmar.
              {done.account === 'created' && ' Sua conta foi criada: acompanhe seus agendamentos no painel do aluno.'}
              {done.account === 'logged_in' && ' Você já entrou no painel do aluno.'}
              {done.account === 'exists' && ` Você já tem conta com ${done.email}: entre para acompanhar.`}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            {done.account !== 'none' && (
              <Link to={done.account === 'exists' ? '/entrar' : '/painel/aluno'} className="btn" onClick={close}>
                {done.account === 'exists' ? 'Entrar' : 'Ir para o painel'}
                <ArrowRight size={18} className="btn-icon" aria-hidden />
              </Link>
            )}
            {whatsappUrl && (
              <a href={whatsappUrl} target="_blank" rel="noopener" className="btn btn-ghost">
                <SocialIcon name="whatsapp" size={20} />
                Falar com a unidade
              </a>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-5 p-6 sm:p-8">
          <div className="field">
            <label htmlFor="ag-nome">Nome completo</label>
            <input id="ag-nome" name="nome" className="input" autoComplete="name" required />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="field">
              <label htmlFor="ag-email">E-mail</label>
              <input id="ag-email" name="email" type="email" className="input" autoComplete="email" required />
            </div>
            <div className="field">
              <label htmlFor="ag-telefone">Telefone com DDD</label>
              <input id="ag-telefone" name="telefone" type="tel" inputMode="tel" className="input" autoComplete="tel" required />
            </div>
            <div className="field">
              <label htmlFor="ag-data">Data</label>
              <input id="ag-data" name="data" type="date" min={today()} className="input" required />
            </div>
            <div className="field">
              <label htmlFor="ag-horario">Horário</label>
              <input id="ag-horario" name="horario" type="time" className="input" required />
            </div>
          </div>
          <div className="field">
            <label htmlFor="ag-senha">Crie uma senha (opcional)</label>
            <input
              id="ag-senha"
              name="password"
              type="password"
              className="input"
              autoComplete="new-password"
              minLength={8}
              placeholder="Mínimo de 8 caracteres"
            />
            <p className="text-sm text-subtle">Com senha você acompanha seus agendamentos no painel do aluno.</p>
          </div>
          {error && <p className="field-error">{error}</p>}
          <button type="submit" disabled={loading} className="btn w-full">
            {loading ? 'Enviando...' : 'Agendar aula experimental'}
            <ArrowRight size={18} className="btn-icon" aria-hidden />
          </button>
        </form>
      )}
    </dialog>
  )
}

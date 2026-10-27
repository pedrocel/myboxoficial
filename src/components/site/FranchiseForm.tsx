import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CircleCheck } from 'lucide-react'
import { SocialIcon } from './SocialIcon'
import { FRANCHISE_WHATSAPP } from './site-links'

type FormState = {
  nome: string
  email: string
  telefone: string
  cidade: string
  investimento_disponivel: string
  mensagem: string
  termos: boolean
}

/**
 * Mesmo endpoint da landing de franquia: ele grava o lead na API da My Box
 * (tabela leads, que alimenta o painel) e avisa a equipe por e-mail.
 */
const LEAD_ENDPOINT = import.meta.env.VITE_LEAD_ENDPOINT ?? 'https://myboxfranquia.myboxoficial.com.br/api/lead'

const initialState: FormState = {
  nome: '',
  email: '',
  telefone: '',
  cidade: '',
  investimento_disponivel: '',
  mensagem: '',
  termos: false,
}

export function FranchiseForm() {
  const [form, setForm] = useState<FormState>(initialState)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [enviado, setEnviado] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Form-encoded é o formato que a function espera, e evita preflight.
      const corpo = new URLSearchParams({
        nome: form.nome,
        email: form.email,
        telefone: form.telefone,
        cidade: form.cidade,
        investimento: form.investimento_disponivel,
        mensagem: form.mensagem,
        termos: form.termos ? '1' : '',
        origem: 'site-franquia',
        pagina: window.location.href,
      })

      const response = await fetch(LEAD_ENDPOINT, { method: 'POST', body: corpo })
      if (!response.ok) throw new Error('Não foi possível enviar agora. Tente de novo em instantes.')

      setEnviado(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar formulário')
    } finally {
      setLoading(false)
    }
  }

  const mensagemWhatsApp = encodeURIComponent(
    `Olá! Me chamo ${form.nome} e tenho interesse em abrir uma academia My Box.\n\n` +
      `Cidade: ${form.cidade}\nE-mail: ${form.email}\nTelefone: ${form.telefone}`,
  )

  if (enviado) {
    return (
      <div className="grid gap-6 rounded-media border bg-card p-6 sm:p-10">
        <span className="inline-flex size-14 items-center justify-center rounded-xl bg-primary/15 text-brand">
          <CircleCheck size={26} aria-hidden />
        </span>
        <div>
          <h3 className="display display-sm">
            Recebemos o seu interesse{form.nome ? `, ${form.nome.split(' ')[0]}` : ''}.
          </h3>
          <p className="mt-3 max-w-[46ch] leading-relaxed text-muted-foreground">
            Nossa equipe de expansão vai analisar a sua região e entrar em contato. Se preferir adiantar a conversa,
            fale agora pelo WhatsApp.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href={`https://wa.me/${FRANCHISE_WHATSAPP}?text=${mensagemWhatsApp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
          >
            <SocialIcon name="whatsapp" size={20} />
            Falar no WhatsApp
          </a>
          <button
            type="button"
            onClick={() => {
              setForm(initialState)
              setEnviado(false)
            }}
            className="btn btn-ghost"
          >
            Enviar outro contato
          </button>
        </div>
      </div>
    )
  }

  const update = (field: keyof FormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form className="grid gap-6 rounded-media border bg-card p-6 sm:p-10" onSubmit={handleSubmit}>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="field sm:col-span-2">
          <label htmlFor="nome">Nome completo</label>
          <input
            id="nome"
            className="input"
            autoComplete="name"
            required
            value={form.nome}
            onChange={(e) => update('nome', e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            className="input"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="telefone">Telefone com DDD</label>
          <input
            id="telefone"
            className="input"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            value={form.telefone}
            onChange={(e) => update('telefone', e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="cidade">Cidade e estado</label>
          <input
            id="cidade"
            className="input"
            autoComplete="address-level2"
            required
            value={form.cidade}
            onChange={(e) => update('cidade', e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="investimento">Investimento disponível</label>
          <select
            id="investimento"
            className="input"
            required
            value={form.investimento_disponivel}
            onChange={(e) => update('investimento_disponivel', e.target.value)}
          >
            <option value="">Selecione uma opção</option>
            <option value="200k-400k">De R$ 200 mil a R$ 400 mil</option>
            <option value="acima-400k">Acima de R$ 400 mil</option>
          </select>
        </div>
        <div className="field sm:col-span-2">
          <label htmlFor="mensagem">Mensagem (opcional)</label>
          <textarea
            id="mensagem"
            className="input"
            value={form.mensagem}
            onChange={(e) => update('mensagem', e.target.value)}
          />
        </div>
      </div>
      <div>
        <label className="flex items-start gap-3 text-sm text-muted-foreground">
          <input
            id="termos"
            type="checkbox"
            className="mt-0.5 size-5 shrink-0 accent-primary"
            required
            checked={form.termos}
            onChange={(e) => update('termos', e.target.checked)}
          />
          <span>
            Concordo com os{' '}
            <Link className="text-brand underline underline-offset-2" to="/termos">
              termos de uso
            </Link>{' '}
            e a{' '}
            <Link className="text-brand underline underline-offset-2" to="/privacidade">
              política de privacidade
            </Link>
            .
          </span>
        </label>
        {error && <p className="field-error mt-2">{error}</p>}
      </div>
      <button type="submit" disabled={loading} className="btn w-full sm:w-auto sm:justify-self-start">
        {loading ? 'Enviando...' : 'Enviar meu interesse'}
        <ArrowRight size={18} className="btn-icon" aria-hidden />
      </button>
    </form>
  )
}

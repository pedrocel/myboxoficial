import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'

type FormState = {
  nome: string
  email: string
  telefone: string
  cidade: string
  investimento_disponivel: string
  mensagem: string
  termos: boolean
}

const FRANCHISE_WHATSAPP = '5519971313300'

/**
 * Mesmo endpoint da landing de franquia: ele grava o lead no Supabase
 * (leads_mybox, que alimenta o painel) e avisa a equipe por e-mail.
 */
const LEAD_ENDPOINT =
  import.meta.env.VITE_LEAD_ENDPOINT ?? 'https://myboxfranquia.myboxoficial.com.br/api/lead'

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
        origem: 'site-home',
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
      <div
        id="formulario"
        className="max-w-4xl mx-auto bg-card rounded-xl shadow-xl overflow-hidden"
        data-aos="fade-up"
      >
        <div className="p-8 md:p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full gradient-green flex items-center justify-center">
            <i className="fas fa-check text-white text-2xl" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-3">
            Recebemos sua solicitação{form.nome ? `, ${form.nome.split(' ')[0]}` : ''}!
          </h3>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Nossa equipe vai analisar sua região e entrar em contato. Se preferir adiantar a conversa, fale com a
            gente agora no WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`https://wa.me/${FRANCHISE_WHATSAPP}?text=${mensagemWhatsApp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-mygreen hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full transition transform hover:scale-105 shadow-lg inline-flex items-center justify-center gap-2"
            >
              <i className="fab fa-whatsapp text-lg" />
              Falar agora no WhatsApp
            </a>
            <button
              type="button"
              onClick={() => {
                setForm(initialState)
                setEnviado(false)
              }}
              className="border border-border text-foreground font-semibold py-3 px-8 rounded-full transition hover:bg-accent"
            >
              Enviar outro contato
            </button>
          </div>
        </div>
      </div>
    )
  }

  const update = (field: keyof FormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div id="formulario" className="max-w-4xl mx-auto bg-card rounded-xl shadow-xl overflow-hidden" data-aos="fade-up">
      <div className="p-8">
        <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Quero ser um Franqueado</h3>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-muted-foreground mb-1">
                Nome Completo
              </label>
              <input
                type="text"
                id="nome"
                required
                value={form.nome}
                onChange={(e) => update('nome', e.target.value)}
                className="w-full px-4 py-2 bg-background text-foreground border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-mygreen"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                required
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                className="w-full px-4 py-2 bg-background text-foreground border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-mygreen"
              />
            </div>
            <div>
              <label htmlFor="telefone" className="block text-sm font-medium text-muted-foreground mb-1">
                Telefone
              </label>
              <input
                type="tel"
                id="telefone"
                required
                value={form.telefone}
                onChange={(e) => update('telefone', e.target.value)}
                className="w-full px-4 py-2 bg-background text-foreground border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-mygreen"
              />
            </div>
            <div>
              <label htmlFor="cidade" className="block text-sm font-medium text-muted-foreground mb-1">
                Cidade/Estado
              </label>
              <input
                type="text"
                id="cidade"
                required
                value={form.cidade}
                onChange={(e) => update('cidade', e.target.value)}
                className="w-full px-4 py-2 bg-background text-foreground border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-mygreen"
              />
            </div>
          </div>

          <div>
            <label htmlFor="investimento_disponivel" className="block text-sm font-medium text-muted-foreground mb-1">
              Investimento Disponível
            </label>
            <select
              id="investimento_disponivel"
              required
              value={form.investimento_disponivel}
              onChange={(e) => update('investimento_disponivel', e.target.value)}
              className="w-full px-4 py-2 bg-background text-foreground border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-mygreen"
            >
              <option value="">Selecione uma opção</option>
              <option value="200k-400k">De R$ 200 mil a R$ 400 mil</option>
              <option value="acima-400k">Acima de R$ 400 mil</option>
            </select>
          </div>

          <div>
            <label htmlFor="mensagem" className="block text-sm font-medium text-muted-foreground mb-1">
              Mensagem (opcional)
            </label>
            <textarea
              id="mensagem"
              rows={4}
              value={form.mensagem}
              onChange={(e) => update('mensagem', e.target.value)}
              className="w-full px-4 py-2 bg-background text-foreground border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-mygreen"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="termos"
              required
              checked={form.termos}
              onChange={(e) => update('termos', e.target.checked)}
              className="h-4 w-4 text-mygreen focus:ring-mygreen border-border rounded"
            />
            <label htmlFor="termos" className="ml-2 block text-sm text-muted-foreground">
              Concordo com os{' '}
              <Link to="/termos" className="text-mygreen hover:underline">
                termos de uso
              </Link>{' '}
              e{' '}
              <Link to="/privacidade" className="text-mygreen hover:underline">
                política de privacidade
              </Link>
            </label>
          </div>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-mygreen hover:bg-green-600 disabled:opacity-60 text-white font-bold py-3 px-8 rounded-full transition transform hover:scale-105 shadow-lg"
            >
              {loading ? 'Enviando...' : 'Quero ser um Franqueado'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

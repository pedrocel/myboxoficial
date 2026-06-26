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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const apiUrl = import.meta.env.VITE_LEADS_API_URL

      if (apiUrl) {
        const response = await fetch(`${apiUrl}/leads`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            nome: form.nome,
            email: form.email,
            telefone: form.telefone,
            cidade: form.cidade,
            investimento_disponivel: form.investimento_disponivel,
            mensagem: form.mensagem,
            termos: form.termos,
          }),
        })

        if (!response.ok) {
          const data = await response.json().catch(() => ({}))
          throw new Error(data.message || 'Erro ao enviar formulário')
        }
      }

      const message = encodeURIComponent(
        `Olá! Me chamo ${form.nome} e tenho interesse em abrir uma academia My Box.\n\n` +
          `Cidade: ${form.cidade}\nE-mail: ${form.email}\nTelefone: ${form.telefone}`,
      )
      window.location.href = `https://wa.me/${FRANCHISE_WHATSAPP}?text=${message}`
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar formulário')
    } finally {
      setLoading(false)
    }
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
              <option value="ate-500k">De R$200mil à R$400mil</option>
              <option value="500k-700k">A cima de R$400mil</option>
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

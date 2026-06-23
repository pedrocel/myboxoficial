import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Unit } from '../../types/unit'

type Props = {
  unit: Unit
  open: boolean
  onClose: () => void
}

export function AgendamentoModal({ unit, open, onClose }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!open) return null

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const payload = {
      nome: form.get('nome'),
      email: form.get('email'),
      telefone: form.get('telefone'),
      data: form.get('data'),
      horario: form.get('horario'),
      modalidade: 'Aula Experimental',
      unidade: unit.name,
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL
      if (apiUrl) {
        const response = await fetch(`${apiUrl}/agendar-aula`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!response.ok) throw new Error('Erro ao agendar')
      }

      const whatsapp = unit.whatsapp?.replace(/[^0-9]/g, '')
      if (whatsapp) {
        window.open(`https://wa.me/55${whatsapp}`, '_blank')
      }
      onClose()
    } catch {
      setError('Não foi possível enviar o agendamento. Tente novamente ou entre em contato pelo WhatsApp.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold text-foreground">Agendar Aula Experimental</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-muted-foreground" aria-label="Fechar">
            <i className="fas fa-times text-xl" />
          </button>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-muted-foreground mb-1">
                Nome Completo
              </label>
              <input type="text" id="nome" name="nome" required className="w-full px-4 py-2 bg-background text-foreground border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-mygreen" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">
                E-mail
              </label>
              <input type="email" id="email" name="email" required className="w-full px-4 py-2 bg-background text-foreground border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-mygreen" />
            </div>
            <div>
              <label htmlFor="telefone" className="block text-sm font-medium text-muted-foreground mb-1">
                Telefone
              </label>
              <input type="tel" id="telefone" name="telefone" required className="w-full px-4 py-2 bg-background text-foreground border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-mygreen" />
            </div>
            <div>
              <label htmlFor="data" className="block text-sm font-medium text-muted-foreground mb-1">
                Data
              </label>
              <input type="date" id="data" name="data" required className="w-full px-4 py-2 bg-background text-foreground border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-mygreen" />
            </div>
            <div>
              <label htmlFor="horario" className="block text-sm font-medium text-muted-foreground mb-1">
                Horário
              </label>
              <input type="time" id="horario" name="horario" required className="w-full px-4 py-2 bg-background text-foreground border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-mygreen" />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-mygreen hover:bg-green-600 disabled:opacity-60 text-white font-bold py-3 px-4 rounded-md transition"
            >
              {loading ? 'Enviando...' : 'Agendar Aula Experimental'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

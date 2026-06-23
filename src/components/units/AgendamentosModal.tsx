import { useState } from 'react'

type Agendamento = {
  modalidade: string
  data: string
  horario: string
  unidade?: string
  nome: string
  telefone: string
  mensagem?: string
}

type Props = {
  open: boolean
  onClose: () => void
}

export function AgendamentosModal({ open, onClose }: Props) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [searched, setSearched] = useState(false)

  if (!open) return null

  const handleSearch = async () => {
    if (!email.trim()) {
      alert('Por favor, digite um e-mail válido.')
      return
    }

    setLoading(true)
    setSearched(false)

    try {
      const apiUrl = import.meta.env.VITE_API_URL
      if (!apiUrl) {
        setAgendamentos([])
        setSearched(true)
        return
      }

      const response = await fetch(`${apiUrl}/api/agendamentos?email=${encodeURIComponent(email)}`)
      const data = await response.json()

      if (data.success && data.agendamentos?.length > 0) {
        setAgendamentos(data.agendamentos)
      } else {
        setAgendamentos([])
      }
    } catch {
      setAgendamentos([])
    } finally {
      setLoading(false)
      setSearched(true)
    }
  }

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR')

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-mydark">Consultar Meus Agendamentos</h3>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-mydark" aria-label="Fechar">
              <i className="fas fa-times text-xl" />
            </button>
          </div>

          <div className="mb-6">
            <label htmlFor="consulta-email" className="block text-sm font-medium text-gray-700 mb-2">
              Digite seu e-mail para consultar agendamentos:
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                id="consulta-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="seu@email.com"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mygreen"
              />
              <button
                type="button"
                onClick={handleSearch}
                className="bg-mygreen hover:bg-green-600 text-white font-medium py-2 px-6 rounded-md transition"
              >
                <i className="fas fa-search mr-2" /> Buscar
              </button>
            </div>
          </div>

          {loading && (
            <div className="text-center py-8">
              <i className="fas fa-spinner fa-spin text-mygreen text-2xl mb-4" />
              <p className="text-gray-500">Buscando agendamentos...</p>
            </div>
          )}

          {!loading && searched && agendamentos.length > 0 && (
            <div>
              <h4 className="text-lg font-bold text-mydark mb-4">Seus Agendamentos</h4>
              <div className="space-y-4">
                {agendamentos.map((ag, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-4 border-l-4 border-mygreen">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-bold text-mydark">{ag.modalidade}</h5>
                      <span className="text-sm text-gray-500">
                        {formatDate(ag.data)} às {ag.horario}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      <i className="fas fa-map-marker-alt mr-1" />
                      {ag.unidade || 'Unidade My Box'}
                    </p>
                    <div className="text-sm text-gray-600">
                      <p>
                        <strong>Nome:</strong> {ag.nome}
                      </p>
                      <p>
                        <strong>Telefone:</strong> {ag.telefone}
                      </p>
                      {ag.mensagem && (
                        <p>
                          <strong>Observações:</strong> {ag.mensagem}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && searched && agendamentos.length === 0 && (
            <div className="text-center py-8">
              <i className="fas fa-calendar-times text-gray-300 text-4xl mb-4" />
              <p className="text-gray-500">
                {import.meta.env.VITE_API_URL
                  ? 'Nenhum agendamento encontrado para este e-mail.'
                  : 'Consulta de agendamentos disponível quando a API estiver configurada (VITE_API_URL).'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

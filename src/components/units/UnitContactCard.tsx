import type { Unit } from '../../types/unit'
import { getWhatsAppUrl } from '../../lib/units'

type Props = {
  unit: Unit
  onOpenAgendamento: () => void
}

export function UnitContactCard({ unit, onOpenAgendamento }: Props) {
  const whatsappUrl = getWhatsAppUrl(unit)

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-32" data-aos="fade-left">
      <div className="p-6 gradient-green text-white">
        <h3 className="text-xl font-bold mb-2">Fale Conosco</h3>
        <p>Estamos à disposição para tirar suas dúvidas</p>
      </div>
      <div className="p-6">
        {unit.telefone && (
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
              <i className="fas fa-phone text-mygreen" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Telefone</p>
              <p className="font-bold text-mydark">{unit.telefone}</p>
            </div>
          </div>
        )}
        {unit.email && (
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
              <i className="fas fa-envelope text-mygreen" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-bold text-mydark">
                <a href={`mailto:${unit.email}`} className="hover:underline">
                  {unit.email}
                </a>
              </p>
            </div>
          </div>
        )}
        {unit.logradouro && (
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
              <i className="fas fa-map-marker-alt text-mygreen" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Endereço</p>
              <p className="font-bold text-mydark">
                {unit.logradouro}, {unit.numero}
                <br />
                {unit.cidade}/{unit.estado}
                {unit.cep && (
                  <>
                    <br />
                    CEP: {unit.cep}
                  </>
                )}
              </p>
            </div>
          </div>
        )}
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
            <i className="fas fa-clock text-mygreen" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Horário de Funcionamento</p>
            <p className="font-bold text-mydark">Segunda à Sexta: 06h às 23h</p>
            <p className="font-bold text-mydark">Sábado: 08h às 18h</p>
            <p className="font-bold text-mydark">Domingo: 09h às 15h</p>
          </div>
        </div>
        <div className="space-y-3">
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              <i className="fab fa-whatsapp mr-2" /> Falar pelo WhatsApp
            </a>
          )}
          <button
            type="button"
            onClick={onOpenAgendamento}
            className="flex items-center justify-center w-full bg-mygreen hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            <i className="fas fa-dumbbell mr-2" /> Agendar Aula Experimental
          </button>
        </div>
      </div>
    </div>
  )
}

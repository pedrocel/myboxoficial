import type { Unit } from '../../types/unit'
import { getFullAddress, getUnitImage, getWhatsAppUrl } from '../../lib/units'

type Props = {
  unit: Unit
  onOpenAgendamento: () => void
}

export function UnitHero({ unit, onOpenAgendamento }: Props) {
  const whatsappUrl = getWhatsAppUrl(unit)

  return (
    <section className="relative py-20 bg-mydark">
      <div className="absolute inset-0 z-0 opacity-40">
        <img src={getUnitImage(unit)} className="w-full h-full object-cover" alt={unit.name} />
      </div>
      <div className="container mx-auto px-4 z-10 relative text-center">
        <div className="inline-block bg-mygreen text-white px-4 py-1 rounded-full text-sm font-bold mb-4" data-aos="fade-down">
          {unit.is_public ? 'UNIDADE PREMIUM' : 'UNIDADE EXCLUSIVA'}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-shadow" data-aos="fade-up">
          {unit.name}
        </h1>
        <p className="text-lg md:text-xl text-white mb-6 max-w-3xl mx-auto text-shadow" data-aos="fade-up" data-aos-delay="100">
          {getFullAddress(unit)}
        </p>
        <div className="flex justify-center mb-8 text-xl" data-aos="fade-up" data-aos-delay="200">
          {[1, 2, 3, 4, 5].map((i) => (
            <i key={i} className="fas fa-star text-mygold" />
          ))}
          <span className="ml-2 text-white text-shadow">(5)</span>
        </div>
        <div className="flex flex-col md:flex-row justify-center gap-4" data-aos="fade-up" data-aos-delay="300">
          <button
            type="button"
            onClick={onOpenAgendamento}
            className="bg-mygreen hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full transition transform hover:scale-105 shadow-lg"
          >
            <i className="fas fa-dumbbell mr-2" /> Agendar Aula Experimental
          </button>
          {whatsappUrl ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-card hover:bg-muted text-foreground font-bold py-3 px-8 rounded-full transition transform hover:scale-105 shadow-lg"
            >
              <i className="fas fa-phone-alt mr-2" /> WhatsApp
            </a>
          ) : unit.telefone ? (
            <a
              href={`tel:${unit.telefone_numerico}`}
              className="bg-card hover:bg-muted text-foreground font-bold py-3 px-8 rounded-full transition transform hover:scale-105 shadow-lg"
            >
              <i className="fas fa-phone-alt mr-2" /> Ligar Agora
            </a>
          ) : null}
        </div>
      </div>
    </section>
  )
}

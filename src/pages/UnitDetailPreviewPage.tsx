import { useState, useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { AgendamentoModal } from '../components/units/AgendamentoModal'
import {
  getUnitBySlug,
  getUnitImage,
  getFullAddress,
  getWhatsAppUrl,
  getMapEmbedUrl,
} from '../lib/units'
import { STATE_NAMES } from '../lib/brazil-states'
import { useAOS } from '../hooks/useAOS'

const MODALIDADES = [
  { icon: 'fa-dumbbell', title: 'Musculação', desc: 'Equipamentos modernos e ambiente motivador.' },
  { icon: 'fa-running', title: 'Cross Training', desc: 'Metodologia própria validada por milhões de alunos.' },
  { icon: 'fa-users', title: 'Aulas Coletivas', desc: 'Comunidade e ecossistema de opções.' },
  { icon: 'fa-coffee', title: 'My Coffee', desc: 'Café de qualidade antes ou depois do treino.' },
]

const HORARIOS = [
  { dia: 'Seg — Sex', musc: '06h — 23h', cross: '06h — 20h' },
  { dia: 'Sábado', musc: '08h — 18h', cross: '09h — 12h' },
  { dia: 'Domingo', musc: '09h — 15h', cross: '10h — 11h' },
]

export function UnitDetailPreviewPage() {
  const { slug } = useParams<{ slug: string }>()
  const unit = slug ? getUnitBySlug(slug) : undefined
  const [agendamentoOpen, setAgendamentoOpen] = useState(false)
  const whatsapp = unit ? getWhatsAppUrl(unit) : null

  useAOS()

  useEffect(() => {
    if (unit) document.title = `${unit.name} - My Box`
  }, [unit])

  if (!unit) {
    return <Navigate to="/unidades-preview" replace />
  }

  const mapsDirections = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(getFullAddress(unit))}`

  return (
    <div className="bg-mydark font-sans min-h-screen">
      {/* Preview ribbon */}
      <div className="bg-mygold text-mydark text-center text-xs font-bold py-1.5 tracking-wide">
        PREVIEW — Nova página de unidade em avaliação ·{' '}
        <Link to={`/unidades/${unit.url_page}`} className="underline hover:no-underline">
          ver versão atual
        </Link>
      </div>

      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden">
        <img
          src={getUnitImage(unit)}
          alt={unit.name}
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-mydark via-mydark/70 to-mydark/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-mygreen/20 to-transparent" />

        <div className="relative z-10 container mx-auto px-4 pb-12 pt-32 w-full">
          <Link
            to="/unidades-preview"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-6 transition"
          >
            <i className="fas fa-arrow-left" /> Voltar ao mapa
          </Link>

          <div className="flex flex-wrap gap-2 mb-4" data-aos="fade-down">
            <span className="bg-mygreen text-white text-xs font-bold px-3 py-1 rounded-full">
              {unit.is_public ? 'UNIDADE PREMIUM' : 'UNIDADE EXCLUSIVA'}
            </span>
            <span className="bg-white/15 backdrop-blur text-white text-xs font-medium px-3 py-1 rounded-full border border-white/20">
              {unit.cidade} — {STATE_NAMES[unit.estado] ?? unit.estado}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 text-shadow max-w-4xl" data-aos="fade-up">
            {unit.name}
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mb-8" data-aos="fade-up" data-aos-delay="100">
            <i className="fas fa-map-marker-alt text-mygreen mr-2" />
            {getFullAddress(unit)}
          </p>

          <div className="flex flex-wrap gap-3" data-aos="fade-up" data-aos-delay="200">
            <button
              type="button"
              onClick={() => setAgendamentoOpen(true)}
              className="bg-mygreen hover:bg-green-600 text-white font-bold py-3.5 px-8 rounded-full transition shadow-lg shadow-mygreen/30"
            >
              <i className="fas fa-dumbbell mr-2" />
              Agendar aula experimental
            </button>
            {whatsapp && (
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 backdrop-blur hover:bg-white/20 text-white font-bold py-3.5 px-8 rounded-full transition border border-white/30"
              >
                <i className="fab fa-whatsapp mr-2" />
                WhatsApp
              </a>
            )}
            <a
              href={mapsDirections}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 backdrop-blur hover:bg-white/20 text-white font-bold py-3.5 px-8 rounded-full transition border border-white/30"
            >
              <i className="fas fa-directions mr-2" />
              Como chegar
            </a>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: 'fa-star', label: 'Avaliação', value: '5.0' },
            { icon: 'fa-clock', label: 'Aberto hoje', value: '06h — 23h' },
            { icon: 'fa-dumbbell', label: 'Modalidades', value: '4+' },
            { icon: 'fa-users', label: 'Comunidade', value: 'My Box' },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3" data-aos="fade-up">
              <div className="w-11 h-11 rounded-xl gradient-green flex items-center justify-center shrink-0">
                <i className={`fas ${s.icon} text-white`} />
              </div>
              <div>
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className="font-bold text-mydark">{s.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main content */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Modalidades */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8" data-aos="fade-up">
                <h2 className="text-2xl font-bold text-mydark mb-6">O que você encontra aqui</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {MODALIDADES.map((m) => (
                    <div
                      key={m.title}
                      className="group p-5 rounded-xl bg-gray-50 hover:bg-green-50 border border-transparent hover:border-mygreen/30 transition"
                    >
                      <div className="w-12 h-12 rounded-xl gradient-green flex items-center justify-center mb-4 group-hover:scale-110 transition">
                        <i className={`fas ${m.icon} text-white text-lg`} />
                      </div>
                      <h3 className="font-bold text-mydark mb-1">{m.title}</h3>
                      <p className="text-sm text-gray-600">{m.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Horários */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8" data-aos="fade-up">
                <h2 className="text-2xl font-bold text-mydark mb-6">Horários de funcionamento</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="pb-3 font-bold text-mydark">Dia</th>
                        <th className="pb-3 font-bold text-mydark">Musculação</th>
                        <th className="pb-3 font-bold text-mydark">Cross Training</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {HORARIOS.map((h) => (
                        <tr key={h.dia}>
                          <td className="py-3 font-medium text-mydark">{h.dia}</td>
                          <td className="py-3 text-gray-600">{h.musc}</td>
                          <td className="py-3 text-gray-600">{h.cross}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mapa */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden" data-aos="fade-up">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-2xl font-bold text-mydark">Localização</h2>
                  <p className="text-gray-500 text-sm mt-1">{unit.como_chegar}</p>
                </div>
                <iframe
                  src={getMapEmbedUrl(unit)}
                  width="100%"
                  height="320"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title={`Mapa ${unit.name}`}
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6"
                data-aos="fade-left"
              >
                <h3 className="text-xl font-bold text-mydark mb-6">Fale com a unidade</h3>

                {unit.telefone && (
                  <div className="flex items-start gap-3 mb-5 pb-5 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                      <i className="fas fa-phone text-mygreen" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Telefone</p>
                      <a href={`tel:${unit.telefone_numerico}`} className="font-bold text-mydark hover:text-mygreen">
                        {unit.telefone}
                      </a>
                    </div>
                  </div>
                )}

                {unit.email && (
                  <div className="flex items-start gap-3 mb-5 pb-5 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                      <i className="fas fa-envelope text-mygreen" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">E-mail</p>
                      <a href={`mailto:${unit.email}`} className="font-bold text-mydark hover:text-mygreen break-all">
                        {unit.email}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                    <i className="fas fa-map-pin text-mygreen" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Endereço</p>
                    <p className="font-bold text-mydark text-sm leading-relaxed">{getFullAddress(unit)}</p>
                    {unit.cep && <p className="text-gray-500 text-sm mt-1">CEP {unit.cep}</p>}
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setAgendamentoOpen(true)}
                    className="w-full bg-mygreen hover:bg-green-600 text-white font-bold py-3.5 rounded-xl transition shadow-md"
                  >
                    Agendar aula experimental
                  </button>
                  {whatsapp && (
                    <a
                      href={whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-xl transition"
                    >
                      <i className="fab fa-whatsapp text-lg" />
                      Falar no WhatsApp
                    </a>
                  )}
                  <a
                    href={mapsDirections}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-mygreen text-mydark font-bold py-3 rounded-xl transition"
                  >
                    <i className="fas fa-directions" />
                    Abrir no Google Maps
                  </a>
                </div>
              </div>

              {/* CTA card */}
              <div className="rounded-2xl overflow-hidden shadow-lg" data-aos="fade-left" data-aos-delay="100">
                <div className="gradient-green p-6 text-white">
                  <h3 className="text-lg font-bold mb-2">Primeira aula grátis?</h3>
                  <p className="text-green-100 text-sm">
                    Agende sua aula experimental e conheça o conceito My Box de perto.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-gray-200 p-3 flex gap-2 shadow-2xl">
        <button
          type="button"
          onClick={() => setAgendamentoOpen(true)}
          className="flex-1 bg-mygreen text-white font-bold py-3 rounded-xl text-sm"
        >
          Agendar aula
        </button>
        {whatsapp && (
          <a
            href={whatsapp}
            className="flex-1 bg-green-500 text-white font-bold py-3 rounded-xl text-sm text-center"
          >
            WhatsApp
          </a>
        )}
      </div>

      <div className="h-20 lg:hidden" />

      <AgendamentoModal unit={unit} open={agendamentoOpen} onClose={() => setAgendamentoOpen(false)} />
    </div>
  )
}

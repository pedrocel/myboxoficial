import { useState, useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { AgendamentoModalPremium } from '../components/units-preview/AgendamentoModalPremium'
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
  {
    icon: 'fa-dumbbell',
    title: 'Musculação',
    desc: 'Equipamentos de última geração em um ambiente que motiva seus resultados.',
    color: 'from-emerald-500/20 to-emerald-600/5',
  },
  {
    icon: 'fa-running',
    title: 'Cross Training',
    desc: 'Metodologia própria validada por mais de um milhão de alunos no Brasil.',
    color: 'from-green-500/20 to-green-600/5',
  },
  {
    icon: 'fa-users',
    title: 'Aulas Coletivas',
    desc: 'Comunidade, energia e variedade para você nunca enjoar do treino.',
    color: 'from-lime-500/20 to-lime-600/5',
  },
  {
    icon: 'fa-coffee',
    title: 'My Coffee',
    desc: 'Café especial antes ou depois do treino. Conceito de shopping fitness.',
    color: 'from-amber-500/20 to-amber-600/5',
  },
]

const HORARIOS = [
  { dia: 'Segunda — Sexta', musc: '06h — 23h', cross: '06h, 07h, 08h, 12h, 18h, 19h, 20h' },
  { dia: 'Sábado', musc: '08h — 18h', cross: '09h, 10h, 11h' },
  { dia: 'Domingo', musc: '09h — 15h', cross: '10h, 11h' },
]

const GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
  'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80',
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
  'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80',
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
  const heroImage = getUnitImage(unit)

  return (
    <div className="bg-mydark font-sans min-h-screen">
      {/* Preview ribbon */}
      <div className="bg-mygold text-mydark text-center text-xs font-bold py-1.5 tracking-wide relative z-50">
        PREVIEW — Nova página de unidade ·{' '}
        <Link to={`/unidades/${unit.url_page}`} className="underline hover:no-underline">
          ver versão atual
        </Link>
      </div>

      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-end overflow-hidden">
        <img src={heroImage} alt={unit.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-mydark via-mydark/80 to-mydark/40" />
        <div className="absolute inset-0 hero-glow" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-mygreen/50 to-transparent" />

        <div className="relative z-10 container mx-auto px-4 pb-16 pt-28 w-full">
          <Link
            to="/unidades-preview"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-8 transition group"
          >
            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition">
              <i className="fas fa-arrow-left text-xs" />
            </span>
            Voltar ao mapa
          </Link>

          <div className="flex flex-wrap gap-2 mb-5" data-aos="fade-down">
            <span className="bg-mygreen text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-mygreen/30">
              {unit.is_public ? '★ UNIDADE PREMIUM' : 'UNIDADE EXCLUSIVA'}
            </span>
            <span className="bg-white/10 backdrop-blur-md text-white text-xs font-medium px-4 py-1.5 rounded-full border border-white/20">
              {unit.cidade} — {STATE_NAMES[unit.estado] ?? unit.estado}
            </span>
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-5 leading-tight max-w-4xl tracking-tight"
            data-aos="fade-up"
          >
            {unit.name}
          </h1>
          <p className="text-lg text-white/80 max-w-xl mb-10 flex items-start gap-2" data-aos="fade-up" data-aos-delay="100">
            <i className="fas fa-map-marker-alt text-mygreen mt-1 shrink-0" />
            {getFullAddress(unit)}
          </p>

          <div className="flex flex-wrap gap-3" data-aos="fade-up" data-aos-delay="200">
            <button
              type="button"
              onClick={() => setAgendamentoOpen(true)}
              className="group bg-mygreen hover:bg-green-500 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-xl shadow-mygreen/30 hover:shadow-mygreen/50 hover:scale-[1.02] flex items-center gap-2"
            >
              <i className="fas fa-calendar-check group-hover:scale-110 transition" />
              Agendar aula experimental
            </button>
            {whatsapp && (
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-bold py-4 px-8 rounded-2xl transition border border-white/25 flex items-center gap-2"
              >
                <i className="fab fa-whatsapp text-lg" />
                WhatsApp
              </a>
            )}
            <a
              href={mapsDirections}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-bold py-4 px-8 rounded-2xl transition border border-white/25 flex items-center gap-2"
            >
              <i className="fas fa-directions" />
              Como chegar
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white relative z-10 -mt-6 mx-4 sm:mx-auto sm:max-w-5xl rounded-2xl shadow-xl border border-gray-100">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
          {[
            { icon: 'fa-star', label: 'Avaliação', value: '5.0', sub: 'Google' },
            { icon: 'fa-clock', label: 'Hoje', value: '06h—23h', sub: 'Aberto' },
            { icon: 'fa-dumbbell', label: 'Modalidades', value: '4+', sub: 'Opções' },
            { icon: 'fa-heart', label: 'Comunidade', value: 'My Box', sub: 'Família' },
          ].map((s) => (
            <div key={s.label} className="p-5 text-center" data-aos="fade-up">
              <i className={`fas ${s.icon} text-mygreen text-lg mb-2`} />
              <p className="text-2xl font-black text-mydark">{s.value}</p>
              <p className="text-xs text-gray-400">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery strip */}
      <section className="py-8 overflow-hidden" data-aos="fade-up">
        <div className="flex gap-3 px-4 overflow-x-auto scrollbar-hide">
          {[heroImage, ...GALLERY_IMAGES].map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              className="h-44 w-64 shrink-0 rounded-2xl object-cover border border-white/10 shadow-lg"
            />
          ))}
        </div>
      </section>

      {/* Content */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Modalidades */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10" data-aos="fade-up">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl md:text-3xl font-black text-mydark">O que você encontra</h2>
                  <span className="text-mygreen text-sm font-bold">My Box</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {MODALIDADES.map((m) => (
                    <div
                      key={m.title}
                      className={`group relative p-6 rounded-2xl bg-gradient-to-br ${m.color} border border-gray-100 hover:border-mygreen/40 hover:shadow-md transition-all overflow-hidden`}
                    >
                      <div className="w-14 h-14 rounded-2xl gradient-green flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
                        <i className={`fas ${m.icon} text-white text-xl`} />
                      </div>
                      <h3 className="font-bold text-mydark text-lg mb-2">{m.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{m.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Horários */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10" data-aos="fade-up">
                <h2 className="text-2xl md:text-3xl font-black text-mydark mb-8">Horários</h2>
                <div className="space-y-3">
                  {HORARIOS.map((h) => (
                    <div
                      key={h.dia}
                      className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 p-4 rounded-2xl bg-gray-50 border border-gray-100"
                    >
                      <p className="font-bold text-mydark sm:w-36 shrink-0">{h.dia}</p>
                      <div className="flex flex-wrap gap-3 text-sm">
                        <span className="flex items-center gap-1.5 text-gray-600">
                          <i className="fas fa-dumbbell text-mygreen text-xs" />
                          {h.musc}
                        </span>
                        <span className="text-gray-300 hidden sm:inline">|</span>
                        <span className="flex items-center gap-1.5 text-gray-600">
                          <i className="fas fa-running text-mygreen text-xs" />
                          {h.cross}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mapa */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden" data-aos="fade-up">
                <div className="p-8 border-b border-gray-100">
                  <h2 className="text-2xl font-black text-mydark">Como chegar</h2>
                  <p className="text-gray-500 mt-2">{unit.como_chegar}</p>
                </div>
                <iframe
                  src={getMapEmbedUrl(unit)}
                  width="100%"
                  height="360"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title={`Mapa ${unit.name}`}
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden sticky top-6" data-aos="fade-left">
                <div className="gradient-green p-6 text-white">
                  <h3 className="text-xl font-black">Agende sua visita</h3>
                  <p className="text-green-100 text-sm mt-1">Primeira aula experimental gratuita</p>
                </div>
                <div className="p-6 space-y-5">
                  {unit.telefone && (
                    <a href={`tel:${unit.telefone_numerico}`} className="flex items-center gap-3 group">
                      <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center group-hover:bg-mygreen group-hover:text-white transition text-mygreen">
                        <i className="fas fa-phone" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Telefone</p>
                        <p className="font-bold text-mydark group-hover:text-mygreen transition">{unit.telefone}</p>
                      </div>
                    </a>
                  )}
                  {unit.email && (
                    <a href={`mailto:${unit.email}`} className="flex items-center gap-3 group">
                      <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center group-hover:bg-mygreen transition text-mygreen">
                        <i className="fas fa-envelope group-hover:text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">E-mail</p>
                        <p className="font-bold text-mydark text-sm truncate group-hover:text-mygreen transition">
                          {unit.email}
                        </p>
                      </div>
                    </a>
                  )}
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center text-mygreen shrink-0">
                      <i className="fas fa-map-pin" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Endereço</p>
                      <p className="font-bold text-mydark text-sm leading-relaxed">{getFullAddress(unit)}</p>
                    </div>
                  </div>

                  <div className="pt-2 space-y-3">
                    <button
                      type="button"
                      onClick={() => setAgendamentoOpen(true)}
                      className="w-full bg-mygreen hover:bg-green-600 text-white font-bold py-4 rounded-2xl transition shadow-lg shadow-mygreen/20 flex items-center justify-center gap-2"
                    >
                      <i className="fas fa-calendar-check" />
                      Escolher horário
                    </button>
                    {whatsapp && (
                      <a
                        href={whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-2xl transition"
                      >
                        <i className="fab fa-whatsapp text-lg" />
                        WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative overflow-hidden py-20" data-aos="fade-up">
        <img src={heroImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-mydark/85" />
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Pronto para começar?</h2>
          <p className="text-white/70 mb-8 max-w-md mx-auto">
            Agende sua aula experimental gratuita e descubra por que a My Box está mudando o fitness no Brasil.
          </p>
          <button
            type="button"
            onClick={() => setAgendamentoOpen(true)}
            className="bg-mygreen hover:bg-green-500 text-white font-bold py-4 px-10 rounded-2xl transition shadow-xl shadow-mygreen/30 text-lg"
          >
            Agendar agora — é grátis
          </button>
        </div>
      </section>

      {/* Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 p-3 flex gap-2 shadow-2xl">
        <button
          type="button"
          onClick={() => setAgendamentoOpen(true)}
          className="flex-1 bg-mygreen text-white font-bold py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-md"
        >
          <i className="fas fa-calendar-check" />
          Agendar aula
        </button>
        {whatsapp && (
          <a
            href={whatsapp}
            className="w-14 bg-green-500 text-white rounded-2xl flex items-center justify-center shadow-md"
          >
            <i className="fab fa-whatsapp text-xl" />
          </a>
        )}
      </div>

      <div className="h-24 lg:hidden" />

      <AgendamentoModalPremium unit={unit} open={agendamentoOpen} onClose={() => setAgendamentoOpen(false)} />
    </div>
  )
}

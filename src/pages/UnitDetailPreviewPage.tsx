import { useState, useEffect, useMemo } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { AgendamentoModalPremium } from '../components/units-preview/AgendamentoModalPremium'
import { UnitGalleryCarousel } from '../components/units-preview/UnitGalleryCarousel'
import {
  getUnitBySlug,
  getUnitImage,
  getFullAddress,
  getWhatsAppUrl,
  getMapEmbedUrl,
} from '../lib/units'
import { STATE_NAMES } from '../lib/brazil-states'
import { useAOS } from '../hooks/useAOS'
import { useDbUnit } from '../hooks/useDbUnit'
import { trackUnitVisit } from '../lib/visits'
import { getUnitHorarios, getUnitModalidades, getUnitGallery } from '../lib/unit-settings'

export function UnitDetailPreviewPage() {
  const { slug } = useParams<{ slug: string }>()
  const unit = slug ? getUnitBySlug(slug) : undefined
  const { unit: dbUnit } = useDbUnit(slug)
  const [agendamentoOpen, setAgendamentoOpen] = useState(false)
  const whatsapp = unit ? getWhatsAppUrl(unit) : null

  const modalidades = useMemo(() => getUnitModalidades(dbUnit), [dbUnit])
  const horarios = useMemo(() => getUnitHorarios(dbUnit), [dbUnit])

  useAOS()

  useEffect(() => {
    if (unit) document.title = `${unit.name} - My Box`
  }, [unit])

  useEffect(() => {
    if (unit) trackUnitVisit(unit.url_page)
  }, [unit])

  const galleryImages = useMemo(() => {
    if (!unit) return []
    return getUnitGallery(dbUnit, getUnitImage(unit))
  }, [unit, dbUnit])

  if (!unit) {
    return <Navigate to="/unidades-preview" replace />
  }

  const mapsDirections = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(getFullAddress(unit))}`
  const heroImage = dbUnit?.hero_image || dbUnit?.image_background || getUnitImage(unit)
  const mapEmbed =
    dbUnit?.lat && dbUnit?.lng
      ? `https://www.google.com/maps?q=${dbUnit.lat},${dbUnit.lng}&z=15&output=embed`
      : getMapEmbedUrl(unit)
  const comoChegar = dbUnit?.como_chegar || unit.como_chegar

  return (
    <div className="bg-background font-sans min-h-screen text-foreground">
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
      <section className="bg-card relative z-10 -mt-6 mx-4 sm:mx-auto sm:max-w-5xl rounded-2xl shadow-xl border border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
          {[
            { icon: 'fa-star', label: 'Avaliação', value: '5.0', sub: 'Google' },
            { icon: 'fa-clock', label: 'Hoje', value: '06h—23h', sub: 'Aberto' },
            { icon: 'fa-dumbbell', label: 'Modalidades', value: `${modalidades.length}+`, sub: 'Opções' },
            { icon: 'fa-heart', label: 'Comunidade', value: 'My Box', sub: 'Família' },
          ].map((s) => (
            <div key={s.label} className="p-5 text-center" data-aos="fade-up">
              <i className={`fas ${s.icon} text-primary text-lg mb-2`} />
              <p className="text-2xl font-black text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Galeria */}
      <section className="container mx-auto px-4 py-10">
        <UnitGalleryCarousel images={galleryImages} alt={unit.name} />
      </section>

      {/* Content */}
      <section className="bg-background py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-card rounded-3xl shadow-sm border border-border p-8 md:p-10" data-aos="fade-up">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl md:text-3xl font-black text-foreground">O que você encontra</h2>
                  <span className="text-primary text-sm font-bold">My Box</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {modalidades.map((m) => (
                    <div
                      key={m.id}
                      className={`group relative p-6 rounded-2xl bg-gradient-to-br ${m.color} border border-border hover:border-primary/40 hover:shadow-md transition-all overflow-hidden`}
                    >
                      <div className="w-14 h-14 rounded-2xl gradient-green flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
                        <i className={`fas ${m.icon} text-white text-xl`} />
                      </div>
                      <h3 className="font-bold text-foreground text-lg mb-2">{m.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{m.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-3xl shadow-sm border border-border p-8 md:p-10" data-aos="fade-up">
                <h2 className="text-2xl md:text-3xl font-black text-foreground mb-8">Horários</h2>
                <div className="space-y-3">
                  {horarios.map((h) => (
                    <div
                      key={h.id}
                      className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6 p-4 rounded-2xl bg-muted/40 border border-border"
                    >
                      <p className="font-bold text-foreground sm:w-36 shrink-0">{h.label}</p>
                      <div className="flex flex-col gap-2 text-sm flex-1">
                        {h.slots.map((slot) => (
                          <span key={slot.id} className="flex items-center gap-2 text-muted-foreground">
                            <span className="font-medium text-primary">{slot.activity}:</span>
                            {slot.hours}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-3xl shadow-sm border border-border overflow-hidden" data-aos="fade-up">
                <div className="p-8 border-b border-border">
                  <h2 className="text-2xl font-black text-foreground">Como chegar</h2>
                  <p className="text-muted-foreground mt-2">{comoChegar}</p>
                </div>
                <iframe
                  src={mapEmbed}
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
              <div className="bg-card rounded-3xl shadow-sm border border-border overflow-hidden sticky top-6" data-aos="fade-left">
                <div className="gradient-green p-6 text-white">
                  <h3 className="text-xl font-black">Agende sua visita</h3>
                  <p className="text-green-100 text-sm mt-1">Primeira aula experimental gratuita</p>
                </div>
                <div className="p-6 space-y-5">
                  {unit.telefone && (
                    <a href={`tel:${unit.telefone_numerico}`} className="flex items-center gap-3 group">
                      <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition text-primary">
                        <i className="fas fa-phone" />
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Telefone</p>
                        <p className="font-bold text-foreground group-hover:text-primary transition">{unit.telefone}</p>
                      </div>
                    </a>
                  )}
                  {unit.email && (
                    <a href={`mailto:${unit.email}`} className="flex items-center gap-3 group">
                      <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center group-hover:bg-primary transition text-primary">
                        <i className="fas fa-envelope group-hover:text-primary-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">E-mail</p>
                        <p className="font-bold text-foreground text-sm truncate group-hover:text-primary transition">
                          {unit.email}
                        </p>
                      </div>
                    </a>
                  )}
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center text-primary shrink-0">
                      <i className="fas fa-map-pin" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Endereço</p>
                      <p className="font-bold text-foreground text-sm leading-relaxed">{getFullAddress(unit)}</p>
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
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-card/95 backdrop-blur-md border-t border-border p-3 flex gap-2 shadow-2xl">
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

      <AgendamentoModalPremium unit={unit} horarios={horarios} open={agendamentoOpen} onClose={() => setAgendamentoOpen(false)} />
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, CalendarCheck, Clock, MapPin, Navigation, Phone } from 'lucide-react'
import { SiteLayout } from '../components/site/SiteLayout'
import { SocialIcon } from '../components/site/SocialIcon'
import { stagger } from '../components/site/stagger'
import { AgendamentoModal } from '../components/units/AgendamentoModal'
import { STATE_NAMES, findUnitBySlug, getMapEmbedUrl, getStreetAddress, getWhatsAppUrl } from '../lib/units'
import { useUnits } from '../hooks/useUnits'

const HOURS = [
  { day: 'Segunda a sexta', time: '06h às 23h' },
  { day: 'Sábado', time: '08h às 18h' },
  { day: 'Domingo', time: '09h às 15h' },
]

export function UnitDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { units, carregando } = useUnits()
  const unit = slug ? findUnitBySlug(units, slug) : undefined
  const [agendamentoOpen, setAgendamentoOpen] = useState(false)

  useEffect(() => {
    if (unit) {
      document.title = `${unit.name} - My Box`
    }
  }, [unit])

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!unit) {
    return <Navigate to="/unidades" replace />
  }

  const whatsappUrl = getWhatsAppUrl(unit)
  const street = getStreetAddress(unit)
  const stateName = STATE_NAMES[unit.estado] ?? unit.estado
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${street} - ${unit.cidade} - ${unit.estado}`,
  )}`
  const phoneDigits = unit.telefone_numerico || unit.telefone?.replace(/\D/g, '')
  const others = units.filter((u) => u.estado === unit.estado && u.url_page !== unit.url_page).slice(0, 6)

  return (
    <SiteLayout>
      <section className="relative isolate flex min-h-[88svh] items-end overflow-hidden bg-night text-foreground lg:min-h-[82svh]">
        {unit.image_background ? (
          <img
            src={unit.image_background}
            alt={`Foto da ${unit.name}`}
            loading="eager"
            fetchPriority="high"
            className="hero-photo absolute inset-0 -z-10 size-full object-cover"
          />
        ) : (
          <img
            src="/images/gym-floor-1600.webp"
            srcSet="/images/gym-floor-640.webp 640w, /images/gym-floor-1024.webp 1024w, /images/gym-floor-1600.webp 1600w, /images/gym-floor-2400.webp 2400w"
            sizes="100vw"
            width="2400"
            height="1602"
            alt="Interior de uma academia com piso de treino e equipamentos"
            loading="eager"
            fetchPriority="high"
            className="hero-photo absolute inset-0 -z-10 size-full object-cover"
          />
        )}
        <div className="scrim absolute inset-0 -z-10" />
        <div className="shell hero-enter pt-36 pb-14 lg:pb-20">
          <p className="eyebrow" style={stagger(0)}>
            {unit.cidade} - {unit.estado}
          </p>
          <h1 className="display display-lg mt-5 max-w-[18ch]" style={stagger(1)}>
            {unit.name}
          </h1>
          <p className="lede mt-6" style={stagger(2)}>
            Cross training, musculação e aulas coletivas no conceito My Box.
          </p>
          <div style={stagger(3)}>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {whatsappUrl && (
                <a href={whatsappUrl} target="_blank" rel="noopener" className="btn">
                  <SocialIcon name="whatsapp" size={20} />
                  Falar no WhatsApp
                </a>
              )}
              <button type="button" onClick={() => setAgendamentoOpen(true)} className="btn btn-on-photo">
                <CalendarCheck size={18} aria-hidden />
                Agendar aula experimental
              </button>
              <a href={directionsUrl} target="_blank" rel="noopener" className="btn btn-on-photo">
                <Navigation size={18} aria-hidden />
                Como chegar
              </a>
            </div>
          </div>
        </div>
      </section>

      <nav aria-label="Trilha de navegação" className="border-b">
        <ol className="shell flex items-center gap-2 py-4 text-sm text-subtle">
          <li>
            <Link className="hover:text-foreground" to="/unidades">
              Unidades
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link className="hover:text-foreground" to={`/unidades?uf=${unit.estado}`}>
              {stateName}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="truncate text-foreground">
            {unit.name}
          </li>
        </ol>
      </nav>

      <section className="py-20 lg:py-28">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <dl className="grid content-start gap-10 lg:col-span-5">
            <div data-reveal>
              <dt className="flex items-center gap-2 text-sm font-medium text-subtle">
                <MapPin size={18} className="text-brand" aria-hidden /> Endereço
              </dt>
              <dd className="mt-3 text-xl leading-snug">
                {street}
                <br />
                {unit.cidade} - {unit.estado}
                {unit.cep && <span className="mt-1 block text-base text-muted-foreground">CEP {unit.cep}</span>}
              </dd>
            </div>
            {unit.telefone && (
              <div data-reveal style={stagger(1)}>
                <dt className="flex items-center gap-2 text-sm font-medium text-subtle">
                  <Phone size={18} className="text-brand" aria-hidden /> Telefone
                </dt>
                <dd className="mt-3 text-xl">
                  <a href={`tel:+55${phoneDigits}`} className="link-arrow">
                    {unit.telefone}
                  </a>
                </dd>
              </div>
            )}
            <div data-reveal style={stagger(2)}>
              <dt className="flex items-center gap-2 text-sm font-medium text-subtle">
                <Clock size={18} className="text-brand" aria-hidden /> Horário padrão da rede
              </dt>
              <dd className="mt-3 grid gap-2">
                {HOURS.map((h) => (
                  <p key={h.day} className="flex justify-between gap-6 border-b pb-2 text-lg">
                    <span className="text-muted-foreground">{h.day}</span>
                    <span className="tabular-nums">{h.time}</span>
                  </p>
                ))}
                <span className="mt-2 text-sm text-subtle">Confirme horários e grade de aulas com a unidade.</span>
              </dd>
            </div>
          </dl>
          <div className="lg:col-span-7" data-reveal style={stagger(1)}>
            <div className="media aspect-[4/3] border lg:aspect-auto lg:h-full lg:min-h-[28rem]">
              <iframe
                src={getMapEmbedUrl(unit)}
                title={`Mapa com a localização da ${unit.name}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="map-frame size-full border-0"
              />
            </div>
          </div>
        </div>
      </section>

      {others.length > 0 && (
        <section className="border-t bg-muted py-20 lg:py-28">
          <div className="shell">
            <h2 className="display display-md" data-reveal>
              Outras unidades em {stateName}
            </h2>
            <ul className="mt-10 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3" data-reveal style={stagger(1)}>
              {others.map((other) => (
                <li key={other.url_page}>
                  <Link
                    className="group flex items-center justify-between gap-4 border-b py-5 transition-colors hover:border-primary"
                    to={`/unidades/${other.url_page}`}
                  >
                    <span>
                      <span className="block font-semibold transition-colors group-hover:text-brand">{other.name}</span>
                      <span className="text-sm text-subtle">{other.cidade}</span>
                    </span>
                    <ArrowRight
                      size={18}
                      className="shrink-0 transition-transform duration-500 group-hover:translate-x-1"
                      aria-hidden
                    />
                  </Link>
                </li>
              ))}
            </ul>
            <Link className="link-arrow mt-10" to={`/unidades?uf=${unit.estado}`}>
              Ver todas em {stateName} <ArrowRight size={18} aria-hidden />
            </Link>
          </div>
        </section>
      )}

      <section className="relative isolate overflow-hidden bg-night text-foreground">
        <img
          src="/images/deadlift-dark-1600.webp"
          srcSet="/images/deadlift-dark-640.webp 640w, /images/deadlift-dark-1024.webp 1024w, /images/deadlift-dark-1600.webp 1600w, /images/deadlift-dark-2400.webp 2400w"
          sizes="100vw"
          width="2400"
          height="1600"
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 -z-10 size-full object-cover object-[50%_60%] opacity-80"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-night via-night/70 to-transparent" />
        <div className="shell py-28 lg:py-40" data-reveal>
          <h2 className="display display-lg max-w-[16ch]">Quer conhecer outra unidade?</h2>
          <p className="lede mt-6">A My Box está em dezenas de cidades. Encontre a mais perto de você.</p>
          <Link className="btn mt-10" to="/unidades">
            Encontrar unidade
            <ArrowUpRight size={18} className="btn-icon" aria-hidden />
          </Link>
        </div>
      </section>

      <AgendamentoModal unit={unit} open={agendamentoOpen} onClose={() => setAgendamentoOpen(false)} />
    </SiteLayout>
  )
}

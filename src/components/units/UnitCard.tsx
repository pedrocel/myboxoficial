import { Link } from 'react-router-dom'
import { ArrowRight, MapPin } from 'lucide-react'
import type { Unit } from '../../types/unit'
import { getStreetAddress, getWhatsAppUrl } from '../../lib/units'
import { SocialIcon } from '../site/SocialIcon'

export function UnitCard({ unit }: { unit: Unit }) {
  const whatsappUrl = getWhatsAppUrl(unit)
  const address = getStreetAddress(unit)

  return (
    <article className="group relative flex h-full flex-col rounded-media border bg-card p-6 transition-colors hover:border-primary">
      <p className="text-sm text-subtle">
        {unit.cidade} - {unit.estado}
      </p>
      <h3 className="mt-1 text-xl font-semibold tracking-tight">
        <Link className="after:absolute after:inset-0" to={`/unidades/${unit.url_page}`}>
          {unit.name}
        </Link>
      </h3>
      {address && (
        <p className="mt-3 flex gap-2 text-muted-foreground">
          <MapPin size={18} className="mt-0.5 shrink-0 text-brand" aria-hidden />
          <span>{address}</span>
        </p>
      )}
      <div className="mt-auto flex items-center justify-between gap-3 pt-6">
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors group-hover:text-brand">
          Ver unidade <ArrowRight size={16} aria-hidden />
        </span>
        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener"
            className="relative z-10 inline-flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform hover:scale-105"
            aria-label={`WhatsApp da ${unit.name}`}
          >
            <SocialIcon name="whatsapp" size={20} />
          </a>
        )}
      </div>
    </article>
  )
}

import { useState, useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { UnitHero } from '../components/units/UnitHero'
import { UnitLocation } from '../components/units/UnitLocation'
import { UnitContactCard } from '../components/units/UnitContactCard'
import { AgendamentoModal } from '../components/units/AgendamentoModal'
import { getUnitBySlug } from '../lib/units'
import { useAOS } from '../hooks/useAOS'

export function UnitDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const unit = slug ? getUnitBySlug(slug) : undefined
  const [agendamentoOpen, setAgendamentoOpen] = useState(false)

  useAOS()

  useEffect(() => {
    if (unit) {
      document.title = `${unit.name} - My Box`
    }
  }, [unit])

  if (!unit) {
    return <Navigate to="/unidades" replace />
  }

  return (
    <div className="bg-background font-sans min-h-screen flex flex-col text-foreground">
      <Header />
      <UnitHero unit={unit} onOpenAgendamento={() => setAgendamentoOpen(true)} />

      <section className="py-16 flex-1">
        <div className="container mx-auto px-4 max-w-4xl">
          <UnitLocation unit={unit} />
          <UnitContactCard unit={unit} onOpenAgendamento={() => setAgendamentoOpen(true)} />
        </div>
      </section>

      <Footer />

      <AgendamentoModal unit={unit} open={agendamentoOpen} onClose={() => setAgendamentoOpen(false)} />

      <div className="container mx-auto px-4 pb-8 text-center">
        <Link to="/unidades" className="text-mygreen hover:underline font-medium">
          <i className="fas fa-arrow-left mr-2" /> Voltar para todas as unidades
        </Link>
      </div>
    </div>
  )
}

import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { HeroSection } from '../components/home/HeroSection'
import { AboutSection } from '../components/home/AboutSection'
import { ConceptSection } from '../components/home/ConceptSection'
import { ModalitiesSection } from '../components/home/ModalitiesSection'
import { FoundersSection } from '../components/home/FoundersSection'
import { UnitsCTASection } from '../components/home/UnitsCTASection'
import { InvestSection } from '../components/home/InvestSection'
import { useAOS, useSmoothScroll } from '../hooks/useAOS'

export function HomePage() {
  useAOS()
  useSmoothScroll()

  return (
    <div className="bg-background font-sans text-foreground">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <ConceptSection />
        <ModalitiesSection />
        <FoundersSection />
        <UnitsCTASection />
        <InvestSection />
      </main>
      <Footer />
    </div>
  )
}

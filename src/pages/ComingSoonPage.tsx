import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { SiteLayout } from '../components/site/SiteLayout'

export function ComingSoonPage({ title, description }: { title: string; description: string }) {
  return (
    <SiteLayout solidHeader>
      <section className="pt-16 pb-24 lg:pt-24 lg:pb-36">
        <div className="shell">
          <h1 className="display display-xl max-w-[14ch]">{title}</h1>
          <p className="lede mt-6">{description}</p>
          <Link to="/" className="btn mt-10">
            Voltar para a página inicial
            <ArrowUpRight size={18} className="btn-icon" aria-hidden />
          </Link>
        </div>
      </section>
    </SiteLayout>
  )
}

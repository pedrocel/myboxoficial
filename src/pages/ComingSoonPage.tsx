import { Link } from 'react-router-dom'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'

export function ComingSoonPage({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-background font-sans min-h-screen flex flex-col text-foreground">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-lg">
          <h1 className="text-4xl font-bold text-foreground mb-4">{title}</h1>
          <p className="text-muted-foreground mb-8">{description}</p>
          <Link
            to="/"
            className="bg-mygreen hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full transition"
          >
            Voltar para a Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}

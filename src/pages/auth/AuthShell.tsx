import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { ThemeToggle } from '../../components/panel/ThemeToggle'

/** Mesma moldura da tela de login (foto a esquerda, cartao a direita) para as telas de senha. */
export function AuthShell({ title, description, children }: { title: string; description: ReactNode; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-card">
        <img src="/img/fachada.jpg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-background" />
        <div className="relative z-10 p-12 flex flex-col justify-end">
          <h2 className="text-4xl font-bold text-foreground mb-4">Painel My Box</h2>
          <p className="text-muted-foreground text-lg max-w-md">
            Gerencie sua unidade, acompanhe agendamentos e conecte-se com seus alunos em um só lugar.
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-between gap-4 mb-8">
            <Link to="/entrar" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition">
              <ArrowLeft className="h-4 w-4" />
              Voltar ao login
            </Link>
            <ThemeToggle />
          </div>
          <Card className="shadow-xl border-border/60">
            <CardHeader>
              <div className="w-14 h-14 rounded-2xl gradient-green flex items-center justify-center text-white font-bold text-2xl mb-2">M</div>
              <CardTitle className="text-2xl">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>{children}</CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

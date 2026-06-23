import { useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useAuth, roleHomePath } from '../../contexts/AuthContext'
import { ThemeToggle } from '../../components/theme/ThemeToggle'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'

export function LoginPage() {
  const { signIn, user, profile, loading, configured } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (!loading && user && profile) {
    return <Navigate to={roleHomePath(profile.role)} replace />
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const result = await signIn(email, password)
    if (result.error) setError(result.error)
    setSubmitting(false)
  }

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

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-8 transition">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao site
          </Link>

          <Card className="shadow-xl border-border/60">
            <CardHeader>
              <div className="w-14 h-14 rounded-2xl gradient-green flex items-center justify-center text-white font-bold text-2xl mb-2">
                M
              </div>
              <CardTitle className="text-2xl">Entrar</CardTitle>
              <CardDescription>Acesse o painel da sua unidade ou perfil de aluno</CardDescription>
            </CardHeader>
            <CardContent>
              {!configured && (
                <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-sm text-amber-700 dark:text-amber-400">
                  <p className="font-semibold mb-1">Supabase não detectado no build</p>
                  <p className="text-xs opacity-90">
                    Configure <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> no .env local ou na Cloudflare Pages.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="seu@email.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
                </div>

                {error && <p className="text-destructive text-sm bg-destructive/10 px-4 py-3 rounded-xl">{error}</p>}

                <Button type="submit" disabled={submitting || !configured} className="w-full" size="lg">
                  {submitting ? <Loader2 className="animate-spin" /> : 'Acessar painel'}
                </Button>
              </form>

              <p className="text-center text-xs text-muted-foreground mt-6">
                Agendou uma aula? Verifique seu e-mail para o link de acesso.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

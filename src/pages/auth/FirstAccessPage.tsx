import { useState, type FormEvent } from 'react'
import { Loader2, MailCheck } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { api, ApiError } from '../../lib/api'
import { AuthShell } from './AuthShell'

/** Primeiro acesso do dono (ou esqueci a senha): manda o link para criar a senha. */
export function FirstAccessPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await api.post('/auth/password/request', { email, app: 'painel' })
      setSent(true)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível enviar agora.')
    } finally {
      setSubmitting(false)
    }
  }

  if (sent) {
    return (
      <AuthShell title="Confira seu e-mail" description="Se esse e-mail estiver cadastrado, o link já está a caminho.">
        <div className="flex flex-col items-center text-center gap-4 py-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <MailCheck className="h-8 w-8" />
          </div>
          <p className="text-muted-foreground">
            Enviamos para <strong className="text-foreground">{email}</strong> um link para criar sua senha. Ele vale por 24
            horas. Não chegou? Olhe a caixa de spam ou promoções.
          </p>
          <Button variant="outline" onClick={() => setSent(false)}>
            Usar outro e-mail
          </Button>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="Primeiro acesso"
      description="Use o e-mail cadastrado da sua unidade. Vamos te enviar um link para criar a senha. Também serve se você esqueceu a senha."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="seu@email.com" autoFocus />
        </div>
        {error && <p className="text-destructive text-sm bg-destructive/10 px-4 py-3 rounded-xl">{error}</p>}
        <Button type="submit" disabled={submitting} className="w-full" size="lg">
          {submitting ? <Loader2 className="animate-spin" /> : 'Enviar link'}
        </Button>
      </form>
    </AuthShell>
  )
}

import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { api, ApiError } from '../../lib/api'
import { roleHomePath, useAuth } from '../../contexts/AuthContext'
import type { Profile } from '../../types/database'
import { AuthShell } from './AuthShell'

/** Link do e-mail: cria (ou redefine) a senha e ja entra no painel. */
export function CreatePasswordPage() {
  const [params] = useSearchParams()
  const token = params.get('token') ?? ''
  const navigate = useNavigate()
  const { refreshProfile } = useAuth()
  const [info, setInfo] = useState<{ email: string; name: string | null; first_access: boolean } | null>(null)
  const [invalid, setInvalid] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    api
      .get<{ email: string; name: string | null; first_access: boolean }>(`/auth/password/check?token=${encodeURIComponent(token)}`)
      .then(setInfo)
      .catch(() => setInvalid(true))
  }, [token])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (password !== confirm) return setError('As senhas não conferem.')
    setSubmitting(true)
    setError(null)
    try {
      const { profile } = await api.post<{ profile: Profile }>('/auth/password/set', { token, password })
      await refreshProfile()
      navigate(roleHomePath(profile.role), { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível salvar agora.')
      setSubmitting(false)
    }
  }

  if (invalid) {
    return (
      <AuthShell title="Link expirado" description="Este link já foi usado ou passou do prazo de 24 horas.">
        <Button asChild className="w-full" size="lg">
          <Link to="/primeiro-acesso">Pedir um novo link</Link>
        </Button>
      </AuthShell>
    )
  }

  if (!info) {
    return (
      <AuthShell title="Criar senha" description="Conferindo seu link...">
        <div className="flex justify-center py-6">
          <Loader2 className="animate-spin text-primary" />
        </div>
      </AuthShell>
    )
  }

  const first = info.name?.split(' ')[0]
  return (
    <AuthShell
      title={info.first_access ? `Bem-vindo${first ? `, ${first}` : ''}!` : 'Nova senha'}
      description={
        <>
          {info.first_access ? 'Crie a senha do seu acesso' : 'Crie uma nova senha para'} <strong>{info.email}</strong>.
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">Senha (mínimo 8 caracteres)</Label>
          <Input id="password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} autoFocus />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">Repita a senha</Label>
          <Input id="confirm" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={8} />
        </div>
        {error && <p className="text-destructive text-sm bg-destructive/10 px-4 py-3 rounded-xl">{error}</p>}
        <Button type="submit" disabled={submitting} className="w-full" size="lg">
          {submitting ? <Loader2 className="animate-spin" /> : 'Salvar senha e entrar'}
        </Button>
      </form>
    </AuthShell>
  )
}

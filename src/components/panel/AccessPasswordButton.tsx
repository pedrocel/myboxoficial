import { useState } from 'react'
import { KeyRound } from 'lucide-react'
import { api } from '../../lib/api'
import { Button } from '../ui/button'

type Props =
  | { mode: 'reset'; profileId: string; onDone?: () => void }
  | { mode: 'create-owner'; unitSlug: string; email: string; fullName?: string | null; onDone?: () => void }

/**
 * Senhas agora sao aleatorias (nada de "{unidade} 2026"): o admin gera uma e repassa ao dono.
 * A senha aparece uma vez so; depois so gerando outra.
 */
export function AccessPasswordButton(props: Props) {
  const [password, setPassword] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const run = async () => {
    const aviso =
      props.mode === 'reset'
        ? 'Gerar uma senha nova? A senha atual deixa de funcionar e a pessoa sai do painel.'
        : `Criar o acesso do dono com o e-mail ${props.email}?`
    if (!window.confirm(aviso)) return
    setLoading(true)
    setError(null)
    try {
      const result =
        props.mode === 'reset'
          ? await api.post<{ password: string }>(`/profiles/${props.profileId}/reset-password`)
          : await api.post<{ password: string }>('/profiles', {
              email: props.email,
              full_name: props.fullName,
              role: 'owner',
              unit_slug: props.unitSlug,
            })
      setPassword(result.password)
      props.onDone?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível gerar a senha.')
    } finally {
      setLoading(false)
    }
  }

  if (password) {
    return (
      <div className="rounded-xl border border-primary/30 bg-primary/10 p-3 text-sm">
        <p className="font-semibold text-foreground">Senha gerada (anote, ela não aparece de novo):</p>
        <code className="mt-1 block select-all rounded bg-background px-2 py-1 font-mono text-foreground">{password}</code>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <Button type="button" variant="outline" size="sm" onClick={run} disabled={loading}>
        <KeyRound className="h-4 w-4" />
        {props.mode === 'reset' ? 'Gerar nova senha' : 'Criar acesso do dono'}
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

import { useEffect, useState, type FormEvent } from 'react'
import { Mail, Plus, Trash2 } from 'lucide-react'
import { PanelLayout } from '../../../components/panel/PanelLayout'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Badge } from '../../../components/ui/badge'
import { ADMIN_NAV } from '../../../lib/panel-nav'
import { api, ApiError } from '../../../lib/api'
import type { LeadEmail } from '../../../types/database'

const EMAIL_VALIDO = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

const mensagemDeErro = (error: unknown) =>
  error instanceof ApiError && error.code === 'email_ja_cadastrado'
    ? 'Esse e-mail já está na lista.'
    : error instanceof Error
      ? error.message
      : 'Erro inesperado'

export function AdminSettingsPage() {
  const [emails, setEmails] = useState<LeadEmail[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [novoEmail, setNovoEmail] = useState('')
  const [novoNome, setNovoNome] = useState('')
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    api
      .get<LeadEmail[]>('/lead-emails')
      .then(setEmails)
      .catch((error) => setErro(mensagemDeErro(error)))
      .finally(() => setCarregando(false))
  }, [])

  const adicionar = async (e: FormEvent) => {
    e.preventDefault()
    const email = novoEmail.trim().toLowerCase()
    if (!EMAIL_VALIDO.test(email)) {
      setErro('E-mail inválido.')
      return
    }

    setSalvando(true)
    setErro(null)
    try {
      const novo = await api.post<LeadEmail>('/lead-emails', { email, nome: novoNome.trim() || null })
      setEmails((atual) => [...atual, novo])
    } catch (error) {
      setErro(mensagemDeErro(error))
      return
    } finally {
      setSalvando(false)
    }
    setNovoEmail('')
    setNovoNome('')
  }

  const alternarAtivo = async (item: LeadEmail) => {
    setErro(null)
    try {
      await api.patch(`/lead-emails/${item.id}`, { ativo: !item.ativo })
    } catch (error) {
      setErro(mensagemDeErro(error))
      return
    }
    setEmails((atual) => atual.map((e) => (e.id === item.id ? { ...e, ativo: !e.ativo } : e)))
  }

  const remover = async (item: LeadEmail) => {
    if (!window.confirm(`Remover ${item.email} da lista de avisos?`)) return
    setErro(null)
    try {
      await api.delete(`/lead-emails/${item.id}`)
    } catch (error) {
      setErro(mensagemDeErro(error))
      return
    }
    setEmails((atual) => atual.filter((e) => e.id !== item.id))
  }

  const ativos = emails.filter((e) => e.ativo).length

  return (
    <PanelLayout title="Configurações" subtitle="Quem recebe os avisos de lead" nav={ADMIN_NAV}>
      <div className="max-w-3xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Mail className="h-4 w-4 text-primary" />
              E-mails que recebem os leads de franquia
            </CardTitle>
            <CardDescription>
              Cada lead do site e da landing dispara um aviso para os endereços ativos desta lista.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {erro && (
              <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-xl">{erro}</p>
            )}

            {carregando ? (
              <div className="flex justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : emails.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhum e-mail cadastrado. Enquanto a lista estiver vazia, o aviso vai para os endereços padrão do
                sistema.
              </p>
            ) : (
              <ul className="divide-y divide-border rounded-xl border border-border">
                {emails.map((item) => (
                  <li key={item.id} className="flex flex-wrap items-center gap-3 p-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground truncate">{item.email}</p>
                      {item.nome && <p className="text-xs text-muted-foreground truncate">{item.nome}</p>}
                    </div>
                    <Badge variant={item.ativo ? 'default' : 'secondary'}>{item.ativo ? 'Recebendo' : 'Pausado'}</Badge>
                    <Button type="button" variant="outline" size="sm" onClick={() => alternarAtivo(item)}>
                      {item.ativo ? 'Pausar' : 'Reativar'}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remover(item)}
                      aria-label={`Remover ${item.email}`}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}

            <form onSubmit={adicionar} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
              <div className="space-y-2">
                <Label htmlFor="novo-email">Novo e-mail</Label>
                <Input
                  id="novo-email"
                  type="email"
                  value={novoEmail}
                  onChange={(e) => setNovoEmail(e.target.value)}
                  placeholder="pessoa@myboxoficial.com.br"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="novo-nome">Nome (opcional)</Label>
                <Input
                  id="novo-nome"
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  placeholder="Comercial"
                />
              </div>
              <Button type="submit" disabled={salvando}>
                <Plus className="h-4 w-4" />
                {salvando ? 'Salvando...' : 'Adicionar'}
              </Button>
            </form>

            <p className="text-xs text-muted-foreground">
              {ativos > 0
                ? `${ativos} endereço${ativos > 1 ? 's' : ''} recebendo os avisos.`
                : 'Nenhum endereço ativo: o aviso vai para os endereços padrão do sistema.'}
            </p>
          </CardContent>
        </Card>
      </div>
    </PanelLayout>
  )
}

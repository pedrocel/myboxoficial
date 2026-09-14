import { useEffect, useMemo, useState } from 'react'
import { Search, MessageCircle, Mail } from 'lucide-react'
import { PanelLayout } from '../../../components/panel/PanelLayout'
import { Input } from '../../../components/ui/input'
import { Card, CardContent } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import { StatCard } from '../../../components/panel/StatCard'
import { Handshake, Clock, CheckCircle2 } from 'lucide-react'
import { ADMIN_NAV } from '../../../lib/panel-nav'
import { supabase } from '../../../lib/supabase'
import type { FranchiseLead, FranchiseLeadStatus } from '../../../types/database'

const STATUS_LABELS: Record<FranchiseLeadStatus, string> = {
  novo: 'Novo',
  contatado: 'Contatado',
  qualificado: 'Qualificado',
  negociacao: 'Negociação',
  fechado: 'Fechado',
  perdido: 'Perdido',
}

function formatarData(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// "pagina" guarda a URL completa de onde o lead veio (ex:
// https://franquia.myboxoficial.com.br/); aqui reduzimos pro dominio, que é o
// que interessa pra saber de qual site/rota o lead chegou.
function origemLegivel(lead: FranchiseLead) {
  if (lead.pagina) {
    try {
      return new URL(lead.pagina).hostname
    } catch {
      return lead.pagina
    }
  }
  return lead.origem ?? '—'
}

export function AdminFranchiseLeadsPage() {
  const [leads, setLeads] = useState<FranchiseLead[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const load = () => {
    if (!supabase) return
    setLoading(true)
    supabase
      .from('leads_mybox')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setLeads(data as FranchiseLead[])
        setLoading(false)
      })
  }

  useEffect(load, [])

  const handleStatus = async (id: string, status: FranchiseLeadStatus) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)))
    if (!supabase) return
    await supabase.from('leads_mybox').update({ status }).eq('id', id)
  }

  const filtered = useMemo(
    () =>
      leads.filter((l) => {
        const q = search.toLowerCase()
        const matchQ =
          !q ||
          l.nome.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          l.cidade.toLowerCase().includes(q) ||
          l.telefone.includes(q)
        const matchStatus = !statusFilter || l.status === statusFilter
        return matchQ && matchStatus
      }),
    [leads, search, statusFilter],
  )

  const stats = useMemo(() => {
    const novos = leads.filter((l) => l.status === 'novo').length
    const emAndamento = leads.filter((l) => ['contatado', 'qualificado', 'negociacao'].includes(l.status)).length
    const fechados = leads.filter((l) => l.status === 'fechado').length
    return { total: leads.length, novos, emAndamento, fechados }
  }, [leads])

  return (
    <PanelLayout title="Leads Franquia" subtitle="Interessados em abrir uma unidade, de todas as landings" nav={ADMIN_NAV}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Handshake} label="Total de leads" value={stats.total} />
        <StatCard icon={Clock} label="Novos" value={stats.novos} variant="blue" />
        <StatCard icon={Handshake} label="Em andamento" value={stats.emAndamento} variant="gold" />
        <StatCard icon={CheckCircle2} label="Fechados" value={stats.fechados} />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar nome, e-mail, cidade ou telefone..."
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 h-10 bg-background border border-input rounded-xl text-sm font-medium text-foreground"
        >
          <option value="">Todos os status</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Carregando leads…</p>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center text-muted-foreground">Nenhum lead encontrado.</CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-muted-foreground">
                <th className="px-4 py-3 font-semibold whitespace-nowrap">Recebido em</th>
                <th className="px-4 py-3 font-semibold">Nome</th>
                <th className="px-4 py-3 font-semibold">Contato</th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">Cidade/UF</th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">Investimento</th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">Origem</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr key={lead.id} className="border-b border-border last:border-0 hover:bg-muted/30 align-top">
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{formatarData(lead.created_at)}</td>
                  <td className="px-4 py-3 font-medium text-foreground">
                    {lead.nome}
                    {lead.profissao && <p className="text-xs text-muted-foreground font-normal">{lead.profissao}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`https://wa.me/55${lead.telefone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-primary hover:underline"
                    >
                      <MessageCircle className="h-3.5 w-3.5" /> {lead.telefone}
                    </a>
                    <a
                      href={`mailto:${lead.email}`}
                      className="flex items-center gap-1.5 text-muted-foreground hover:underline mt-0.5"
                    >
                      <Mail className="h-3.5 w-3.5" /> {lead.email}
                    </a>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {lead.cidade}
                    {lead.estado ? ` - ${lead.estado}` : ''}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Badge variant="outline">{lead.investimento}</Badge>
                    {lead.prazo && <p className="text-xs text-muted-foreground mt-1">{lead.prazo}</p>}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{origemLegivel(lead)}</td>
                  <td className="px-4 py-3">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatus(lead.id, e.target.value as FranchiseLeadStatus)}
                      className="px-2.5 py-1.5 bg-background border border-input rounded-lg text-xs font-semibold"
                    >
                      {Object.entries(STATUS_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PanelLayout>
  )
}

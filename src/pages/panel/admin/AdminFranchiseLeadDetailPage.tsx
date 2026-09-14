import { useEffect, useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { ArrowLeft, MessageCircle, Mail } from 'lucide-react'
import { PanelLayout } from '../../../components/panel/PanelLayout'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
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

function Campo({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null
  return (
    <div>
      <p className="text-[10px] text-muted-foreground uppercase font-semibold">{label}</p>
      <p className="font-medium text-foreground">{value}</p>
    </div>
  )
}

function formatarData(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function AdminFranchiseLeadDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [lead, setLead] = useState<FranchiseLead | null>(null)
  const [loading, setLoading] = useState(true)
  const [savingStatus, setSavingStatus] = useState(false)

  useEffect(() => {
    if (!supabase || !id) return
    supabase
      .from('leads_mybox')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        if (data) setLead(data as FranchiseLead)
        setLoading(false)
      })
  }, [id])

  const handleStatus = async (status: FranchiseLeadStatus) => {
    if (!supabase || !lead) return
    setSavingStatus(true)
    const { error } = await supabase.from('leads_mybox').update({ status }).eq('id', lead.id)
    if (!error) setLead({ ...lead, status })
    setSavingStatus(false)
  }

  if (!id) return <Navigate to="/painel/admin/leads-franquia" replace />

  if (loading) {
    return (
      <PanelLayout title="Lead" nav={ADMIN_NAV}>
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </PanelLayout>
    )
  }

  if (!lead) {
    return (
      <PanelLayout title="Lead não encontrado" nav={ADMIN_NAV}>
        <Link to="/painel/admin/leads-franquia" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-6">
          <ArrowLeft className="h-4 w-4" /> Leads Franquia
        </Link>
        <Card>
          <CardContent className="p-10 text-center text-muted-foreground">Esse lead não existe mais.</CardContent>
        </Card>
      </PanelLayout>
    )
  }

  const origemUrl = (() => {
    try {
      return lead.pagina ? new URL(lead.pagina).hostname : null
    } catch {
      return lead.pagina
    }
  })()

  return (
    <PanelLayout title={lead.nome} subtitle={lead.email} nav={ADMIN_NAV}>
      <Link to="/painel/admin/leads-franquia" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-6">
        <ArrowLeft className="h-4 w-4" /> Leads Franquia
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 h-fit">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center pb-6 border-b border-border">
              <div className="w-20 h-20 rounded-2xl gradient-green flex items-center justify-center text-white font-bold text-3xl mb-4 shadow-lg">
                {lead.nome[0]?.toUpperCase()}
              </div>
              <h2 className="text-xl font-bold text-foreground">{lead.nome}</h2>
              {lead.profissao && <p className="text-muted-foreground text-sm">{lead.profissao}</p>}

              <div className="flex flex-col gap-1.5 mt-4 w-full">
                <a
                  href={`https://wa.me/55${lead.telefone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  <MessageCircle className="h-4 w-4" /> {lead.telefone}
                </a>
                <a
                  href={`mailto:${lead.email}`}
                  className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:underline"
                >
                  <Mail className="h-4 w-4" /> {lead.email}
                </a>
              </div>
            </div>

            <div className="pt-6 space-y-4 text-sm">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-semibold mb-1.5">Status</p>
                <select
                  value={lead.status}
                  disabled={savingStatus}
                  onChange={(e) => handleStatus(e.target.value as FranchiseLeadStatus)}
                  className="w-full px-3 py-2 bg-background border border-input rounded-xl text-sm font-semibold text-foreground"
                >
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <Campo label="Cidade / UF" value={lead.estado ? `${lead.cidade} - ${lead.estado}` : lead.cidade} />
              <Campo label="Já possui empresa" value={lead.possui_empresa} />
              <Campo label="Instagram" value={lead.instagram} />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-semibold">Recebido em</p>
                <p className="font-medium text-foreground">{formatarData(lead.created_at)}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-semibold">ID</p>
                <p className="font-mono text-xs text-muted-foreground break-all">{lead.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Interesse na franquia</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-semibold">Investimento disponível</p>
                <Badge variant="outline" className="mt-1">{lead.investimento}</Badge>
              </div>
              <Campo label="Prazo para abrir" value={lead.prazo} />
            </CardContent>
          </Card>

          {lead.mensagem && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Mensagem</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground whitespace-pre-wrap">{lead.mensagem}</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">De onde veio</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Campo label="Origem" value={lead.origem} />
              <Campo label="Site / página" value={origemUrl} />
              <Campo label="UTM Source" value={lead.utm_source} />
              <Campo label="UTM Medium" value={lead.utm_medium} />
              <Campo label="UTM Campaign" value={lead.utm_campaign} />
              <Campo label="UTM Term" value={lead.utm_term} />
              <Campo label="UTM Content" value={lead.utm_content} />
              <Campo label="Google Click ID" value={lead.gclid} />
              <Campo label="Referrer" value={lead.referrer} />
              {!lead.origem && !lead.pagina && !lead.utm_source && !lead.referrer && (
                <p className="text-sm text-muted-foreground col-span-2">Sem dados de origem para esse lead.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PanelLayout>
  )
}

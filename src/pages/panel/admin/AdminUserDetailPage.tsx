import { CalendarCheck, Clock, ArrowLeft, ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { PanelLayout } from '../../../components/panel/PanelLayout'
import { StatCard } from '../../../components/panel/StatCard'
import { BookingsTable } from '../../../components/panel/BookingsTable'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import { ADMIN_NAV } from '../../../lib/panel-nav'
import { supabase } from '../../../lib/supabase'
import { ownerDefaultPassword } from '../../../lib/unit-settings'
import type { Booking, DbUnit, Profile } from '../../../types/database'

const ROLE_LABELS = { admin: 'Administrador', owner: 'Dono da unidade', student: 'Aluno' }

export function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [unit, setUnit] = useState<DbUnit | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])

  useEffect(() => {
    if (!supabase || !id) return
    ;(async () => {
      const { data: p } = await supabase.from('profiles').select('*').eq('id', id).single()
      if (!p) return
      const prof = p as Profile
      setProfile(prof)
      if (prof.unit_slug) {
        const { data: u } = await supabase.from('units').select('*').eq('slug', prof.unit_slug).single()
        if (u) setUnit(u as DbUnit)
      }
      const { data: b } = await supabase
        .from('bookings')
        .select('*')
        .or(`student_id.eq.${id},student_email.eq.${prof.email}`)
        .order('created_at', { ascending: false })
      if (b) setBookings(b as Booking[])
    })()
  }, [id])

  if (!id) return <Navigate to="/painel/admin/usuarios" replace />

  if (!profile) {
    return (
      <PanelLayout title="Usuário" nav={ADMIN_NAV}>
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </PanelLayout>
    )
  }

  return (
    <PanelLayout title={profile.full_name ?? profile.email} subtitle={ROLE_LABELS[profile.role]} nav={ADMIN_NAV}>
      <Link to="/painel/admin/usuarios" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-6">
        <ArrowLeft className="h-4 w-4" /> Usuários
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center pb-6 border-b border-border">
              <div className="w-20 h-20 rounded-2xl gradient-green flex items-center justify-center text-white font-bold text-3xl mb-4 shadow-lg">
                {(profile.full_name ?? profile.email)[0]?.toUpperCase()}
              </div>
              <h2 className="text-xl font-bold text-foreground">{profile.full_name ?? '—'}</h2>
              <p className="text-muted-foreground text-sm">{profile.email}</p>
              <Badge variant="success" className="mt-2">{ROLE_LABELS[profile.role]}</Badge>
            </div>
            <div className="pt-6 space-y-4 text-sm">
              {profile.phone && (
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">Telefone</p>
                  <p className="font-medium text-foreground">{profile.phone}</p>
                </div>
              )}
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-semibold">Cadastro</p>
                <p className="font-medium text-foreground">{new Date(profile.created_at).toLocaleDateString('pt-BR')}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-semibold">ID</p>
                <p className="font-mono text-xs text-muted-foreground break-all">{profile.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          {profile.role === 'owner' && unit && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Unidade vinculada</CardTitle>
              </CardHeader>
              <CardContent>
                <Link to={`/painel/admin/unidades/${unit.slug}`} className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl hover:bg-accent transition group">
                  <div className="w-12 h-12 rounded-xl gradient-green flex items-center justify-center text-white font-bold">{unit.name[0]}</div>
                  <div className="flex-1">
                    <p className="font-bold text-foreground group-hover:text-primary">{unit.name}</p>
                    <p className="text-sm text-muted-foreground">{unit.cidade} — {unit.estado}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-primary" />
                </Link>
                <p className="text-xs text-muted-foreground mt-3">
                  Senha padrão owner: <code className="bg-muted px-1 rounded">{ownerDefaultPassword(unit.name)}</code>
                </p>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-2 gap-4">
            <StatCard icon={CalendarCheck} label="Agendamentos" value={bookings.length} />
            <StatCard icon={Clock} label="Pendentes" value={bookings.filter((b) => b.status === 'pending').length} variant="gold" />
          </div>

          {profile.role === 'student' && (
            <Card>
              <CardHeader>
                <CardTitle>Agendamentos do aluno</CardTitle>
              </CardHeader>
              <CardContent>
                <BookingsTable bookings={bookings} showUnit />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PanelLayout>
  )
}

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { PanelLayout } from '../../../components/panel/PanelLayout'
import { Input } from '../../../components/ui/input'
import { Card } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import { ADMIN_NAV } from '../../../lib/panel-nav'
import { supabase } from '../../../lib/supabase'
import type { Profile } from '../../../types/database'

const ROLE_LABELS = { admin: 'Administrador', owner: 'Dono', student: 'Aluno' }

export function AdminUsersPage() {
  const [users, setUsers] = useState<Profile[]>([])
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')

  useEffect(() => {
    if (!supabase) return
    supabase.from('profiles').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setUsers(data as Profile[])
    })
  }, [])

  const filtered = users.filter((u) => {
    const q = search.toLowerCase()
    const matchQ = !q || u.full_name?.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    const matchR = !roleFilter || u.role === roleFilter
    return matchQ && matchR
  })

  return (
    <PanelLayout title="Usuários" subtitle={`${users.length} contas no sistema`} nav={ADMIN_NAV}>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar nome ou e-mail..."
            className="pl-10"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 h-10 bg-background border border-input rounded-xl text-sm font-medium text-foreground"
        >
          <option value="">Todos os perfis</option>
          <option value="admin">Administradores</option>
          <option value="owner">Donos</option>
          <option value="student">Alunos</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((u) => (
          <Link key={u.id} to={`/painel/admin/usuarios/${u.id}`}>
            <Card className="p-5 hover:border-primary/30 hover:shadow-lg transition group flex items-start gap-4 h-full">
              <div className="w-14 h-14 rounded-2xl gradient-green flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-md">
                {(u.full_name ?? u.email)[0]?.toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-foreground truncate group-hover:text-primary transition">{u.full_name ?? '—'}</p>
                <p className="text-sm text-muted-foreground truncate">{u.email}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="secondary">{ROLE_LABELS[u.role]}</Badge>
                  {u.unit_slug && <Badge variant="outline">{u.unit_slug}</Badge>}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </PanelLayout>
  )
}

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PanelLayout } from '../../../components/panel/PanelLayout'
import { ADMIN_NAV } from '../../../lib/panel-nav'
import { supabase } from '../../../lib/supabase'
import type { Profile } from '../../../types/database'

const ROLE_LABELS = { admin: 'Administrador', owner: 'Dono', student: 'Aluno' }
const ROLE_COLORS = {
  admin: 'bg-purple-100 text-purple-700',
  owner: 'bg-mygreen/20 text-mygreen',
  student: 'bg-blue-100 text-blue-700',
}

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
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar nome ou e-mail..."
            className="w-full pl-11 pr-4 py-3 bg-white border rounded-xl shadow-sm focus:ring-2 focus:ring-mygreen"
          />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="px-4 py-3 bg-white border rounded-xl text-sm font-semibold">
          <option value="">Todos os perfis</option>
          <option value="admin">Administradores</option>
          <option value="owner">Donos</option>
          <option value="student">Alunos</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((u) => (
          <Link
            key={u.id}
            to={`/painel/admin/usuarios/${u.id}`}
            className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-lg hover:border-mygreen/30 transition group flex items-start gap-4"
          >
            <div className="w-14 h-14 rounded-2xl gradient-green flex items-center justify-center text-white font-black text-xl shrink-0 shadow-md">
              {(u.full_name ?? u.email)[0]?.toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-black text-mydark truncate group-hover:text-mygreen transition">{u.full_name ?? '—'}</p>
              <p className="text-sm text-gray-500 truncate">{u.email}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ROLE_COLORS[u.role]}`}>
                  {ROLE_LABELS[u.role]}
                </span>
                {u.unit_slug && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{u.unit_slug}</span>}
              </div>
            </div>
            <i className="fas fa-chevron-right text-gray-300 group-hover:text-mygreen mt-4" />
          </Link>
        ))}
      </div>
    </PanelLayout>
  )
}

import { useEffect, useState } from 'react'
import { PanelLayout } from '../../../components/panel/PanelLayout'
import { supabase } from '../../../lib/supabase'
import type { Profile } from '../../../types/database'

const ADMIN_NAV = [
  { to: '/painel/admin', label: 'Dashboard', icon: 'fa-chart-pie' },
  { to: '/painel/admin/unidades', label: 'Unidades', icon: 'fa-store' },
  { to: '/painel/admin/agendamentos', label: 'Agendamentos', icon: 'fa-calendar-check' },
  { to: '/painel/admin/usuarios', label: 'Usuários', icon: 'fa-users' },
]

const ROLE_LABELS = { admin: 'Administrador', owner: 'Dono da unidade', student: 'Aluno' }
const ROLE_COLORS = {
  admin: 'bg-purple-100 text-purple-700',
  owner: 'bg-mygreen/20 text-mygreen',
  student: 'bg-blue-100 text-blue-700',
}

export function AdminUsersPage() {
  const [users, setUsers] = useState<Profile[]>([])

  useEffect(() => {
    if (!supabase) return
    supabase.from('profiles').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setUsers(data as Profile[])
    })
  }, [])

  return (
    <PanelLayout title="Usuários" subtitle="Administradores, donos e alunos" nav={ADMIN_NAV}>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
              <th className="px-6 py-4">Nome</th>
              <th className="px-6 py-4">E-mail</th>
              <th className="px-6 py-4">Perfil</th>
              <th className="px-6 py-4">Unidade</th>
              <th className="px-6 py-4">Cadastro</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 font-bold text-mydark">{u.full_name ?? '—'}</td>
                <td className="px-6 py-4 text-gray-600">{u.email}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${ROLE_COLORS[u.role]}`}>
                    {ROLE_LABELS[u.role]}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 text-xs">{u.unit_slug ?? '—'}</td>
                <td className="px-6 py-4 text-gray-400 text-xs">
                  {new Date(u.created_at).toLocaleDateString('pt-BR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PanelLayout>
  )
}

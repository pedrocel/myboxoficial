import type { ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import type { UserRole } from '../../types/database'

export type NavItem = {
  to: string
  label: string
  icon: string
  group?: string
}

const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrador',
  owner: 'Dono da unidade',
  student: 'Aluno',
}

type Props = {
  title: string
  subtitle?: string
  nav: NavItem[]
  children: ReactNode
}

export function PanelLayout({ title, subtitle, nav, children }: Props) {
  const { profile, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const groups = nav.reduce<string[]>((acc, item) => {
    const g = item.group ?? 'Menu'
    if (!acc.includes(g)) acc.push(g)
    return acc
  }, [])

  const isActive = (to: string) =>
    location.pathname === to ||
    (to !== '/painel/admin' && to !== '/painel/unidade' && to !== '/painel/aluno' && location.pathname.startsWith(to + '/'))

  const handleSignOut = async () => {
    await signOut()
    navigate('/entrar')
  }

  return (
    <div className="min-h-screen bg-[#eef2eb] flex">
      <aside className="hidden lg:flex w-[280px] flex-col shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d0d] via-[#141414] to-[#1a2412]" />
        <div className="absolute top-0 right-0 w-40 h-40 bg-mygreen/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-0 w-32 h-32 bg-mygreen/5 rounded-full blur-2xl" />

        <div className="relative z-10 p-6 border-b border-white/5">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl gradient-green flex items-center justify-center font-black text-lg shadow-lg shadow-mygreen/30 group-hover:scale-105 transition">
              M
            </div>
            <div>
              <p className="font-black tracking-tight text-white">My Box</p>
              <p className="text-[10px] text-mygreen/80 uppercase tracking-[0.2em] font-bold">Painel</p>
            </div>
          </Link>
        </div>

        <nav className="relative z-10 flex-1 p-4 overflow-y-auto custom-scrollbar space-y-6">
          {groups.map((group) => (
            <div key={group}>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-3 mb-2">{group}</p>
              <div className="space-y-0.5">
                {nav.filter((n) => (n.group ?? 'Menu') === group).map((item) => {
                  const active = isActive(item.to)
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        active
                          ? 'bg-mygreen/20 text-white border border-mygreen/30 shadow-inner shadow-mygreen/10'
                          : 'text-white/55 hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <span
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          active ? 'bg-mygreen text-white' : 'bg-white/5 text-white/50'
                        }`}
                      >
                        <i className={`fas ${item.icon} text-xs`} />
                      </span>
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="relative z-10 p-4 border-t border-white/5">
          <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-green flex items-center justify-center text-white font-bold shadow-md">
                {(profile?.full_name ?? profile?.email ?? '?')[0]?.toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-white truncate">{profile?.full_name ?? 'Usuário'}</p>
                <span className="text-[9px] font-bold uppercase tracking-wider text-mygreen/90">
                  {profile ? ROLE_LABELS[profile.role] : ''}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="mt-3 w-full flex items-center justify-center gap-2 text-xs text-white/50 hover:text-white py-2 rounded-lg hover:bg-white/5 transition"
            >
              <i className="fas fa-sign-out-alt" />
              Sair da conta
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/80 px-4 sm:px-8 py-5 flex items-center justify-between gap-4 sticky top-0 z-20">
          <div>
            <h1 className="text-2xl font-black text-mydark tracking-tight">{title}</h1>
            {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-3">
            {profile?.unit_slug && (
              <Link
                to={`/unidades-preview/${profile.unit_slug}`}
                target="_blank"
                className="hidden sm:flex text-xs font-bold text-gray-500 hover:text-mygreen items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-50"
              >
                <i className="fas fa-external-link-alt" />
                Ver página
              </Link>
            )}
            <Link
              to="/"
              className="text-sm font-semibold text-mygreen hover:text-green-600 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-green-50 transition"
            >
              <i className="fas fa-globe text-xs" />
              Site
            </Link>
          </div>
        </header>

        <div className="lg:hidden bg-[#141414] px-4 py-3 overflow-x-auto scrollbar-hide border-b border-white/5">
          <div className="flex gap-2">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                  isActive(item.to) ? 'bg-mygreen text-white' : 'bg-white/10 text-white/70'
                }`}
              >
                <i className={`fas ${item.icon}`} />
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}

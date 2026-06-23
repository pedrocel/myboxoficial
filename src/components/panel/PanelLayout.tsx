import type { ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export type NavItem = {
  to: string
  label: string
  icon: string
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

  const handleSignOut = async () => {
    await signOut()
    navigate('/entrar')
  }

  return (
    <div className="min-h-screen bg-[#f4f6f4] flex">
      <aside className="hidden lg:flex w-72 flex-col bg-[#141414] text-white shrink-0">
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-green flex items-center justify-center font-black text-lg">
              M
            </div>
            <div>
              <p className="font-black tracking-tight">My Box</p>
              <p className="text-[10px] text-white/50 uppercase tracking-widest">Painel</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {nav.map((item) => {
            const active = location.pathname === item.to || location.pathname.startsWith(item.to + '/')
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                  active
                    ? 'bg-mygreen text-white shadow-lg shadow-mygreen/20'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <i className={`fas ${item.icon} w-5 text-center`} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-10 h-10 rounded-full bg-mygreen/20 text-mygreen flex items-center justify-center font-bold">
              {(profile?.full_name ?? profile?.email ?? '?')[0]?.toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold truncate">{profile?.full_name ?? 'Usuário'}</p>
              <p className="text-xs text-white/50 truncate">{profile?.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="mt-3 w-full flex items-center justify-center gap-2 text-sm text-white/60 hover:text-white py-2 rounded-lg hover:bg-white/5 transition"
          >
            <i className="fas fa-sign-out-alt" />
            Sair
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-4 sm:px-8 py-5 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-mydark">{title}</h1>
            {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
          <Link
            to="/"
            className="text-sm font-semibold text-mygreen hover:text-green-600 flex items-center gap-2"
          >
            <i className="fas fa-external-link-alt text-xs" />
            Ver site
          </Link>
        </header>

        <div className="lg:hidden bg-[#141414] px-4 py-3 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2">
            {nav.map((item) => {
              const active = location.pathname === item.to
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition ${
                    active ? 'bg-mygreen text-white' : 'bg-white/10 text-white/70'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>

        <main className="flex-1 p-4 sm:p-8">{children}</main>
      </div>
    </div>
  )
}

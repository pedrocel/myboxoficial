import type { ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ExternalLink, Globe, LogOut } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import type { UserRole } from '../../types/database'
import type { LucideIcon } from 'lucide-react'
import { ThemeToggle } from '../theme/ThemeToggle'
import { Button } from '../ui/button'
import { cn } from '../../lib/utils'

export type NavItem = {
  to: string
  label: string
  icon: LucideIcon
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
    <div className="min-h-screen bg-background flex">
      <aside className="hidden lg:flex w-[280px] flex-col shrink-0 border-r border-border bg-card">
        <div className="p-6 border-b border-border">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl gradient-green flex items-center justify-center font-black text-lg shadow-lg shadow-primary/20 group-hover:scale-105 transition">
              M
            </div>
            <div>
              <p className="font-bold tracking-tight text-foreground">My Box</p>
              <p className="text-[10px] text-primary uppercase tracking-[0.2em] font-semibold">Painel</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-6">
          {groups.map((group) => (
            <div key={group}>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-3 mb-2">{group}</p>
              <div className="space-y-0.5">
                {nav.filter((n) => (n.group ?? 'Menu') === group).map((item) => {
                  const active = isActive(item.to)
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                        active
                          ? 'bg-primary/15 text-primary border border-primary/20'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent',
                      )}
                    >
                      <span
                        className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                          active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="rounded-2xl p-3 bg-muted/50 border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-green flex items-center justify-center text-white font-bold text-sm">
                {(profile?.full_name ?? profile?.email ?? '?')[0]?.toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground truncate">{profile?.full_name ?? 'Usuário'}</p>
                <p className="text-[10px] font-medium uppercase tracking-wider text-primary">
                  {profile ? ROLE_LABELS[profile.role] : ''}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="mt-3 w-full justify-center gap-2 text-muted-foreground"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sair
            </Button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="glass-panel sticky top-0 z-20 px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {profile?.unit_slug && (
              <Button variant="outline" size="sm" asChild className="hidden sm:flex">
                <Link to={`/unidades-preview/${profile.unit_slug}`} target="_blank">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Ver página
                </Link>
              </Button>
            )}
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <Globe className="h-3.5 w-3.5" />
                Site
              </Link>
            </Button>
          </div>
        </header>

        <div className="lg:hidden bg-card border-b border-border px-4 py-3 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2">
            {nav.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    'shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition flex items-center gap-1.5',
                    isActive(item.to) ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}

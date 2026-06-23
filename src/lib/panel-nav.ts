import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  Store,
  CalendarCheck,
  Users,
  Palette,
  Eye,
  Home,
  User,
} from 'lucide-react'
import type { NavItem } from '../components/panel/PanelLayout'

export const ADMIN_NAV: NavItem[] = [
  { to: '/painel/admin', label: 'Dashboard', icon: LayoutDashboard, group: 'Principal' },
  { to: '/painel/admin/unidades', label: 'Unidades', icon: Store, group: 'Operação' },
  { to: '/painel/admin/agendamentos', label: 'Agendamentos', icon: CalendarCheck, group: 'Operação' },
  { to: '/painel/admin/usuarios', label: 'Usuários', icon: Users, group: 'Operação' },
]

export const OWNER_NAV: NavItem[] = [
  { to: '/painel/unidade', label: 'Dashboard', icon: LayoutDashboard, group: 'Principal' },
  { to: '/painel/unidade/personalizar', label: 'Personalizar', icon: Palette, group: 'Minha unidade' },
  { to: '/painel/unidade/agendamentos', label: 'Agendamentos', icon: CalendarCheck, group: 'Operação' },
  { to: '/painel/unidade/alunos', label: 'Alunos', icon: Users, group: 'Operação' },
  { to: '/painel/unidade/visitas', label: 'Visitas', icon: Eye, group: 'Operação' },
]

export const STUDENT_NAV: NavItem[] = [
  { to: '/painel/aluno', label: 'Início', icon: Home, group: 'Principal' },
  { to: '/painel/aluno/agendamentos', label: 'Meus agendamentos', icon: CalendarCheck, group: 'Conta' },
  { to: '/painel/aluno/perfil', label: 'Meu perfil', icon: User, group: 'Conta' },
]

export type { LucideIcon }

import type { NavItem } from '../components/panel/PanelLayout'

export const ADMIN_NAV: NavItem[] = [
  { to: '/painel/admin', label: 'Dashboard', icon: 'fa-chart-pie', group: 'Principal' },
  { to: '/painel/admin/unidades', label: 'Unidades', icon: 'fa-store', group: 'Operação' },
  { to: '/painel/admin/agendamentos', label: 'Agendamentos', icon: 'fa-calendar-check', group: 'Operação' },
  { to: '/painel/admin/usuarios', label: 'Usuários', icon: 'fa-users', group: 'Operação' },
]

export const OWNER_NAV: NavItem[] = [
  { to: '/painel/unidade', label: 'Dashboard', icon: 'fa-chart-pie', group: 'Principal' },
  { to: '/painel/unidade/personalizar', label: 'Personalizar', icon: 'fa-palette', group: 'Minha unidade' },
  { to: '/painel/unidade/agendamentos', label: 'Agendamentos', icon: 'fa-calendar-check', group: 'Operação' },
  { to: '/painel/unidade/alunos', label: 'Alunos', icon: 'fa-users', group: 'Operação' },
  { to: '/painel/unidade/visitas', label: 'Visitas', icon: 'fa-eye', group: 'Operação' },
]

export const STUDENT_NAV: NavItem[] = [
  { to: '/painel/aluno', label: 'Início', icon: 'fa-home', group: 'Principal' },
  { to: '/painel/aluno/agendamentos', label: 'Meus agendamentos', icon: 'fa-calendar-check', group: 'Conta' },
  { to: '/painel/aluno/perfil', label: 'Meu perfil', icon: 'fa-user', group: 'Conta' },
]

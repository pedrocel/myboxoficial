export type Theme = 'dark' | 'light'

export const THEME_STORAGE_KEY = 'mybox-theme'

/** Rotas que respeitam a escolha do usuario; o resto do site e sempre escuro. */
export function isPanelPath(pathname: string) {
  return pathname === '/entrar' || pathname === '/painel' || pathname.startsWith('/painel/')
}

export function readStoredTheme(): Theme {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) === 'light' ? 'light' : 'dark'
  } catch {
    // Navegador com armazenamento bloqueado: segue no escuro.
    return 'dark'
  }
}

export function storeTheme(theme: Theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Sem persistencia a troca ainda vale para a sessao atual.
  }
}

export type Theme = 'dark' | 'light'

export const THEME_STORAGE_KEY = 'mybox-theme'

export function readStoredTheme(): Theme {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) === 'dark' ? 'dark' : 'light'
  } catch {
    // Navegador com armazenamento bloqueado: segue no claro, como o site de referencia.
    return 'light'
  }
}

export function storeTheme(theme: Theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Sem persistencia a troca ainda vale para a sessao atual.
  }
}

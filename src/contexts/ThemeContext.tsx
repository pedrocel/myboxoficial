import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { isPanelPath, readStoredTheme, storeTheme, type Theme } from '../lib/theme'

type ThemeContextValue = {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  setTheme: () => {},
  toggleTheme: () => {},
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const [theme, setThemeState] = useState<Theme>(readStoredTheme)

  const setTheme = useCallback((novo: Theme) => {
    setThemeState(novo)
    storeTheme(novo)
  }, [])

  useEffect(() => {
    // Fora do painel a classe .light sai e o site volta ao escuro do :root.
    const claro = isPanelPath(pathname) && theme === 'light'
    const root = document.documentElement
    root.classList.toggle('light', claro)
    root.classList.toggle('dark', !claro)
    root.style.colorScheme = claro ? 'light' : 'dark'
  }, [pathname, theme])

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, setTheme, toggleTheme: () => setTheme(theme === 'dark' ? 'light' : 'dark') }),
    [theme, setTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}

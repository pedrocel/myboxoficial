import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { readStoredTheme, storeTheme, type Theme } from '../lib/theme'

type ThemeContextValue = {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readStoredTheme)

  const setTheme = useCallback((novo: Theme) => {
    setThemeState(novo)
    storeTheme(novo)
  }, [])

  useEffect(() => {
    // Site e painel seguem a mesma escolha; sem escolha salva, vale o claro.
    const claro = theme === 'light'
    const root = document.documentElement
    root.classList.toggle('light', claro)
    root.classList.toggle('dark', !claro)
    root.style.colorScheme = claro ? 'light' : 'dark'
  }, [theme])

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, setTheme, toggleTheme: () => setTheme(theme === 'dark' ? 'light' : 'dark') }),
    [theme, setTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}

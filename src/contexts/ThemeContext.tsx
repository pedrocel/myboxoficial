import { createContext, useContext, useEffect, type ReactNode } from 'react'

type ThemeContextValue = {
  theme: 'dark'
}

const ThemeContext = createContext<ThemeContextValue>({ theme: 'dark' })

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light')
    root.classList.add('dark')
    localStorage.setItem('mybox-theme', 'dark')
  }, [])

  return <ThemeContext.Provider value={{ theme: 'dark' }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}

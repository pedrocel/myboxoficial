import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { api, ApiError } from '../lib/api'
import type { Profile, UserRole } from '../types/database'

type AuthContextValue = {
  /** Quem esta logado; o perfil e o proprio usuario agora que o login e da nossa API. */
  user: Profile | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

async function fetchMe(): Promise<Profile | null> {
  try {
    return (await api.get<{ profile: Profile }>('/auth/me')).profile
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMe().then((p) => {
      setProfile(p)
      setLoading(false)
    })
  }, [])

  const refreshProfile = async () => setProfile(await fetchMe())

  const signIn = async (email: string, password: string) => {
    try {
      const { profile: p } = await api.post<{ profile: Profile }>('/auth/login', { email, password })
      setProfile(p)
      return { error: null }
    } catch (err) {
      return { error: err instanceof ApiError ? err.message : 'Não foi possível entrar agora.' }
    }
  }

  const signOut = async () => {
    await api.post('/auth/logout').catch(() => {})
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{ user: profile, profile, loading, signIn, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function roleHomePath(role: UserRole): string {
  switch (role) {
    case 'admin':
      return '/painel/admin'
    case 'owner':
      return '/painel/unidade'
    case 'student':
      return '/painel/aluno'
  }
}

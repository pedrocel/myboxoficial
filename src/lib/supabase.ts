import { createClient, type SupabaseClient } from '@supabase/supabase-js'

function env(...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = import.meta.env[key] as string | undefined
    if (value && value.trim()) return value.trim()
  }
  return undefined
}

export const supabaseUrl = env('VITE_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL')

export const supabaseKey = env(
  'VITE_SUPABASE_PUBLISHABLE_KEY',
  'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
  'VITE_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
)

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey)

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseKey!)
  : null

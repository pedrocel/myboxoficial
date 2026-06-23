import { createClient } from '@supabase/supabase-js'
import { getSupabaseConfig, loadEnv } from './load-env.mjs'

loadEnv()
const { url, publishableKey } = getSupabaseConfig()

if (!url || !publishableKey) {
  console.error('Defina VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY no .env')
  process.exit(1)
}

const client = createClient(url, publishableKey)
const { error } = await client.from('units').select('slug', { count: 'exact', head: true })

if (error) {
  if (error.message.includes('does not exist') || error.code === '42P01') {
    console.log('CONECTADO — tabela units ainda não existe. Rode a migration no SQL Editor.')
  } else {
    console.error('ERRO:', error.message)
    process.exit(1)
  }
} else {
  console.log('CONECTADO — Supabase cloud OK')
}

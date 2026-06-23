/**
 * Configura Supabase: importa unidades e cria usuários demo.
 *
 * Cloud: adicione SUPABASE_SERVICE_ROLE_KEY no .env e rode npm run setup:supabase
 * Local: npx supabase start && npm run setup:supabase
 */
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'
import { createClient } from '@supabase/supabase-js'
import { getSupabaseConfig, loadEnv } from './load-env.mjs'

loadEnv()

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const DEMO_USERS = [
  {
    email: 'admin@mybox.com.br',
    password: 'MyBox@Admin2025',
    role: 'admin',
    full_name: 'Administrador My Box',
  },
  {
    email: 'dono@mybox.com.br',
    password: 'MyBox@Dono2025',
    role: 'owner',
    full_name: 'Dono Demo',
    unit_slug: 'my-box-uvaranas',
  },
  {
    email: 'aluno@mybox.com.br',
    password: 'MyBox@Aluno2025',
    role: 'student',
    full_name: 'Aluno Demo',
  },
]

function loadLocalSupabaseStatus() {
  try {
    const out = execSync('npx supabase status -o env 2>/dev/null', {
      cwd: root,
      encoding: 'utf8',
    })
    const vars = {}
    for (const line of out.split('\n')) {
      const m = line.match(/^([A-Z_]+)="(.+)"$/)
      if (m) vars[m[1]] = m[2]
    }
    return vars
  } catch {
    return null
  }
}

async function main() {
  let { url, serviceKey } = getSupabaseConfig()

  if (!url || !serviceKey) {
    const status = loadLocalSupabaseStatus()
    if (status) {
      url = url ?? status.API_URL
      serviceKey = serviceKey ?? status.SERVICE_ROLE_KEY
    }
  }

  if (!url || !serviceKey) {
    console.error('Defina VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env')
    console.error('A service_role está em: Supabase Dashboard → Settings → API')
    process.exit(1)
  }

  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const units = JSON.parse(readFileSync(join(root, 'src/data/units.json'), 'utf8'))
  const rows = units.map((u) => ({
    slug: u.url_page,
    name: u.name,
    razao_social: u.razao_social ?? null,
    cidade: u.cidade ?? null,
    estado: u.estado ?? null,
    nome_dono: u.nome_dono ?? null,
    telefone: u.telefone ?? null,
    email: u.email ?? null,
    whatsapp: u.whatsapp ?? null,
    como_chegar: u.como_chegar ?? null,
    logradouro: u.logradouro ?? null,
    numero: u.numero ?? null,
    cep: u.cep ?? null,
    lat: u.lat ?? null,
    lng: u.lng ?? null,
    image_background: u.image_background ?? null,
    is_public: u.is_public ?? true,
    status: u.status ?? true,
  }))

  console.log(`Importando ${rows.length} unidades em ${url}...`)
  const { error: unitsError } = await admin.from('units').upsert(rows, { onConflict: 'slug' })
  if (unitsError) {
    console.error('Erro ao importar unidades:', unitsError.message)
    process.exit(1)
  }
  console.log('✓ Unidades importadas')

  let ownerId = null

  for (const user of DEMO_USERS) {
    const { data: existing } = await admin.auth.admin.listUsers()
    const found = existing?.users?.find((u) => u.email === user.email)

    let userId = found?.id

    if (!found) {
      const { data, error } = await admin.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          full_name: user.full_name,
          role: user.role,
          unit_slug: user.unit_slug ?? '',
          phone: '',
        },
      })
      if (error) {
        console.error(`Erro ao criar ${user.email}:`, error.message)
        continue
      }
      userId = data.user.id
      console.log(`✓ Usuário criado: ${user.email}`)
    } else {
      await admin.auth.admin.updateUserById(found.id, {
        password: user.password,
        user_metadata: {
          full_name: user.full_name,
          role: user.role,
          unit_slug: user.unit_slug ?? '',
        },
      })
      userId = found.id
      console.log(`✓ Usuário atualizado: ${user.email}`)
    }

    await admin
      .from('profiles')
      .update({
        role: user.role,
        full_name: user.full_name,
        unit_slug: user.unit_slug ?? null,
      })
      .eq('id', userId)

    if (user.role === 'owner') ownerId = userId
  }

  if (ownerId) {
    await admin.from('units').update({ owner_id: ownerId }).eq('slug', 'my-box-uvaranas')
    console.log('✓ Dono vinculado à unidade My Box Uvaranas')
  }

  console.log('\n══════════════════════════════════════════')
  console.log('  My Box — credenciais de acesso demo')
  console.log('══════════════════════════════════════════')
  console.log('  Admin:  admin@mybox.com.br  / MyBox@Admin2025')
  console.log('  Dono:   dono@mybox.com.br   / MyBox@Dono2025')
  console.log('  Aluno:  aluno@mybox.com.br  / MyBox@Aluno2025')
  console.log('══════════════════════════════════════════')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

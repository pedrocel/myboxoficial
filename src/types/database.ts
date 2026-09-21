export type UserRole = 'admin' | 'owner' | 'student'
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'

export type Profile = {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  role: UserRole
  unit_slug: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export type DbUnit = {
  slug: string
  name: string
  razao_social: string | null
  cidade: string | null
  estado: string | null
  nome_dono: string | null
  telefone: string | null
  email: string | null
  whatsapp: string | null
  como_chegar: string | null
  logradouro: string | null
  numero: string | null
  cep: string | null
  lat: number | null
  lng: number | null
  image_background: string | null
  gallery_images: string[] | null
  is_public: boolean
  status: boolean
  visits_count: number
  owner_id: string | null
  horarios: unknown | null
  modalidades: unknown | null
  hero_image: string | null
  description: string | null
  created_at: string
  updated_at: string
}

export type Booking = {
  id: string
  unit_slug: string
  student_id: string | null
  student_name: string
  student_email: string
  student_phone: string
  booking_date: string
  booking_time: string
  modalidade: string
  status: BookingStatus
  notes: string | null
  created_at: string
}

export type UnitVisit = {
  id: string
  unit_slug: string
  path: string | null
  referrer: string | null
  created_at: string
}

export type FranchiseLeadStatus = 'novo' | 'contatado' | 'qualificado' | 'negociacao' | 'fechado' | 'perdido'

// Tabela leads_mybox: recebe os leads de todas as landings de franquia
// (ex: franquia.myboxoficial.com.br). "origem" e "pagina" guardam de qual
// site/rota o lead veio.
export type FranchiseLead = {
  id: string
  nome: string
  email: string
  telefone: string
  cidade: string
  estado: string | null
  profissao: string | null
  possui_empresa: string | null
  investimento: string
  prazo: string | null
  instagram: string | null
  mensagem: string | null
  origem: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_term: string | null
  utm_content: string | null
  gclid: string | null
  pagina: string | null
  referrer: string | null
  status: FranchiseLeadStatus
  created_at: string
  updated_at: string
}

export type Database = {
  public: {
    Tables: {
      profiles_mybox: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile> }
      units_mybox: { Row: DbUnit; Insert: Partial<DbUnit>; Update: Partial<DbUnit> }
      bookings_mybox: { Row: Booking; Insert: Partial<Booking>; Update: Partial<Booking> }
      unit_visits_mybox: { Row: UnitVisit; Insert: Partial<UnitVisit>; Update: Partial<UnitVisit> }
    }
  }
}

export type LeadEmail = {
  id: string
  email: string
  nome: string | null
  ativo: boolean
  created_at: string
}

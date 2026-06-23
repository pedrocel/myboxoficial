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

export type Database = {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile> }
      units: { Row: DbUnit; Insert: Partial<DbUnit>; Update: Partial<DbUnit> }
      bookings: { Row: Booking; Insert: Partial<Booking>; Update: Partial<Booking> }
      unit_visits: { Row: UnitVisit; Insert: Partial<UnitVisit>; Update: Partial<UnitVisit> }
    }
  }
}

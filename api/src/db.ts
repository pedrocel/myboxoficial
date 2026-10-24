import fs from 'node:fs'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'

export type Db = DatabaseSync

/**
 * Mesmas tabelas que existiam no Supabase (sem o sufixo _mybox, o banco e so da My Box).
 * Listas e objetos (galeria, horarios, modalidades) ficam como JSON em texto.
 * Cada item do array e uma migracao; a posicao vira o PRAGMA user_version.
 */
const MIGRATIONS = [
  `
  CREATE TABLE units (
    slug TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    razao_social TEXT,
    cidade TEXT,
    estado TEXT,
    nome_dono TEXT,
    telefone TEXT,
    email TEXT,
    whatsapp TEXT,
    como_chegar TEXT,
    logradouro TEXT,
    numero TEXT,
    cep TEXT,
    lat REAL,
    lng REAL,
    image_background TEXT,
    gallery_images TEXT NOT NULL DEFAULT '[]',
    horarios TEXT,
    modalidades TEXT,
    hero_image TEXT,
    description TEXT,
    is_public INTEGER NOT NULL DEFAULT 1,
    status INTEGER NOT NULL DEFAULT 1,
    visits_count INTEGER NOT NULL DEFAULT 0,
    owner_id TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE profiles (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT,
    full_name TEXT,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'owner', 'student')),
    unit_slug TEXT REFERENCES units(slug) ON DELETE SET NULL,
    avatar_url TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE sessions (
    id TEXT PRIMARY KEY,
    profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL,
    expires_at TEXT NOT NULL
  );
  CREATE INDEX idx_sessions_profile ON sessions(profile_id);

  CREATE TABLE bookings (
    id TEXT PRIMARY KEY,
    unit_slug TEXT NOT NULL REFERENCES units(slug) ON DELETE CASCADE,
    student_id TEXT REFERENCES profiles(id) ON DELETE SET NULL,
    student_name TEXT NOT NULL,
    student_email TEXT NOT NULL,
    student_phone TEXT NOT NULL,
    booking_date TEXT NOT NULL,
    booking_time TEXT NOT NULL,
    modalidade TEXT NOT NULL DEFAULT 'Aula Experimental',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    notes TEXT,
    created_at TEXT NOT NULL
  );
  CREATE INDEX idx_bookings_unit ON bookings(unit_slug, booking_date);
  CREATE INDEX idx_bookings_email ON bookings(student_email);

  CREATE TABLE unit_visits (
    id TEXT PRIMARY KEY,
    unit_slug TEXT NOT NULL REFERENCES units(slug) ON DELETE CASCADE,
    path TEXT,
    referrer TEXT,
    created_at TEXT NOT NULL
  );
  CREATE INDEX idx_visits_unit ON unit_visits(unit_slug, created_at);

  CREATE TABLE leads (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    telefone TEXT NOT NULL,
    cidade TEXT NOT NULL,
    estado TEXT,
    profissao TEXT,
    possui_empresa TEXT,
    investimento TEXT NOT NULL,
    prazo TEXT,
    instagram TEXT,
    mensagem TEXT,
    origem TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_term TEXT,
    utm_content TEXT,
    gclid TEXT,
    pagina TEXT,
    referrer TEXT,
    status TEXT NOT NULL DEFAULT 'novo'
      CHECK (status IN ('novo', 'contatado', 'qualificado', 'negociacao', 'fechado', 'perdido')),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE lead_emails (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    nome TEXT,
    ativo INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL
  );
  `,
]

export function openDatabase(file: string): Db {
  if (file !== ':memory:') fs.mkdirSync(path.dirname(file), { recursive: true })
  const db = new DatabaseSync(file)
  db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;')

  const current = Number((db.prepare('PRAGMA user_version').get() as { user_version: number }).user_version)
  for (let version = current; version < MIGRATIONS.length; version++) {
    db.exec('BEGIN')
    try {
      db.exec(MIGRATIONS[version])
      db.exec(`PRAGMA user_version = ${version + 1}`)
      db.exec('COMMIT')
    } catch (err) {
      db.exec('ROLLBACK')
      throw err
    }
  }
  return db
}

export const nowIso = () => new Date().toISOString()
export const newId = () => crypto.randomUUID()

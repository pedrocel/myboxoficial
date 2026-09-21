/**
 * Fonte das unidades do site publico.
 *
 * O banco (units_mybox) manda: e o que o painel edita. O src/data/units.json
 * fica so como reserva, para o site nao ficar sem unidades se o Supabase
 * estiver fora do ar ou sem configuracao no build.
 *
 * Unidade desativada (status = false) nao aparece no site.
 */
import unitsData from '../data/units.json'
import { supabase } from './supabase'
import type { Unit } from '../types/unit'
import type { DbUnit } from '../types/database'

const UNIDADES_RESERVA = unitsData as Unit[]

const somenteAtivas = (unidades: Unit[]) => unidades.filter((u) => u.status)

export function unitFromDb(linha: DbUnit): Unit {
  const telefone = linha.telefone ?? ''
  return {
    name: linha.name,
    razao_social: linha.razao_social ?? '',
    url_page: linha.slug,
    cidade: linha.cidade ?? '',
    estado: linha.estado ?? '',
    nome_dono: linha.nome_dono ?? '',
    telefone,
    telefone_numerico: telefone.replace(/\D/g, ''),
    whatsapp: linha.whatsapp ?? '',
    email: linha.email ?? '',
    como_chegar: linha.como_chegar ?? '',
    logradouro: linha.logradouro ?? '',
    numero: linha.numero ?? '',
    cep: linha.cep ?? '',
    is_public: linha.is_public,
    status: linha.status,
    image_background: linha.image_background ?? undefined,
    lat: linha.lat ?? undefined,
    lng: linha.lng ?? undefined,
  }
}

async function buscarUnidades(): Promise<Unit[]> {
  if (!supabase) return somenteAtivas(UNIDADES_RESERVA)

  const { data, error } = await supabase.from('units_mybox').select('*').order('name')

  if (error || !data?.length) {
    console.warn('Unidades: caindo para o units.json de reserva.', error?.message ?? 'banco sem registros')
    return somenteAtivas(UNIDADES_RESERVA)
  }

  return somenteAtivas((data as DbUnit[]).map(unitFromDb))
}

let emCache: Promise<Unit[]> | null = null

/** Uma consulta por sessao; as paginas compartilham o mesmo resultado. */
export function loadUnits(): Promise<Unit[]> {
  if (!emCache) emCache = buscarUnidades()
  return emCache
}

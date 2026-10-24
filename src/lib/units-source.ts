/**
 * Fonte das unidades do site publico.
 *
 * O banco da API (VPS) manda: e o que o painel edita. O src/data/units.json
 * fica so como reserva, para o site nao ficar sem unidades se a API
 * estiver fora do ar.
 *
 * Unidade desativada (status = false) nao aparece no site.
 */
import unitsData from '../data/units.json'
import { api } from './api'
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
  try {
    const data = await api.get<DbUnit[]>('/units')
    if (data.length) return somenteAtivas(data.map(unitFromDb))
    console.warn('Unidades: banco sem registros, caindo para o units.json de reserva.')
  } catch (err) {
    console.warn('Unidades: API fora do ar, caindo para o units.json de reserva.', err)
  }
  return somenteAtivas(UNIDADES_RESERVA)
}

let emCache: Promise<Unit[]> | null = null

/** Uma consulta por sessao; as paginas compartilham o mesmo resultado. */
export function loadUnits(): Promise<Unit[]> {
  if (!emCache) emCache = buscarUnidades()
  return emCache
}

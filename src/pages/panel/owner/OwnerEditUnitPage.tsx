import { useEffect, useState, type FormEvent } from 'react'
import { PanelLayout } from '../../../components/panel/PanelLayout'
import { useAuth } from '../../../contexts/AuthContext'
import { supabase } from '../../../lib/supabase'
import type { DbUnit } from '../../../types/database'

import { OWNER_NAV } from '../../../lib/panel-nav'

export function OwnerEditUnitPage() {
  const { profile } = useAuth()
  const [unit, setUnit] = useState<DbUnit | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const slug = profile?.unit_slug

  useEffect(() => {
    if (!supabase || !slug) return
    supabase.from('units').select('*').eq('slug', slug).single().then(({ data }) => {
      if (data) setUnit(data as DbUnit)
    })
  }, [slug])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!supabase || !unit || !slug) return
    setSaving(true)
    setSaved(false)
    const { error } = await supabase
      .from('units')
      .update({
        telefone: unit.telefone,
        email: unit.email,
        whatsapp: unit.whatsapp,
        como_chegar: unit.como_chegar,
        logradouro: unit.logradouro,
        numero: unit.numero,
        cep: unit.cep,
        nome_dono: unit.nome_dono,
        updated_at: new Date().toISOString(),
      })
      .eq('slug', slug)
    setSaving(false)
    if (!error) setSaved(true)
  }

  const field = (label: string, key: keyof DbUnit, type = 'text', rows?: number) => (
    <div>
      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</label>
      {rows ? (
        <textarea
          rows={rows}
          value={(unit?.[key] as string) ?? ''}
          onChange={(e) => setUnit((u) => (u ? { ...u, [key]: e.target.value } : u))}
          className="mt-1.5 w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-mygreen resize-none"
        />
      ) : (
        <input
          type={type}
          value={(unit?.[key] as string) ?? ''}
          onChange={(e) => setUnit((u) => (u ? { ...u, [key]: e.target.value } : u))}
          className="mt-1.5 w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-mygreen"
        />
      )}
    </div>
  )

  if (!unit) {
    return (
      <PanelLayout title="Minha unidade" subtitle="Carregando..." nav={OWNER_NAV}>
        <div className="flex justify-center py-20">
          <i className="fas fa-spinner fa-spin text-mygreen text-3xl" />
        </div>
      </PanelLayout>
    )
  }

  return (
    <PanelLayout title="Minha unidade" subtitle="Edite os dados da sua academia" nav={OWNER_NAV}>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
            <div className="w-16 h-16 rounded-2xl gradient-green flex items-center justify-center text-white font-black text-2xl">
              {unit.name[0]}
            </div>
            <div>
              <h2 className="text-xl font-black text-mydark">{unit.name}</h2>
              <p className="text-sm text-gray-500">{unit.cidade} — {unit.estado}</p>
            </div>
          </div>

          {field('Responsável', 'nome_dono')}
          {field('Telefone', 'telefone', 'tel')}
          {field('WhatsApp', 'whatsapp', 'tel')}
          {field('E-mail', 'email', 'email')}
          {field('Logradouro', 'logradouro')}
          {field('Número', 'numero')}
          {field('CEP', 'cep')}
          {field('Como chegar', 'como_chegar', 'text', 3)}
        </div>

        {saved && (
          <p className="text-mygreen text-sm font-semibold flex items-center gap-2">
            <i className="fas fa-check-circle" />
            Dados salvos com sucesso!
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="bg-mygreen hover:bg-green-600 disabled:opacity-60 text-white font-bold py-4 px-8 rounded-xl transition shadow-lg shadow-mygreen/25"
        >
          {saving ? <i className="fas fa-spinner fa-spin" /> : 'Salvar alterações'}
        </button>
      </form>
    </PanelLayout>
  )
}

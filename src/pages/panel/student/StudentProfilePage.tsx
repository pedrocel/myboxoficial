import { useState, type FormEvent } from 'react'
import { PanelLayout } from '../../../components/panel/PanelLayout'
import { useAuth } from '../../../contexts/AuthContext'
import { supabase } from '../../../lib/supabase'

const STUDENT_NAV = [
  { to: '/painel/aluno', label: 'Início', icon: 'fa-home' },
  { to: '/painel/aluno/agendamentos', label: 'Meus agendamentos', icon: 'fa-calendar-check' },
  { to: '/painel/aluno/perfil', label: 'Meu perfil', icon: 'fa-user' },
]

export function StudentProfilePage() {
  const { profile, refreshProfile } = useAuth()
  const [fullName, setFullName] = useState(profile?.full_name ?? '')
  const [phone, setPhone] = useState(profile?.phone ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!supabase || !profile) return
    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName, phone, updated_at: new Date().toISOString() })
      .eq('id', profile.id)
    setSaving(false)
    if (!error) {
      setSaved(true)
      await refreshProfile()
    }
  }

  return (
    <PanelLayout title="Meu perfil" subtitle="Seus dados pessoais" nav={STUDENT_NAV}>
      <form onSubmit={handleSubmit} className="max-w-lg">
        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full gradient-green flex items-center justify-center text-white font-black text-2xl">
              {(fullName || profile?.email || '?')[0]?.toUpperCase()}
            </div>
            <div>
              <p className="font-black text-mydark">{fullName || 'Aluno'}</p>
              <p className="text-sm text-gray-500">{profile?.email}</p>
              <span className="inline-block mt-1 text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase">
                Aluno
              </span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nome completo</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1.5 w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-mygreen"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Telefone / WhatsApp</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1.5 w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-mygreen"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">E-mail</label>
            <input
              type="email"
              value={profile?.email ?? ''}
              disabled
              className="mt-1.5 w-full px-4 py-3 bg-gray-100 border border-gray-100 rounded-xl text-gray-400 cursor-not-allowed"
            />
          </div>
        </div>

        {saved && (
          <p className="text-mygreen text-sm font-semibold mt-4 flex items-center gap-2">
            <i className="fas fa-check-circle" />
            Perfil atualizado!
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="mt-6 bg-mygreen hover:bg-green-600 disabled:opacity-60 text-white font-bold py-4 px-8 rounded-xl transition"
        >
          {saving ? <i className="fas fa-spinner fa-spin" /> : 'Salvar perfil'}
        </button>
      </form>
    </PanelLayout>
  )
}

import { useState, useRef, type FormEvent } from 'react'
import type { DbUnit } from '../../types/database'
import {
  DEFAULT_HORARIOS,
  DEFAULT_MODALIDADES,
  parseHorarios,
  parseModalidades,
  type UnitHorario,
} from '../../lib/unit-settings'
import { uploadUnitImage, deleteUnitImage } from '../../lib/storage'

type Tab = 'geral' | 'galeria' | 'horarios' | 'modalidades' | 'mapa'

type Props = {
  unit: DbUnit
  onSave: (unit: DbUnit) => Promise<{ error?: string }>
  readOnly?: boolean
}

export function UnitCustomizeEditor({ unit: initial, onSave, readOnly }: Props) {
  const [unit, setUnit] = useState(initial)
  const [tab, setTab] = useState<Tab>('geral')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const horarios = parseHorarios(unit.horarios)
  const modalidades = parseModalidades(unit.modalidades)
  const gallery = unit.gallery_images ?? []

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'geral', label: 'Dados gerais', icon: 'fa-info-circle' },
    { id: 'galeria', label: 'Galeria', icon: 'fa-images' },
    { id: 'horarios', label: 'Horários', icon: 'fa-clock' },
    { id: 'modalidades', label: 'Modalidades', icon: 'fa-dumbbell' },
    { id: 'mapa', label: 'Localização', icon: 'fa-map-marker-alt' },
  ]

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (readOnly) return
    setSaving(true)
    setMsg(null)
    const result = await onSave(unit)
    setSaving(false)
    setMsg(result.error ? { type: 'err', text: result.error } : { type: 'ok', text: 'Salvo com sucesso!' })
  }

  const setField = <K extends keyof DbUnit>(key: K, value: DbUnit[K]) => {
    setUnit((u) => ({ ...u, [key]: value }))
  }

  const updateHorario = (i: number, field: keyof UnitHorario, value: string) => {
    const next = [...horarios]
    next[i] = { ...next[i], [field]: value }
    setField('horarios', next)
  }

  const toggleModalidade = (id: string) => {
    const next = modalidades.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m))
    setField('modalidades', next)
  }

  const updateModDesc = (id: string, desc: string) => {
    const next = modalidades.map((m) => (m.id === id ? { ...m, desc } : m))
    setField('modalidades', next)
  }

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length || readOnly) return
    setUploading(true)
    const newUrls: string[] = []
    for (const file of Array.from(files)) {
      const { url, error } = await uploadUnitImage(unit.slug, file)
      if (url) newUrls.push(url)
      else if (error) setMsg({ type: 'err', text: error })
    }
    if (newUrls.length) {
      setField('gallery_images', [...gallery, ...newUrls])
      if (!unit.hero_image) setField('hero_image', newUrls[0])
    }
    setUploading(false)
  }

  const removeImage = async (url: string) => {
    if (readOnly) return
    await deleteUnitImage(url, unit.slug)
    const next = gallery.filter((u) => u !== url)
    setField('gallery_images', next)
    if (unit.hero_image === url) setField('hero_image', next[0] ?? null)
  }

  const mapUrl =
    unit.lat && unit.lng
      ? `https://www.google.com/maps?q=${unit.lat},${unit.lng}&z=15&output=embed`
      : `https://maps.google.com/maps?q=${encodeURIComponent([unit.logradouro, unit.numero, unit.cidade, unit.estado].filter(Boolean).join(', '))}&output=embed`

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition ${
              tab === t.id ? 'bg-mygreen text-white shadow-md shadow-mygreen/25' : 'bg-white text-gray-600 border border-gray-100 hover:border-mygreen/30'
            }`}
          >
            <i className={`fas ${t.icon}`} />
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
        {tab === 'geral' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              ['Nome', 'name'],
              ['Responsável', 'nome_dono'],
              ['Telefone', 'telefone'],
              ['WhatsApp', 'whatsapp'],
              ['E-mail', 'email'],
              ['CEP', 'cep'],
              ['Logradouro', 'logradouro'],
              ['Número', 'numero'],
            ].map(([label, key]) => (
              <div key={key}>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</label>
                <input
                  disabled={readOnly}
                  value={(unit[key as keyof DbUnit] as string) ?? ''}
                  onChange={(e) => setField(key as keyof DbUnit, e.target.value as never)}
                  className="mt-1.5 w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-mygreen disabled:opacity-60"
                />
              </div>
            ))}
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Descrição da unidade</label>
              <textarea
                disabled={readOnly}
                rows={3}
                value={unit.description ?? ''}
                onChange={(e) => setField('description', e.target.value)}
                className="mt-1.5 w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-mygreen resize-none disabled:opacity-60"
                placeholder="Texto exibido na página pública..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Como chegar</label>
              <textarea
                disabled={readOnly}
                rows={2}
                value={unit.como_chegar ?? ''}
                onChange={(e) => setField('como_chegar', e.target.value)}
                className="mt-1.5 w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-mygreen resize-none disabled:opacity-60"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  disabled={readOnly}
                  checked={unit.status}
                  onChange={(e) => setField('status', e.target.checked)}
                  className="w-4 h-4 accent-mygreen"
                />
                <span className="text-sm font-semibold text-mydark">Unidade ativa</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  disabled={readOnly}
                  checked={unit.is_public}
                  onChange={(e) => setField('is_public', e.target.checked)}
                  className="w-4 h-4 accent-mygreen"
                />
                <span className="text-sm font-semibold text-mydark">Página pública</span>
              </label>
            </div>
          </div>
        )}

        {tab === 'galeria' && (
          <div>
            <p className="text-sm text-gray-500 mb-4">Imagens da galeria e hero da página pública. Bucket Supabase: <code className="text-xs bg-gray-100 px-1 rounded">unit-gallery</code></p>
            {!readOnly && (
              <>
                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleUpload(e.target.files)} />
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => fileRef.current?.click()}
                  className="mb-6 flex items-center gap-2 px-5 py-3 bg-mygreen/10 text-mygreen font-bold rounded-xl hover:bg-mygreen/20 transition"
                >
                  {uploading ? <i className="fas fa-spinner fa-spin" /> : <i className="fas fa-cloud-upload-alt" />}
                  Enviar imagens
                </button>
              </>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {gallery.map((url) => (
                <div key={url} className="relative group aspect-video rounded-xl overflow-hidden border border-gray-100">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  {unit.hero_image === url && (
                    <span className="absolute top-2 left-2 text-[9px] font-bold bg-mygreen text-white px-2 py-0.5 rounded-full">HERO</span>
                  )}
                  {!readOnly && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                      <button type="button" onClick={() => setField('hero_image', url)} className="w-8 h-8 rounded-lg bg-white text-mygreen text-xs" title="Definir como hero">
                        <i className="fas fa-star" />
                      </button>
                      <button type="button" onClick={() => removeImage(url)} className="w-8 h-8 rounded-lg bg-red-500 text-white text-xs">
                        <i className="fas fa-trash" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {!gallery.length && (
                <div className="col-span-full py-12 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                  <i className="fas fa-images text-3xl mb-2" />
                  <p className="text-sm">Nenhuma imagem na galeria</p>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'horarios' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">Horários exibidos na página pública de detalhes.</p>
            {horarios.map((h, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-gray-50 rounded-xl">
                <input
                  disabled={readOnly}
                  value={h.dia}
                  onChange={(e) => updateHorario(i, 'dia', e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-200 font-bold text-sm disabled:opacity-60"
                />
                <input
                  disabled={readOnly}
                  value={h.musc}
                  onChange={(e) => updateHorario(i, 'musc', e.target.value)}
                  placeholder="Musculação"
                  className="px-3 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-60"
                />
                <input
                  disabled={readOnly}
                  value={h.cross}
                  onChange={(e) => updateHorario(i, 'cross', e.target.value)}
                  placeholder="Cross / Coletivas"
                  className="px-3 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-60"
                />
              </div>
            ))}
            {!readOnly && (
              <button
                type="button"
                onClick={() => setField('horarios', [...horarios, { dia: 'Novo dia', musc: '', cross: '' }])}
                className="text-sm font-bold text-mygreen"
              >
                + Adicionar linha
              </button>
            )}
          </div>
        )}

        {tab === 'modalidades' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {modalidades.map((m) => (
              <div
                key={m.id}
                className={`p-5 rounded-2xl border-2 transition ${m.enabled ? 'border-mygreen/40 bg-green-50/50' : 'border-gray-100 opacity-60'}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <i className={`fas ${m.icon} text-mygreen`} />
                    <span className="font-bold text-mydark">{m.title}</span>
                  </div>
                  {!readOnly && (
                    <button type="button" onClick={() => toggleModalidade(m.id)} className={`w-10 h-6 rounded-full transition ${m.enabled ? 'bg-mygreen' : 'bg-gray-300'}`}>
                      <span className={`block w-4 h-4 bg-white rounded-full mx-1 transition ${m.enabled ? 'translate-x-4' : ''}`} />
                    </button>
                  )}
                </div>
                <textarea
                  disabled={readOnly}
                  rows={2}
                  value={m.desc}
                  onChange={(e) => updateModDesc(m.id, e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 disabled:opacity-60"
                />
              </div>
            ))}
          </div>
        )}

        {tab === 'mapa' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Latitude</label>
                <input
                  disabled={readOnly}
                  type="number"
                  step="any"
                  value={unit.lat ?? ''}
                  onChange={(e) => setField('lat', e.target.value ? parseFloat(e.target.value) : null)}
                  className="mt-1 w-full px-4 py-3 bg-gray-50 border rounded-xl disabled:opacity-60"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Longitude</label>
                <input
                  disabled={readOnly}
                  type="number"
                  step="any"
                  value={unit.lng ?? ''}
                  onChange={(e) => setField('lng', e.target.value ? parseFloat(e.target.value) : null)}
                  className="mt-1 w-full px-4 py-3 bg-gray-50 border rounded-xl disabled:opacity-60"
                />
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden border border-gray-100 h-72">
              <iframe src={mapUrl} width="100%" height="100%" style={{ border: 0 }} loading="lazy" title="Mapa" />
            </div>
          </div>
        )}
      </div>

      {msg && (
        <p className={`text-sm font-semibold flex items-center gap-2 ${msg.type === 'ok' ? 'text-mygreen' : 'text-red-500'}`}>
          <i className={`fas ${msg.type === 'ok' ? 'fa-check-circle' : 'fa-exclamation-circle'}`} />
          {msg.text}
        </p>
      )}

      {!readOnly && (
        <button
          type="submit"
          disabled={saving}
          className="bg-mygreen hover:bg-green-600 disabled:opacity-60 text-white font-bold py-4 px-10 rounded-xl shadow-lg shadow-mygreen/25 transition"
        >
          {saving ? <i className="fas fa-spinner fa-spin" /> : 'Salvar personalização'}
        </button>
      )}
    </form>
  )
}

export function buildUnitUpdatePayload(unit: DbUnit) {
  return {
    name: unit.name,
    nome_dono: unit.nome_dono,
    telefone: unit.telefone,
    email: unit.email,
    whatsapp: unit.whatsapp,
    como_chegar: unit.como_chegar,
    logradouro: unit.logradouro,
    numero: unit.numero,
    cep: unit.cep,
    lat: unit.lat,
    lng: unit.lng,
    description: unit.description,
    hero_image: unit.hero_image,
    image_background: unit.hero_image ?? unit.image_background,
    gallery_images: unit.gallery_images,
    horarios: unit.horarios ?? DEFAULT_HORARIOS,
    modalidades: unit.modalidades ?? DEFAULT_MODALIDADES,
    status: unit.status,
    is_public: unit.is_public,
    updated_at: new Date().toISOString(),
  }
}

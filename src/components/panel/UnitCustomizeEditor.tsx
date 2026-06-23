import { useState, useRef, type FormEvent } from 'react'
import {
  Clock,
  Dumbbell,
  ImagePlus,
  Info,
  Loader2,
  MapPin,
  Plus,
  Save,
  Star,
  Trash2,
  Upload,
} from 'lucide-react'
import type { DbUnit } from '../../types/database'
import {
  DEFAULT_HORARIOS,
  DEFAULT_MODALIDADES,
  createEmptyHorario,
  createEmptySlot,
  parseHorarios,
  parseModalidades,
  type HorarioSlot,
  type UnitHorario,
} from '../../lib/unit-settings'
import { buildUnitAddress } from '../../lib/geocode'
import { uploadUnitImage, deleteUnitImage } from '../../lib/storage'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Switch } from '../ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Badge } from '../ui/badge'
import { cn } from '../../lib/utils'

type Props = {
  unit: DbUnit
  onSave: (unit: DbUnit) => Promise<{ error?: string }>
  readOnly?: boolean
}

export function UnitCustomizeEditor({ unit: initial, onSave, readOnly }: Props) {
  const [unit, setUnit] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const horarios = parseHorarios(unit.horarios)
  const modalidades = parseModalidades(unit.modalidades)
  const gallery = unit.gallery_images ?? []

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

  const updateHorarios = (next: UnitHorario[]) => setField('horarios', next)

  const updateHorarioLabel = (id: string, label: string) => {
    updateHorarios(horarios.map((h) => (h.id === id ? { ...h, label } : h)))
  }

  const updateSlot = (horarioId: string, slotId: string, field: keyof HorarioSlot, value: string) => {
    updateHorarios(
      horarios.map((h) =>
        h.id === horarioId
          ? { ...h, slots: h.slots.map((s) => (s.id === slotId ? { ...s, [field]: value } : s)) }
          : h,
      ),
    )
  }

  const addSlot = (horarioId: string) => {
    updateHorarios(
      horarios.map((h) => (h.id === horarioId ? { ...h, slots: [...h.slots, createEmptySlot()] } : h)),
    )
  }

  const removeSlot = (horarioId: string, slotId: string) => {
    updateHorarios(
      horarios.map((h) =>
        h.id === horarioId ? { ...h, slots: h.slots.filter((s) => s.id !== slotId) } : h,
      ),
    )
  }

  const removeHorario = (id: string) => updateHorarios(horarios.filter((h) => h.id !== id))

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

  const addressPreview = buildUnitAddress(unit)
  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(addressPreview)}&output=embed`

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="geral" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="geral"><Info className="h-4 w-4" />Geral</TabsTrigger>
          <TabsTrigger value="local"><MapPin className="h-4 w-4" />Endereço</TabsTrigger>
          <TabsTrigger value="galeria"><ImagePlus className="h-4 w-4" />Galeria</TabsTrigger>
          <TabsTrigger value="horarios"><Clock className="h-4 w-4" />Horários</TabsTrigger>
          <TabsTrigger value="modalidades"><Dumbbell className="h-4 w-4" />Modalidades</TabsTrigger>
        </TabsList>

        <TabsContent value="geral">
          <Card>
            <CardHeader>
              <CardTitle>Dados da unidade</CardTitle>
              <CardDescription>Informações exibidas na página pública e no painel.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {([
                ['Nome', 'name'],
                ['Responsável', 'nome_dono'],
                ['Telefone', 'telefone'],
                ['WhatsApp', 'whatsapp'],
                ['E-mail', 'email'],
              ] as const).map(([label, key]) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key}>{label}</Label>
                  <Input
                    id={key}
                    disabled={readOnly}
                    value={(unit[key] as string) ?? ''}
                    onChange={(e) => setField(key, e.target.value as never)}
                  />
                </div>
              ))}
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  disabled={readOnly}
                  rows={3}
                  value={unit.description ?? ''}
                  onChange={(e) => setField('description', e.target.value)}
                  placeholder="Texto exibido na página pública..."
                />
              </div>
              <div className="md:col-span-2 flex flex-wrap gap-8 pt-2">
                <div className="flex items-center gap-3">
                  <Switch
                    id="status"
                    disabled={readOnly}
                    checked={unit.status}
                    onCheckedChange={(v) => setField('status', v)}
                  />
                  <Label htmlFor="status" className="normal-case tracking-normal text-sm text-foreground">Unidade ativa</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    id="is_public"
                    disabled={readOnly}
                    checked={unit.is_public}
                    onCheckedChange={(v) => setField('is_public', v)}
                  />
                  <Label htmlFor="is_public" className="normal-case tracking-normal text-sm text-foreground">Página pública</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="local">
          <Card>
            <CardHeader>
              <CardTitle>Endereço da unidade</CardTitle>
              <CardDescription>
                Preencha o endereço completo. O mapa é gerado automaticamente — não é necessário informar coordenadas.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cep">CEP</Label>
                  <Input id="cep" disabled={readOnly} value={unit.cep ?? ''} onChange={(e) => setField('cep', e.target.value)} />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="logradouro">Logradouro</Label>
                  <Input id="logradouro" disabled={readOnly} value={unit.logradouro ?? ''} onChange={(e) => setField('logradouro', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numero">Número</Label>
                  <Input id="numero" disabled={readOnly} value={unit.numero ?? ''} onChange={(e) => setField('numero', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input id="cidade" disabled={readOnly} value={unit.cidade ?? ''} onChange={(e) => setField('cidade', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado (UF)</Label>
                  <Input id="estado" disabled={readOnly} value={unit.estado ?? ''} onChange={(e) => setField('estado', e.target.value)} maxLength={2} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="como_chegar">Como chegar / referência</Label>
                <Textarea
                  id="como_chegar"
                  disabled={readOnly}
                  rows={2}
                  value={unit.como_chegar ?? ''}
                  onChange={(e) => setField('como_chegar', e.target.value)}
                  placeholder="Ex: Ao lado do shopping, estacionamento gratuito..."
                />
              </div>
              {addressPreview && (
                <div className="rounded-xl bg-muted/50 px-4 py-3 text-sm text-muted-foreground flex items-start gap-2">
                  <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
                  <span>{addressPreview}</span>
                </div>
              )}
              <div className="rounded-2xl overflow-hidden border border-border h-72">
                <iframe src={mapUrl} width="100%" height="100%" style={{ border: 0 }} loading="lazy" title="Mapa" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="galeria">
          <Card>
            <CardHeader>
              <CardTitle>Galeria de imagens</CardTitle>
              <CardDescription>Fotos da unidade exibidas na página pública. Armazenadas no Supabase.</CardDescription>
            </CardHeader>
            <CardContent>
              {!readOnly && (
                <>
                  <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleUpload(e.target.files)} />
                  <Button type="button" variant="outline" disabled={uploading} onClick={() => fileRef.current?.click()} className="mb-6">
                    {uploading ? <Loader2 className="animate-spin" /> : <Upload />}
                    Enviar imagens
                  </Button>
                </>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {gallery.map((url) => (
                  <div key={url} className="relative group aspect-video rounded-xl overflow-hidden border border-border">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    {unit.hero_image === url && (
                      <Badge className="absolute top-2 left-2 text-[10px]">Hero</Badge>
                    )}
                    {!readOnly && (
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                        <Button type="button" size="icon" variant="secondary" onClick={() => setField('hero_image', url)} title="Definir como hero">
                          <Star className="h-4 w-4" />
                        </Button>
                        <Button type="button" size="icon" variant="destructive" onClick={() => removeImage(url)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
                {!gallery.length && (
                  <div className="col-span-full py-16 text-center text-muted-foreground border-2 border-dashed border-border rounded-2xl">
                    <ImagePlus className="h-10 w-10 mx-auto mb-3 opacity-40" />
                    <p className="text-sm">Nenhuma imagem na galeria</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="horarios">
          <Card>
            <CardHeader>
              <CardTitle>Horários de funcionamento</CardTitle>
              <CardDescription>
                Adicione períodos (dias) e atividades com horários livres — musculação, cross, pilates, etc.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {horarios.map((h) => (
                <div key={h.id} className="rounded-2xl border border-border bg-muted/30 p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <Input
                      disabled={readOnly}
                      value={h.label}
                      onChange={(e) => updateHorarioLabel(h.id, e.target.value)}
                      className="font-semibold flex-1"
                      placeholder="Ex: Segunda — Sexta"
                    />
                    {!readOnly && horarios.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeHorario(h.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {h.slots.map((slot) => (
                      <div key={slot.id} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2">
                        <Input
                          disabled={readOnly}
                          value={slot.activity}
                          onChange={(e) => updateSlot(h.id, slot.id, 'activity', e.target.value)}
                          placeholder="Atividade"
                        />
                        <Input
                          disabled={readOnly}
                          value={slot.hours}
                          onChange={(e) => updateSlot(h.id, slot.id, 'hours', e.target.value)}
                          placeholder="Horário"
                        />
                        {!readOnly && h.slots.length > 1 && (
                          <Button type="button" variant="ghost" size="icon" onClick={() => removeSlot(h.id, slot.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  {!readOnly && (
                    <Button type="button" variant="outline" size="sm" onClick={() => addSlot(h.id)}>
                      <Plus className="h-4 w-4" /> Atividade
                    </Button>
                  )}
                </div>
              ))}
              {!readOnly && (
                <Button type="button" variant="outline" onClick={() => updateHorarios([...horarios, createEmptyHorario()])}>
                  <Plus className="h-4 w-4" /> Novo período
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modalidades">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {modalidades.map((m) => (
              <Card key={m.id} className={cn(!m.enabled && 'opacity-60')}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <i className={cn('fas', m.icon, 'text-primary')} />
                      {m.title}
                    </CardTitle>
                    {!readOnly && (
                      <Switch checked={m.enabled} onCheckedChange={() => toggleModalidade(m.id)} />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    disabled={readOnly}
                    rows={2}
                    value={m.desc}
                    onChange={(e) => updateModDesc(m.id, e.target.value)}
                    className="text-sm"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {msg && (
        <p className={cn('text-sm font-medium', msg.type === 'ok' ? 'text-primary' : 'text-destructive')}>
          {msg.text}
        </p>
      )}

      {!readOnly && (
        <Button type="submit" disabled={saving} size="lg">
          {saving ? <Loader2 className="animate-spin" /> : <Save />}
          Salvar personalização
        </Button>
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
    cidade: unit.cidade,
    estado: unit.estado,
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

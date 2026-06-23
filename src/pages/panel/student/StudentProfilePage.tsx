import { useState, type FormEvent } from 'react'
import { Loader2 } from 'lucide-react'
import { PanelLayout } from '../../../components/panel/PanelLayout'
import { useAuth } from '../../../contexts/AuthContext'
import { supabase } from '../../../lib/supabase'
import { STUDENT_NAV } from '../../../lib/panel-nav'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Card, CardContent } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'

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
      <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
        <Card>
          <CardContent className="p-8 space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full gradient-green flex items-center justify-center text-white font-bold text-2xl">
                {(fullName || profile?.email || '?')[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-foreground">{fullName || 'Aluno'}</p>
                <p className="text-sm text-muted-foreground">{profile?.email}</p>
                <Badge variant="secondary" className="mt-2">Aluno</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Nome completo</Label>
              <Input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone / WhatsApp</Label>
              <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" value={profile?.email ?? ''} disabled className="opacity-60" />
            </div>
          </CardContent>
        </Card>

        {saved && <p className="text-primary text-sm font-medium">Perfil atualizado!</p>}

        <Button type="submit" disabled={saving} size="lg">
          {saving ? <Loader2 className="animate-spin" /> : 'Salvar perfil'}
        </Button>
      </form>
    </PanelLayout>
  )
}

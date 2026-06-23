import type { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '../ui/card'
import { cn } from '../../lib/utils'

type Props = {
  icon: LucideIcon
  label: string
  value: string | number
  trend?: string
  variant?: 'default' | 'gold' | 'blue' | 'muted'
}

const VARIANTS = {
  default: 'bg-primary/10 text-primary',
  gold: 'bg-amber-500/10 text-amber-500',
  blue: 'bg-blue-500/10 text-blue-500',
  muted: 'bg-muted text-muted-foreground',
}

export function StatCard({ icon: Icon, label, value, trend, variant = 'default' }: Props) {
  return (
    <Card className="hover:shadow-md transition-shadow border-border/60">
      <CardContent className="p-6">
        <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center mb-4', VARIANTS[variant])}>
          <Icon className="h-5 w-5" />
        </div>
        <p className="text-3xl font-bold text-foreground tabular-nums">{value}</p>
        <p className="text-sm text-muted-foreground mt-1">{label}</p>
        {trend && <p className="text-xs text-primary font-medium mt-2">{trend}</p>}
      </CardContent>
    </Card>
  )
}

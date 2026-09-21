import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { Button } from '../ui/button'
import { cn } from '../../lib/utils'

type Props = {
  className?: string
}

/** Alterna o painel entre tema escuro e claro. A escolha fica salva no navegador. */
export function ThemeToggle({ className }: Props) {
  const { theme, toggleTheme } = useTheme()
  const paraEscuro = theme === 'light'
  const rotulo = paraEscuro ? 'Mudar para o tema escuro' : 'Mudar para o tema claro'

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      title={rotulo}
      aria-label={rotulo}
      aria-pressed={paraEscuro}
      className={cn('shrink-0', className)}
    >
      {paraEscuro ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </Button>
  )
}

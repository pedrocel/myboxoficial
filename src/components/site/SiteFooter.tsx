import { Link } from 'react-router-dom'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import type { Theme } from '../../lib/theme'
import { SocialIcon, type SocialName } from './SocialIcon'
import { NETWORK_EMAIL, SITE_LINKS, SOCIAL_LINKS, STORE_URL } from './site-links'

const socials: { name: SocialName; label: string }[] = [
  { name: 'instagram', label: 'Instagram da My Box' },
  { name: 'facebook', label: 'Facebook da My Box' },
  { name: 'youtube', label: 'YouTube da My Box' },
]

const themes: { value: Theme; label: string; Icon: typeof Moon }[] = [
  { value: 'dark', label: 'Tema escuro', Icon: Moon },
  { value: 'light', label: 'Tema claro', Icon: Sun },
]

const linkClass = 'transition-colors hover:text-foreground'

export function SiteFooter() {
  const { theme, setTheme } = useTheme()

  return (
    <footer className="relative overflow-hidden border-t bg-muted">
      <div className="shell grid gap-14 pt-20 pb-10 lg:grid-cols-12 lg:gap-8 lg:pt-28">
        <div className="lg:col-span-5">
          <span className="logo-mark h-14 text-primary" />
          <p className="mt-6 max-w-sm text-muted-foreground">
            Academia com conceito de shopping. 92 unidades em 12 estados, desde 2016.
          </p>
          <div className="mt-8 flex gap-2">
            {socials.map((s) => (
              <a
                key={s.name}
                href={SOCIAL_LINKS[s.name as keyof typeof SOCIAL_LINKS]}
                target="_blank"
                rel="noopener"
                className="chip size-11 justify-center p-0"
                aria-label={s.label}
              >
                <SocialIcon name={s.name} />
              </a>
            ))}
          </div>
        </div>
        <nav aria-label="Rodapé" className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
          <div>
            <h2 className="text-sm font-semibold">Navegue</h2>
            <ul className="mt-5 grid gap-3 text-muted-foreground">
              {SITE_LINKS.map((link) => (
                <li key={link.to}>
                  <Link className={linkClass} to={link.to}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold">Para você</h2>
            <ul className="mt-5 grid gap-3 text-muted-foreground">
              <li>
                <Link className={linkClass} to="/unidades">
                  Encontrar unidade
                </Link>
              </li>
              <li>
                <a href={STORE_URL} target="_blank" rel="noopener" className={linkClass}>
                  Loja My Box
                </a>
              </li>
              <li>
                <Link to="/entrar" className={linkClass}>
                  Área do aluno e da unidade
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <h2 className="text-sm font-semibold">Fale com a rede</h2>
            <ul className="mt-5 grid gap-3 text-muted-foreground">
              <li>
                <a href={`mailto:${NETWORK_EMAIL}`} className={`${linkClass} break-all`}>
                  {NETWORK_EMAIL}
                </a>
              </li>
              <li>
                <Link className={linkClass} to="/franquia">
                  Seja franqueado
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      <div className="shell" aria-hidden="true">
        <span className="logo-mark w-full text-foreground opacity-[0.05]" />
      </div>
      <div className="shell flex flex-col gap-4 border-t py-8 text-sm text-subtle sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} My Box. Todos os direitos reservados.</p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link className={linkClass} to="/termos">
            Termos de Uso
          </Link>
          <Link className={linkClass} to="/privacidade">
            Política de Privacidade
          </Link>
          <div className="flex items-center gap-1 rounded-full border p-1" role="group" aria-label="Tema do site">
            {themes.map(({ value, label, Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setTheme(value)}
                aria-pressed={theme === value}
                aria-label={label}
                className="inline-flex size-8 items-center justify-center rounded-full aria-pressed:bg-primary aria-pressed:text-primary-foreground"
              >
                <Icon size={16} aria-hidden />
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

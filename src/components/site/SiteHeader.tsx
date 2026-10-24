import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { cn } from '../../lib/utils'
import { SITE_LINKS, STORE_URL } from './site-links'
import { stagger } from './stagger'

type Props = {
  /** Sem foto no topo da pagina: o header ja nasce com fundo. */
  solid?: boolean
}

const navLinkClass =
  'relative rounded-full px-4 py-2 text-[0.95rem] font-medium opacity-80 transition-opacity hover:opacity-100 aria-[current=page]:opacity-100 aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-4 aria-[current=page]:after:-bottom-0.5 aria-[current=page]:after:h-0.5 aria-[current=page]:after:bg-primary'

export function SiteHeader({ solid = false }: Props) {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [overPhoto, setOverPhoto] = useState(!solid)
  const [menuOpen, setMenuOpen] = useState(false)

  // Enquanto a foto do topo aparece, o header fica transparente com texto claro.
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(([entry]) => setOverPhoto(!solid && entry.isIntersecting))
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [solid])

  const openMenu = () => {
    setMenuOpen(true)
    dialogRef.current?.showModal()
  }
  const closeMenu = () => dialogRef.current?.close()

  return (
    <>
      <div
        ref={sentinelRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0"
        style={{ height: solid ? '24px' : '60svh' }}
      />
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-40 border-b transition-[background-color,border-color,color] duration-500',
          overPhoto
            ? 'border-transparent bg-transparent text-snow'
            : 'border-border bg-background/80 text-foreground backdrop-blur-lg backdrop-saturate-150',
        )}
      >
        <div className="shell flex h-[68px] items-center justify-between gap-6 lg:h-[76px]">
          <Link to="/" aria-label="My Box, página inicial" className="flex items-center">
            <span className="logo-mark h-9 lg:h-10" />
          </Link>
          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {SITE_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink to={link.to} className={navLinkClass}>
                    {link.label}
                  </NavLink>
                </li>
              ))}
              <li>
                <a
                  href={STORE_URL}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-[0.95rem] font-medium opacity-80 transition-opacity hover:opacity-100"
                >
                  Loja <ArrowUpRight size={14} aria-hidden />
                </a>
              </li>
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/unidades" className="btn hidden min-h-11 px-5 text-[0.92rem] sm:inline-flex">
              Encontrar unidade
            </Link>
            <button
              type="button"
              onClick={openMenu}
              className="inline-flex size-11 items-center justify-center rounded-full border border-current/25 lg:hidden"
              aria-controls="mobile-menu"
              aria-expanded={menuOpen}
              aria-label="Abrir menu"
            >
              <Menu size={22} aria-hidden />
            </button>
          </div>
        </div>
      </header>
      <dialog
        id="mobile-menu"
        ref={dialogRef}
        onClose={() => setMenuOpen(false)}
        aria-label="Menu"
        className="m-0 h-dvh max-h-none w-full max-w-none bg-night p-0 text-snow backdrop:bg-transparent open:flex open:flex-col"
      >
        {menuOpen && (
          <>
            <div className="shell flex h-[68px] shrink-0 items-center justify-between">
              <Link to="/" aria-label="My Box, página inicial" onClick={closeMenu}>
                <span className="logo-mark h-9" />
              </Link>
              <button
                type="button"
                onClick={closeMenu}
                className="inline-flex size-11 items-center justify-center rounded-full border border-snow/25"
                aria-label="Fechar menu"
              >
                <X size={22} aria-hidden />
              </button>
            </div>
            <nav aria-label="Menu móvel" className="shell flex flex-1 flex-col justify-center gap-1 pb-10">
              {SITE_LINKS.map((link, i) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={closeMenu}
                  className="menu-item display display-lg py-2 transition-colors hover:text-brand"
                  style={stagger(i)}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={STORE_URL}
                target="_blank"
                rel="noopener"
                className="mt-6 inline-flex items-center gap-2 text-lg text-snow/75"
              >
                Loja My Box <ArrowUpRight size={18} aria-hidden />
              </a>
            </nav>
            <div className="shell grid gap-3 pb-8 sm:grid-cols-2">
              <Link to="/unidades" onClick={closeMenu} className="btn w-full">
                Encontrar unidade
              </Link>
              <Link to="/franquia" onClick={closeMenu} className="btn btn-on-photo w-full">
                Seja franqueado
              </Link>
            </div>
          </>
        )}
      </dialog>
    </>
  )
}

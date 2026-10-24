import { useEffect, useRef, type ReactNode } from 'react'
import { SiteHeader } from './SiteHeader'
import { SiteFooter } from './SiteFooter'

type Props = {
  children: ReactNode
  /** Paginas sem foto no topo: header ja com fundo e conteudo abaixo dele. */
  solidHeader?: boolean
}

/**
 * Casca das paginas publicas: header, rodape, granulado e a animacao de
 * entrada dos elementos marcados com data-reveal.
 */
export function SiteLayout({ children, solidHeader = false }: Props) {
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    document.documentElement.classList.add('js')
    const main = mainRef.current
    if (!main) return

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            io.unobserve(entry.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    const watch = () => main.querySelectorAll('[data-reveal]:not(.is-in)').forEach((el) => io.observe(el))
    watch()
    // Listas que chegam do banco depois do primeiro render tambem animam.
    const mo = new MutationObserver(watch)
    mo.observe(main, { childList: true, subtree: true })
    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [])

  return (
    <div className="grain min-h-dvh">
      <a
        href="#conteudo"
        className="sr-only z-50 rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Pular para o conteúdo
      </a>
      <SiteHeader solid={solidHeader} />
      <main id="conteudo" ref={mainRef} className={solidHeader ? 'pt-[68px] lg:pt-[76px]' : ''}>
        {children}
      </main>
      <SiteFooter />
    </div>
  )
}

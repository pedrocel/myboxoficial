import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'

export function useAOS() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true })
  }, [])
}

export function useSmoothScroll() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!anchor) return

      const href = anchor.getAttribute('href')
      if (!href || href === '#') return

      const el = document.querySelector(href)
      if (el) {
        e.preventDefault()
        window.scrollTo({
          top: el.getBoundingClientRect().top + window.scrollY - 120,
          behavior: 'smooth',
        })
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])
}

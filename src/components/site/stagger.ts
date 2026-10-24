import type { CSSProperties } from 'react'

/** Atraso em cascata das animacoes de entrada (lido pelo CSS como --i). */
export function stagger(i: number) {
  return { '--i': i } as CSSProperties
}

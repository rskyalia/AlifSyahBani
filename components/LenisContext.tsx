import { createContext, useContext } from 'react'
import Lenis from 'lenis'

export const LenisContext = createContext<Lenis | null>(null)

export function useLenis(): Lenis | null {
  return useContext(LenisContext)
}

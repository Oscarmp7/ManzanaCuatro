import { createContext, useContext } from 'react'

export const ThemeContext = createContext(null)

export function useThemeContext() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useThemeContext must be used within ThemeContext.Provider')
  return ctx
}

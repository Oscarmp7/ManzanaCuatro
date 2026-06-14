import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'm4-theme'
const DEFAULT_THEME = 'dark'

const isSSR = typeof window === 'undefined'
const hasMatchMedia = !isSSR && typeof window.matchMedia === 'function'

const getSystemTheme = () => {
  if (isSSR || !hasMatchMedia) {
    return DEFAULT_THEME
  }

  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

const getStoredTheme = () => {
  if (isSSR) {
    return null
  }

  try {
    const storedTheme = window.localStorage.getItem(STORAGE_KEY)
    return storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : null
  } catch {
    return null
  }
}

const createInitialThemeState = () => {
  const storedTheme = getStoredTheme()

  if (storedTheme) {
    return { theme: storedTheme, hasStoredTheme: true }
  }

  return { theme: getSystemTheme(), hasStoredTheme: false }
}

export default function useTheme() {
  const [{ theme, hasStoredTheme }, setThemeState] = useState(() => createInitialThemeState())

  useEffect(() => {
    if (typeof document === 'undefined') {
      return
    }

    document.documentElement.setAttribute('data-theme', theme)

    if (!hasStoredTheme || isSSR) {
      return
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // Ignore storage failures in sandboxed or privacy-restricted environments.
    }
  }, [hasStoredTheme, theme])

  useEffect(() => {
    if (hasStoredTheme || isSSR || !hasMatchMedia) {
      return undefined
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)')
    const syncSystemTheme = (event) => {
      setThemeState((current) => {
        if (current.hasStoredTheme) {
          return current
        }

        return {
          theme: event.matches ? 'light' : 'dark',
          hasStoredTheme: false,
        }
      })
    }

    mediaQuery.addEventListener('change', syncSystemTheme)

    return () => {
      mediaQuery.removeEventListener('change', syncSystemTheme)
    }
  }, [hasStoredTheme])

  const toggle = useCallback(() => {
    setThemeState((current) => ({
      theme: current.theme === 'dark' ? 'light' : 'dark',
      hasStoredTheme: true,
    }))
  }, [])

  return { theme, toggle }
}

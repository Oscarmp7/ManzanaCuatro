import { useEffect, useState } from 'react'

const isSSR = typeof window === 'undefined'
const hasMatchMedia = !isSSR && typeof window.matchMedia === 'function'

const getInitialReducedMotionPreference = () => {
  if (isSSR || !hasMatchMedia) {
    return false
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    getInitialReducedMotionPreference(),
  )

  useEffect(() => {
    if (isSSR || !hasMatchMedia) {
      return undefined
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncPreference = (event) => setPrefersReducedMotion(event.matches)

    mediaQuery.addEventListener('change', syncPreference)

    return () => {
      mediaQuery.removeEventListener('change', syncPreference)
    }
  }, [])

  return prefersReducedMotion
}

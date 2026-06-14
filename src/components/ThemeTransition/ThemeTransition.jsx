import { useRef, useCallback } from 'react'
import gsap from 'gsap'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'
import './ThemeTransition.css'

export default function useThemeTransition(onMidpoint) {
  const veilRef = useRef(null)
  const animatingRef = useRef(false)
  const reducedMotion = usePrefersReducedMotion()

  const play = useCallback(() => {
    if (animatingRef.current) return

    if (reducedMotion) {
      onMidpoint?.()
      return
    }

    animatingRef.current = true

    // Dark → light: white overexposure flash. Light → dark: black shutter flash.
    const currentTheme = document.documentElement.dataset.theme
    const flashColor = currentTheme === 'dark' ? 'var(--flash-overexpose)' : 'var(--flash-shutter)'

    const veil = veilRef.current
    veil.style.background = flashColor

    const tl = gsap.timeline({
      onComplete: () => {
        animatingRef.current = false
        if (veilRef.current) veilRef.current.style.background = ''
      },
    })

    tl.set(veil, { display: 'block', opacity: 0 })
      .to(veil, { opacity: 1, duration: 0.1, ease: 'power1.in' })
      .call(() => onMidpoint?.())
      .to(veil, { opacity: 0, duration: 0.18, ease: 'power1.out' })
      .set(veil, { display: 'none' })
  }, [onMidpoint, reducedMotion])

  const curtain = <div ref={veilRef} className="theme-veil" aria-hidden="true" />

  return { curtain, play }
}

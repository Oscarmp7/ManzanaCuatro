import { useRef, useLayoutEffect } from 'react'
import { useLocation } from 'react-router'
import gsap from 'gsap'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'
import { getLenis } from '../../hooks/useLenis'
import './PageTransition.css'

export default function PageTransition({ children }) {
  const stageRef = useRef(null)
  const wipeRef = useRef(null)
  const location = useLocation()
  const isFirstRender = useRef(true)
  const reducedMotion = usePrefersReducedMotion()
  const sharedNav = Boolean(location.state?.sharedThumb)

  useLayoutEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    // Reset scroll on route change. Prefer Lenis so its virtual position stays
    // in sync; fall back to the native instant scroll (also overrides the html
    // scroll-behavior: smooth so route changes never animate the scroll).
    const resetScroll = () => {
      const lenis = getLenis()
      if (lenis) lenis.scrollTo(0, { immediate: true })
      else window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }

    if (reducedMotion) {
      resetScroll()
      return
    }

    resetScroll()

    // Shared-element navigation (card → detail) plays its own FLIP on the hero;
    // skip the wipe so it never covers the morphing element.
    if (sharedNav) return

    // Overlay slides out right, revealing content left-to-right (compositor-only: transform)
    const ctx = gsap.context(() => {
      gsap.fromTo(
        wipeRef.current,
        { xPercent: 0 },
        { xPercent: 100, duration: 1, ease: 'expo.out' },
      )
    }, stageRef)

    return () => ctx.revert()
  }, [location.pathname, reducedMotion, sharedNav])

  return (
    <div ref={stageRef} className="page-stage" data-route={location.pathname}>
      <div ref={wipeRef} className="page-stage__wipe" aria-hidden="true" />
      {children}
    </div>
  )
}

import { useRef, useLayoutEffect } from 'react'
import { useLocation } from 'react-router'
import gsap from 'gsap'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'
import './PageTransition.css'

export default function PageTransition({ children }) {
  const stageRef = useRef(null)
  const wipeRef = useRef(null)
  const location = useLocation()
  const isFirstRender = useRef(true)
  const reducedMotion = usePrefersReducedMotion()

  useLayoutEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    // 'instant' overrides the html scroll-behavior: smooth so route changes
    // never animate the scroll position (which would fire ScrollTriggers).
    if (reducedMotion) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      return
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })

    // Overlay slides out right, revealing content left-to-right (compositor-only: transform)
    const ctx = gsap.context(() => {
      gsap.fromTo(
        wipeRef.current,
        { xPercent: 0 },
        { xPercent: 100, duration: 1, ease: 'expo.out' },
      )
    }, stageRef)

    return () => ctx.revert()
  }, [location.pathname, reducedMotion])

  return (
    <div ref={stageRef} className="page-stage" data-route={location.pathname}>
      <div ref={wipeRef} className="page-stage__wipe" aria-hidden="true" />
      {children}
    </div>
  )
}

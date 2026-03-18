import { useRef, useLayoutEffect } from 'react'
import { useLocation } from 'react-router'
import gsap from 'gsap'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'
import './PageTransition.css'

export default function PageTransition({ children }) {
  const stageRef = useRef(null)
  const location = useLocation()
  const isFirstRender = useRef(true)
  const reducedMotion = usePrefersReducedMotion()

  useLayoutEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (reducedMotion) {
      window.scrollTo(0, 0)
      return
    }

    window.scrollTo(0, 0)

    // Content itself sweeps in left-to-right like a film frame advancing
    gsap.fromTo(
      stageRef.current,
      { clipPath: 'inset(0 100% 0 0)' },
      { clipPath: 'inset(0 0% 0 0)', duration: 1, ease: 'expo.out' },
    )
  }, [location.pathname, reducedMotion])

  return (
    <div ref={stageRef} className="page-stage" data-route={location.pathname}>
      {children}
    </div>
  )
}

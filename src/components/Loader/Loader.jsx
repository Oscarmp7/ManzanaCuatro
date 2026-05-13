import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { siteContent } from '../../data/siteContent'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'
import './Loader.css'

export default function Loader({ onComplete }) {
  const loaderRef = useRef(null)
  const reducedMotionHandledRef = useRef(false)
  const reducedMotion = usePrefersReducedMotion()
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (reducedMotion) {
      if (!reducedMotionHandledRef.current) {
        reducedMotionHandledRef.current = true
        onComplete?.()
      }

      return undefined
    }

    const tl = gsap.timeline({
      onComplete: () => setVisible(false),
    })

    tl.to({}, { duration: 0.24 })
      .call(() => onComplete?.())
      .to(loaderRef.current, {
        opacity: 0,
        duration: 1.05,
        ease: 'expo.out',
      })

    return () => tl.kill()
  }, [onComplete, reducedMotion])

  if (reducedMotion) return null
  if (!visible) return null

  return (
    <div ref={loaderRef} className="loader" aria-hidden="true">
      <div className="loader__content">
        <div className="loader__title-card">
          <p className="loader__meta">{siteContent.hero.eyebrow}</p>
          <h1 className="loader__wordmark">{siteContent.brand.name}</h1>
          <span className="loader__view">{siteContent.hero.primaryCta.label}</span>
        </div>
      </div>
    </div>
  )
}

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { siteContent } from '../../data/siteContent'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'
import './StudioManifesto.css'

export default function StudioManifesto() {
  const reduced = usePrefersReducedMotion()
  const rootRef = useRef(null)
  const revealRefs = useRef([])

  const { about } = siteContent

  // Collect reveal targets via refs (no global selectors).
  const addReveal = (el) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el)
  }

  useEffect(() => {
    if (reduced) return undefined
    const ctx = gsap.context(() => {
      if (revealRefs.current.length) {
        gsap.from(revealRefs.current, {
          opacity: 0,
          y: 26,
          duration: 0.8,
          ease: 'expo.out',
          stagger: 0.1,
          scrollTrigger: { trigger: rootRef.current, start: 'top 74%', once: true },
        })
      }
    }, rootRef)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section ref={rootRef} className="studio-manifesto">
      <div className="studio-manifesto__inner">
        <p ref={addReveal} className="studio-manifesto__label">
          El estudio
        </p>

        <div className="studio-manifesto__cols">
          <div ref={addReveal} className="studio-manifesto__col">
            <p className="studio-manifesto__lead">{about.title}</p>
            <p className="studio-manifesto__body">{about.text}</p>
          </div>
          <ul ref={addReveal} className="studio-manifesto__col studio-manifesto__points">
            {about.highlights.map((h) => (
              <li key={h} className="studio-manifesto__point">
                {h}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

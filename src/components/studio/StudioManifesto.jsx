import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
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

  // The about block peeks under the reel hero on entry, so it reads as part of
  // the same composition — it reveals on mount, not on scroll. A scroll trigger
  // would leave the already-visible label/lead stuck invisible until the user
  // scrolled past it (the peek would look empty on arrival).
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
          delay: 0.2,
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

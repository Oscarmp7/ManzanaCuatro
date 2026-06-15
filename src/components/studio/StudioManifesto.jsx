import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { siteContent } from '../../data/siteContent'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'
import './StudioManifesto.css'

export default function StudioManifesto() {
  const reduced = usePrefersReducedMotion()
  const rootRef = useRef(null)
  const headlineRef = useRef(null)
  const revealRefs = useRef([])
  const statRefs = useRef([])

  const { about, stats } = siteContent

  // Collect reveal targets via refs (no global selectors).
  const addReveal = (el) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el)
  }

  useEffect(() => {
    if (reduced) return undefined
    const ctx = gsap.context(() => {
      if (headlineRef.current) {
        gsap.from(headlineRef.current, {
          yPercent: 115,
          duration: 0.95,
          ease: 'expo.out',
          scrollTrigger: { trigger: headlineRef.current, start: 'top 88%', once: true },
        })
      }

      if (revealRefs.current.length) {
        gsap.from(revealRefs.current, {
          opacity: 0,
          y: 26,
          duration: 0.7,
          ease: 'expo.out',
          stagger: 0.1,
          scrollTrigger: { trigger: rootRef.current, start: 'top 68%', once: true },
        })
      }

      // Count-up via a proxy object (robust — tweens a number, writes textContent)
      statRefs.current.forEach((el) => {
        if (!el) return
        const target = Number(el.dataset.value) || 0
        const proxy = { v: 0 }
        gsap.to(proxy, {
          v: target,
          duration: 1.6,
          ease: 'expo.out',
          onUpdate: () => {
            el.textContent = String(Math.round(proxy.v))
          },
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        })
      })
    }, rootRef)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section ref={rootRef} className="studio-manifesto">
      <div className="studio-manifesto__inner">
        <span ref={addReveal} className="studio-manifesto__eyebrow">
          {about.eyebrow}
        </span>

        <h2 className="studio-manifesto__headline">
          <span className="studio-manifesto__headline-mask">
            <span ref={headlineRef} className="studio-manifesto__headline-inner">
              {about.title}
            </span>
          </span>
        </h2>

        <div className="studio-manifesto__cols">
          <div className="studio-manifesto__col">
            <p ref={addReveal} className="studio-manifesto__lead">
              {about.text}
            </p>
          </div>
          <div className="studio-manifesto__col">
            <ul className="studio-manifesto__highlights">
              {about.highlights.map((h) => (
                <li ref={addReveal} key={h} className="studio-manifesto__highlight">
                  <span className="studio-manifesto__dot" aria-hidden="true" />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="studio-manifesto__stats">
          {stats.map((stat, i) => (
            <div ref={addReveal} key={stat.label} className="studio-manifesto__stat">
              <div className="studio-manifesto__stat-num">
                <span
                  ref={(el) => (statRefs.current[i] = el)}
                  data-value={stat.value}
                  className="studio-manifesto__stat-value"
                >
                  {reduced ? stat.value : '0'}
                </span>
                <span className="studio-manifesto__stat-suffix">{stat.suffix}</span>
              </div>
              <span className="studio-manifesto__stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

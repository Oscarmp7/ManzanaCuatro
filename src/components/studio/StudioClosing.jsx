import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { siteContent } from '../../data/siteContent'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'
import './StudioClosing.css'

export default function StudioClosing() {
  const reduced = usePrefersReducedMotion()
  const rootRef = useRef(null)
  const revealRefs = useRef([])

  const { contact, brand } = siteContent
  const addReveal = (el) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el)
  }

  useEffect(() => {
    if (reduced) return undefined
    const ctx = gsap.context(() => {
      if (!revealRefs.current.length) return undefined
      gsap.from(revealRefs.current, {
        opacity: 0,
        y: 24,
        duration: 0.75,
        ease: 'expo.out',
        stagger: 0.1,
        scrollTrigger: { trigger: rootRef.current, start: 'top 80%', once: true },
      })
      return undefined
    }, rootRef)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section ref={rootRef} className="studio-closing">
      <span className="studio-closing__glow" aria-hidden="true" />

      <div className="studio-closing__inner">
        <span ref={addReveal} className="studio-closing__eyebrow">
          {contact.eyebrow}
        </span>
        <h2 ref={addReveal} className="studio-closing__title">
          {contact.title}
        </h2>
        <p ref={addReveal} className="studio-closing__text">
          {contact.text}
        </p>
        <a
          ref={addReveal}
          className="studio-closing__cta"
          href={contact.primaryCta.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {contact.primaryCta.label}
        </a>
      </div>

      <span className="studio-closing__wordmark" aria-hidden="true">
        {brand.name}
      </span>
    </section>
  )
}

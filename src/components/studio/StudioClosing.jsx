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
  const fillRef = useRef(null)
  const ctaRef = useRef(null)
  const xToRef = useRef(null)
  const yToRef = useRef(null)

  const { contact, brand } = siteContent
  const addReveal = (el) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el)
  }

  useEffect(() => {
    if (reduced) return undefined
    const ctx = gsap.context(() => {
      if (revealRefs.current.length) {
        gsap.from(revealRefs.current, {
          opacity: 0,
          y: 28,
          duration: 0.9,
          ease: 'expo.out',
          stagger: 0.12,
          scrollTrigger: { trigger: rootRef.current, start: 'top 78%', once: true },
        })
      }

      // Grade reveal: the solid wordmark "develops" from the void, left→right,
      // as the closing scrolls through — the loader's grade-wipe motif. Mask
      // wipe on a single solid colour (system bans gradient text).
      if (fillRef.current) {
        gsap.fromTo(
          fillRef.current,
          { '--fill': '0%' },
          {
            '--fill': '100%',
            ease: 'none',
            scrollTrigger: {
              trigger: rootRef.current,
              start: 'top 75%',
              end: 'bottom bottom',
              scrub: 0.6,
            },
          },
        )
      }

      // Reusable setters for the magnetic CTA (one tween each, not a fresh
      // gsap.to per pointermove).
      if (ctaRef.current) {
        xToRef.current = gsap.quickTo(ctaRef.current, 'x', { duration: 0.5, ease: 'power3.out' })
        yToRef.current = gsap.quickTo(ctaRef.current, 'y', { duration: 0.5, ease: 'power3.out' })
      }
      return undefined
    }, rootRef)
    return () => {
      ctx.revert()
      xToRef.current = null
      yToRef.current = null
    }
  }, [reduced])

  // Gentle magnetic pull on the single CTA — power easing (never elastic),
  // damped to a quiet settle, fine-pointer only.
  const onCtaMove = (e) => {
    if (reduced || !xToRef.current || !ctaRef.current) return
    if (window.matchMedia?.('(pointer: coarse)').matches) return
    const r = ctaRef.current.getBoundingClientRect()
    xToRef.current((e.clientX - (r.left + r.width / 2)) * 0.16)
    yToRef.current((e.clientY - (r.top + r.height / 2)) * 0.22)
  }
  const onCtaLeave = () => {
    xToRef.current?.(0)
    yToRef.current?.(0)
  }

  return (
    <section ref={rootRef} className="studio-closing">
      <div className="studio-closing__hud" aria-hidden="true">
        <span>SANTO DOMINGO · RD</span>
        <span>ESC. FINAL</span>
      </div>

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
        <div ref={addReveal} className="studio-closing__cta-wrap">
          <a
            ref={ctaRef}
            className="studio-closing__cta"
            href={contact.primaryCta.href}
            target="_blank"
            rel="noopener noreferrer"
            onPointerMove={onCtaMove}
            onPointerLeave={onCtaLeave}
            onPointerCancel={onCtaLeave}
          >
            <span className="studio-closing__cta-label">{contact.primaryCta.label}</span>
            <svg
              className="studio-closing__cta-arrow"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <path d="M5 12h13" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      <p className="studio-closing__slate" aria-hidden="true">
        Productora audiovisual · Santo Domingo, RD
      </p>

      <div className="studio-closing__wordmark" aria-hidden="true">
        <span className="studio-closing__wordmark-ghost">{brand.name}</span>
        <span ref={fillRef} className="studio-closing__wordmark-fill">
          {brand.name}
        </span>
      </div>
    </section>
  )
}

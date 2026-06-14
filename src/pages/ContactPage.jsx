import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { siteContent } from '../data/siteContent'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'
import './ContactPage.css'

const { brand, contact } = siteContent

const contactChannels = [
  {
    label: 'Email',
    value: brand.email,
    href: `mailto:${brand.email}`,
    external: false,
  },
  {
    label: 'Instagram',
    value: brand.instagramLabel,
    href: brand.instagramHref,
    external: true,
  },
]

export default function ContactPage() {
  const sectionRef = useRef(null)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (reducedMotion) return undefined

    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelector('.contact__title'),
        { yPercent: 100 },
        { yPercent: 0, duration: 0.7, ease: 'expo.out' }
      )

      gsap.fromTo(
        section.querySelectorAll('.contact__fade-in'),
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'expo.out', delay: 0.2 }
      )

      gsap.fromTo(
        section.querySelectorAll('.contact__channel'),
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'expo.out', delay: 0.55 }
      )
    }, section)

    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <section className="contact" ref={sectionRef}>

      <span className="contact__eyebrow contact__fade-in">{contact.eyebrow}</span>

      <div className="contact__title-wrap">
        <h1 className="contact__title">{contact.title}</h1>
      </div>

      <p className="contact__subtitle contact__fade-in">{contact.text}</p>

      <a
        className="contact__cta contact__fade-in"
        href={contact.primaryCta.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {contact.primaryCta.label} &rarr;
      </a>

      <div className="contact__separator" />

      <div className="contact__channels">
        {contactChannels.map((ch) => (
          <a
            key={ch.label}
            className="contact__channel"
            href={ch.href}
            target={ch.external ? '_blank' : undefined}
            rel={ch.external ? 'noopener noreferrer' : undefined}
          >
            <span className="contact__channel-label">{ch.label}</span>
            <span className="contact__channel-arrow" aria-hidden="true">→</span>
            <span className="contact__channel-value">{ch.value}</span>
          </a>
        ))}
      </div>

      <p className="contact__notes">
        {brand.domain}&ensp;·&ensp;{brand.location}
      </p>

    </section>
  )
}

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { siteContent } from '../data/siteContent'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'
import './ContactPage.css'

gsap.registerPlugin(ScrollTrigger)

const { brand, contact } = siteContent

const contactCards = [
  {
    label: 'WhatsApp',
    value: brand.phone,
    href: brand.whatsappHref,
  },
  {
    label: 'Email',
    value: brand.email,
    href: `mailto:${brand.email}`,
  },
  {
    label: 'Instagram',
    value: brand.instagramLabel,
    href: brand.instagramHref,
  },
  {
    label: 'Web',
    value: brand.domain,
    href: null,
  },
]

export default function ContactPage() {
  const sectionRef = useRef(null)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (reducedMotion) {
      return undefined
    }

    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      // Title mask reveal
      gsap.fromTo(
        section.querySelector('.contact__title'),
        { yPercent: 100 },
        {
          yPercent: 0,
          duration: 0.5,
          ease: 'expo.out',
        }
      )

      // Subtitle + CTA stagger fade in
      gsap.fromTo(
        section.querySelectorAll('.contact__fade-in'),
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'expo.out',
          delay: 0.25,
        }
      )

      // Contact cards stagger on scroll
      gsap.fromTo(
        section.querySelectorAll('.contact-card'),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.08,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: section.querySelector('.contact__grid'),
            start: 'top 85%',
          },
        }
      )
    }, section)

    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <section className="contact" ref={sectionRef}>
      {/* Title */}
      <div className="contact__title-wrap">
        <h1 className="contact__title">{contact.title}</h1>
      </div>

      {/* Subtitle */}
      <p className="contact__subtitle contact__fade-in">{contact.text}</p>

      {/* Primary CTA */}
      <a
        className="contact__cta contact__fade-in"
        href={contact.primaryCta.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {contact.primaryCta.label} &rarr;
      </a>

      {/* Separator */}
      <div className="contact__separator contact__fade-in" />

      {/* Contact Grid */}
      <div className="contact__grid">
        {contactCards.map((card) => (
          <div className="contact-card" key={card.label}>
            <div className="contact-card__label">{card.label}</div>
            {card.href ? (
              <a
                className="contact-card__value"
                href={card.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {card.value}
              </a>
            ) : (
              <span className="contact-card__value">{card.value}</span>
            )}
          </div>
        ))}
      </div>

      {/* Notes */}
      <p className="contact__notes">{contact.notes.join(' · ')}</p>
    </section>
  )
}

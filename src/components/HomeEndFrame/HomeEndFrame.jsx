import { siteContent } from '../../data/siteContent'
import TextSwap from '../TextSwap/TextSwap'
import './HomeEndFrame.css'

export default function HomeEndFrame() {
  const currentYear = new Date().getFullYear()

  return (
    <section className="home-end">
      <div className="home-end__center">
        <span className="home-end__eyebrow">{siteContent.contact.eyebrow}</span>
        <a
          href={siteContent.contact.primaryCta.href}
          className="home-end__title"
          target="_blank"
          rel="noopener noreferrer"
        >
          <TextSwap
            label={siteContent.contact.title}
            variant="display"
            className="home-end__title-label"
          />
        </a>
        <p className="home-end__text">{siteContent.contact.text}</p>
      </div>

      <div className="home-end__footer-links">
        <a href={`mailto:${siteContent.brand.email}`} className="home-end__link">
          {siteContent.brand.email}
        </a>
        <a
          href={siteContent.brand.instagramHref}
          className="home-end__link"
          target="_blank"
          rel="noopener noreferrer"
        >
          Instagram
        </a>
        <a
          href={siteContent.brand.whatsappHref}
          className="home-end__link"
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp
        </a>
        <span className="home-end__legal">&copy; Manzana Cuatro {currentYear}</span>
      </div>
    </section>
  )
}

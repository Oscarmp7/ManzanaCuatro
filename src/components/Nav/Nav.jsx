import { useEffect, useRef, useState, useCallback } from 'react'
import { Link, useLocation } from 'react-router'
import gsap from 'gsap'
import { siteContent } from '../../data/siteContent'
import TextSwap from '../TextSwap/TextSwap'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'
import { useThemeContext } from '../../contexts/ThemeContext'
import './Nav.css'

export default function Nav() {
  const { theme, toggleTheme } = useThemeContext()
  const mobileRef = useRef(null)
  const menuButtonRef = useRef(null)
  const previousFocusRef = useRef(null)
  const location = useLocation()
  const isHome = location.pathname === '/'
  const reducedMotion = usePrefersReducedMotion()
  const [scrolled, setScrolled] = useState(false)
  const [homeOnDarkStage, setHomeOnDarkStage] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const navLinks = siteContent.nav
  const desktopLinks = [{ href: '/', label: siteContent.brand.name, kind: 'brand' }, ...navLinks]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!isHome) {
      return undefined
    }

    const syncHomeStage = () => {
      const tone = document.documentElement.dataset.homeReelTone || 'media'
      setHomeOnDarkStage(tone !== 'pure')
    }

    const handleHomeStageChange = (event) => {
      const tone = event.detail && event.detail.tone
      if (typeof tone !== 'string') return
      setHomeOnDarkStage(tone !== 'pure')
    }

    syncHomeStage()
    window.addEventListener('home-reel-stagechange', handleHomeStageChange)

    return () => {
      window.removeEventListener('home-reel-stagechange', handleHomeStageChange)
    }
  }, [isHome])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  useEffect(() => {
    if (menuOpen && mobileRef.current) {
      if (reducedMotion) {
        return undefined
      }

      const links = mobileRef.current.querySelectorAll('.nav__mobile-link')
      gsap.from(links, {
        opacity: 0,
        y: 30,
        stagger: 0.05,
        duration: 0.4,
        ease: 'power3.out',
      })
    }

    return undefined
  }, [menuOpen, reducedMotion])

  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const handleMobileThemeToggle = useCallback(() => {
    toggleTheme()
    closeMenu()
  }, [closeMenu, toggleTheme])

  const isLinkActive = useCallback((href) => {
    if (href === '/') {
      return location.pathname === href
    }

    if (href === '/proyectos') {
      return location.pathname.startsWith('/proyectos')
    }

    return location.pathname === href
  }, [location.pathname])

  useEffect(() => {
    if (!menuOpen || !mobileRef.current) {
      return undefined
    }

    previousFocusRef.current = document.activeElement

    const panel = mobileRef.current
    const focusableSelector =
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    const getFocusable = () =>
      Array.from(panel.querySelectorAll(focusableSelector)).filter(
        (element) => !element.hasAttribute('disabled'),
      )

    const [firstFocusable] = getFocusable()
    const menuButton = menuButtonRef.current

    requestAnimationFrame(() => {
      if (firstFocusable) {
        firstFocusable.focus()
        return
      }

      panel.focus()
    })

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeMenu()
        return
      }

      if (event.key !== 'Tab') {
        return
      }

      const focusableElements = getFocusable()
      const firstFocusable = focusableElements[0]
      const lastFocusable = focusableElements[focusableElements.length - 1]

      if (!firstFocusable || !lastFocusable) {
        event.preventDefault()
        panel.focus()
        return
      }

      if (event.shiftKey && document.activeElement === firstFocusable) {
        event.preventDefault()
        lastFocusable.focus()
        return
      }

      if (!event.shiftKey && document.activeElement === lastFocusable) {
        event.preventDefault()
        firstFocusable.focus()
      }
    }

    panel.addEventListener('keydown', handleKeyDown)

    return () => {
      panel.removeEventListener('keydown', handleKeyDown)

      if (previousFocusRef.current instanceof HTMLElement) {
        previousFocusRef.current.focus()
      } else if (menuButton) {
        menuButton.focus()
      }
    }
  }, [closeMenu, menuOpen])

  const navClassName = `nav${isHome ? ' nav--home' : ''}${
    isHome && homeOnDarkStage ? ' nav--home-stage' : ''
  }${scrolled && !isHome ? ' nav--scrolled' : ''}${menuOpen ? ' nav--menu-open' : ''}`

  return (
    <>
      <header className={navClassName}>
        <div className="nav__inner">
          <div className="nav__desktop-shell">
            <nav className="nav__grid" aria-label="Navegacion principal">
              {desktopLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`nav__item nav__item--${link.kind ?? 'link'}${
                    isLinkActive(link.href) ? ' nav__item--active' : ''
                  }`}
                  aria-current={isLinkActive(link.href) ? 'page' : undefined}
                >
                  {link.kind === 'brand' ? link.label : <TextSwap label={link.label} />}
                </Link>
              ))}
            </nav>

            <div className="nav__mobile-actions">
              <button
                ref={menuButtonRef}
                type="button"
                className={`nav__menu${menuOpen ? ' nav__menu--open' : ''}`}
                onClick={() => setMenuOpen((value) => !value)}
                aria-label={menuOpen ? 'Cerrar menu' : 'Abrir menu'}
                aria-expanded={menuOpen}
                aria-controls="nav-mobile-panel"
              >
                <span className="nav__menu-box" aria-hidden="true">
                  <span className="nav__menu-bar nav__menu-bar--top" />
                  <span className="nav__menu-bar nav__menu-bar--middle" />
                  <span className="nav__menu-bar nav__menu-bar--bottom" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="nav__theme-dock" data-home-stage={isHome && homeOnDarkStage ? 'true' : 'false'}>
        <button
          type="button"
          className="nav__theme-toggle"
          onClick={toggleTheme}
          aria-label={`Tema actual ${theme}. Cambiar a ${theme === 'dark' ? 'light' : 'dark'}`}
        >
          <span className={`nav__theme-option${theme === 'dark' ? ' nav__theme-option--active' : ''}`}>
            Dark
          </span>
          <span className="nav__theme-slash" aria-hidden="true">
            /
          </span>
          <span className={`nav__theme-option${theme === 'light' ? ' nav__theme-option--active' : ''}`}>
            Light
          </span>
        </button>
      </div>

      {menuOpen && (
        <div
          id="nav-mobile-panel"
          className="nav__mobile"
          ref={mobileRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="nav-mobile-title"
          tabIndex={-1}
        >
          <div className="nav__mobile-inner">
            <h2 id="nav-mobile-title" className="nav__mobile-title">
              Menu
            </h2>
            <Link to="/" className="nav__mobile-link nav__mobile-link--brand" onClick={closeMenu}>
              Manzana Cuatro
            </Link>
            {siteContent.nav.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="nav__mobile-link"
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}

            <button
              type="button"
              className="nav__mobile-theme"
              onClick={handleMobileThemeToggle}
            >
              {theme === 'dark' ? 'Cambiar a light' : 'Cambiar a dark'}
            </button>

            <a
              href={siteContent.brand.whatsappHref}
              className="nav__mobile-cta"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
            >
              WhatsApp
            </a>
          </div>
        </div>
      )}
    </>
  )
}

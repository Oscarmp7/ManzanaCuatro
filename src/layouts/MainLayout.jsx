import { Outlet, useLocation } from 'react-router'
import Nav from '../components/Nav/Nav'
import Footer from '../components/Footer/Footer'
import PageTransition from '../components/PageTransition/PageTransition'
import RouteMeta from '../seo/RouteMeta.jsx'
import { useThemeContext } from '../contexts/ThemeContext'

export default function MainLayout() {
  const { theme } = useThemeContext()
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <>
      <RouteMeta theme={theme} />
      <a href="#main-content" className="skip-link">
        Saltar al contenido
      </a>
      <Nav />
      <PageTransition>
        <main id="main-content" tabIndex={-1}>
          <Outlet />
        </main>
        {!isHome && <Footer />}
      </PageTransition>
    </>
  )
}

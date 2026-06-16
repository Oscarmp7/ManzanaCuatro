import { Suspense, lazy, useState, useCallback } from 'react'
import { Routes, Route } from 'react-router'
import MainLayout from './layouts/MainLayout'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'
import Loader from './components/Loader/Loader'
import useTheme from './hooks/useTheme'
import useThemeTransition from './components/ThemeTransition/ThemeTransition'
import { ThemeContext } from './contexts/ThemeContext'

const HomePage = lazy(() => import('./pages/HomePage'))
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'))
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'))
const StudioPage = lazy(() => import('./pages/StudioPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

// The full grade-reveal loader only plays on the first load of the session.
// On later reloads within the same session we skip straight to the composed
// app; internal route changes use the lightweight PageTransition wipe.
const sessionAlreadyLoaded = () => {
  try {
    return sessionStorage.getItem('m4-loaded') === '1'
  } catch {
    return false
  }
}

export default function App() {
  const [loaded, setLoaded] = useState(sessionAlreadyLoaded)
  // True only when the full loader plays this mount → the home reveals its
  // brand subtitle + CTA as the loader hands off.
  const [firstLoad] = useState(() => !sessionAlreadyLoaded())
  const { theme, toggle } = useTheme()
  const { curtain, play } = useThemeTransition(toggle)

  const handleThemeToggle = useCallback(() => play(), [play])
  const handleLoaderComplete = useCallback(() => {
    try {
      sessionStorage.setItem('m4-loaded', '1')
    } catch {
      /* ignore storage failures */
    }
    setLoaded(true)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme: handleThemeToggle }}>
      {!loaded && <Loader onComplete={handleLoaderComplete} />}
      {curtain}
      <div className={`app-shell ${loaded ? 'app-shell--ready' : ''}`}>
        <ErrorBoundary>
          <Suspense fallback={<div className="route-fallback" aria-hidden="true" />}>
            <Routes>
              <Route element={<MainLayout />}>
                <Route index element={<HomePage ready={loaded} firstLoad={firstLoad} />} />
                <Route path="proyectos" element={<ProjectsPage />} />
                <Route path="proyectos/:slug" element={<ProjectDetailPage />} />
                <Route path="studio" element={<StudioPage />} />
                <Route path="contacto" element={<ContactPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </div>
    </ThemeContext.Provider>
  )
}

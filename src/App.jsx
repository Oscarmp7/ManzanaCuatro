import { Suspense, lazy, useState } from 'react'
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

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const { theme, toggle } = useTheme()
  const { curtain, play } = useThemeTransition(toggle)

  const handleThemeToggle = () => play()

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme: handleThemeToggle }}>
      {!loaded && <Loader onComplete={() => setLoaded(true)} />}
      {curtain}
      <div className={`app-shell ${loaded ? 'app-shell--ready' : ''}`}>
        <ErrorBoundary>
          <Suspense fallback={null}>
            <Routes>
              <Route element={<MainLayout />}>
                <Route index element={<HomePage ready={loaded} />} />
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

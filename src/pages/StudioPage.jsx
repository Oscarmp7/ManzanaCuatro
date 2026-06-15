import { siteContent } from '../data/siteContent'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'
import StudioHero from '../components/studio/StudioHero'
import StudioManifesto from '../components/studio/StudioManifesto'
import StudioMarquee from '../components/studio/StudioMarquee'
import StudioServices from '../components/studio/StudioServices'
import StudioBehindScenes from '../components/studio/StudioBehindScenes'
import './StudioPage.css'

export default function StudioPage() {
  const reducedMotion = usePrefersReducedMotion()
  const { about } = siteContent

  return (
    <div className={`page page--studio${reducedMotion ? ' page--reduced-motion' : ''}`}>
      <h1 className="studio__sr-title">{about.eyebrow}</h1>

      <StudioHero />
      <StudioManifesto />
      <StudioMarquee />
      <StudioServices />
      <StudioBehindScenes />
    </div>
  )
}

import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Module singleton so non-hook code (e.g. page transitions) can drive scroll.
let lenisInstance = null
export const getLenis = () => lenisInstance

// Smooth inertia scrolling with Lenis, synced to GSAP's ticker + ScrollTrigger.
// Skipped entirely when `enabled` is false (reduced motion) so native scrolling
// stays in control and the pinned HomeReel keeps its exact behaviour.
export default function useLenis(enabled = true) {
  useEffect(() => {
    if (!enabled) return undefined

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    lenisInstance = lenis

    // Keep ScrollTrigger in sync with Lenis' virtual scroll position.
    lenis.on('scroll', ScrollTrigger.update)

    const onTick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(onTick)
      gsap.ticker.lagSmoothing(500, 33)
      lenis.destroy()
      lenisInstance = null
    }
  }, [enabled])
}

import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Reveals every `[data-reveal]` element once it scrolls into view.
 * Re-runs on route change so newly mounted pages get observed too.
 *
 * ponytail: IntersectionObserver + CSS transitions instead of an animation
 * library. Swap in GSAP/ScrollTrigger only if a section needs pinning or
 * scrub-linked timelines, which plain reveals can't do.
 */
export function useReveal() {
  const { pathname } = useLocation()

  useEffect(() => {
    const targets = document.querySelectorAll('[data-reveal]:not([data-revealed])')

    if (!('IntersectionObserver' in window)) {
      targets.forEach((el) => el.setAttribute('data-revealed', ''))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.setAttribute('data-revealed', '')
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    )

    targets.forEach((el) => observer.observe(el))

    /**
     * Safeguard: never leave an element permanently invisible.
     *
     * An element that was inside a `display: none` ancestor when it was observed
     * never generates an intersection entry, so if a breakpoint change reveals its
     * container it would stay at `opacity: 0` forever — a real hazard here, where
     * sections swap layouts at `lg`. This sweeps anything still unrevealed that is
     * now actually on screen. Also covers a restored scroll position landing past
     * an element before the observer attaches.
     */
    const sweep = () => {
      for (const el of document.querySelectorAll('[data-reveal]:not([data-revealed])')) {
        const rect = el.getBoundingClientRect()
        if (rect.height > 0 && rect.top < window.innerHeight && rect.bottom > 0) {
          el.setAttribute('data-revealed', '')
          observer.unobserve(el)
        }
      }
    }

    window.addEventListener('resize', sweep)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', sweep)
    }
  }, [pathname])
}

import { useEffect, useState } from 'react'

/**
 * Which section is currently "the one you're reading".
 *
 * `rootMargin: -50% 0px -50% 0px` collapses the observer root to a zero-height
 * line across the middle of the viewport, so exactly one section can intersect
 * at a time. Without that, tall adjacent sections are both "visible" and the
 * active state flickers between them.
 */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0])

  useEffect(() => {
    const targets = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (!targets.length) return

    /**
     * Seed from geometry rather than trusting `ids[0]`.
     *
     * The observer only reports sections that intersect the centre line, and it
     * reports nothing at all while that line is inside the footer — which is
     * taller than half a viewport. So on a restored scroll position or a deep
     * link near the end of the page, nothing ever fired and the rail sat there
     * claiming section 01 at the bottom of the document. Picking the last section
     * that has already started fixes the initial state; ordinary scrolling then
     * passes through every section and the observer takes over.
     */
    const mid = window.innerHeight / 2
    let started = targets[0]
    for (const el of targets) {
      if (el.getBoundingClientRect().top <= mid) started = el
    }
    setActive(started.id)

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: '-50% 0px -50% 0px' },
    )

    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids])

  return active
}

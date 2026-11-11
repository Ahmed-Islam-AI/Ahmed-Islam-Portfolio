import { useEffect, useState } from 'react'

/**
 * `prefers-reduced-motion`, read after mount rather than during render.
 *
 * Every page is rendered to HTML at build time (prerender.mjs), where there is
 * no media query to ask, so that HTML is always the animated layout. The
 * browser's first render has to produce the same markup to adopt it, so this
 * starts `false` there too; reduced-motion visitors get one re-render a moment
 * later. Reading `matchMedia` in a `useState` initialiser instead made the two
 * disagree, and React keeps the build-time attributes when they do.
 */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => setReduced(matchMedia('(prefers-reduced-motion: reduce)').matches), [])
  return reduced
}

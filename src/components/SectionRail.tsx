import { useEffect, useState, type CSSProperties } from 'react'

export const SECTIONS = [
  { id: 'hero', index: '01', label: 'Intro' },
  { id: 'about', index: '02', label: 'About' },
  { id: 'experience', index: '03', label: 'Experience' },
  { id: 'skills', index: '04', label: 'Skills' },
  { id: 'services', index: '05', label: 'Services' },
  { id: 'reviews', index: '06', label: 'Reviews' },
  { id: 'method', index: '07', label: 'Method' },
  { id: 'projects', index: '08', label: 'Projects' },
  { id: 'certifications', index: '09', label: 'Certifications' },
  { id: 'contact', index: '10', label: 'Contact' },
]

/**
 * Which kind of band the rails are currently sitting over.
 *
 * Not a boolean, because there are three cases and not two. `dark` and `brand`
 * both want white neutrals, but on `brand` the surface *is* the accent — so
 * anything that signals with orange (the active tick, a hover fill) becomes
 * invisible and has to switch to ink instead. Both rails read this, so the two
 * can never disagree about the band they're on.
 */
export type RailSurface = 'light' | 'dark' | 'brand'

/**
 * Left-gutter progress rail: where you are, how far through, and a way forward.
 *
 * Lives in the `lg:px-20` gutter that every section reserves — the mirror of
 * SocialRail on the right, so neither sits on content.
 */
export default function SectionRail({
  active,
  surface = 'light',
}: {
  active: string
  surface?: RailSurface
}) {
  const [progress, setProgress] = useState(0)
  const onBrand = surface === 'brand'
  const onDark = surface === 'dark'
  const index = Math.max(
    0,
    SECTIONS.findIndex((section) => section.id === active),
  )

  /**
   * The fill and the active tick share one reference: the horizontal centre line
   * of the viewport, which is also exactly what `useActiveSection` keys off (its
   * `rootMargin: -50% 0px -50%` collapses the root to that line).
   *
   * So `index` is which section the centre line is inside, and `within` is how far
   * through that section it has travelled — which means the fill is always
   * somewhere between the active tick and the next one, and reaches the next tick
   * at the same moment `active` flips to it.
   *
   * It used to be raw `scrollY / scrollHeight`, a completely separate model from
   * the observer. With three 220–520vh pinned runways on the page those two
   * diverge badly: measured mid-Method, the active tick was `05` while the fill
   * had only reached `03`.
   */
  useEffect(() => {
    // Coalesced to one measurement per frame. A scroll event can fire several
    // times per frame, and each one here reads a rect (forcing layout) and then
    // sets state — so the rail was re-rendering more often than the screen
    // refreshes, for a bar that only ever moves a few pixels.
    let queued = 0
    const measure = () => {
      queued = 0
      const span = SECTIONS.length - 1
      const el = document.getElementById(SECTIONS[index].id)
      let within = 0
      if (el) {
        const rect = el.getBoundingClientRect()
        if (rect.height > 0) {
          // Capped just short of the next tick. At a full 1.0 the fill lands
          // exactly on the next tick one frame before the observer flips `active`
          // to it, which showed up as a brief 1-step overshoot at a boundary.
          within = Math.min(0.9, Math.max(0, (window.innerHeight / 2 - rect.top) / rect.height))
        }
      }
      setProgress(Math.min(1, (index + within) / span))
    }
    const onScroll = () => {
      if (!queued) queued = requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (queued) cancelAnimationFrame(queued)
    }
  }, [index])

  return (
    <nav
      aria-label="Section progress"
      className="fixed top-1/2 left-4 z-40 hidden -translate-y-1/2 lg:block"
    >
      {/* progress spine */}
      <div
        className={`absolute inset-y-2 left-[0.6875rem] w-px transition-colors duration-500 ${
          onBrand ? 'bg-ink/20' : onDark ? 'bg-white/15' : 'bg-heading/10'
        }`}
        aria-hidden
      >
        {/* Tick centres sit at exactly `i / (SECTIONS.length - 1)` of the spine
            (equal heights, equal gaps), so scaling by that fraction lands the
            fill's bottom edge on the active tick. */}
        <div
          className={`h-full w-px origin-top scale-y-[var(--p)] transition-transform duration-200 ease-out ${
            onBrand ? 'bg-ink' : 'bg-brand'
          }`}
          style={{ '--p': progress } as CSSProperties}
        />
      </div>

      <ul className="relative flex flex-col gap-6">
        {SECTIONS.map((section) => {
          const on = active === section.id
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={on ? 'true' : undefined}
                className="group flex items-center gap-3"
              >
                <span
                  aria-hidden
                  className={`h-px transition-all duration-300 ${
                    on
                      ? `w-6 ${onBrand ? 'bg-ink' : 'bg-brand'}`
                      : `w-3 group-hover:w-5 ${
                          onBrand
                            ? 'bg-ink/30 group-hover:bg-ink/70'
                            : `group-hover:bg-brand/60 ${onDark ? 'bg-white/30' : 'bg-heading/25'}`
                        }`
                  }`}
                />
                <span
                  className={`text-[0.6875rem] font-semibold tracking-[0.14em] tabular-nums transition-colors duration-300 ${
                    on
                      ? onBrand
                        ? 'text-ink'
                        : 'text-brand'
                      : onBrand
                        ? 'text-white/60 group-hover:text-white'
                        : onDark
                          ? 'text-white/35 group-hover:text-white/70'
                          : 'text-heading/30 group-hover:text-heading/60'
                  }`}
                >
                  {section.index}
                </span>
                {/* label slides out on hover so the rail stays quiet at rest */}
                <span
                  className={`pointer-events-none max-w-0 overflow-hidden text-[0.6875rem] font-semibold tracking-[0.14em] whitespace-nowrap uppercase opacity-0 transition-all duration-300 group-hover:max-w-[8rem] group-hover:opacity-100 ${
                    onBrand ? 'text-white' : onDark ? 'text-white/70' : 'text-heading/60'
                  }`}
                >
                  {section.label}
                </span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

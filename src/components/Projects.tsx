import { useEffect, useRef, useState, type CSSProperties, type FocusEvent } from 'react'
import { PROJECTS, type Project } from '../data/projects'
import TechIcon from './TechIcon'

/** Background word. 7 letters => 7 full-width rows at 100vh/7 each. */
const WORD = 'SHIPPED'

/**
 * Repeats per row. Sized for the *narrowest* letter, not the widest: measured at
 * a 129px font, one "I" advances 32px against an "H"'s 94px, so a count that
 * fills the screen with H leaves the I row ending mid-viewport. It also has to
 * cover WORD_DRIFT's overhang at the widest viewport, not just the current one.
 * The panel clips whatever is left over, so over-repeating is free.
 */
const REPEAT = 120

/**
 * How far the background word drifts across the panel, as a fraction of the
 * card row's own travel. Slower than the cards, which is what reads as depth
 * rather than as one layer. REPEAT has to cover this much overhang.
 */
const WORD_DRIFT = 0.16

/**
 * Vertical scroll runway per card, in viewport heights. Higher = slower, more
 * deliberate horizontal travel; lower = snappier. 0.7–0.9 is roughly 1:1
 * vertical-to-horizontal.
 *
 * Dropped 1.3 -> 0.85 when the gallery went from 4 real-ish cards to 7: at 1.3
 * this one section was 9.1 viewport heights of scrolling. 0.85 puts it at 5.95,
 * near where it was at four cards. Same reasoning as Certifications' PACE drop
 * when its deck grew — re-check this if the count changes again.
 */
const PACE = 0.85

const LIVE = PROJECTS.filter((p) => p.status === 'LIVE').length
const SOURCE = PROJECTS.filter((p) => p.href.includes('github.com')).length

const isRepo = (href: string) => new URL(href).host === 'github.com'

/**
 * The destination, printed in the card's footer.
 *
 * For a repo this is the **repo name alone**. It used to print host + owner +
 * repo, but `github.com/Ahmed-Islam-AI/` is the identical first 24 characters on
 * six of the seven cards, so `truncate` ate the only part that said anything.
 * The GitHub mark beside the label already carries which host it is.
 *
 * The one live site keeps its host, which is the useful thing there.
 */
function urlLabel(href: string) {
  const url = new URL(href)
  if (url.host === 'github.com') {
    return decodeURIComponent(url.pathname.split('/').filter(Boolean)[1] ?? url.host)
  }
  return url.host.replace(/^www\./, '') + url.pathname.replace(/\/$/, '')
}

export default function Projects() {
  const track = useRef<HTMLDivElement>(null)
  const row = useRef<HTMLDivElement>(null)
  const word = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [reduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  // Vertical progress through the runway -> horizontal offset of the card row.
  // The transform is written directly in a rAF loop rather than through state:
  // a scroll-triggered re-render per frame would drop frames on a 7-card strip.
  // Reading the rect every frame also makes resize handling free — no listener.
  useEffect(() => {
    if (reduced) return
    const el = track.current
    if (!el) return

    let raf = 0
    const frame = () => {
      raf = requestAnimationFrame(frame)
      const strip = row.current
      const lane = strip?.parentElement
      if (!strip || !lane) return

      const rect = el.getBoundingClientRect()
      const scrollable = rect.height - window.innerHeight
      const p = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0

      // Horizontal at every width — the lane is `flex-row` throughout, so a phone
      // gets the same right-to-left gallery as the desktop, just with one card in
      // view at a time.
      const travel = Math.max(0, strip.scrollWidth - lane.clientWidth)
      strip.style.transform = `translate3d(${(-p * travel).toFixed(2)}px,0,0)`

      // The word drifts slower than the cards, so the background reads as a
      // deeper layer instead of a static backdrop.
      if (word.current) {
        word.current.style.transform = `translate3d(${(-p * travel * WORD_DRIFT).toFixed(2)}px,0,0)`
      }

      // Identical values bail out of React's update, so this is a no-op most frames.
      setActive(Math.min(PROJECTS.length - 1, Math.floor(p * PROJECTS.length)))
    }

    // Run the loop only while the runway is on screen — a permanent rAF loop
    // would burn frames for the whole page.
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!raf) frame()
      } else if (raf) {
        cancelAnimationFrame(raf)
        raf = 0
      }
    })
    io.observe(el)

    return () => {
      io.disconnect()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [reduced])

  // While pinned, an off-screen card is unreachable — the row is transformed,
  // not scrolled, so the browser can't bring a focused card into view itself.
  // Keyboard focus therefore drives the page scroll to that card's position.
  const focusCard = (i: number) => (event: FocusEvent<HTMLAnchorElement>) => {
    if (reduced || !event.currentTarget.matches(':focus-visible')) return
    const el = track.current
    if (!el) return
    const scrollable = el.offsetHeight - window.innerHeight
    if (scrollable <= 0) return
    const top = el.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: top + (i / Math.max(1, PROJECTS.length - 1)) * scrollable })
  }

  const heading = (
    <>
      <p className="text-eyebrow flex gap-2 text-white/40 uppercase">
        <span className="text-brand">08</span>
        <span aria-hidden>/</span>
        <span>Projects</span>
      </p>
      {/* text-display like every other section heading. With the screenshot
          frames gone the cards are narrower, which is what leaves room for it
          inside the pinned panel. */}
      <h2 className="type-hero mt-4 text-display leading-[0.95] uppercase">
        <span className="block text-white">Things I&rsquo;ve</span>
        <span className="block text-white/25">
          shipped<span className="text-brand">.</span>
        </span>
      </h2>
    </>
  )

  const meta = (
    <div className="flex flex-col items-start gap-3 sm:items-end">
      <p className="inline-flex items-center gap-2.5 rounded-full bg-white/[0.06] px-4 py-2 font-mono text-[0.6875rem] tracking-[0.12em] text-dark-muted uppercase ring-1 ring-white/10">
        <span aria-hidden className="size-1.5 rounded-full bg-brand" />
        {/* Both counts are derived, so the pill can't drift from the array. */}
        {PROJECTS.length} builds
        <span aria-hidden className="text-white/25">·</span>
        {LIVE} live
        <span aria-hidden className="text-white/25">·</span>
        {SOURCE} open source
      </p>
      {/* Turns the section from "seven cards" into "seven of my repos, and here
          is the rest" — the cheapest credibility a project gallery can buy. */}
      <a
        href="https://github.com/Ahmed-Islam-AI"
        target="_blank"
        rel="noopener noreferrer"
        // py/-my rather than a taller box: STYLE.md's 44px target floor, paid for
        // out of the surrounding gap so the header block doesn't grow.
        className="group -my-2.5 inline-flex items-center gap-2 py-3.5 text-[0.75rem] font-semibold tracking-[0.14em] text-brand-bright uppercase transition-colors hover:text-white"
      >
        <TechIcon name="GitHub" className="size-3.5 shrink-0" />
        All repositories
        <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
          &rarr;
        </span>
      </a>
    </div>
  )

  return (
    // No `overflow-hidden` on the section or the runway: a clipped ancestor
    // becomes the sticky panel's scroll container and sticky silently stops
    // working. The panel clips itself instead, which is fine.
    <section id="projects" className="relative scroll-mt-28 bg-ink">
      {/* ── Pinned gallery, every width ─────────────────────── */}
      {!reduced && (
        <div
          ref={track}
          style={{ height: `${Math.round(100 * PACE * PROJECTS.length)}vh` }}
        >
          <div className="pt-nav sticky top-0 relative isolate flex h-screen flex-col overflow-hidden pb-8 lg:pb-12">
            {/* Giant word: one full-width row per letter, drifting with the scroll
                and tinted to the card currently in view. Never announced. */}
            <div
              ref={word}
              aria-hidden
              // Texture, not subject. The accents are spread across the warm range
              // rather than being near-identical oranges, which looked like no
              // change at all.
              //
              // 0.11 -> 0.05 when the screenshots were removed. That value was
              // tuned against bright photographic cards; against the quiet dark
              // cards that replaced them the letters read as a heavy stripe
              // pattern competing with the content, and SHIPPED was comfortably
              // legible — which is STYLE.md's definition of a watermark that is
              // too strong. Re-check this if the cards ever get louder again.
              className="pointer-events-none absolute inset-0 -z-10 flex flex-col justify-center opacity-[0.05] transition-colors duration-700 will-change-transform"
              style={{ color: PROJECTS[active].accentColor }}
            >
              {[...WORD].map((letter, i) => (
                <span
                  key={i}
                  className="type-hero block leading-[0.9] tracking-[-0.06em] whitespace-nowrap"
                  style={{ fontSize: `${100 / WORD.length}vh` }}
                >
                  {letter.repeat(REPEAT)}
                </span>
              ))}
            </div>

            {/* Same container as every other section, so the index gutter lines
                up: px on the outside, max-w-6xl centred within it. */}
            <div className="w-full shrink-0 px-4 sm:px-6 lg:px-20">
              <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
                <div>{heading}</div>
                {meta}
              </div>
            </div>

            {/* The edge mask runs at every width: below lg there are no gutter
                rails to clear, but a card sliding off a hard edge reads as clipped
                whereas a fade reads as continuing. */}
            <div className="edge-mask-x mt-6 min-h-0 flex-1 overflow-hidden lg:mt-10">
              <div
                ref={row}
                className="flex h-full w-max items-center gap-5 px-4 will-change-transform sm:px-6 lg:gap-8 lg:px-20"
              >
                {PROJECTS.map((project, i) => (
                  <Card
                    key={project.slug}
                    project={project}
                    index={i}
                    on={i === active}
                    onFocus={focusCard(i)}
                    // Equal heights, capped: `h-full` against a lane with a
                    // definite height gives one clean baseline across the row,
                    // and the cap stops a tall viewport stretching each card into
                    // a thin column with its content floating in the middle.
                    className="h-full max-h-[30rem] w-[85vw] max-w-[24rem] lg:w-[23rem]"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Reduced motion only: plain stacked grid ─────────────
          Rendered instead of the runway, not alongside it, so there's no
          scroll-driven transform and no duplicate set of links in the DOM. */}
      {reduced && (
        <div className="px-4 py-20 sm:px-6 lg:px-20 lg:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
              <div data-reveal>{heading}</div>
              <div data-reveal className="[--reveal-delay:80ms]">
                {meta}
              </div>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {PROJECTS.map((project, i) => (
                <div
                  key={project.slug}
                  data-reveal
                  className="flex"
                  style={{ '--reveal-delay': `${160 + i * 70}ms` } as CSSProperties}
                >
                  <Card project={project} index={i} on={false} className="w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

/**
 * A project card.
 *
 * Deliberately carries **no imagery** — see the note at the top of
 * `data/projects.ts`. What a developer reading this page wants is what the thing
 * does and what it is built with, and neither was on the card before. The
 * stack-chip markup is lifted verbatim from the Work switcher so "a technology"
 * looks identical in both sections.
 *
 * `className` supplies the width and height; the card fills whatever it is given
 * and pushes its stack and footer to the bottom with `mt-auto`, so a row of
 * cards shares one baseline whatever their copy length.
 */
function Card({
  project,
  index,
  on,
  className,
  onFocus,
}: {
  project: Project
  index: number
  on: boolean
  className: string
  onFocus?: (event: FocusEvent<HTMLAnchorElement>) => void
}) {
  const live = project.status === 'LIVE'
  const repo = isRepo(project.href)
  return (
    // A real external anchor, not a router <Link>: every project points at a live
    // site or a public repo. `/work/:slug` is still a stub route in App.tsx and
    // nothing links to it any more.
    <a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      onFocus={onFocus}
      aria-label={`${project.name} — opens the ${live ? 'live site' : 'source repository'} in a new tab`}
      className={`group flex shrink-0 flex-col rounded-[1.75rem] bg-ink-raised p-6 shadow-[0_30px_60px_-34px_rgb(0_0_0/0.85)] ring-1 transition-all duration-500 hover:ring-white/25 lg:p-7 lg:short:p-6 ${
        on ? 'ring-white/25' : 'ring-white/12'
      } ${className}`}
    >
      {/* Machine metadata row: index and status, both mono. */}
      <div className="flex shrink-0 items-center justify-between gap-3 font-mono text-[0.6875rem] tracking-[0.14em]">
        <span className="text-brand">{String(index + 1).padStart(2, '0')}</span>
        <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-dark-muted ring-1 ring-white/10">
          {project.status}
        </span>
      </div>

      <h3 className="type-hero mt-6 text-xl leading-[1.15] text-white transition-colors group-hover:text-brand-bright lg:mt-7 lg:text-2xl lg:short:mt-5 lg:short:text-xl">
        {project.name}
      </h3>

      <p className="mt-3 max-w-[42ch] text-sm leading-relaxed text-dark-muted">
        {project.summary}
      </p>

      {/* Only one project's README states a metric. Rendering it as mono keeps it
          reading as a measurement rather than a marketing line. */}
      {project.metric && (
        <p className="mt-3 font-mono text-xs tracking-[0.04em] text-brand-bright">
          {project.metric}
        </p>
      )}

      {/* mt-auto pins the stack and footer to the bottom, so cards of different
          copy length still line up along one baseline. */}
      <ul className="mt-auto flex flex-wrap gap-2 pt-6">
        {project.stack.map((tool) => (
          <li
            key={tool}
            className="flex items-center gap-1.5 rounded-lg bg-white/[0.06] px-2.5 py-1.5 text-xs font-semibold text-dark-muted ring-1 ring-white/10"
          >
            <TechIcon name={tool} className="size-3.5 shrink-0 text-brand-bright" />
            {tool}
          </li>
        ))}
      </ul>

      <div className="mt-5 flex shrink-0 items-center gap-2.5 border-t border-white/10 pt-4 lg:short:mt-4">
        {repo && <TechIcon name="GitHub" className="size-3.5 shrink-0 text-white/40" />}
        <span className="truncate font-mono text-xs text-white/40">
          {urlLabel(project.href)}
        </span>
        <span
          aria-hidden
          className="ml-auto shrink-0 text-brand-bright transition-transform group-hover:translate-x-0.5"
        >
          &rarr;
        </span>
      </div>
    </a>
  )
}

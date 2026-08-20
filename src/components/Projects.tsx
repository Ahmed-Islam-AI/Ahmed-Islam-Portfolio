import { useEffect, useRef, useState, type CSSProperties, type FocusEvent } from 'react'
import { PROJECTS, type Project } from '../data/projects'

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

/** Screenshot proportions, and the height the label row costs below the frame. */
const FRAME_RATIO = 16 / 10
const LABEL_H = 48

/**
 * Hard cap on card width, in px. Without it the card is purely height-derived and
 * grows with the viewport — at 1440x900 that made a 859x537 frame, which read as
 * one giant screenshot rather than a gallery. 640 keeps roughly two cards in view
 * and a 640x400 frame, which is a believable screenshot size.
 */
const CARD_MAX = 640

const LIVE = PROJECTS.filter((p) => p.status === 'LIVE').length
const SOURCE = PROJECTS.filter((p) => p.href.includes('github.com')).length

/**
 * What the fake browser chrome shows. It used to print `/work/{slug}`, a route
 * that is still only a stub — now that every card opens a real destination, the
 * chrome should name that destination or it is just decoration.
 *
 * Trimmed to two path segments: one project links to a subfolder deep inside a
 * repo, and the full path renders as pure ellipsis in a `truncate` pill.
 */
function urlLabel(href: string) {
  const url = new URL(href)
  const path = url.pathname.split('/').filter(Boolean).slice(0, 2).join('/')
  return decodeURIComponent(url.host.replace(/^www\./, '') + (path ? `/${path}` : ''))
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
  // a scroll-triggered re-render per frame would drop frames on a 4-card strip.
  // Reading the rect every frame also makes resize handling free — no listener.
  useEffect(() => {
    if (reduced) return
    const el = track.current
    if (!el) return

    let raf = 0
    let lastLane = 0
    const frame = () => {
      raf = requestAnimationFrame(frame)
      const strip = row.current
      const lane = strip?.parentElement
      if (!strip || !lane) return

      // Card width comes from the height the panel actually has, so the frame
      // keeps screenshot proportions and the label row can never fall below the
      // fold — the card is pinned, so anything past the fold is unreachable.
      // Only on change: writing a custom property every frame would force a
      // synchronous layout before the scrollWidth read below.
      if (lane.clientHeight !== lastLane) {
        lastLane = lane.clientHeight
        // Height-derived first, then bounded so a card never eats the whole
        // viewport. The height is set back from the final width rather than
        // left at 100%, or a width-bounded card would stretch past 16:10.
        const width = Math.min(
          (lastLane - LABEL_H) * FRAME_RATIO,
          window.innerWidth * 0.78,
          CARD_MAX,
        )
        lane.style.setProperty('--card-w', `${Math.round(width)}px`)
      }

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
      {/* text-display like every other section heading; the CARD_MAX cap is what
          leaves room for it inside the pinned panel. */}
      <h2 className="type-hero mt-4 text-display leading-[0.95] uppercase">
        <span className="block text-white">Things I&rsquo;ve</span>
        <span className="block text-white/25">
          shipped<span className="text-brand">.</span>
        </span>
      </h2>
    </>
  )

  const pill = (
    <p className="inline-flex items-center gap-2.5 self-start rounded-full bg-white/[0.06] px-4 py-2 text-[0.6875rem] font-semibold tracking-[0.14em] text-dark-muted uppercase ring-1 ring-white/10">
      <span aria-hidden className="size-1.5 rounded-full bg-brand" />
      The work
      <span aria-hidden className="text-white/25">·</span>
      {/* Both counts are derived, so the pill can't drift from the array. It read
          "{n} builds, {n} live" when three of four statuses were placeholders;
          with one deployed product and six public repos, the repo count is the
          number that actually says something. */}
      {PROJECTS.length} builds, {LIVE} live, {SOURCE} open source
    </p>
  )

  return (
    // No `overflow-hidden` on the section or the runway: a clipped ancestor
    // becomes the sticky panel's scroll container and sticky silently stops
    // working. The panel clips itself instead, which is fine.
    <section id="projects" className="relative scroll-mt-28 bg-ink">
      {/* ── Pinned gallery, every width ───────────────────────
          The lane is a row from lg and a column below it, so the same runway,
          giant word and colour swap run on a phone — only the axis the cards
          travel along changes. */}
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
              // Texture, not subject: at 0.16 the letters read louder than the
              // cards. Low enough that the uneven row weights ("I" is a much
              // thinner row than "S") stop reading as a mistake, but the tint
              // change still has to be legible — that's why the four accents are
              // spread across the warm range rather than four near-identical
              // oranges, which looked like no change at all.
              className="pointer-events-none absolute inset-0 -z-10 flex flex-col justify-center opacity-[0.11] transition-colors duration-700 will-change-transform"
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
                {pill}
              </div>
            </div>

            {/* The edge mask now runs at every width: below lg there are no gutter
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
                    on={i === active}
                    onFocus={focusCard(i)}
                    className="w-[85vw] max-w-[26rem] lg:w-[var(--card-w,34rem)] lg:max-w-none"
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
          <div data-reveal>{heading}</div>
          <div data-reveal className="mt-8 [--reveal-delay:80ms]">
            {pill}
          </div>
          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {PROJECTS.map((project, i) => (
              <div
                key={project.slug}
                data-reveal
                style={{ '--reveal-delay': `${160 + i * 70}ms` } as CSSProperties}
              >
                <Card project={project} on={false} className="w-full" />
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
 * Browser-window frame + label row.
 *
 * `className` supplies the width only — `aspect-[16/10]` on the frame turns that
 * into its height and the card's own height follows, so a screenshot keeps its
 * proportions in both layouts. Aspect ratio can't run the other way here (a
 * width derived from a flexed height): the card is a column flex container, so
 * `align-items: stretch` sizes the frame's width from the card and the ratio is
 * ignored — it measured 198x537. The pinned panel therefore computes `--card-w`
 * from its own height, which is what keeps the label row above the fold.
 */
function Card({
  project,
  on,
  className,
  onFocus,
}: {
  project: Project
  on: boolean
  className: string
  onFocus?: (event: FocusEvent<HTMLAnchorElement>) => void
}) {
  const live = project.status === 'LIVE'
  return (
    // A real external anchor, not a router <Link>: every project now points at a
    // live site or a public repo. `/work/:slug` is still a stub route in App.tsx
    // and nothing links to it any more.
    <a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      onFocus={onFocus}
      aria-label={`${project.name} — opens the ${live ? 'live site' : 'source repository'} in a new tab`}
      className={`group flex shrink-0 flex-col ${className}`}
    >
      <div
        className={`flex aspect-[16/10] flex-col overflow-hidden rounded-[1.75rem] bg-ink-raised shadow-[0_30px_60px_-34px_rgb(0_0_0/0.85)] ring-1 transition-all duration-500 group-hover:ring-white/25 ${
          on ? 'ring-white/25' : 'ring-white/12'
        }`}
      >
        {/* window chrome */}
        <div className="flex shrink-0 items-center gap-1.5 border-b border-white/10 px-4 py-3">
          <span aria-hidden className="size-2.5 rounded-full bg-white/20" />
          <span aria-hidden className="size-2.5 rounded-full bg-white/12" />
          <span aria-hidden className="size-2.5 rounded-full bg-white/12" />
          <span
            aria-hidden
            className="ml-3 truncate rounded-full bg-white/[0.05] px-3 py-1 text-[0.6875rem] tracking-[0.06em] text-white/30"
          >
            {urlLabel(project.href)}
          </span>
        </div>

        {project.image ? (
          <img
            src={project.image}
            alt=""
            width={1280}
            height={800}
            // Off-screen cards are genuinely off-screen (the lane clips them), so
            // lazy actually defers here rather than being a no-op.
            loading="lazy"
            decoding="async"
            className="min-h-0 w-full flex-1 object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <span className="grid min-h-0 flex-1 place-items-center bg-white/[0.03] text-[0.6875rem] font-semibold tracking-[0.16em] text-white/25 uppercase">
            Screenshot
          </span>
        )}
      </div>

      {/* label row, outside the frame */}
      <div className="mt-4 flex shrink-0 items-center gap-3">
        {/* Monogram, not a logo — same call as the Work switcher. It is the one
            place a project's accent colour appears as a fill. */}
        <span
          aria-hidden
          style={{ backgroundColor: project.accentColor }}
          className="grid size-8 shrink-0 place-items-center rounded-lg text-[0.8125rem] font-bold text-white"
        >
          {project.name[0]}
        </span>
        <span className="truncate text-sm font-semibold text-white transition-colors group-hover:text-brand-bright">
          {project.name}
        </span>
        <span className="ml-auto shrink-0 rounded-full bg-white/[0.06] px-3 py-1.5 text-[0.6875rem] font-semibold tracking-[0.12em] text-dark-muted uppercase ring-1 ring-white/10">
          {project.status}
        </span>
      </div>
    </a>
  )
}

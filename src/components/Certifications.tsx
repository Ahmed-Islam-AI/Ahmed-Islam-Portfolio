import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { CERTIFICATIONS, type Certification } from '../data/certifications'

/**
 * Viewport heights of runway per card, plus one for the settle at each end.
 *
 * Dropped 0.6 -> 0.4 when the deck went from 5 cards to 11: at 0.6 the section
 * alone was 7.6 viewport heights of scrolling, which is a long time to spend in
 * one band. 0.4 puts it at 5.4 and each card still gets a visible hold.
 */
const PACE = 0.4

/**
 * Fraction of each card's slot spent fully settled, at each end. 0.35 means a
 * card holds still for the first and last 35% of its slot and swaps across the
 * middle 30% — that hold is what makes it read as a deck being dealt rather than
 * a continuous slide. 0 removes the hold entirely.
 */
const HOLD = 0.35

const ISSUERS = new Set(CERTIFICATIONS.map((c) => c.issuer)).size

export default function Certifications({
  /** Section background. Any CSS colour; lands on the `--cert-bg` variable. */
  background = 'var(--color-brand)',
}: {
  background?: string
}) {
  const track = useRef<HTMLDivElement>(null)
  const deck = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [reduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    if (reduced) return
    const el = track.current
    if (!el) return

    let raf = 0
    const frame = () => {
      raf = requestAnimationFrame(frame)
      const cards = deck.current?.children
      if (!cards) return

      // Progress through the runway: 0 when its top hits the viewport top, 1
      // when its bottom does — exactly the span the panel stays pinned for.
      const rect = el.getBoundingClientRect()
      const scrollable = rect.height - window.innerHeight
      const p = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0

      // Progress -> a continuous "card index" t, where t === i means card i is
      // exactly on top. One slot per card, offset by half a slot so the first
      // and last cards get a settle at the ends instead of being on top for a
      // single instant. Within a slot, HOLD flattens both ends and a smoothstep
      // eases the swap between them, so t moves in steps rather than linearly.
      const raw = Math.min(CERTIFICATIONS.length - 1, Math.max(0, p * CERTIFICATIONS.length - 0.5))
      const index = Math.floor(raw)
      const f = raw - index
      const swap = Math.min(1, Math.max(0, (f - HOLD) / (1 - 2 * HOLD)))
      const t = index + swap * swap * (3 - 2 * swap)

      for (let i = 0; i < cards.length; i++) {
        const card = cards[i] as HTMLElement
        // Signed distance from the top of the deck. Negative = already dealt
        // (slides up and out), positive = still to come (waits below, scaled
        // down). Both fade, so only the card at d ~ 0 is fully opaque.
        const d = i - t
        const abs = Math.abs(d)
        card.style.opacity = String(Math.max(0, 1 - abs * 0.9))
        card.style.transform = `translate3d(0,${(d * 44).toFixed(1)}px,0) scale(${(
          1 - Math.min(abs, 2) * 0.06
        ).toFixed(3)})`
        // Nearest to the top of the deck paints last. The `d >= 0` bias breaks
        // the tie mid-swap so the incoming card crosses over the outgoing one.
        card.style.zIndex = String(Math.round(100 - abs * 10) + (d >= 0 ? 1 : 0))
      }

      if (bar.current) bar.current.style.transform = `scaleX(${Math.max(p, 0.004)})`
      // Identical values bail out of React's update, so this is a no-op most frames.
      setActive(Math.round(t))
    }

    // Run only while the runway is on screen. Below `lg` it's display:none, so
    // the observer never fires and the loop never starts — that's the mobile
    // guard as well as the idle guard.
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

  const label = (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
      <p className="text-eyebrow flex items-center gap-2 uppercase">
        <span className="text-ink">09</span>
        <span aria-hidden className="text-white/50">
          /
        </span>
        <span aria-hidden className="size-1.5 rounded-full bg-ink" />
        <span className="text-white">Certifications</span>
      </p>
      <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-white/60 uppercase">
        {CERTIFICATIONS.length} certifications
        <span aria-hidden className="mx-2 text-ink/40">
          ·
        </span>
        {ISSUERS} issuers
      </p>
    </div>
  )

  const headline = (
    <h2 className="type-hero mt-6 text-display leading-[0.92] uppercase">
      <span className="block text-white">Certified.</span>
      <span className="block text-white/40">
        Then applied<span className="text-ink">.</span>
      </span>
    </h2>
  )

  return (
    // No `overflow-hidden` anywhere above the sticky panel: a clipped ancestor
    // becomes its scroll container and sticky silently stops working.
    <section
      id="certifications"
      className="relative scroll-mt-28 bg-[var(--cert-bg)]"
      style={{ '--cert-bg': background } as CSSProperties}
    >
      {/* ── Pinned card-swap deck, every width ───────────────────
          One card dealt over the last, on a phone as well as the desktop. It used
          to fall back to a plain list of five cards below lg, which lost the
          effect entirely. */}
      {!reduced && (
        <div
          ref={track}
          style={{ height: `${Math.round(100 * (CERTIFICATIONS.length * PACE + 1))}vh` }}
        >
          <div className="pt-nav sticky top-0 flex h-screen flex-col px-4 pb-8 sm:px-6 lg:px-20 lg:pb-12">
            <div className="mx-auto w-full max-w-6xl">
              {label}
              {headline}
            </div>

            {/* mt-auto drops the deck into the lower portion of the panel */}
            <div className="mx-auto mt-auto w-full max-w-6xl">
              <div className="max-w-[46rem]">
                {/* Fixed height: the cards are absolutely positioned, so the
                    container has to carry the height itself, and a uniform one
                    keeps the underline from moving as the deck swaps. */}
                <div ref={deck} className="relative h-[19rem] sm:h-[17.5rem] xl:h-[18.5rem]">
                  {CERTIFICATIONS.map((cert, i) => (
                    <Card key={cert.id} cert={cert} on={i === active} />
                  ))}
                </div>

                <div className="mt-7 flex items-center gap-4">
                  <div className="h-px flex-1 bg-white/25">
                    <div
                      ref={bar}
                      aria-hidden
                      className="h-px origin-left bg-white"
                      style={{ width: '100%', transform: 'scaleX(0.004)' }}
                    />
                  </div>
                  <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-white tabular-nums">
                    {String(active + 1).padStart(2, '0')}
                    <span aria-hidden className="text-white/40">
                      {' '}
                      / {String(CERTIFICATIONS.length).padStart(2, '0')}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Reduced motion only: plain stacked list ─────────────
          Rendered instead of the runway, so there's no scroll-driven transform and
          no duplicate set of cards sitting hidden in the DOM. */}
      {reduced && (
      <div className="section-y px-4 sm:px-6 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <div data-reveal>{label}</div>
          <div data-reveal className="[--reveal-delay:70ms]">
            {headline}
          </div>
          <ul className="mt-10 grid max-w-[46rem] gap-5">
            {CERTIFICATIONS.map((cert, i) => (
              <li
                key={cert.id}
                data-reveal
                style={{ '--reveal-delay': `${150 + i * 70}ms` } as CSSProperties}
              >
                <Card cert={cert} on stacked />
              </li>
            ))}
          </ul>
        </div>
      </div>
      )}
    </section>
  )
}

/**
 * In the deck every card is stacked on top of the others, so the inactive ones
 * are transparent but still in the layout. They therefore have to be inert:
 * `aria-hidden` and `pointer-events-none` keep them off the a11y tree and stop a
 * click landing on an invisible card, and a card that is a link also needs
 * `tabIndex={-1}` or keyboard users tab into something they cannot see.
 */
function Card({
  cert,
  on,
  stacked = false,
}: {
  cert: Certification
  on: boolean
  stacked?: boolean
}) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-4">
        <p className="type-hero text-4xl leading-none text-brand sm:text-5xl">{cert.highlight}</p>
        <p className="shrink-0 rounded-full px-3 py-1.5 text-[0.6875rem] font-semibold tracking-[0.12em] text-muted uppercase ring-1 ring-heading/15 tabular-nums">
          {cert.date}
        </p>
      </div>

      <h3 className="type-hero mt-6 text-h3 text-heading">{cert.name}</h3>
      <p className="mt-1.5 text-sm font-semibold text-heading/70">{cert.issuer}</p>
      <p className="mt-3 max-w-[52ch] text-sm text-muted">{cert.detail}</p>

      <ul className="mt-auto flex flex-wrap gap-2 pt-6">
        {cert.badges.map((badge) => (
          <li
            key={badge}
            className="rounded-full px-3 py-1.5 text-[0.6875rem] font-semibold tracking-[0.12em] text-heading/70 uppercase ring-1 ring-heading/15"
          >
            {badge}
          </li>
        ))}
        {/* "View", not "Verify" — the hrefs point at a LinkedIn certifications
            list rather than a per-credential page, so claiming verification would
            be overstating what the link does. */}
        {cert.href && (
          <li className="ml-auto self-center text-[0.6875rem] font-semibold tracking-[0.14em] text-brand uppercase group-hover:text-brand-deep">
            View &rarr;
          </li>
        )}
      </ul>
    </>
  )

  const shell = `group flex flex-col rounded-[1.75rem] bg-paper p-8 shadow-[0_30px_60px_-30px_rgb(20_19_18/0.45)] sm:p-10 ${
    stacked ? '' : 'absolute inset-0 will-change-transform'
  } ${on ? '' : 'pointer-events-none'}`

  if (!cert.href) {
    return (
      <div className={shell} aria-hidden={on ? undefined : true}>
        {body}
      </div>
    )
  }

  return (
    <a
      href={cert.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${cert.name} — ${cert.issuer}, opens the credential listing in a new tab`}
      aria-hidden={on ? undefined : true}
      tabIndex={on ? undefined : -1}
      className={shell}
    >
      {body}
    </a>
  )
}

import { useEffect, useRef, useState } from 'react'

const STATS = [
  {
    value: 50,
    suffix: '+',
    label: 'Satisfied clients',
    icon: (
      <>
        <circle cx="9.5" cy="8" r="3.5" />
        <path d="M3.5 19v-1.25A3.75 3.75 0 0 1 7.25 14h4.5a3.75 3.75 0 0 1 3.75 3.75V19" />
        <path d="M16.5 5.4a3 3 0 0 1 0 5.2" />
        <path d="M20.5 19v-1.25a3.75 3.75 0 0 0-2.6-3.57" />
      </>
    ),
  },
  {
    value: 70,
    suffix: '+',
    label: 'Projects completed',
    icon: (
      <>
        <rect x="3.75" y="3.75" width="16.5" height="16.5" rx="3" />
        <path d="M8.25 12.25 11 15l5-5.5" />
      </>
    ),
  },
  {
    value: 2,
    suffix: '+',
    label: 'Years of experience',
    icon: (
      <>
        <circle cx="12" cy="12" r="8.25" />
        <path d="M12 7.5v5l3.25 1.9" />
      </>
    ),
  },
]

/** Long enough that the climb reads as counting, not a blur. It was 1500ms,
 *  and with ease-out most of that was spent in the first half-second. */
const DURATION = 2400

/** How long each stat rests on a phone before the carousel moves on. */
const DWELL = 3200

/** Counts 0 → value once `run` flips true. Jumps straight to the value when the
 *  visitor prefers reduced motion. */
function Counter({ value, suffix, run }: { value: number; suffix: string; run: boolean }) {
  const [shown, setShown] = useState(0)

  useEffect(() => {
    if (!run) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(value)
      return
    }

    let frame = 0
    const started = performance.now()

    const tick = (now: number) => {
      const p = Math.min((now - started) / DURATION, 1)
      setShown(Math.round(value * (1 - (1 - p) ** 3))) // easeOutCubic
      if (p < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [run, value])

  return (
    <>
      {shown}
      <span className="text-brand/70">{suffix}</span>
    </>
  )
}

function Stat({ stat, run }: { stat: (typeof STATS)[number]; run: boolean }) {
  return (
    <>
      <span
        aria-hidden
        className="grid size-14 shrink-0 place-items-center rounded-full text-brand-bright ring-1 ring-white/15"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-6"
        >
          {stat.icon}
        </svg>
      </span>

      <div>
        <p className="type-hero text-[2rem] text-brand-bright tabular-nums sm:text-4xl">
          <span aria-hidden>
            <Counter value={stat.value} suffix={stat.suffix} run={run} />
          </span>
          <span className="sr-only">
            {stat.value}
            {stat.suffix}
          </span>
        </p>
        <p className="mt-0.5 text-sm text-dark-muted">{stat.label}</p>
      </div>
    </>
  )
}

export default function StatsBar() {
  const card = useRef<HTMLDivElement>(null)
  const rail = useRef<HTMLUListElement>(null)
  const [inView, setInView] = useState(false)
  const [counting, setCounting] = useState(false)
  // Phone carousel state. `active` is the stat on screen; `seen` latches each
  // one the first time it is, so a stat counts up when you can see it rather
  // than finishing off the edge of the card. `auto` goes false for good the
  // moment the visitor swipes the rail: they've taken over. There are no page
  // dots (tried, and cut on Ahmed's call 2026-10-25 — they read as clutter on a
  // three-number card), so a swipe is the one way to stop the motion, which
  // is the "mechanism to stop" WCAG 2.2.2 asks of auto-moving content.
  const [phone, setPhone] = useState(false)
  const [active, setActive] = useState(0)
  const [seen, setSeen] = useState(() => STATS.map((_, i) => i === 0))
  const [auto, setAuto] = useState(true)
  // A finger is on the rail. The rail scrolling while this is true is a swipe,
  // which stops the autoplay. A touch alone doesn't: a thumb resting on the
  // card while scrolling the *page* never scrolls the rail sideways.
  const touching = useRef(false)

  // Not disconnected after the first hit: `inView` also pauses the carousel
  // while it is off screen. `counting` is the part that latches.
  useEffect(() => {
    const el = card.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        if (entry.isIntersecting) setCounting(true)
      },
      { threshold: 0.35 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Below `sm` (40rem) is where the row becomes a carousel.
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 39.99rem)')
    const sync = () => setPhone(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  // Which stat is showing, from the scroll position; the clone at the end folds
  // onto 0. rAF-coalesced, like every other scroll reader on the page.
  useEffect(() => {
    const el = rail.current
    if (!el) return
    let frame = 0
    const onScroll = () => {
      if (touching.current) setAuto(false)
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        setActive(Math.round(el.scrollLeft / el.clientWidth) % STATS.length)
      })
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      el.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    if (counting) setSeen((s) => (s[active] ? s : s.map((v, i) => v || i === active)))
  }, [active, counting])

  // Autoplay. Always moves forward: after the last stat it scrolls onto a clone
  // of the first, and the next tick jumps from the clone to the real first one
  // instantly — identical pixels, so the jump can't be seen — before scrolling
  // on to the second. That is what makes the loop seamless instead of rewinding
  // across all three. Off under reduced motion, off screen, and once touched.
  useEffect(() => {
    const el = rail.current
    if (!el || !phone || !auto || !inView) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const timer = window.setInterval(() => {
      const w = el.clientWidth
      let i = Math.round(el.scrollLeft / w)
      if (i >= STATS.length) {
        el.scrollTo({ left: 0, behavior: 'instant' })
        i = 0
      }
      el.scrollTo({ left: (i + 1) * w, behavior: 'smooth' })
    }, DWELL)
    return () => window.clearInterval(timer)
  }, [phone, auto, inView])

  return (
    <section className="scroll-rise px-4 pb-20 sm:px-6 lg:px-20 lg:pb-28">
      <div
        ref={card}
        data-reveal
        className="mx-auto max-w-6xl rounded-[1.75rem] bg-ink-raised px-6 py-9 sm:px-10 sm:py-11"
      >
        {/* ul rather than dl: the icon is a sibling of the value/label pair, and
            `dl > div` may only contain dt/dd. */}
        {/* Below sm: a one-stat-at-a-time carousel. Native horizontal scroll
            with mandatory snap, so swiping works with no gesture code; the
            `-mx-6` bleed makes each slide the card's full width. From sm: the
            3-up grid, unchanged. It used to be a free-scrolling rail here, which
            left the second stat cut off at the card edge and the third out of
            sight, with nothing saying there was more. */}
        <ul
          ref={rail}
          onTouchStart={() => (touching.current = true)}
          onTouchEnd={() => (touching.current = false)}
          onTouchCancel={() => (touching.current = false)}
          // a sideways trackpad swipe, or arrow keys once focused, is the same
          // "I've taken over" as a finger
          onWheel={(e) => Math.abs(e.deltaX) > Math.abs(e.deltaY) && setAuto(false)}
          onKeyDown={() => setAuto(false)}
          className="no-scrollbar flex overflow-x-auto max-sm:-mx-6 max-sm:snap-x max-sm:snap-mandatory sm:grid sm:grid-cols-3 sm:gap-x-6 sm:overflow-visible lg:gap-x-10"
        >
          {STATS.map((stat, i) => (
            <li
              key={stat.label}
              className={`flex shrink-0 items-center gap-4 max-sm:w-full max-sm:snap-start max-sm:justify-center max-sm:px-6 ${
                i > 0 ? 'sm:border-l sm:border-white/12 sm:pl-6 lg:pl-10' : ''
              }`}
            >
              <Stat stat={stat} run={counting && (!phone || seen[i])} />
            </li>
          ))}

          {/* The loop's seam: a copy of the first stat, phone only, hidden from
              assistive tech so the list still reads as three. */}
          <li
            aria-hidden
            className="flex w-full shrink-0 snap-start items-center justify-center gap-4 px-6 sm:hidden"
          >
            <Stat stat={STATS[0]} run={counting} />
          </li>
        </ul>
      </div>
    </section>
  )
}

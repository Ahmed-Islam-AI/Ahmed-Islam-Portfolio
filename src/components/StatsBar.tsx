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

const DURATION = 1500

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

export default function StatsBar() {
  const card = useRef<HTMLDivElement>(null)
  const [counting, setCounting] = useState(false)

  useEffect(() => {
    const el = card.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setCounting(true)
        observer.disconnect()
      },
      { threshold: 0.35 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="px-4 pb-20 sm:px-6 lg:px-20 lg:pb-28">
      <div
        ref={card}
        data-reveal
        className="mx-auto max-w-6xl rounded-[1.75rem] bg-ink-raised px-6 py-9 sm:px-10 sm:py-11"
      >
        {/* ul rather than dl: the icon is a sibling of the value/label pair, and
            `dl > div` may only contain dt/dd. */}
        <ul className="grid gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:gap-x-10">
          {STATS.map((stat, i) => (
            <li
              key={stat.label}
              className={`flex items-center gap-4 ${
                i > 0 ? 'sm:border-l sm:border-white/12 sm:pl-6 lg:pl-10' : ''
              }`}
            >
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
                    <Counter value={stat.value} suffix={stat.suffix} run={counting} />
                  </span>
                  <span className="sr-only">
                    {stat.value}
                    {stat.suffix}
                  </span>
                </p>
                <p className="mt-0.5 text-sm text-dark-muted">{stat.label}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

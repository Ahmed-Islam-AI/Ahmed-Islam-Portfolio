import { useMemo } from 'react'

/**
 * A post's cover, drawn rather than pictured.
 *
 * STYLE.md rules out stock and generated imagery, so every post gets a designed
 * plate instead: ink, the hero's hairline grid, and a field of dots generated
 * from the post's slug — a "data landscape" unique to each post and identical on
 * every visit. Faint dots are the data, hollow ones are the gaps in it, and the
 * few orange ones are the signal. Same category as ProjectMark: a diagram, not a
 * picture, so nobody mistakes it for a screenshot.
 *
 * The SVG uses `slice`, so one drawing serves the 21:9 post header, the 16:10
 * cards and a phone's 4:3 without distortion — it crops, never stretches.
 */

const COLS = 32
const ROWS = 18
const STEP = 50 // viewBox is 1600 x 900

/** mulberry32: tiny seeded PRNG, so a slug always draws the same field. */
function seeded(slug: string) {
  let h = 1779033703
  for (const ch of slug) h = Math.imul(h ^ ch.charCodeAt(0), 3432918353)
  let a = h >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type Dot = { x: number; y: number; kind: 'faint' | 'lit' | 'gap' | 'signal' }

function field(slug: string): Dot[] {
  const rand = seeded(slug)
  // A smooth ridge across the plate: three sines with seeded phase and
  // frequency. Dots under it are "lit", so every cover has a horizon.
  const waves = [0, 1, 2].map(() => ({ f: 0.6 + rand() * 1.6, p: rand() * Math.PI * 2, a: 0.08 + rand() * 0.1 }))
  const dots: Dot[] = []
  for (let c = 0; c < COLS; c++) {
    const t = c / (COLS - 1)
    const ridge = 0.5 + waves.reduce((s, w) => s + w.a * Math.sin(t * Math.PI * w.f * 2 + w.p), 0)
    for (let r = 0; r < ROWS; r++) {
      const depth = r / (ROWS - 1)
      const under = depth > ridge
      const roll = rand()
      const kind: Dot['kind'] =
        under && roll < 0.06 ? 'signal' : under && roll < 0.15 ? 'gap' : under ? 'lit' : 'faint'
      dots.push({ x: STEP / 2 + c * STEP, y: STEP / 2 + r * STEP, kind })
    }
  }
  return dots
}

export default function PostCover({
  slug,
  issue,
  className = '',
  size = 'lg',
}: {
  slug: string
  /** 1-based, oldest post is 1 */
  issue: number
  className?: string
  size?: 'lg' | 'sm'
}) {
  const dots = useMemo(() => field(slug), [slug])
  const pad = size === 'lg' ? 'p-6 sm:p-9' : 'p-5'

  return (
    <div
      aria-hidden
      className={`relative isolate overflow-hidden bg-ink ${className}`}
    >
      <div className="hero-grid absolute inset-0 -z-10 opacity-[0.18] invert" />
      <div className="absolute -top-1/3 -right-1/4 -z-10 size-[70%] rounded-full bg-brand/25 blur-[90px]" />

      <svg
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 size-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      >
        {/* Radii are sized for a phone: at 390px the plate renders at ~0.25
            scale, so anything under ~4 units disappears. Signal dots get a soft
            halo so the orange reads as light, not as a printed dot. */}
        {dots.map((d, i) =>
          d.kind === 'gap' ? (
            <circle key={i} cx={d.x} cy={d.y} r={7} fill="none" stroke="rgb(255 255 255 / 0.45)" strokeWidth={2.2} />
          ) : d.kind === 'signal' ? (
            <g key={i}>
              <circle cx={d.x} cy={d.y} r={20} fill="var(--color-brand)" opacity={0.18} />
              <circle cx={d.x} cy={d.y} r={9} fill="var(--color-brand)" />
            </g>
          ) : (
            <circle
              key={i}
              cx={d.x}
              cy={d.y}
              r={d.kind === 'lit' ? 6 : 3.5}
              fill={d.kind === 'lit' ? 'rgb(255 255 255 / 0.62)' : 'rgb(255 255 255 / 0.13)'}
            />
          ),
        )}
      </svg>

      {/* Labels are HTML, not SVG text, so they stay crisp and in Archivo at
          every size. The scrim only has to clear the issue number. */}
      <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-ink/80 to-transparent" />
      <div className={`absolute inset-0 flex flex-col justify-between ${pad}`}>
        <span className="flex items-center gap-2.5">
          <span className="h-5 w-[3px] rounded-full bg-brand" />
          <span className="text-[0.625rem] font-semibold tracking-[0.18em] text-white/75 uppercase sm:text-[0.6875rem]">
            Notes from the build
          </span>
        </span>
        {/* No category here: every place a cover appears already prints it in
            the kicker right beside it, and saying it twice read as filler. */}
        <span className="self-end rounded-full bg-ink/85 px-2.5 py-1 font-mono text-[0.6875rem] tracking-[0.14em] text-white/80 ring-1 ring-white/10">
          No. {String(issue).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}

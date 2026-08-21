import { useEffect, useRef, useState } from 'react'

/**
 * DRAFT COPY — the one section not derived from the CV. The five phases are
 * inferred from what the CV says Ahmed actually does (versioned prompts, a
 * rubric-graded evaluation pipeline, vector-store memory, Docker + Bitbucket CI,
 * CloudWatch observability). Reword freely; it's positioning, not fact.
 */
const STEPS = [
  { n: '1', title: 'Scope', detail: 'Task, tools, failure modes' },
  { n: '2', title: 'Design', detail: 'Graph, memory, tool surface' },
  { n: '3', title: 'Build', detail: 'LangGraph, versioned prompts' },
  { n: '4', title: 'Evaluate', detail: 'Rubric-graded, not vibes' },
  { n: '5', title: 'Ship', detail: 'Docker, CI, observability' },
]

/** `at` is the scroll progress each tool appears at — just past the phase it
 *  belongs to, so tools cascade in behind the line instead of all at once. */
const TOOLS = [
  { name: 'MCP', role: 'tool surface', at: 0.28 },
  { name: 'FAISS + ChromaDB', role: 'memory', at: 0.36 },
  { name: 'LangGraph', role: 'orchestration', at: 0.54 },
  { name: 'Langfuse', role: 'tracing', at: 0.76 },
  { name: 'Docker + CI', role: 'delivery', at: 0.92 },
]

const NODES = [
  { x: 120, y: 80 },
  { x: 310, y: 160 },
  { x: 500, y: 80 },
  { x: 690, y: 160 },
  { x: 855, y: 80 },
]

/**
 * Smooth wave rather than a polyline. Each cubic puts both control points on the
 * segment's horizontal midpoint, which forces a horizontal tangent at every node
 * — that's what makes the joins read as one continuous curve instead of five
 * arcs glued together.
 */
const CURVE = NODES.reduce((d, node, i) => {
  if (i === 0) return `M${node.x},${node.y}`
  const prev = NODES[i - 1]
  const mid = (prev.x + node.x) / 2
  return `${d} C${mid},${prev.y} ${mid},${node.y} ${node.x},${node.y}`
}, '')

const LEFT = ['12%', '31%', '50%', '69%', '85.5%']

/**
 * Must match `top-20` on the pinned panel. Progress is measured from the moment
 * the runway's top crosses this line — that is when the panel actually pins, and
 * it is the only reference that does not involve `window.innerHeight`.
 *
 * That matters more than it looks: the old maths was `-rect.top / (rect.height -
 * innerHeight)`, which starts 80px late and, on mobile, divides by a number that
 * changes every time the address bar slides. Measuring runway against panel — two
 * elements, no viewport term — gives an identical 0→1 ramp on the 220vh phone
 * track and the 280vh desktop one, and doesn't lurch mid-scroll on a phone.
 */
const STICK = 80

export default function Method() {
  const runway = useRef<HTMLDivElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const path = useRef<SVGPathElement>(null)
  const dot = useRef<HTMLSpanElement>(null)
  const [reduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  /**
   * A coarse copy of progress, and the ONLY thing here that goes through React.
   * The line and the dot are written straight to the DOM (below); this drives the
   * step cards, the tool chips and the closing pill, which are pass/fail gates.
   *
   * Quantised to 2% so those re-render at most ~50 times across the whole runway
   * rather than once per frame — every gate on the page is at least 2% apart, so
   * nothing changes about when they fire. The previous version called setState on
   * every scroll event and then a *second* time from an effect, which is two full
   * re-renders of this subtree per event.
   */
  const [stage, setStage] = useState(0)

  const progress = reduced ? 1 : stage

  /**
   * One frame, one progress value, both the line and the dot written from it.
   *
   * This is the whole fix for the dot lagging the line. The line used to be
   * declarative (`strokeDashoffset={1 - progress}`) while the dot's position came
   * from a `useEffect` keyed on that same progress — so the line painted in commit
   * N and the dot caught up in commit N+1. It was structurally one frame behind,
   * every frame, and the gap widened with scroll speed.
   *
   * Two details keep them locked together now:
   *
   * - The dash and the dot share ONE length. `pathLength={1}` is gone: it made the
   *   dash unit-free but left `getPointAtLength` on the geometric scale, so the
   *   two agreed only if the browser happened to normalise `getTotalLength()` the
   *   same way. Measured once — the path is in viewBox units, so its length never
   *   changes with the viewport.
   * - The dot carries no `style` prop. React re-applies `style` on every render,
   *   so a prop here would clobber the rAF writes each time `stage` ticked.
   */
  useEffect(() => {
    const line = path.current
    if (!line) return

    const len = line.getTotalLength()
    line.style.strokeDasharray = String(len)

    const draw = (p: number) => {
      line.style.strokeDashoffset = String(len * (1 - p))
      const point = line.getPointAtLength(len * p)
      const el = dot.current
      if (!el) return
      // Percentages of the same viewBox, so the dot inherits the same stretch
      // `preserveAspectRatio="none"` applies to the path — which is why it can be
      // an HTML element and still sit exactly on the line.
      el.style.left = `${(point.x / 1000) * 100}%`
      el.style.top = `${(point.y / 240) * 100}%`
    }

    if (reduced) {
      draw(1)
      return
    }

    draw(0)

    let raf = 0
    const frame = () => {
      raf = requestAnimationFrame(frame)
      const track = runway.current
      const stuck = panel.current
      if (!track || !stuck) return
      const rect = track.getBoundingClientRect()
      // Pure element geometry: 0 where the panel pins, 1 where the runway runs
      // out from under it. No viewport term, so every width ramps identically.
      const span = rect.height - stuck.offsetHeight
      const p = span > 0 ? Math.min(1, Math.max(0, (STICK - rect.top) / span)) : 0
      draw(p)
      // Identical values bail out of React's update, so this is a no-op most frames.
      setStage(Math.round(p * 50) / 50)
    }

    // Only burn frames while the section is on screen — the same guard
    // Certifications and Projects use.
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!raf) frame()
      } else if (raf) {
        cancelAnimationFrame(raf)
        raf = 0
      }
    })
    if (runway.current) io.observe(runway.current)

    return () => {
      io.disconnect()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [reduced])

  // No `overflow-hidden` on the section: an ancestor with clipped overflow becomes
  // the sticky element's scroll container, and since that container doesn't
  // scroll, sticky silently stops working. The bloom is clipped by the sticky
  // child instead — clipping the sticky element itself is fine.
  return (
    <section id="method" className="relative bg-ink">
      {/* The runway collapses entirely under reduced motion — otherwise progress
          is forced to 1 and you'd scroll 280vh past a static card. */}
      <div ref={runway} className={reduced ? '' : 'h-[220vh] lg:h-[280vh]'}>
        {/* Pinned at every width now, not just lg — the scrubbed curve is the
            section, so swapping it for a different layout on a phone changed the
            content rather than adapting it. */}
        {/* `svh`, not `vh`. `100vh` on a phone is the *large* viewport — the
            height with the address bar hidden — so the panel was taller than the
            visible area whenever the bar was showing, putting the closing pill
            below a fold that cannot be scrolled while the panel is pinned. `svh`
            is the small viewport, so it always fits. Progress doesn't care either
            way: it's measured off this element's own height. */}
        <div
          ref={panel}
          className="relative isolate flex h-[calc(100svh-5rem)] items-center overflow-hidden sticky top-20"
        >
          {/* warm bloom so the full-bleed dark band isn't a flat slab */}
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/2 size-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/12 blur-[140px]" />
          </div>
          {/* Padding on the outside, `max-w-6xl` centred within it — the same
              order About and Work use, which is what makes every section's index
              gutter land on the same x. Padding *inside* the max-w container
              (what this section used to do, and Stack still does) pushes the
              column a further 80px in. */}
          <div className="w-full px-4 sm:px-6 lg:px-20">
            <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[6.5rem_1fr] lg:gap-14">
              <p className="text-eyebrow flex gap-2 text-white/40 uppercase lg:pt-2">
                <span className="text-brand">07</span>
                <span aria-hidden>/</span>
                <span>Method</span>
              </p>

              <div className="min-w-0">
                {/* text-display, matching every other section heading — this was
                    the only one still on the smaller text-h2 step. */}
                <h2 className="type-hero text-display leading-[0.95] uppercase">
                  <span className="block text-white">How I</span>
                  <span className="block text-white/25">
                    build<span className="text-brand">.</span>
                  </span>
                </h2>

                <p className="text-body mt-5 max-w-[56ch] text-dark-muted lg:short:mt-4">
                  An agent that demos well and an agent that survives production are different
                  artefacts. Nothing here ships until it has been measured against a rubric, not a
                  hunch.
                </p>

                {/* ── Scrubbed curve, every width ───────────────── */}
                {/* Curve and card heights are coupled: NODES sit at y=80/160 of a
                    240 viewBox to clear the cards, so shrinking one without the
                    other puts the line through a card. Both step down together on
                    a short viewport. */}
                <div className="relative mt-9 h-52 sm:h-56 lg:mt-12 lg:h-60 lg:short:mt-8 lg:short:h-48">
                  <svg
                    viewBox="0 0 1000 240"
                    preserveAspectRatio="none"
                    className="absolute inset-0 size-full"
                    aria-hidden
                  >
                    {/* The route ahead — this is what makes it guidance, not a
                        reveal. It stops at the last node: it used to run on to
                        1000,150 so the route read as "continuing", but once the
                        progress line completed, that tail was left dangling past
                        the final card with nothing to reach. */}
                    <path
                      d={CURVE}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      className="text-white/12"
                    />
                    {/* Progress. The dash is set imperatively from the same
                        measured length the dot is positioned from — see the
                        effect above. No dash props here on purpose: React would
                        re-apply them on every render and fight the rAF loop. */}
                    <path
                      ref={path}
                      d={CURVE}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      className="text-brand"
                    />
                  </svg>

                  {/* The travelling dot is an HTML element, not an SVG circle:
                      `preserveAspectRatio="none"` stretches the viewBox, which
                      turns a circle into an ellipse — barely visible at desktop
                      width but a clear oval at 390px. Percentages of the same
                      viewBox keep it on the curve without inheriting the scale. */}
                  {/* Always rendered. It used to be gated on
                      `progress > 0.01 && progress < 0.995`, which meant the dot
                      vanished at both ends while the line stayed drawn — read as
                      the two coming apart exactly where the eye was looking for
                      them. At p=0 it parks on the first node, at p=1 on the last.
                      Position is written by the rAF loop; no `style` prop here,
                      or React would reset it on every render. */}
                  <span
                    ref={dot}
                    aria-hidden
                    className="absolute grid size-[18px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white"
                  >
                    <span className="size-[9px] rounded-full bg-brand" />
                  </span>

                  {STEPS.map((step, i) => {
                    const on = progress >= i / (STEPS.length - 1) - 0.02
                    return (
                      <div
                        key={step.title}
                        style={{ left: LEFT[i] }}
                        // Fixed height: wrapping details otherwise gave ragged
                        // heights. Below lg the card shrinks to the phase word
                        // alone — five 224px cards cannot sit side by side on a
                        // phone, and 56px is what the node spacing allows.
                        className={`absolute flex h-14 w-14 -translate-x-1/2 flex-col items-center justify-center rounded-xl bg-white px-1 text-center shadow-[0_18px_40px_-24px_rgb(0_0_0/0.7)] transition-all duration-500 sm:h-16 sm:w-20 lg:h-18 lg:w-56 lg:rounded-2xl lg:px-4 lg:py-3 lg:short:h-14 lg:short:py-2 ${
                          i % 2 === 0 ? 'top-0' : 'bottom-0'
                        } ${on ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-3 scale-95 opacity-0'}`}
                      >
                        <span
                          aria-hidden
                          className="text-[0.5625rem] leading-none font-bold text-brand lg:hidden"
                        >
                          {step.n}
                        </span>
                        <p className="text-[0.625rem] leading-tight font-semibold text-heading sm:text-[0.6875rem] lg:text-sm">
                          <span className="hidden text-brand lg:inline">{step.n} · </span>
                          {step.title}
                        </p>
                        <p className="mt-0.5 hidden text-[0.6875rem] font-semibold tracking-[0.08em] text-muted uppercase lg:block">
                          {step.detail}
                        </p>
                      </div>
                    )
                  })}
                </div>

                {/* Tools cascade in behind the line, one per phase reached. The
                    old `max-lg:` always-visible overrides are gone: the scrub now
                    runs at every width, so forcing them on contradicted it. */}
                <ul className="mt-7 flex flex-wrap gap-1.5 lg:mt-10 lg:gap-2 lg:short:mt-6">
                  {TOOLS.map((tool) => {
                    const on = progress >= tool.at
                    return (
                      <li
                        key={tool.name}
                        className={`flex items-center gap-1.5 rounded-full bg-white/[0.06] px-2.5 py-1.5 text-[0.6875rem] ring-1 ring-white/10 transition-all duration-500 lg:gap-2 lg:px-3.5 lg:py-2 lg:text-xs ${
                          on ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                        }`}
                      >
                        <span aria-hidden className="size-1.5 rounded-full bg-brand" />
                        <span className="font-semibold text-white">{tool.name}</span>
                        <span className="tracking-[0.08em] text-dark-muted/70 uppercase">
                          {tool.role}
                        </span>
                      </li>
                    )
                  })}
                </ul>

                {/* Appears with the last tool chip (0.92), not at 0.98. At 0.98
                    it was only on screen for the final 2% of the runway — 36px of
                    scrolling on desktop — which read as permanently hidden. It is
                    progress-gated, not a `data-reveal` element. */}
                <p
                  className={`mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-[0.6875rem] font-semibold tracking-[0.12em] text-white uppercase transition-opacity duration-500 lg:mt-8 lg:text-[0.75rem] lg:short:mt-4 ${
                    progress >= 0.92 ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  No agent ships unevaluated
                  <span aria-hidden className="size-1.5 rounded-full bg-white/80" />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

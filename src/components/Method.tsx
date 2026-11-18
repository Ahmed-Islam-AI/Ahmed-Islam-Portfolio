import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

/** DRAFT copy: the five phases are inferred from the CV, not quoted from it. */
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

/** Both control points on each segment's x-midpoint: a flat tangent at every node, one wave. */
const CURVE = NODES.reduce((d, node, i) => {
  if (i === 0) return `M${node.x},${node.y}`
  const prev = NODES[i - 1]
  const mid = (prev.x + node.x) / 2
  return `${d} C${mid},${prev.y} ${mid},${node.y} ${node.x},${node.y}`
}, '')

const LEFT = ['12%', '31%', '50%', '69%', '85.5%']

// STICK must equal the panel's top-20: progress starts where it pins (HISTORY.md › Method)
const STICK = 80

export default function Method() {
  const runway = useRef<HTMLDivElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const path = useRef<SVGPathElement>(null)
  const dot = useRef<HTMLSpanElement>(null)
  const drawn = useRef<SVGRectElement>(null)
  const reduced = useReducedMotion()
  // Progress quantised to 2%, the only value that goes through React: it gates the cards,
  // chips and pill. The line and the dot are written straight to the DOM.
  const [stage, setStage] = useState(0)

  const progress = reduced ? 1 : stage

  // Line and dot are written from one progress value per frame, outside React. The line is
  // a clip, not a dash: non-scaling-stroke breaks dash maths (HISTORY.md › Method).
  useEffect(() => {
    const line = path.current
    const edge = drawn.current
    if (!line || !edge) return

    const len = line.getTotalLength()

    const draw = (p: number) => {
      const point = line.getPointAtLength(len * p)
      edge.setAttribute('width', String(point.x))
      const el = dot.current
      if (!el) return
      // Percentages of the viewBox, so the HTML dot stretches with the path and stays on it.
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

    // Only burn frames while the section is on screen, as Certifications does.
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

  // No overflow-hidden above the sticky panel, or sticky silently stops (HISTORY.md › Method)
  return (
    <section id="method" className="relative bg-ink">
      {/* The runway collapses entirely under reduced motion — otherwise progress
          is forced to 1 and you'd scroll 280vh past a static card. */}
      <div ref={runway} className={reduced ? '' : 'h-[220vh] lg:h-[280vh]'}>
        {/* svh, not vh: a phone's 100vh is taller than the visible area (HISTORY.md › Method) */}
        <div
          ref={panel}
          className="relative isolate flex h-[calc(100svh-5rem)] items-center overflow-hidden sticky top-20"
        >
          {/* warm bloom so the full-bleed dark band isn't a flat slab */}
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/2 size-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/12 blur-[140px]" />
          </div>
          {/* Padding outside max-w-6xl, never inside (HISTORY.md › Site layout) */}
          <div className="w-full px-4 sm:px-6 lg:px-20">
            <div className="mx-auto w-full max-w-6xl">
              <div className="min-w-0">
                <h2 className="type-hero text-display leading-[0.95] uppercase">
                  <span className="block text-white">How I</span>{' '}
                  <span className="block text-white/35">
                    build<span className="text-brand">.</span>
                  </span>
                </h2>

                <p className="text-body mt-5 max-w-[56ch] text-dark-muted lg:short:mt-4">
                  An agent that demos well and an agent that survives production are different
                  artefacts. Nothing here ships until it has been measured against a rubric, not a
                  hunch.
                </p>

                {/* ── Scrubbed curve, every width ───────────────── */}
                {/* Curve and card heights are coupled (HISTORY.md › Method) */}
                <div className="relative mt-9 h-52 sm:h-56 lg:mt-12 lg:h-60 lg:short:mt-8 lg:short:h-48">
                  <svg
                    viewBox="0 0 1000 240"
                    preserveAspectRatio="none"
                    className="absolute inset-0 size-full"
                    aria-hidden
                  >
                    {/* The route ahead; it ends at the last node (HISTORY.md › Method) */}
                    <path
                      d={CURVE}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      className="text-white/12"
                    />
                    {/* Progress: the curve clipped at the dot's x, set by the rAF loop. */}
                    <clipPath id="method-drawn">
                      <rect ref={drawn} width="0" height="240" />
                    </clipPath>
                    <path
                      ref={path}
                      d={CURVE}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      clipPath="url(#method-drawn)"
                      className="text-brand"
                    />
                  </svg>

                  {/* HTML, not an SVG circle, which the stretched viewBox makes oval. Always
                      rendered; no style prop, the rAF loop owns it (HISTORY.md › Method) */}
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
                        // Fixed height. Below lg only the phase word shows: the
                        // node spacing leaves 56px per card.
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

                {/* Tools cascade in behind the line, one per phase reached. */}
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

                {/* Shown at 0.92 by progress, not data-reveal (HISTORY.md › Method) */}
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

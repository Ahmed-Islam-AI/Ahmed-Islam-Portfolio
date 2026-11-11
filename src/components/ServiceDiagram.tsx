import type { CSSProperties } from 'react'
import TechIcon from './TechIcon'
import type { GraphNode, Service } from '../data/services'

/** The field every graph is laid out in (`data/services.ts`). The box below
 *  has the same aspect ratio, so the SVG scales without stretching and node
 *  percentages land exactly on the path ends. */
const W = 400
const H = 340

/** Tangents follow the longer axis, so a mostly-vertical link leaves and
 *  enters vertically and the graph reads as flow rather than a web of lines. */
function curve(a: GraphNode, b: GraphNode) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  if (Math.abs(dy) >= Math.abs(dx)) {
    const my = a.y + dy / 2
    return `M${a.x} ${a.y}C${a.x} ${my} ${b.x} ${my} ${b.x} ${b.y}`
  }
  const mx = a.x + dx / 2
  return `M${a.x} ${a.y}C${mx} ${a.y} ${mx} ${b.y} ${b.x} ${b.y}`
}

/**
 * A service's system as a diagram on an ink stage. Two uses:
 *
 * - **Hero** (`assemble`): the whole system, drawing itself in, with a pulse
 *   running along every link.
 * - **Story** (`built` + `active`): the same system as a blueprint. Nodes not
 *   built yet are dashed outlines; each step fills in its nodes in orange, and
 *   only the links touching them carry a pulse.
 *
 * A diagram, not a picture of a product: generic parts, single accent — the
 * same licence as `ProjectMark`. It is one `role="img"` with a text label, so
 * the boxes inside are hidden from assistive tech.
 */
export default function ServiceDiagram({
  graph,
  label,
  built,
  active,
  assemble = false,
  className = '',
}: {
  graph: Service['graph']
  label: string
  /** Node ids drawn as built. Omitted: all of them. */
  built?: Set<string>
  /** Node ids the current step is about. */
  active?: Set<string>
  assemble?: boolean
  className?: string
}) {
  const byId = new Map(graph.nodes.map((n) => [n.id, n]))
  const stateOf = (id: string) =>
    active?.has(id) ? 'active' : !built || built.has(id) ? 'built' : 'future'

  return (
    <div
      role="img"
      aria-label={label}
      className={`relative isolate overflow-clip rounded-[1.75rem] bg-ink p-4 shadow-[0_40px_80px_-50px_rgb(20_19_18/0.7)] sm:p-7 lg:rounded-[2rem] ${
        assemble ? 'diagram-assemble' : ''
      } ${className}`}
    >
      {/* Same hairline grid as the hero, in white, and one warm glow. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 [background-image:linear-gradient(to_right,rgb(255_255_255/0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.045)_1px,transparent_1px)] [background-size:2.25rem_2.25rem]"
      />
      <div aria-hidden className="absolute -top-1/3 -right-1/4 -z-10 size-[70%] rounded-full bg-brand/15 blur-[90px]" />

      {/* A size container: the boxes are sized from the diagram's own width
          (cqw), not the viewport's. Viewport steps got it wrong at 1024px,
          where a two-column layout makes the diagram narrower than on a phone
          and the boxes collided. Everything inside is in `em`, so a box scales
          with its text and the whole drawing scales as one. Under 20rem (a
          360px phone) the text stops shrinking at 10px and the icons drop out
          instead, which is what keeps neighbours apart there. */}
      <div className="@container relative aspect-[400/340]">
        <svg viewBox={`0 0 ${W} ${H}`} fill="none" className="absolute inset-0 size-full overflow-visible" aria-hidden>
          {graph.edges.map(([from, to], i) => {
            const a = byId.get(from)
            const b = byId.get(to)
            if (!a || !b) return null
            const d = curve(a, b)
            const sa = stateOf(from)
            const sb = stateOf(to)
            const state =
              sa === 'future' || sb === 'future'
                ? 'future'
                : sa === 'active' || sb === 'active'
                  ? 'live'
                  : 'built'
            const pulse = assemble || state === 'live'
            return (
              <g key={`${from}-${to}`} style={{ '--d': `${i * 0.09}s` } as CSSProperties}>
                {/* pathLength only where the hero draws it in; the story's
                    dashed "not built yet" links keep dashes in real units, so
                    a short link and a long one dash alike */}
                <path d={d} pathLength={assemble ? 1 : undefined} className="diagram-edge" data-state={state} />
                {pulse && (
                  <path
                    d={d}
                    pathLength={1}
                    className="diagram-pulse"
                    // staggered so the links don't fire in unison; the hero's
                    // wait for the edges to finish drawing first
                    style={{ animationDelay: `${(assemble ? 1.5 : 0) + ((i * 0.53) % 2.2)}s` }}
                  />
                )}
              </g>
            )
          })}
        </svg>

        {graph.nodes.map((n, i) => (
          <span
            key={n.id}
            data-state={stateOf(n.id)}
            style={{ left: `${(n.x / W) * 100}%`, top: `${(n.y / H) * 100}%`, '--d': `${i * 0.07}s` } as CSSProperties}
            className="diagram-node absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-[0.55em] rounded-full border px-[0.8em] py-[0.6em] text-[clamp(0.625rem,2.6cqw,0.75rem)] leading-none font-semibold whitespace-nowrap transition-[background-color,border-color,color,box-shadow,scale] duration-500 data-[state=active]:scale-110 data-[state=active]:border-brand data-[state=active]:bg-brand data-[state=active]:text-white data-[state=active]:shadow-[0_0_0_5px_rgb(241_86_41/0.2),0_10px_28px_-6px_rgb(241_86_41/0.7)] data-[state=built]:border-white/15 data-[state=built]:bg-ink-raised data-[state=built]:text-white data-[state=future]:border-dashed data-[state=future]:border-white/20 data-[state=future]:bg-ink data-[state=future]:text-white/40"
          >
            {n.icon ? (
              <TechIcon
                name={n.icon}
                className="size-[1.2em] shrink-0 text-brand-bright @max-[20rem]:hidden transition-colors duration-500 [[data-state=active]_&]:text-white [[data-state=future]_&]:text-white/30"
              />
            ) : (
              <span className="size-[0.55em] shrink-0 rounded-full @max-[20rem]:hidden bg-brand-bright transition-colors duration-500 [[data-state=active]_&]:bg-white [[data-state=future]_&]:bg-white/30" />
            )}
            {n.label}
          </span>
        ))}
      </div>
    </div>
  )
}

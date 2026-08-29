import { Link } from 'react-router-dom'
import type { CSSProperties } from 'react'
import {
  FEATURED_PROJECTS,
  LIVE_COUNT,
  PROJECTS,
  SOURCE_COUNT,
  isRepo,
  urlLabel,
  type Project,
} from '../data/projects'
import TechIcon from './TechIcon'
import ProjectMark from './ProjectMark'

/**
 * Projects — section 08.
 *
 * Rebuilt 2026-08-30. This was a pinned, scroll-scrubbed horizontal gallery of
 * all seven projects: a `PACE * 7` = 5.95 viewport-height runway driving a
 * `translate` on a card row, with a drifting background word. All of that is
 * gone. What it delivered was seven identical `ink-raised` rectangles at
 * identical size — the one live SaaS product rendered exactly like a scraper —
 * so the section spent six screens of scrolling to present what was structurally
 * a flat list. Big effect over undifferentiated content is what read as gimmick,
 * and it sat between two other pinned bands (Method, Certifications), closing
 * the page on ~14 viewport heights of back-to-back scroll-jacking.
 *
 * What replaced it is hierarchy: one featured project at real scale, two peers
 * beside it, and a door to the rest. Three projects here, seven on `/projects`.
 *
 * Deliberately NOT reintroduced, all deleted with the runway — don't bring any
 * of it back without a reason that isn't "it looked dynamic":
 *   - the rAF loop and its IntersectionObserver gate
 *   - `focusCard`, which only existed because a transformed row can't be
 *     scrolled into view by the browser
 *   - `PACE`, `REPEAT`, `WORD_DRIFT`, the `active` index
 *   - the separate reduced-motion branch: `[data-reveal]` is already gated on
 *     `prefers-reduced-motion` in index.css, so one render path covers both
 *   - the `lg:short:` overrides on the card. `short` exists to defend a pinned
 *     panel's fold budget; with nothing pinned there is no fold to defend.
 */

/**
 * There is deliberately NO background watermark here any more.
 *
 * The old seven-row `SHIPPED` block existed to fill a 100vh pinned panel and to
 * carry the per-project `accentColor` tint as the cards travelled. Both of those
 * jobs are gone. A single-line version was tried on the rebuild and measured at
 * both widths: at `top-1/2` it landed in the gap between the featured panel and
 * the two cards, where brand-on-ink at 0.045 reads as a maroon smudge rather
 * than texture — clearly visible on a phone, and neither legible enough to be a
 * word nor faint enough to be ground. Worst of both, so it was cut.
 *
 * If this band ever needs texture again, it needs to be designed against the new
 * layout rather than inherited from the old one.
 */

export default function Projects() {
  const [lead, ...peers] = FEATURED_PROJECTS

  return (
    <section
      id="projects"
      // Takes normal `section-y` rhythm now. The three pinned bands skip it
      // because their child is exactly one viewport tall and pins to it, so
      // outer padding would only buy dead scroll — that reasoning stopped
      // applying to this section the moment the runway came out.
      className="section-y scroll-mt-28 bg-ink px-4 sm:px-6 lg:px-20"
    >
      <div className="mx-auto max-w-6xl">
        {/* ── Header ─────────────────────────────────────────────
            One exit, not three. `All repositories →` used to sit up here beside
            the count; it now closes `/projects` instead. Users satisfice — they
            take the first reasonable option — so a top-right link straight to
            raw GitHub siphoned clicks before the visitor had seen a single
            project. The only way out of this section is the CTA at the bottom. */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div>
            <p data-reveal className="text-eyebrow flex gap-2 text-white/40 uppercase">
              <span className="text-brand">08</span>
              <span aria-hidden>/</span>
              <span>Projects</span>
            </p>
            <h2
              data-reveal
              className="type-hero mt-4 text-display leading-[0.95] uppercase [--reveal-delay:60ms]"
            >
              <span className="block text-white">Things I&rsquo;ve</span>
              <span className="block text-white/25">
                shipped<span className="text-brand">.</span>
              </span>
            </h2>
          </div>

          {/* Derived from the array, so it can't drift when a project is added. */}
          <p
            data-reveal
            className="inline-flex shrink-0 items-center gap-2.5 self-start rounded-full bg-white/[0.06] px-4 py-2 font-mono text-[0.6875rem] tracking-[0.12em] text-dark-muted uppercase ring-1 ring-white/10 sm:self-auto [--reveal-delay:120ms]"
          >
            <span aria-hidden className="size-1.5 rounded-full bg-brand" />
            {PROJECTS.length} builds
            <span aria-hidden className="text-white/25">·</span>
            {LIVE_COUNT} live
            <span aria-hidden className="text-white/25">·</span>
            {SOURCE_COUNT} open source
          </p>
        </div>

        <div data-reveal className="mt-10 [--reveal-delay:180ms] lg:mt-14">
          <Featured project={lead} index={0} />
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:mt-8 lg:gap-8">
          {peers.map((project, i) => (
            <div
              key={project.slug}
              data-reveal
              // `min-w-0` is load-bearing, not tidiness — the same trap as the
              // Work grid column. Grid items default to `min-width: auto`, so
              // the card's min-content width wins over the track: the longest
              // repo path (`PPE-Detection-for-Construction-site-workers`) pushed
              // each card to 379.5px inside a 358px track and put the page 6px
              // past a 390px viewport. `truncate` on the path doesn't help —
              // the min-content width propagates up before it ever applies.
              className="flex min-w-0"
              style={{ '--reveal-delay': `${240 + i * 70}ms` } as CSSProperties}
            >
              <Card project={project} index={i + 1} className="w-full" />
            </div>
          ))}
        </div>

        <div data-reveal className="mt-10 [--reveal-delay:380ms] lg:mt-12">
          {/* A router Link, not an <a>: /projects is an internal route, and a
              raw href would full-page-reload the SPA. */}
          <Link
            to="/projects"
            className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-b from-brand-bright to-brand-deep px-6 py-3.5 text-[0.75rem] font-semibold tracking-[0.14em] text-white uppercase transition hover:brightness-110"
          >
            View all {PROJECTS.length} projects
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
              &rarr;
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}

/**
 * The featured project: a two-column panel, taller than the two cards beside it.
 *
 * **The visual is the anchor, and the name sits beside it at `text-h2`.**
 *
 * This changed once, deliberately. When no project had any imagery the anchor was
 * the project's own name at `text-display` in the left column — the site's
 * type-led move, and the right answer for a card with nothing to look at. Now
 * every card carries a visual (a real capture, or a drawn mark — see `Visual`),
 * so a display-scale name *beside* one gives the panel two things competing to be
 * looked at first. Measured at 1440 that also left ~150px of dead space in the
 * right column, because the left column had grown taller than the copy.
 *
 * So: visual anchors, name drops a step, and `lg:items-center` balances the
 * shorter copy column against the taller visual instead of stranding it at the
 * top. If a future project has no visual at all, the display-scale name is the
 * right fallback to bring back — the reasoning above is about competition, not
 * about the name being wrong.
 *
 * An earlier draft used an oversized ghosted numeral as the anchor. Rejected:
 * every giant-faded-text precedent here (About's watermark, the footer's
 * `AHMED.`) is *section-scale background*, never in-card, so it would have been
 * a new pattern dressed as an existing one — decoration carrying no information.
 */
function Featured({ project, index }: { project: Project; index: number }) {
  const live = project.status === 'LIVE'
  return (
    <a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${project.name} — opens the ${live ? 'live site' : 'source repository'} in a new tab`}
      className="group grid gap-8 rounded-[1.75rem] bg-ink-raised p-6 shadow-[0_30px_60px_-34px_rgb(0_0_0/0.85)] ring-1 ring-white/12 transition-all duration-500 hover:ring-white/25 lg:grid-cols-2 lg:items-center lg:gap-12 lg:p-10"
    >
      <div className="min-w-0">
        <div className="flex items-center justify-between gap-3 font-mono text-[0.6875rem] tracking-[0.14em]">
          <span className="text-brand">{String(index + 1).padStart(2, '0')}</span>
          <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-dark-muted ring-1 ring-white/10">
            {project.status}
          </span>
        </div>

        <Visual project={project} className="mt-5" />
      </div>

      <div className="min-w-0">
        <h3 className="type-hero text-h2 leading-[1.05] text-white transition-colors group-hover:text-brand-bright">
          {project.name}
        </h3>

        <p className="mt-4 max-w-[46ch] text-lead text-dark-muted">{project.summary}</p>

        {project.metric && (
          <p className="mt-4 font-mono text-xs tracking-[0.04em] text-brand-bright">
            {project.metric}
          </p>
        )}

        <StackChips stack={project.stack} className="mt-7" />
        <Destination href={project.href} className="mt-6" />
      </div>
    </a>
  )
}

/**
 * A peer project, beside the featured one. Unchanged from the card the old
 * travelling row used, minus the scroll-driven `on` ring (there is no active
 * index any more) and minus the `lg:short:` steps.
 */
function Card({
  project,
  index,
  className,
}: {
  project: Project
  index: number
  className: string
}) {
  const live = project.status === 'LIVE'
  return (
    <a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${project.name} — opens the ${live ? 'live site' : 'source repository'} in a new tab`}
      className={`group flex min-w-0 flex-col rounded-[1.75rem] bg-ink-raised p-6 shadow-[0_30px_60px_-34px_rgb(0_0_0/0.85)] ring-1 ring-white/12 transition-all duration-500 hover:ring-white/25 lg:p-7 ${className}`}
    >
      <Visual project={project} className="mb-6" />

      <div className="flex shrink-0 items-center justify-between gap-3 font-mono text-[0.6875rem] tracking-[0.14em]">
        <span className="text-brand">{String(index + 1).padStart(2, '0')}</span>
        <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-dark-muted ring-1 ring-white/10">
          {project.status}
        </span>
      </div>

      <h3 className="type-hero mt-5 text-xl leading-[1.15] text-white transition-colors group-hover:text-brand-bright lg:text-2xl">
        {project.name}
      </h3>

      <p className="mt-3 max-w-[42ch] text-sm leading-relaxed text-dark-muted">
        {project.summary}
      </p>

      {project.metric && (
        <p className="mt-3 font-mono text-xs tracking-[0.04em] text-brand-bright">
          {project.metric}
        </p>
      )}

      {/* mt-auto pins the stack and footer to the bottom, so cards of different
          copy length still line up along one baseline. */}
      <StackChips stack={project.stack} className="mt-auto pt-6" />
      <Destination href={project.href} className="mt-5" />
    </a>
  )
}

/**
 * The card visual: a real capture where one exists, a drawn schematic where none
 * does.
 *
 * Only `ppe-safety` has real imagery — genuine YOLOv8 output from Ahmed's own
 * model. Every repo was checked on 2026-08-30 and none of the other six carries
 * a screenshot; `padelos.co` is live but shows no product UI and never uses the
 * name PadelGPT, so a capture of it would be a marketing page rather than his
 * work.
 *
 * The marks are deliberately diagrams and not pictures — see `ProjectMark.tsx`
 * for why that distinction is what keeps this from repeating the generated-poster
 * failure. **Setting `image` on a project makes its photo win automatically**, so
 * each mark disappears the moment a real capture arrives. That is the intended
 * direction of travel; don't treat the marks as the finished state.
 */
export function Visual({ project, className = '' }: { project: Project; className?: string }) {
  return (
    <div
      className={`aspect-[16/10] w-full overflow-hidden rounded-xl bg-ink ring-1 ring-white/10 ${className}`}
    >
      {project.image ? (
        <img
          src={project.image.src}
          alt={project.image.alt}
          loading="lazy"
          className="size-full object-cover"
        />
      ) : (
        <ProjectMark
          slug={project.slug}
          // Inset so the geometry never touches the frame, and quiet enough that
          // it reads as a plate rather than competing with the project name.
          className="size-full p-5 text-brand/70 transition-colors duration-500 group-hover:text-brand"
        />
      )}
    </div>
  )
}

/**
 * Stack chips. Markup lifted verbatim from the Work switcher's stack-tag list so
 * "a technology" looks identical in both sections — change it in both places.
 */
export function StackChips({ stack, className = '' }: { stack: string[]; className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {stack.map((tool) => (
        <li
          key={tool}
          className="flex items-center gap-1.5 rounded-lg bg-white/[0.06] px-2.5 py-1.5 text-xs font-semibold text-dark-muted ring-1 ring-white/10"
        >
          <TechIcon name={tool} className="size-3.5 shrink-0 text-brand-bright" />
          {tool}
        </li>
      ))}
    </ul>
  )
}

/** Where the card goes: repo name for GitHub, host for the one live site. */
export function Destination({ href, className = '' }: { href: string; className?: string }) {
  return (
    <div className={`flex shrink-0 items-center gap-2.5 border-t border-white/10 pt-4 ${className}`}>
      {isRepo(href) && <TechIcon name="GitHub" className="size-3.5 shrink-0 text-white/40" />}
      <span className="truncate font-mono text-xs text-white/40">{urlLabel(href)}</span>
      <span
        aria-hidden
        className="ml-auto shrink-0 text-brand-bright transition-transform group-hover:translate-x-0.5"
      >
        &rarr;
      </span>
    </div>
  )
}

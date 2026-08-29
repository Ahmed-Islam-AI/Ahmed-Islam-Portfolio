import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { Destination, StackChips, Visual } from '../components/Projects'
import {
  GITHUB_PROFILE,
  LIVE_COUNT,
  PROJECTS,
  SOURCE_COUNT,
  type Project,
} from '../data/projects'
import TechIcon from './../components/TechIcon'

/**
 * The full project index — every project, one row each.
 *
 * **A list, not a card grid.** The obvious build here was `lg:grid-cols-3` of
 * the same card the home section uses, and that was rejected twice over: a
 * three-column card grid is the most recognisable AI-generated layout there is,
 * and reusing the home section's card would make the two surfaces read as the
 * same page twice. STYLE.md asks each new surface to find its own form.
 *
 * A list is also the form that scales. At seven entries a three-across grid
 * already leaves an orphan row; at ten it still does. A list is correct at any
 * count, which matters because this is the page that grows.
 *
 * `bg-ink` to match section 08 on the home page — Projects is an ink surface
 * everywhere, per STYLE.md's closing-bands rhythm.
 */
export default function ProjectsPage() {
  // react-router keeps scroll position across routes, so arriving here from the
  // CTA (which sits well down the home page) would otherwise drop you into the
  // middle of the list.
  useEffect(() => {
    window.scrollTo(0, 0)
    const previous = document.title
    document.title = 'Projects — Ahmed Islam'
    return () => {
      document.title = previous
    }
  }, [])

  return (
    <>
      <Nav />

      <main id="top" className="min-h-screen bg-ink">
        <div className="pt-nav px-4 pb-20 sm:px-6 lg:px-20 lg:pb-28">
          <div className="mx-auto max-w-6xl">
            {/* ── Header ─────────────────────────────────────── */}
            <div className="flex flex-col gap-5 pt-10 sm:flex-row sm:items-end sm:justify-between sm:gap-8 lg:pt-14">
              <div>
                {/* No index numeral here. The `0N /` gutter is the home page's
                    section counter, and on a standalone route `08` has nothing
                    to count against — it would be borrowing a meaning this page
                    doesn't have. Same eyebrow shape, honest label. */}
                <p data-reveal className="text-eyebrow flex gap-2 text-white/40 uppercase">
                  <span className="text-brand">Projects</span>
                  <span aria-hidden>/</span>
                  <span>Full index</span>
                </p>
                <h1
                  data-reveal
                  className="type-hero mt-4 text-display leading-[0.95] uppercase [--reveal-delay:60ms]"
                >
                  <span className="block text-white">Everything</span>
                  <span className="block text-white/25">
                    I&rsquo;ve built<span className="text-brand">.</span>
                  </span>
                </h1>
              </div>

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

            {/* ── The index ──────────────────────────────────── */}
            <ul className="mt-12 border-t border-white/10 lg:mt-16">
              {PROJECTS.map((project, i) => (
                <li key={project.slug}>
                  <Row project={project} index={i} />
                </li>
              ))}
            </ul>

            {/* ── Exits ──────────────────────────────────────────
                `All repositories →` lives here rather than on the home section.
                This is the point where "and here is the rest" is the right
                offer — at the end of the full index, not before the visitor has
                seen a single project. */}
            <div
              data-reveal
              className="mt-12 flex flex-col gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between"
            >
              <a
                href={GITHUB_PROFILE}
                target="_blank"
                rel="noopener noreferrer"
                className="group -my-2.5 inline-flex items-center gap-2 py-3.5 text-[0.75rem] font-semibold tracking-[0.14em] text-brand-bright uppercase transition-colors hover:text-white"
              >
                <TechIcon name="GitHub" className="size-3.5 shrink-0" />
                All repositories
                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                  &rarr;
                </span>
              </a>

              <Link
                to="/"
                className="group -my-2.5 inline-flex items-center gap-2 py-3.5 text-[0.75rem] font-semibold tracking-[0.14em] text-white/60 uppercase transition-colors hover:text-white"
              >
                <span aria-hidden className="transition-transform group-hover:-translate-x-0.5">
                  &larr;
                </span>
                Back to the site
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

/**
 * One index row. Numeral, name, summary, stack, status, destination.
 *
 * Hairline-separated rather than boxed: seven bordered cards stacked vertically
 * is a card grid with one column, which is the shape this page exists to avoid.
 * The whole row is the link, so the target is far larger than the 44px floor.
 */
function Row({ project, index }: { project: Project; index: number }) {
  const live = project.status === 'LIVE'
  return (
    <a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${project.name} — opens the ${live ? 'live site' : 'source repository'} in a new tab`}
      // Negative inline margin + matching padding so the hover tint bleeds past
      // the text column and reads as a full row, without the border moving.
      className="group -mx-4 grid gap-x-6 gap-y-4 border-b border-white/10 px-4 py-8 transition-colors hover:bg-white/[0.03] lg:grid-cols-[2.5rem_9rem_minmax(0,1fr)_minmax(0,17rem)] lg:gap-x-8 lg:py-10"
    >
      <span className="font-mono text-[0.6875rem] tracking-[0.14em] text-brand lg:pt-2">
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Same visual as the home cards — real capture where one exists, drawn
          schematic where none does. Capped on mobile so a full-bleed thumb
          doesn't turn each row into its own screen. */}
      <Visual project={project} className="max-w-[12rem] lg:max-w-none" />

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <h2 className="type-hero text-h3 leading-tight text-white transition-colors group-hover:text-brand-bright">
            {project.name}
          </h2>
          <span className="shrink-0 rounded-full bg-white/[0.06] px-2.5 py-1 font-mono text-[0.6875rem] tracking-[0.14em] text-dark-muted ring-1 ring-white/10">
            {project.status}
          </span>
        </div>

        <p className="mt-3 max-w-[58ch] text-sm leading-relaxed text-dark-muted">
          {project.summary}
        </p>

        {project.metric && (
          <p className="mt-3 font-mono text-xs tracking-[0.04em] text-brand-bright">
            {project.metric}
          </p>
        )}
      </div>

      <div className="flex min-w-0 flex-col justify-between gap-4">
        <StackChips stack={project.stack} />
        <Destination href={project.href} />
      </div>
    </a>
  )
}

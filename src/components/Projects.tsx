import { Link } from 'react-router-dom'
import type { CSSProperties } from 'react'
import {
  destinationOf,
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

/** Projects, section 08: a featured project, two peers and a door to /projects.
 *  Deliberately not a pinned scroll effect (HISTORY.md › Projects). */

// No background watermark: a `SHIPPED` word was tried here and cut (HISTORY.md › Projects).

export default function Projects() {
  const [lead, ...peers] = FEATURED_PROJECTS

  return (
    <section
      id="projects"
      className="section-y scroll-mt-28 bg-ink px-4 sm:px-6 lg:px-20"
    >
      <div className="mx-auto max-w-6xl">
        {/* ── Header ── no exit link here: the CTA at the bottom is the only one */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div>
            <h2
              data-reveal
              className="type-hero text-display leading-[0.95] uppercase"
            >
              <span className="block text-white">Things I&rsquo;ve</span>{' '}
              <span className="block text-white/35">
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
              // min-w-0: the longest repo path overflowed a 390px phone (HISTORY.md › Projects)
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
            className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-b from-brand to-brand-deep px-6 py-3.5 text-[0.75rem] font-bold tracking-[0.14em] text-white uppercase press hover:brightness-110"
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

/** The featured panel: visual first, name beside it at `text-h2` (HISTORY.md › Projects). */
function Featured({ project, index }: { project: Project; index: number }) {
  return (
    <a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${project.name} — opens the ${destinationOf(project)} in a new tab`}
      className="group grid gap-8 rounded-[1.75rem] bg-ink-raised p-6 shadow-[0_30px_60px_-34px_rgb(0_0_0/0.85)] ring-1 ring-white/12 transition-all duration-500 hover:ring-white/25 active:scale-[0.99] lg:grid-cols-2 lg:items-center lg:gap-12 lg:p-10"
    >
      <div className="min-w-0">
        <div className="flex items-center justify-between gap-3 font-mono text-[0.6875rem] tracking-[0.14em]">
          <span className="text-brand">{String(index + 1).padStart(2, '0')}</span>
          <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-dark-muted ring-1 ring-white/10">
            {project.status}
          </span>
        </div>

        <Visual project={project} className="scroll-unveil mt-5" />
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

/** A peer project card, beside the featured one. */
function Card({
  project,
  index,
  className,
}: {
  project: Project
  index: number
  className: string
}) {
  return (
    <a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${project.name} — opens the ${destinationOf(project)} in a new tab`}
      className={`group flex min-w-0 flex-col rounded-[1.75rem] bg-ink-raised p-6 shadow-[0_30px_60px_-34px_rgb(0_0_0/0.85)] ring-1 ring-white/12 transition-all duration-500 hover:ring-white/25 active:scale-[0.99] lg:p-7 ${className}`}
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

/** The card visual: `project.image` if set, otherwise a drawn `ProjectMark`. */
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

/** Stack chips. Markup copied verbatim from Work.tsx's stack-tag list: change both together. */
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

/** Where the card goes: repo name for GitHub, host for anything else. */
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

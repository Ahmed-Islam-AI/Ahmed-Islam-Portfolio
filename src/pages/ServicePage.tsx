import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link, useParams } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import ServiceDiagram from '../components/ServiceDiagram'
import TechIcon from '../components/TechIcon'
import { StackChips } from '../components/Projects'
import { EXPERIENCE } from '../components/Work'
import { PROJECTS, type Project } from '../data/projects'
import { SERVICES, type Service } from '../data/services'
import { BackPill, TalkPanel } from './BlogPostPage'
import { Row } from './ProjectsPage'

const num = (i: number) => String(i + 1).padStart(2, '0')
const PAD = 'px-4 sm:px-6 lg:px-20'

// services.ts has to stay plain data (blog.vite.ts imports it in Node), so its
// cross-references are checked here: a typo would silently drop a project, a
// CV line or a diagram node.
if (import.meta.env.DEV) {
  for (const s of SERVICES) {
    const ids = new Set(s.graph.nodes.map((n) => n.id))
    const fail = (what: string) => {
      throw new Error(`services.ts: "${s.id}" ${what}`)
    }
    for (const slug of s.projects) if (!PROJECTS.some((p) => p.slug === slug)) fail(`lists unknown project "${slug}"`)
    for (const [a, b] of s.graph.edges) if (!ids.has(a) || !ids.has(b)) fail(`has an edge to a missing node (${a}–${b})`)
    for (const step of s.steps) for (const id of step.nodes) if (!ids.has(id)) fail(`step "${step.title}" lights missing node "${id}"`)
    for (const e of s.experience) {
      const entry = EXPERIENCE.find((x) => x.company === e.company)
      if (!entry) fail(`cites unknown CV entry "${e.company}"`)
      else for (const p of e.points) if (!entry.points[p]) fail(`cites ${e.company} point ${p}, which doesn't exist`)
    }
  }
}

/**
 * One service, `/services/:id`, told as a story (rebuilt 2026-11-11 after the
 * first version read as a short, flat page):
 *
 *   hero (the system, drawing itself) → the problem (lit as you read) →
 *   how I build it (the same system, assembled step by step as you scroll) →
 *   what you get → where I've done it (CV lines, quoted) → questions → next.
 *
 * Built from the site's own vocabulary: two-tone display headings, the hero
 * grid, `scroll-read`, the Services index rows, the /projects rows, the blog's
 * back pill and talk panel. Every chapter is plain content under reduced
 * motion; nothing here depends on animation to be read.
 */
export default function ServicePage() {
  const { slug = '' } = useParams()
  const service = SERVICES.find((s) => s.id === slug)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  useEffect(() => {
    if (!service) return
    const previous = document.title
    document.title = `${service.seoTitle} — Ahmed Islam`
    return () => {
      document.title = previous
    }
  }, [service])

  if (!service) return <NotFound />

  const contact = `/?service=${service.id}#contact`
  const label = `Diagram of ${service.title.toLowerCase()}: ${service.graph.nodes.map((n) => n.label).join(', ')}.`

  return (
    <>
      <Nav />
      {/* Keyed so a jump to another service starts its story from step one. */}
      <main id="top" key={service.id} className="bg-paper">
        <Hero service={service} contact={contact} label={label} />
        <Problem service={service} />
        <Story service={service} label={label} />
        <Deliverables service={service} />
        <Proof service={service} />
        <Questions service={service} contact={contact} />
        <Next service={service} contact={contact} />
      </main>
      <Footer />
    </>
  )
}

/** A two-tone section heading, the site's signature (STYLE.md). */
function Heading({ lines, dark = false, id }: { lines: [string, string]; dark?: boolean; id?: string }) {
  return (
    <h2 id={id} data-reveal className="type-hero text-display leading-[0.92] uppercase">
      <span className={`block ${dark ? 'text-white' : 'text-heading'}`}>{lines[0]}</span>{' '}
      <span className={`block ${dark ? 'text-white/35' : 'text-heading/50'}`}>
        {lines[1]}
        <span className="text-brand">.</span>
      </span>
    </h2>
  )
}

const primary =
  'press inline-flex items-center gap-2.5 rounded-full bg-gradient-to-b from-brand to-brand-deep px-6 py-3.5 text-[0.75rem] font-bold tracking-[0.14em] text-white uppercase shadow-lg shadow-brand/25 hover:brightness-110'
const secondary =
  'press inline-flex items-center gap-2.5 rounded-full px-6 py-3.5 text-[0.75rem] font-bold tracking-[0.14em] text-heading uppercase ring-1 ring-heading/20 hover:text-brand hover:ring-brand'

/* ── 1. Hero ────────────────────────────────────────────────────────────── */

function Hero({ service, contact, label }: { service: Service; contact: string; label: string }) {
  return (
    <section className={`pt-nav relative isolate overflow-x-clip ${PAD}`}>
      {/* The home hero's ground: hairline grid and a warm glow. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="hero-grid absolute inset-0" />
        <div className="absolute -top-32 -right-32 size-[38rem] rounded-full bg-brand/10 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-6xl pb-20 lg:pb-28">
        {/* Back pill only, and only from `sm`. The "Services / RAG & knowledge
            systems" trail beside it was cut on Ahmed's call (2026-11-12): it
            repeated the heading right below it and read as generated. On a
            phone the nav pill and the Back gesture already do this job. */}
        <nav aria-label="Back" className="pt-8 max-sm:hidden lg:pt-10">
          <BackPill href="/#services">All services</BackPill>
        </nav>

        <div className="mt-8 grid items-center gap-12 sm:mt-10 lg:mt-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-14">
          <div className="min-w-0">
            <h1 data-reveal className="type-hero text-display leading-[0.92] uppercase">
              <span className="block text-heading">{service.heading[0]}</span>{' '}
              <span className="block text-heading/50">
                {service.heading[1]}
                <span className="text-brand">.</span>
              </span>
            </h1>
            <p data-reveal className="text-lead mt-8 max-w-[40ch] text-muted [--reveal-delay:220ms]">
              {service.summary}
            </p>
            <div data-reveal className="mt-10 flex flex-wrap gap-3 [--reveal-delay:300ms]">
              <a href={contact} data-track="contact_cta" data-track-from="service_hero" className={primary}>
                Start a project <span aria-hidden>&rarr;</span>
              </a>
              <a href="#how" className={secondary}>
                How I build it <span aria-hidden>&darr;</span>
              </a>
            </div>
            <ul data-reveal aria-label="Tools" className="mt-10 flex flex-wrap gap-2 [--reveal-delay:380ms]">
              {service.stack.map((tool) => (
                <li
                  key={tool}
                  className="flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold text-heading ring-1 ring-hairline"
                >
                  <TechIcon name={tool} className="size-3.5 shrink-0 text-brand" />
                  {tool}
                </li>
              ))}
            </ul>
          </div>

          <ServiceDiagram graph={service.graph} label={label} assemble />
        </div>
      </div>
    </section>
  )
}

/* ── 2. The problem ─────────────────────────────────────────────────────── */

/** One statement, lit in reading order as it scrolls in (`scroll-read`, the
 *  same sweep as About's thesis, which is why this band is paper-2). */
function Problem({ service }: { service: Service }) {
  return (
    <section aria-label="The problem" className={`section-y bg-paper-2 ${PAD}`}>
      <div className="mx-auto max-w-6xl">
        <p data-reveal className="text-eyebrow flex items-center gap-3 text-muted uppercase">
          <span aria-hidden className="h-px w-8 bg-brand" />
          The problem
        </p>
        <p className="type-hero mt-8 max-w-[28ch] text-h2 leading-[1.15] text-heading">
          <span className="scroll-read">{service.problem}</span>
        </p>
        <a
          href="#how"
          className="group mt-12 inline-flex items-center gap-3 text-[0.75rem] font-bold tracking-[0.14em] text-heading uppercase transition-colors hover:text-brand"
        >
          Here&rsquo;s how I build it
          <span
            aria-hidden
            className="grid size-9 place-items-center rounded-full bg-heading text-white transition-transform group-hover:translate-y-0.5"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M6 13l6 6 6-6" />
            </svg>
          </span>
        </a>
      </div>
    </section>
  )
}

/* ── 3. How I build it: the sticky story ───────────────────────────────── */

/**
 * The diagram stays put while the steps scroll past it, and each step builds
 * its part of the system: dashed outline → orange while it's the current
 * step → solid once it's done. No pinning and no scroll-jacking — the page
 * scrolls normally; only the diagram is `sticky`.
 *
 * Which step is current comes from an IntersectionObserver on a thin band
 * across the viewport: just below the middle from `lg`, and at ~74% below it.
 * Below `lg` the diagram sticks to the top (about the top 450px of a phone)
 * and the steps pass under it, so a step must be well clear of it before it
 * counts — measured: at 60% the current step's title was still behind the
 * diagram. The band is set once on mount; a resize across `lg` only shifts
 * where steps switch, nothing breaks.
 *
 * **Block layout below `lg`, not grid.** A sticky grid item can only move
 * inside its own grid area, which in one column is just its own row: it would
 * never stick. From `lg` it's a grid item with `self-start`, so its area is
 * the full height of the steps beside it.
 */
function Story({ service, label }: { service: Service; label: string }) {
  const [step, setStep] = useState(0)
  const list = useRef<HTMLOListElement>(null)
  const fill = useRef<HTMLDivElement>(null)
  const steps = service.steps

  useEffect(() => {
    const items = list.current?.querySelectorAll<HTMLElement>('[data-step]')
    if (!items) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setStep(Number((e.target as HTMLElement).dataset.step))
      },
      {
        rootMargin: matchMedia('(min-width: 64rem)').matches ? '-58% 0px -38% 0px' : '-72% 0px -24% 0px',
      },
    )
    items.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  // The progress line stops on the current step's dot. Measured, because the
  // steps differ in height; written straight to `style`, out of React.
  useEffect(() => {
    const measure = () => {
      const ol = list.current
      const dot = ol?.querySelectorAll<HTMLElement>('[data-dot]')[step]
      if (!ol || !dot || !fill.current) return
      const y = dot.getBoundingClientRect().top - ol.getBoundingClientRect().top + dot.offsetHeight / 2
      // `scale`, not `transform`: the class's `scale-y-0` is the `scale`
      // property in Tailwind 4, and the two would multiply to zero
      fill.current.style.scale = `1 ${y / ol.offsetHeight}`
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [step])

  const built = new Set(steps.slice(0, step + 1).flatMap((s) => s.nodes))
  const active = new Set(steps[step].nodes)

  return (
    <section id="how" aria-labelledby="how-title" className={`section-y scroll-mt-20 ${PAD}`}>
      <div className="mx-auto max-w-6xl">
        <Heading id="how-title" lines={['How I', 'build it']} />
        <p data-reveal className="text-lead mt-8 max-w-[44ch] text-muted [--reveal-delay:120ms]">
          {steps.length} steps from the first conversation to launch. The diagram fills in as each
          part gets built.
        </p>

        <div className="mt-12 lg:mt-16 lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16">
          {/* paper behind it below lg, so the steps pass under rather than through */}
          <div className="sticky top-[4.75rem] z-10 -mx-4 bg-paper px-4 pt-3 pb-4 after:pointer-events-none after:absolute after:inset-x-0 after:top-full after:h-8 after:bg-gradient-to-b after:from-paper after:to-transparent sm:-mx-6 sm:px-6 lg:top-28 lg:mx-0 lg:self-start lg:bg-transparent lg:p-0 lg:after:hidden">
            <ServiceDiagram graph={service.graph} label={label} built={built} active={active} />
            {/* Desktop only: on a phone the step's own title sits right under it. */}
            <p aria-hidden className="mt-4 hidden items-baseline gap-3 text-sm text-muted lg:flex">
              <span className="text-[0.6875rem] font-semibold tracking-[0.14em] text-brand tabular-nums">
                {num(step)} / {num(steps.length - 1)}
              </span>
              <span className="font-semibold text-heading">{steps[step].title}</span>
            </p>
          </div>

          <ol ref={list} className="relative mt-6 lg:mt-0">
            <div aria-hidden className="absolute top-0 bottom-0 left-[5px] w-px bg-hairline">
              <div
                ref={fill}
                className="absolute inset-0 origin-top scale-y-0 bg-brand transition-transform duration-700 ease-out"
              />
            </div>
            {steps.map((s, i) => {
              const on = i === step
              const done = i < step
              return (
                <li
                  key={s.title}
                  data-step={i}
                  className="relative flex min-h-[52svh] flex-col justify-center pl-10 lg:min-h-[64svh]"
                >
                  <div className="relative">
                    <span
                      data-dot
                      aria-hidden
                      className={`absolute top-[0.1rem] -left-10 size-[11px] rounded-full border-2 transition-[background-color,border-color,scale] duration-500 ${
                        on ? 'scale-125 border-brand bg-brand' : done ? 'border-brand bg-brand' : 'border-heading/25 bg-paper'
                      }`}
                    />
                    <p
                      className={`text-[0.6875rem] font-semibold tracking-[0.14em] tabular-nums transition-colors duration-500 ${
                        on ? 'text-brand' : 'text-muted'
                      }`}
                    >
                      Step {num(i)}
                    </p>
                    <h3
                      className={`type-hero mt-3 text-h3 leading-tight transition-colors duration-500 ${
                        on ? 'text-heading' : 'text-heading/50'
                      }`}
                    >
                      {s.title}
                    </h3>
                    <p
                      className={`text-body mt-3 max-w-[44ch] transition-colors duration-500 ${
                        on ? 'text-heading' : 'text-muted'
                      }`}
                    >
                      {s.body}
                    </p>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}

/* ── 4. What you get ────────────────────────────────────────────────────── */

function Deliverables({ service }: { service: Service }) {
  return (
    <section aria-labelledby="get-title" className={`section-y bg-ink ${PAD}`}>
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <div>
          <Heading id="get-title" dark lines={['What you', 'get']} />
          <p data-reveal className="text-lead mt-8 max-w-[34ch] text-dark-muted [--reveal-delay:120ms]">
            All of it, or only the part you need. Each piece can be scoped on its own.
          </p>
          <div data-reveal className="mt-10 [--reveal-delay:180ms]">
            <p className="text-eyebrow text-dark-muted uppercase">Built with</p>
            <StackChips stack={service.stack} className="mt-4" />
          </div>
        </div>

        <ol className="border-b border-white/10 lg:mt-3">
          {service.deliverables.map((item, i) => (
            <li
              key={item}
              data-reveal
              style={{ '--reveal-delay': `${120 + i * 80}ms` } as CSSProperties}
              className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4 border-t border-white/10 py-6 sm:py-7"
            >
              <span className="pt-1.5 text-[0.6875rem] font-semibold tracking-[0.14em] text-brand-bright tabular-nums">
                {num(i)}
              </span>
              <span className="type-hero text-[1.25rem] leading-snug text-white sm:text-[1.5rem]">{item}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ── 5. Where I've done it ──────────────────────────────────────────────── */

/** The CV lines quoted as written (`EXPERIENCE` in Work.tsx), then the builds.
 *  Nothing on this chapter is written for the page. */
function Proof({ service }: { service: Service }) {
  const entries = service.experience.flatMap((e) => {
    const entry = EXPERIENCE.find((x) => x.company === e.company)
    return entry ? [{ entry, points: e.points.map((p) => entry.points[p]).filter(Boolean) }] : []
  })
  const projects = service.projects
    .map((s) => PROJECTS.find((p) => p.slug === s))
    .filter((p): p is Project => p !== undefined)

  return (
    <section id="work" aria-labelledby="work-title" className={`section-y scroll-mt-20 ${PAD}`}>
      <div className="mx-auto max-w-6xl">
        <Heading id="work-title" lines={['Where I’ve', 'done it']} />
        <p data-reveal className="text-lead mt-8 max-w-[46ch] text-muted [--reveal-delay:120ms]">
          {entries.length > 0
            ? 'Quoted from my CV, then the builds you can open and check for yourself.'
            : 'The builds you can open and check for yourself.'}
        </p>

        {entries.length > 0 && (
          <ul className="mt-12 border-b border-hairline">
            {entries.map(({ entry, points }) => (
              <li
                key={entry.company}
                data-reveal
                className="grid gap-6 border-t border-hairline py-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-12 lg:py-10"
              >
                <div className="flex items-center gap-4">
                  <span className="grid size-12 shrink-0 place-items-center overflow-clip rounded-xl bg-white ring-1 ring-hairline">
                    {entry.logo ? (
                      <img src={entry.logo} alt="" className="size-8 object-contain" />
                    ) : (
                      <span className="type-hero text-sm text-heading">{entry.short}</span>
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="type-hero text-lg leading-tight text-heading">{entry.company}</p>
                    <p className="mt-1 text-sm text-muted">{entry.roles[0].title}</p>
                    <p className="mt-0.5 text-sm text-muted tabular-nums">{entry.roles[0].period}</p>
                  </div>
                </div>
                <ul className="grid gap-4">
                  {points.map((point) => (
                    <li key={point} className="text-body flex gap-3 text-heading">
                      <span aria-hidden className="mt-[0.7rem] size-1.5 shrink-0 rounded-full bg-brand" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}

        {projects.length > 0 && (
          <div className="mt-16 lg:mt-20">
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
              <h3 data-reveal className="type-hero text-h3 text-heading">
                Builds<span className="text-brand">.</span>
              </h3>
              <Link
                to="/projects"
                className="group -my-2.5 inline-flex items-center gap-2 py-3.5 text-[0.75rem] font-semibold tracking-[0.14em] text-heading uppercase transition-colors hover:text-brand"
              >
                All projects
                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                  &rarr;
                </span>
              </Link>
            </div>
            {/* `overflow-clip`, not `hidden`: hidden would make this a scroll
                container and freeze any view() timeline inside (CLAUDE.md). */}
            <ul
              data-reveal
              className="mt-6 overflow-clip rounded-[2rem] bg-ink px-4 [--reveal-delay:80ms] sm:px-8 lg:px-10 [&>li:last-child>a]:border-b-0"
            >
              {projects.map((project, i) => (
                <li key={project.slug}>
                  <Row project={project} index={i} heading="h3" />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}

/* ── 6. Questions ───────────────────────────────────────────────────────── */

/** Native <details>, one open at a time via `name`. Keyboard, screen readers
 *  and the open state come free; the answer rises in each time it opens. */
function Questions({ service, contact }: { service: Service; contact: string }) {
  return (
    <section aria-labelledby="faq-title" className={`section-y bg-paper-2 ${PAD}`}>
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <div>
          <Heading id="faq-title" lines={['Questions', 'clients ask']} />
          <p data-reveal className="text-lead mt-8 max-w-[30ch] text-muted [--reveal-delay:120ms]">
            Not covered here?{' '}
            <a
              href={contact}
              data-track="contact_cta"
              data-track-from="service_faq"
              className="text-heading underline decoration-brand decoration-2 underline-offset-4 hover:text-brand">
              Ask me directly.
            </a>
          </p>
        </div>

        <div data-reveal className="border-b border-hairline [--reveal-delay:120ms]">
          {service.faqs.map((f) => (
            <details key={f.q} name={`faq-${service.id}`} className="group border-t border-hairline">
              <summary className="flex cursor-pointer list-none items-center gap-6 py-6 [&::-webkit-details-marker]:hidden">
                <span className="type-hero flex-1 text-[1.125rem] leading-snug text-heading transition-colors group-hover:text-brand sm:text-[1.25rem]">
                  {f.q}
                </span>
                <span
                  aria-hidden
                  className="relative grid size-9 shrink-0 place-items-center rounded-full text-muted ring-1 ring-hairline transition-colors group-open:bg-heading group-open:text-white group-open:ring-heading"
                >
                  <span className="absolute h-[1.5px] w-3.5 rounded-full bg-current" />
                  <span className="absolute h-3.5 w-[1.5px] rounded-full bg-current transition-transform duration-300 group-open:scale-y-0" />
                </span>
              </summary>
              <p className="text-body max-w-[58ch] animate-rise-in pb-7 text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── 7. Next: the other services, then the talk panel ──────────────────── */

function Next({ service, contact }: { service: Service; contact: string }) {
  return (
    <section aria-labelledby="others-title" className={`section-y ${PAD}`}>
      <div className="mx-auto max-w-6xl">
        <h2 id="others-title" data-reveal className="type-hero text-h2 leading-[1.05] text-heading">
          Other services<span className="text-brand">.</span>
        </h2>
        {/* Numbered as on the home page, so the gap where this page's own
            number would be is the "you are here". */}
        <ul data-reveal className="mt-8 border-b border-hairline [--reveal-delay:80ms]">
          {SERVICES.map((s, i) =>
            s === service ? null : (
              <li key={s.id} className="border-t border-hairline">
                <Link
                  to={`/services/${s.id}`}
                  className="group press grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-x-4 py-5 [--press:0.985] sm:gap-x-6 lg:grid-cols-[2.5rem_minmax(0,19rem)_minmax(0,1fr)_auto]"
                >
                  <span className="text-[0.6875rem] font-semibold tracking-[0.14em] text-muted tabular-nums">
                    {num(i)}
                  </span>
                  <span className="type-hero text-[1.125rem] leading-tight text-heading transition-colors group-hover:text-brand sm:text-[1.375rem]">
                    {s.title}
                  </span>
                  <span className="hidden text-sm text-muted lg:block">{s.summary}</span>
                  <span aria-hidden className="text-brand transition-transform group-hover:translate-x-0.5">
                    &rarr;
                  </span>
                </Link>
              </li>
            ),
          )}
        </ul>

        <div className="mt-20 lg:mt-28">
          <TalkPanel
            title="Have a project like this"
            body="Tell me what you want to build, and I'll tell you how I would approach it."
            href={contact}
          />
        </div>
      </div>
    </section>
  )
}

function NotFound() {
  return (
    <>
      <Nav />
      <main id="top" className="grid min-h-screen place-items-center bg-paper px-4 pt-nav pb-28">
        <div className="max-w-md text-center">
          <p className="text-eyebrow text-muted uppercase">404</p>
          <h1 className="type-hero mt-4 text-h2 text-heading">
            No service here<span className="text-brand">.</span>
          </h1>
          <p className="mt-4 text-body text-muted">It may have moved, or the link has a typo.</p>
          <a
            href="/#services"
            className="press mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-heading ring-1 ring-hairline hover:ring-heading/20"
          >
            <span aria-hidden>&larr;</span> All services
          </a>
        </div>
      </main>
      <Footer />
    </>
  )
}

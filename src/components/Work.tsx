import { useEffect, useRef, useState } from 'react'
import TechIcon from './TechIcon'

/** Collapsed height of the bullet list, in px. Keeps the card the same height
 *  whichever company is selected — Padelos has 6 bullets, Bytewise has 2. */
const COLLAPSED_H = 216

/** Straight from Ahmed-Islam-CV.pdf — roles, dates and bullets are his, verbatim
 *  apart from light trimming. Keep this in sync with the CV when it changes. */
const EXPERIENCE = [
  {
    company: 'Padelos',
    short: 'P',
    logo: '/companies/padelos.svg',
    kind: 'Live SaaS platform',
    roles: [{ title: 'Associate AI Engineer', period: 'Jan 2026 — Present' }],
    points: [
      'Build LLM-powered agents and multi-agent workflows on the Padelos SaaS platform with LangChain and LangGraph, automating multi-step production processes.',
      'Developed a Model Context Protocol (MCP) server that exposes platform data and business logic to AI agents through structured tool-calling interfaces.',
      'Engineer and version system prompts for PadelGPT, the platform assistant, and built a quality-evaluation pipeline that grades responses against a rubric and generates structured Excel and CSV reports.',
      'Manage agent memory with vector stores (FAISS, ChromaDB) for retrieval, and Redis and PostgreSQL for short-term and persistent state.',
      'Built n8n pipelines that extract, transform, and report conversation data from Azure Cosmos DB across player and admin schemas.',
      'Migrated the platform chatbot from Azure to AWS EC2 and shipped services with Docker and Bitbucket Pipelines CI/CD, adding CloudWatch-based observability.',
    ],
    stack: ['LangGraph', 'LangChain', 'MCP', 'FAISS', 'ChromaDB', 'Redis', 'PostgreSQL', 'n8n', 'AWS EC2', 'Docker'],
  },
  {
    company: 'IR Solutions',
    short: 'IR',
    logo: '/companies/IR-Solutions.svg',
    kind: 'Agentic AI systems',
    roles: [{ title: 'Junior AI Engineer', period: 'Jul — Dec 2025' }],
    points: [
      'Built production agentic AI systems with n8n and engineered large-scale web scraping and data-ingestion pipelines.',
      'Delivered end-to-end AI agents from design through deployment in a fast-paced team.',
    ],
    stack: ['n8n', 'Python', 'Web scraping', 'ETL'],
  },
  {
    company: 'Itsolera',
    short: 'IT',
    logo: '/companies/itsolera.png',
    kind: 'Deep learning',
    roles: [{ title: 'Deep Learning Intern', period: 'Jul — Oct 2024' }],
    points: [
      'Built a CNN content-moderation system for images and text, plus a facial-recognition attendance system.',
      'Implemented real-time product-detection models for retail shelf monitoring with computer vision.',
    ],
    stack: ['TensorFlow', 'CNNs', 'Computer Vision', 'YOLO'],
  },
  {
    company: 'Bytewise',
    short: 'BW',
    // cropped from the original 900x900 jpg, which was two-thirds white margin
    logo: '/companies/bytewise.png',
    kind: 'ML fellowship',
    roles: [{ title: 'Machine Learning Fellow', period: 'Jun — Sep 2024' }],
    points: [
      'Completed an intensive fellowship in supervised and unsupervised ML, feature engineering, and model evaluation.',
      'Applied end-to-end ML workflows on real datasets with scikit-learn and pandas.',
    ],
    stack: ['scikit-learn', 'pandas', 'Feature engineering'],
  },
  {
    // Education sits last in the rail — same card, so the switcher covers the
    // whole timeline rather than needing a second component.
    company: 'University of Haripur',
    short: 'UH',
    logo: null,
    kind: 'Education',
    roles: [{ title: 'BS Computer Science — CGPA 3.79 / 4.0', period: 'Sep 2021 — Jul 2025' }],
    points: [
      'Graduated Jul 2025 with a CGPA of 3.79 / 4.0, with coursework across Machine Learning, Data Structures & Algorithms, Computer Vision, Database Systems and Software Engineering.',
      'Trained a 2D U-Net on the BraTS2020 MRI dataset to segment necrotic core, edema and enhancing tumour regions — 99.2% validation accuracy and a 0.71 Dice score, using custom augmentation to handle class imbalance.',
      'Built a multimodal RAG system combining text and image understanding with LangChain, FAISS/ChromaDB and Hugging Face Transformers, served through a FastAPI backend for quiz generation, Q&A and mock-interview simulations.',
      'Contributed to modelcontextprotocol/inspector, fixing a rendering bug where nested and optional array parameters fell back to raw JSON instead of structured form inputs.',
      'Certified through the Atomcamp Data Science & AI Bootcamp, IBM Machine Learning, AI & ML Foundation (Xeven Solutions), MLOps (Udemy) and LangChain Academy’s Introduction to LangGraph.',
    ],
    stack: ['Python', 'PyTorch', 'TensorFlow', 'U-Net', 'scikit-learn', 'LangChain'],
  },
]

export default function Work() {
  const [active, setActive] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const [contentH, setContentH] = useState<number | null>(null)
  const points = useRef<HTMLUListElement>(null)
  const job = EXPERIENCE[active]

  // ResizeObserver rather than measuring once: it also catches the Archivo
  // web-font swap and window resizes, both of which change how bullets wrap.
  useEffect(() => {
    const el = points.current
    if (!el) return
    const observer = new ResizeObserver(() => setContentH(el.offsetHeight))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Assume overflow until measured, so the first paint is already clamped
  // instead of flashing the full list.
  const measured = contentH !== null
  const overflows = !measured || contentH > COLLAPSED_H + 8
  // Collapsed is always exactly COLLAPSED_H, even when the content is shorter —
  // a fixed *max* height still let 2-bullet roles shrink the card (408px vs
  // 611px). Short roles get trailing space; the stack tags below therefore land
  // at the same spot on every tab.
  const bodyHeight = expanded ? (contentH ?? undefined) : COLLAPSED_H
  const faded = overflows && !expanded

  return (
    <section id="experience" className="section-y scroll-mt-28 px-4 sm:px-6 lg:px-20">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[6.5rem_1fr] lg:gap-14">
        <p data-reveal className="text-eyebrow flex gap-2 text-muted/70 uppercase lg:pt-4">
          <span className="text-brand">03</span>
          <span aria-hidden>/</span>
          <span>Experience</span>
        </p>

        {/* min-w-0: grid items default to min-width:auto, so the tab rail's
            min-content width would otherwise push this column past the viewport
            and stop its overflow-x-auto from ever engaging. */}
        <div className="min-w-0">
          {/* Not "Selected work." any more — section 06 is now "Things I've
              shipped.", and two headings both claiming "work" read as the same
              section twice. This one is the employment + education timeline. */}
          <h2 data-reveal className="type-hero text-display leading-[0.92] uppercase">
            <span className="block text-heading">Where I&rsquo;ve</span>
            <span className="block text-heading/25">
              been<span className="text-brand">.</span>
            </span>
          </h2>

          <div
            data-reveal
            className="mt-12 overflow-hidden rounded-[1.75rem] bg-ink-raised [--reveal-delay:120ms] lg:grid lg:grid-cols-[16rem_1fr]"
          >
            {/* ── Company switcher ───────────────────────────────
                Plain buttons with aria-current rather than ARIA tab roles —
                role="tab" promises arrow-key navigation this doesn't implement. */}
            <ul className="flex overflow-x-auto border-b border-white/10 lg:flex-col lg:overflow-visible lg:border-r lg:border-b-0">
              {EXPERIENCE.map((item, i) => {
                const on = i === active
                return (
                  <li key={item.company} className="shrink-0 lg:shrink">
                    <button
                      type="button"
                      onClick={() => {
                        setActive(i)
                        setExpanded(false)
                      }}
                      aria-current={on ? 'true' : undefined}
                      className={`relative flex w-full items-center gap-3.5 px-5 py-4 text-left transition-colors ${
                        on ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'
                      }`}
                    >
                      {on && (
                        <span
                          aria-hidden
                          className="absolute inset-x-0 bottom-0 h-[3px] bg-brand lg:inset-x-auto lg:inset-y-0 lg:left-0 lg:h-auto lg:w-[3px]"
                        />
                      )}
                      {/* Monogram, not the logo: itsolera and bytewise are wide
                          wordmarks and are unreadable squeezed into 40px. The real
                          logo goes in the panel header where it has room. */}
                      <span
                        aria-hidden
                        className={`grid size-10 shrink-0 place-items-center rounded-full text-[0.8125rem] font-bold transition-colors ${
                          on
                            ? 'bg-brand text-white'
                            : 'bg-white/8 text-dark-muted ring-1 ring-white/10'
                        }`}
                      >
                        {item.short}
                      </span>
                      <span className="min-w-0">
                        <span
                          className={`block truncate text-sm font-semibold ${
                            on ? 'text-white' : 'text-dark-muted'
                          }`}
                        >
                          {item.company}
                        </span>
                        <span className="block truncate text-xs text-dark-muted/70">
                          {item.roles[0].period}
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>

            {/* ── Detail panel ───────────────────────────────── */}
            <div className="px-6 py-8 sm:px-9 sm:py-10">
              <div className="flex items-center gap-4">
                {job.logo && (
                  // wide plate, not a square: every one of these is a horizontal
                  // wordmark, so height is the constraint and width must be free
                  <img
                    src={job.logo}
                    alt={`${job.company} logo`}
                    className="h-12 w-auto max-w-[9rem] shrink-0 rounded-xl bg-white object-contain px-2.5 py-1.5"
                  />
                )}
                <div>
                  <p className="text-eyebrow text-brand-bright uppercase">{job.kind}</p>
                  <h3 className="type-hero mt-1.5 text-2xl text-white sm:text-3xl">
                    {job.company}
                  </h3>
                </div>
              </div>

              <ol className="mt-7 space-y-5 border-l border-white/12 pl-6">
                {job.roles.map((role) => (
                  <li key={role.title} className="relative">
                    <span
                      aria-hidden
                      className="absolute top-1.5 -left-[1.6875rem] size-2.5 rounded-full bg-brand ring-4 ring-ink-raised"
                    />
                    <p className="text-sm font-semibold text-white">{role.title}</p>
                    <p className="mt-0.5 text-sm text-dark-muted tabular-nums">{role.period}</p>
                  </li>
                ))}
              </ol>

              <div
                id="role-points"
                className="relative mt-7 overflow-hidden transition-[height] duration-300 ease-out motion-reduce:transition-none"
                style={{ height: bodyHeight }}
              >
                <ul ref={points} className="space-y-3">
                  {job.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-3 text-[0.9375rem] leading-relaxed text-dark-muted"
                    >
                      <span
                        aria-hidden
                        className="mt-[0.5rem] size-1.5 shrink-0 rounded-full bg-brand/70"
                      />
                      <span className="max-w-[66ch]">{point}</span>
                    </li>
                  ))}
                </ul>

                {faded && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink-raised via-ink-raised/85 to-transparent"
                  />
                )}
              </div>

              {/* Always rendered so it reserves its row — conditionally rendering
                  it made the card 34px shorter on roles that fit. Faded out it
                  stays unfocusable and unannounced, but keeps its space. */}
              <div className="mt-4 flex">
                <button
                  type="button"
                  onClick={() => setExpanded((v) => !v)}
                  aria-expanded={expanded}
                  aria-controls="role-points"
                  aria-hidden={!overflows}
                  tabIndex={overflows ? undefined : -1}
                  className={`inline-flex items-center gap-2 text-[0.75rem] font-semibold tracking-[0.14em] text-brand-bright uppercase transition-colors hover:text-white ${
                    overflows ? '' : 'pointer-events-none opacity-0'
                  }`}
                >
                  {expanded ? 'Show less' : 'Read more'}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`size-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
                    aria-hidden
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
              </div>

              {/* Reserves two tag rows (measured at 89px incl. pt-6): Padelos' 10
                  tags wrap to two, the shorter roles fit one, and the difference
                  was jumping the card 25px. Bump if an entry ever needs three. */}
              <ul className="mt-8 flex min-h-24 flex-wrap content-start items-start gap-2 border-t border-white/10 pt-6">
                {job.stack.map((tool) => (
                  <li
                    key={tool}
                    className="flex items-center gap-1.5 rounded-lg bg-white/[0.06] px-2.5 py-1.5 text-xs font-semibold text-dark-muted ring-1 ring-white/10"
                  >
                    <TechIcon name={tool} className="size-3.5 shrink-0 text-brand-bright" />
                    {tool}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

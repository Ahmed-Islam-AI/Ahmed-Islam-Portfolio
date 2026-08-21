import portrait from '../assets/ahmed.png'

/** Floating capability chips. Positions are hand-tuned so they clear each other
 *  and the portrait caption — in the mockup "Production observability" landed on
 *  top of the caption and "Multi-agent systems" was clipped by the ring. */
const CAPABILITIES = [
  { label: 'Multi-agent systems', tone: 'light', pos: 'top-[13%] -left-[9%]' },
  { label: 'MCP + integrations', tone: 'brand', pos: 'top-[31%] -right-[3%]' },
  { label: 'RAG pipelines', tone: 'light', pos: 'top-[55%] -left-[11%]' },
  // Took the slot "Production observability" held, as part of the full-stack
  // reframe. It stays four chips, not five — the positions are hand-tuned to
  // clear each other, and a fifth has nowhere to go. Shorter than the label it
  // replaced, so the right-hand overhang only got smaller.
  { label: 'React & Next.js', tone: 'light', pos: 'top-[69%] -right-[2%]' },
] as const

const TONES = {
  light: 'bg-white text-heading shadow-[0_12px_32px_-14px_rgb(20_19_18/0.5)]',
  brand: 'bg-brand text-white shadow-[0_12px_32px_-14px_rgb(241_86_41/0.7)]',
}

const chipClass =
  'rounded-lg px-3 py-2 text-[0.6875rem] font-semibold tracking-[0.12em] whitespace-nowrap uppercase'

export default function Hero() {
  return (
    <section id="hero" className="px-4 pt-12 pb-16 sm:px-6 lg:px-20 lg:pt-16 lg:pb-20">
      {/* max-w-6xl, like every other section — at 7xl the hero column started
          128px wider than the rest of the page and nothing lined up down the
          left edge. The nav keeps 7xl on purpose; see Nav.tsx. */}
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1fr_minmax(0,26rem)] lg:gap-20">
        {/* ── Copy ─────────────────────────────────────────────── */}
        <div>
          <p data-reveal>
            <span className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-white to-paper-2 py-2 pr-4 pl-3 shadow-[0_10px_30px_-18px_rgb(20_19_18/0.5)] ring-1 ring-hairline">
              {/* live dot — green reads "available"; orange is the brand accent
                  and would read as decoration rather than status */}
              <span className="relative flex size-2.5 shrink-0" title="Available for new work">
                <span className="absolute inline-flex size-full rounded-full bg-success opacity-60 motion-safe:animate-ping" />
                <span className="relative inline-flex size-2.5 rounded-full bg-success" />
              </span>
              <span className="text-eyebrow text-heading uppercase">
                Full-Stack AI Engineer <span className="text-brand">·</span> Web &amp; Agentic
              </span>
              <span className="sr-only">— available for new work</span>
            </span>
          </p>

          <h1
            data-reveal
            className="type-hero text-display mt-6 max-w-[16ch] text-heading uppercase [--reveal-delay:80ms]"
          >
            {/* "systems" -> "products" so the line covers a website as well as an
                agent. "Beyond the demo" is the sharpest phrase on the page and
                stays; the pill above and the lead below carry the specifics. */}
            I build products that work beyond the demo.
          </h1>

          <p
            data-reveal
            className="text-lead mt-7 max-w-[44ch] text-muted [--reveal-delay:160ms]"
          >
            Ahmed builds production AI systems and the full-stack products around them —
            LangGraph, MCP and RAG on the back end, React and Next.js on the front.
          </p>

          {/* The mockup's two icon-only circles gave no hint what they do, so the
              primary CTA now carries a label. The mail button keeps the circle. */}
          <div data-reveal className="mt-9 flex flex-wrap items-center gap-3 [--reveal-delay:240ms]">
            <a
              href="#projects"
              className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-b from-brand-bright to-brand-deep px-6 py-3.5 text-[0.75rem] font-semibold tracking-[0.14em] text-white uppercase shadow-lg shadow-brand/25 transition hover:brightness-110"
            >
              See the work
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4 transition-transform group-hover:translate-y-0.5"
                aria-hidden
              >
                <path d="M12 5v14M6 13l6 6 6-6" />
              </svg>
            </a>

            <a
              href="mailto:ahmedislam.official@gmail.com"
              aria-label="Email Ahmed"
              className="grid size-12 place-items-center rounded-full border border-heading/15 text-heading transition hover:border-brand hover:text-brand"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-5"
                aria-hidden
              >
                <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
                <path d="M3 7l9 6 9-6" />
              </svg>
            </a>
          </div>

          <p
            data-reveal
            className="text-eyebrow mt-10 max-w-[40ch] border-t border-hairline pt-6 text-heading/80 uppercase [--reveal-delay:320ms]"
          >
            Full-stack engineering for software that needs to keep working after launch.
          </p>
        </div>

        {/* ── Portrait ─────────────────────────────────────────── */}
        <div data-reveal="right" className="relative [--reveal-delay:200ms]">
          <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
            {/* decorative ring, sits behind the card */}
            <span
              aria-hidden
              className="absolute -top-6 -left-[17%] hidden size-44 rounded-full border border-brand/25 lg:block"
            />

            {/* offset orange block */}
            <span
              aria-hidden
              className="absolute inset-0 translate-x-5 translate-y-6 rounded-[2rem] bg-gradient-to-b from-brand-bright to-brand-deep"
            />

            <div className="relative aspect-4/5 overflow-hidden rounded-[2rem] bg-ink-raised">
              <span
                aria-hidden
                className="absolute -top-1/4 left-1/2 size-[26rem] -translate-x-1/2 rounded-full bg-brand/20 blur-[90px]"
              />
              <img
                src={portrait}
                alt="Ahmed Islam"
                width={790}
                height={1110}
                fetchPriority="high"
                className="absolute bottom-0 left-1/2 h-full w-auto max-w-none -translate-x-1/2 object-bottom"
              />
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink-deep via-ink-deep/75 to-transparent"
              />
              {/* Chips overlaid on the portrait below lg, over the existing scrim.
                  They used to sit in a row *under* the card, which read as a
                  detached list rather than part of the portrait. */}
              <ul className="absolute inset-x-3 bottom-3 z-20 flex flex-wrap gap-1.5 lg:hidden">
                {CAPABILITIES.map((cap) => (
                  <li
                    key={cap.label}
                    className={`rounded-lg px-2.5 py-1.5 text-[0.625rem] font-semibold tracking-[0.1em] whitespace-nowrap uppercase ${TONES[cap.tone]}`}
                  >
                    {cap.label}
                  </li>
                ))}
              </ul>
            </div>

            {/* chips — absolutely placed on desktop */}
            {CAPABILITIES.map((cap) => (
              <span
                key={cap.label}
                className={`absolute z-20 hidden lg:block ${cap.pos} ${chipClass} ${TONES[cap.tone]}`}
              >
                {cap.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

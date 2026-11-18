import { useState } from 'react'
import { TESTIMONIALS } from '../data/testimonials'

/** One paragraph of verbatim pull-quotes; the ledger below holds each full text.
 *  Runs are <a> so they wrap; hover only recolours, a click expands (HISTORY.md › Reviews) */
export default function Reviews() {
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="reviews" className="section-y scroll-mt-28 bg-paper-2 px-4 sm:px-6 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <div className="min-w-0">
          <h2 data-reveal className="type-hero text-display leading-[0.92] uppercase">
            <span className="block text-heading">In their</span>{' '}
            <span className="block text-heading/50">
              words<span className="text-brand">.</span>
            </span>
          </h2>

          <p data-reveal className="text-lead mt-9 max-w-[56ch] text-muted [--reveal-delay:120ms]">
            Five recommendations from LinkedIn, opened at their sharpest line. Pick any one to
            read it in full, exactly as it was written.
          </p>

          {/* The composite. One paragraph, five voices, each linked to its source. */}
          <p data-reveal className="text-h3 mt-12 max-w-[52ch] leading-[1.5] [--reveal-delay:180ms]">
            {TESTIMONIALS.map((testimonial, i) => {
              const on = active === i
              return (
                <span key={testimonial.id}>
                  <a
                    id={`review-run-${i + 1}`}
                    href={`#review-note-${i + 1}`}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    // also opens the source row, or the jump would land on it collapsed
                    onClick={() => {
                      setActive(i)
                      setOpen(i)
                    }}
                    className={`transition-colors duration-200 ${
                      on
                        ? 'text-heading underline decoration-brand/70 decoration-2 underline-offset-[0.3em]'
                        : 'text-muted'
                    }`}
                  >
                    <q>{testimonial.pull}</q>
                    <sup
                      // no-underline: the active run's rule stops at the quote, not the marker
                      className={`ms-1 text-[0.5em] font-semibold no-underline tabular-nums transition-colors duration-200 ${
                        on ? 'text-brand' : 'text-muted'
                      }`}
                    >
                      {i + 1}
                    </sup>
                  </a>{' '}
                </span>
              )
            })}
          </p>

          <h3
            data-reveal
            className="text-eyebrow mt-14 text-muted uppercase [--reveal-delay:240ms]"
          >
            Who said it
          </h3>

          <ol data-reveal className="mt-5 [--reveal-delay:300ms]">
            {TESTIMONIALS.map((testimonial, i) => {
              const on = active === i
              const expanded = open === i
              return (
                <li
                  key={testimonial.id}
                  id={`review-note-${i + 1}`}
                  className="border-t border-hairline last:border-b"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setActive(i)
                      setOpen(expanded ? null : i)
                    }}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    aria-expanded={expanded}
                    aria-controls={`review-full-${i + 1}`}
                    className="press flex w-full items-center gap-4 py-3 text-left [--press:0.99]"
                  >
                    {/* Same tick language as SectionRail, so the two read as one system. */}
                    <span
                      aria-hidden
                      className={`h-px shrink-0 transition-all duration-300 ${
                        on ? 'w-6 bg-brand' : 'w-3 bg-heading/25'
                      }`}
                    />

                    <span className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-1">
                      <span
                        className={`text-[0.6875rem] font-semibold tracking-[0.14em] tabular-nums transition-colors duration-200 ${
                          on ? 'text-brand' : 'text-muted'
                        }`}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span
                        className={`type-hero text-[0.9375rem] transition-colors duration-200 ${
                          on ? 'text-heading' : 'text-muted'
                        }`}
                      >
                        {testimonial.name}
                      </span>
                      <span className="text-sm text-muted">
                        {testimonial.relation} &middot; {testimonial.location}
                      </span>
                      <span
                        // ms-auto only from sm: on a wrapped phone row it reads as detached
                        className={`rounded-full px-3 py-1 text-[0.6875rem] font-semibold tracking-[0.12em] whitespace-nowrap uppercase transition-colors duration-200 sm:ms-auto ${
                          on
                            ? 'bg-white text-heading ring-1 ring-hairline'
                            : 'text-muted ring-1 ring-heading/10'
                        }`}
                      >
                        LinkedIn
                      </span>
                    </span>

                    {/* A plus that becomes a minus, the same control Services uses. */}
                    <span
                      aria-hidden
                      className={`relative grid size-8 shrink-0 place-items-center rounded-full transition-colors ${
                        expanded ? 'bg-brand text-white' : 'text-muted ring-1 ring-hairline'
                      }`}
                    >
                      <span className="absolute h-[1.5px] w-3 rounded-full bg-current" />
                      <span
                        className={`absolute h-3 w-[1.5px] rounded-full bg-current transition-transform duration-300 ${
                          expanded ? 'scale-y-0' : ''
                        }`}
                      />
                    </span>
                  </button>

                  {/* 0fr → 1fr rows animate to natural height, which height: auto can't. */}
                  <div
                    id={`review-full-${i + 1}`}
                    role="region"
                    className={`grid transition-all duration-300 ease-out ${
                      expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <blockquote className="text-body max-w-[62ch] pb-6 ps-10 text-muted sm:ps-14">
                        {testimonial.quote}
                      </blockquote>
                    </div>
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

import { useState } from 'react'
import { TESTIMONIALS } from '../data/testimonials'

/**
 * Reviews as ONE running paragraph of praise, not five cards.
 *
 * The unit of design here is the sentence, not the card — deliberately, because
 * Work, Projects and Certifications are all card sets already and STYLE.md asks
 * the next new section to find its own form. Five recommendations sit end to end
 * as one block of endorsement; picking a run pulls that voice out of the composite
 * and lights up its source in the ledger below.
 *
 * **The composite is an index of pull-quotes, and the ledger holds the originals.**
 * That split is what makes the section survive real testimonials: the supplied
 * LinkedIn recommendations run from 11 to 140 words, and five of those set end to
 * end is an essay, not a paragraph. Each `pull` is a verbatim contiguous excerpt
 * (see the interface note in `data/testimonials.ts`), so the paragraph stays ~90
 * words whatever the sources do, and the full text is one tap away in the row.
 *
 * Three things this is careful about:
 *
 * - **Inactive runs are `text-muted`, not the `heading/25` ghost.** The ghost tone
 *   is for display text; at body scale it fails the contrast floor in STYLE.md,
 *   and four unreadable quotes is not a design. So the whole composite is legible
 *   at rest and the active state is purely an enhancement — which is also what
 *   makes this work on touch, where there is no hover at all.
 * - **Each run is an `<a>`, not a `<button>`.** A button is atomic inline-level and
 *   cannot break across lines, which would destroy the running paragraph. An
 *   anchor wraps normally, is focusable for free, and jumping to its own source is
 *   exactly what a footnote reference should do when tapped.
 * - **Hover only ever changes colour; expanding is a click.** Sweeping the mouse
 *   across the composite must not open and close rows underneath it — that thrashes
 *   the page height and moves content out from under the cursor.
 */
export default function Reviews() {
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="reviews" className="section-y scroll-mt-28 bg-paper-2 px-4 sm:px-6 lg:px-20">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[6.5rem_1fr] lg:gap-14">
        <p data-reveal className="text-eyebrow flex gap-2 text-muted/70 uppercase lg:pt-4">
          <span className="text-brand">06</span>
          <span aria-hidden>/</span>
          <span>Reviews</span>
        </p>

        <div className="min-w-0">
          <h2 data-reveal className="type-hero text-display leading-[0.92] uppercase">
            <span className="block text-heading">In their</span>
            <span className="block text-heading/25">
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
                    // Tapping a run lands you on its source with the full text
                    // already open — the jump on its own would leave you looking
                    // at a collapsed row.
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
                      // no-underline so the active run's rule stops at the quote
                      // rather than leaving a stray dash under the marker
                      className={`ms-1 text-[0.5em] font-semibold no-underline tabular-nums transition-colors duration-200 ${
                        on ? 'text-brand' : 'text-heading/40'
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
            className="text-eyebrow mt-14 text-muted/70 uppercase [--reveal-delay:240ms]"
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
                    className="flex w-full items-center gap-4 py-3 text-left"
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
                          on ? 'text-brand' : 'text-heading/40'
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
                        // ms-auto only from sm: below that the row wraps to three
                        // lines and a right-flung chip reads as detached from its row
                        className={`rounded-full px-3 py-1 text-[0.6875rem] font-semibold tracking-[0.12em] whitespace-nowrap uppercase transition-colors duration-200 sm:ms-auto ${
                          on
                            ? 'bg-white text-heading ring-1 ring-hairline'
                            : 'text-heading/45 ring-1 ring-heading/10'
                        }`}
                      >
                        LinkedIn
                      </span>
                    </span>

                    {/* A plus that becomes a minus — same control Services uses, so
                        "this opens" reads the same way in both places. */}
                    <span
                      aria-hidden
                      className={`relative grid size-8 shrink-0 place-items-center rounded-full transition-colors ${
                        expanded ? 'bg-brand text-white' : 'text-heading/40 ring-1 ring-hairline'
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

                  {/* Grid-rows trick, same as Services: animating grid-template-rows
                      from 0fr to 1fr transitions to the content's natural height
                      without measuring it, which `height: auto` can't do. */}
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

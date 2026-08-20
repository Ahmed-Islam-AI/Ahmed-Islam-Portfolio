import { useState } from 'react'
import TechIcon from './TechIcon'
import { SERVICES } from '../data/services'

/**
 * Services as a numbered index that opens one row at a time, not a grid of icon
 * cards. Two reasons: the card grid is already this page's dominant shape (Work,
 * Projects, Certifications all use one), and a three-across icon grid is the most
 * template-looking thing a portfolio can contain. The numbered rows reuse the
 * site's own index-gutter language instead, and the open row inverts to `bg-ink`,
 * which is the interactive-state rule from STYLE.md applied at full width.
 */
export default function Services() {
  const [open, setOpen] = useState(SERVICES[0].id)

  return (
    <section id="services" className="section-y scroll-mt-28 px-4 sm:px-6 lg:px-20">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[6.5rem_1fr] lg:gap-14">
        <p data-reveal className="text-eyebrow flex gap-2 text-muted/70 uppercase lg:pt-4">
          <span className="text-brand">05</span>
          <span aria-hidden>/</span>
          <span>Services</span>
        </p>

        <div className="min-w-0">
          <h2 data-reveal className="type-hero text-display leading-[0.92] uppercase">
            <span className="block text-heading">What I</span>
            <span className="block text-heading/25">
              deliver<span className="text-brand">.</span>
            </span>
          </h2>

          <p data-reveal className="text-lead mt-9 max-w-[56ch] text-muted [--reveal-delay:120ms]">
            Six ways I get hired, from a single agent to the whole product around it.
            Scope one or chain them — most projects end up being two or three.
          </p>

          <ul data-reveal className="mt-12 [--reveal-delay:180ms]">
            {SERVICES.map((service, i) => {
              const on = open === service.id
              return (
                <li
                  key={service.id}
                  // The open row is a raised ink slab; closed rows are separated by
                  // a hairline instead of a border-box, so the list reads as an
                  // index rather than six stacked cards.
                  className={`overflow-hidden transition-all duration-300 ${
                    on
                      ? 'rounded-[1.75rem] bg-ink shadow-[0_24px_50px_-30px_rgb(20_19_18/0.6)]'
                      : 'border-t border-hairline'
                  } ${i === SERVICES.length - 1 && !on ? 'border-b' : ''}`}
                >
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpen(service.id)}
                      aria-expanded={on}
                      aria-controls={`service-${service.id}`}
                      className="group flex w-full items-center gap-4 px-5 py-6 text-left sm:gap-6 sm:px-8"
                    >
                      <span
                        className={`text-[0.6875rem] font-semibold tracking-[0.14em] tabular-nums transition-colors ${
                          on ? 'text-brand-bright' : 'text-heading/30'
                        }`}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span
                        className={`type-hero min-w-0 flex-1 text-[1.125rem] leading-tight transition-colors sm:text-[1.375rem] ${
                          on ? 'text-white' : 'text-heading group-hover:text-brand'
                        }`}
                      >
                        {service.title}
                      </span>
                      {/* A plus that becomes a minus — cheaper than an icon and it
                          reads as "expand" without a label. */}
                      <span
                        aria-hidden
                        className={`relative grid size-9 shrink-0 place-items-center rounded-full transition-colors ${
                          on ? 'bg-brand text-white' : 'text-heading/40 ring-1 ring-hairline'
                        }`}
                      >
                        <span className="absolute h-[1.5px] w-3.5 rounded-full bg-current" />
                        <span
                          className={`absolute h-3.5 w-[1.5px] rounded-full bg-current transition-transform duration-300 ${
                            on ? 'scale-y-0' : ''
                          }`}
                        />
                      </span>
                    </button>
                  </h3>

                  {/* Grid-rows trick: animating `grid-template-rows` from 0fr to
                      1fr transitions to the content's natural height without
                      measuring it, which `height: auto` can't do. */}
                  <div
                    id={`service-${service.id}`}
                    role="region"
                    className={`grid transition-all duration-300 ease-out ${
                      on ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 pb-7 sm:px-8 sm:pl-[4.5rem]">
                        <p className="text-body max-w-[54ch] text-dark-muted">{service.summary}</p>

                        <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                          {service.deliverables.map((item) => (
                            <li key={item} className="flex gap-3 text-sm text-dark-muted">
                              <span
                                aria-hidden
                                className="mt-[0.4375rem] size-1.5 shrink-0 rounded-full bg-brand"
                              />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>

                        <ul className="mt-7 flex flex-wrap gap-2 border-t border-white/10 pt-6">
                          {service.stack.map((tool) => (
                            <li
                              key={tool}
                              className="flex items-center gap-1.5 rounded-lg bg-white/[0.06] px-2.5 py-1.5 text-xs font-semibold text-dark-muted ring-1 ring-white/10"
                            >
                              <TechIcon
                                name={tool}
                                className="size-3.5 shrink-0 text-brand-bright"
                              />
                              {tool}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}

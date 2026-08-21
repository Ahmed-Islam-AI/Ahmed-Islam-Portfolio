import { useState, type FormEvent } from 'react'
import { SERVICES } from '../data/services'

/**
 * TODO(ahmed): paste your Formspree form ID here — the part after `/f/` in the
 * endpoint they give you. Until it's set the form does NOT post anywhere; it
 * hands off to your mail client with every field already filled in, so the
 * section works today rather than silently swallowing enquiries. Deliberately not
 * guessed: a made-up ID would POST a stranger's inbox.
 */
const FORMSPREE_ID = ''

/** Both real, from the CV. */
const EMAIL = 'ahmedislam.official@gmail.com'
const WHATSAPP = '923008760724'

/** Client-side options, not a price list — edit freely. */
const BUDGETS = ['Under $1k', '$1k – $5k', '$5k – $15k', '$15k+', 'Not sure yet']
const TIMELINES = ['Start now', 'Within a month', 'This quarter', 'Just exploring']

type Status = 'idle' | 'sending' | 'sent' | 'error'

const fieldClass =
  'w-full rounded-xl bg-white/[0.04] px-4 py-3 text-[0.9375rem] text-white ring-1 ring-white/12 transition-colors placeholder:text-dark-muted/50 hover:ring-white/20 focus:ring-brand focus:outline-none'

const labelClass = 'text-eyebrow mb-2 block text-dark-muted uppercase'

/**
 * One chip. Shared verbatim by the service checkboxes and the two radio groups,
 * so "an option you can pick" looks identical everywhere in this form.
 */
const chipClass =
  'block cursor-pointer rounded-full bg-white/[0.04] px-3.5 py-2 text-[0.75rem] font-semibold tracking-[0.06em] text-dark-muted ring-1 ring-white/12 transition duration-200 hover:text-white peer-checked:bg-brand peer-checked:text-white peer-checked:ring-brand peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-brand peer-focus-visible:outline-offset-2'

/**
 * Budget and Timeline as radio chips, NOT a `<select>`.
 *
 * They were styled native selects, and that was the right instinct for the closed
 * control — `appearance-none` matches it to the inputs beside it perfectly. The
 * problem is the popup list, which the OS draws: Windows rendered it white with a
 * blue highlight regardless of `color-scheme: dark` and regardless of styling the
 * `<option>`s. There is no CSS that reliably wins that argument on every
 * browser/OS pair, so the fix is to not open a popup at all.
 *
 * A custom `div` listbox would also solve it and was rejected: that means
 * hand-writing arrow keys, type-ahead, Escape, click-outside and
 * `aria-activedescendant`, and losing the native picker sheet on mobile. Radios
 * cost none of that — arrow-key navigation within a group is free, they serialise
 * into `FormData` under `name` exactly like the select did, and the value is still
 * the human-readable string so submissions read without a lookup table.
 *
 * Same construction as the service checkboxes above: a real input made `sr-only`,
 * with its label styled off `peer-checked:`.
 */
function ChipGroup({
  name,
  legend,
  options,
  defaultValue,
}: {
  name: string
  legend: string
  options: string[]
  defaultValue: string
}) {
  return (
    <fieldset>
      <legend className={labelClass}>{legend}</legend>
      <ul className="flex flex-wrap gap-2">
        {options.map((option, i) => (
          <li key={option}>
            {/* Index-based id: the labels contain spaces, `$` and en dashes. */}
            <input
              type="radio"
              id={`${name}-${i}`}
              name={name}
              value={option}
              defaultChecked={option === defaultValue}
              className="peer sr-only"
            />
            <label htmlFor={`${name}-${i}`} className={chipClass}>
              {option}
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  )
}

export default function Contact() {
  const [status, setStatus] = useState<Status>('idle')

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    // Honeypot: bots fill every field they find, humans never see this one.
    if (data.get('_gotcha')) return

    if (!FORMSPREE_ID) {
      const services = data.getAll('services').join(', ') || 'Not specified'
      const body = [
        `Name: ${data.get('name')}`,
        `Email: ${data.get('email')}`,
        `Company: ${data.get('company') || '—'}`,
        `Budget: ${data.get('budget')}`,
        `Timeline: ${data.get('timeline')}`,
        `Services: ${services}`,
        '',
        String(data.get('message') ?? ''),
      ].join('\n')
      window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(
        `Project enquiry — ${data.get('name')}`,
      )}&body=${encodeURIComponent(body)}`
      return
    }

    setStatus('sending')
    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      })
      if (!response.ok) throw new Error(String(response.status))
      form.reset()
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="section-y scroll-mt-28 bg-ink px-4 sm:px-6 lg:px-20">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[6.5rem_1fr] lg:gap-14">
        <p data-reveal className="text-eyebrow flex gap-2 text-white/40 uppercase lg:pt-4">
          <span className="text-brand">10</span>
          <span aria-hidden>/</span>
          <span>Contact</span>
        </p>

        <div className="min-w-0">
          <h2 data-reveal className="type-hero text-display leading-[0.92] uppercase">
            <span className="block text-white">Tell me what</span>
            <span className="block text-white/25">
              you need<span className="text-brand">.</span>
            </span>
          </h2>

          <p
            data-reveal
            className="text-lead mt-9 max-w-[52ch] text-dark-muted [--reveal-delay:120ms]"
          >
            {/* No "on the left / on the right" — the two halves stack below lg,
                where that reads as nonsense. TODO(ahmed): the reply-time promise
                is yours to keep or cut. */}
            Pick what you need, tell me what you&rsquo;re building, and I&rsquo;ll come back with a
            scope. I reply to everything within a day or two.
          </p>

          {/* Direct routes, for anyone who'd rather not fill in a form at all. */}
          <ul data-reveal className="mt-8 flex flex-wrap gap-2.5 [--reveal-delay:160ms]">
            <li>
              <a
                href={`mailto:${EMAIL}`}
                className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-4 py-2.5 text-[0.75rem] font-semibold tracking-[0.1em] text-white uppercase ring-1 ring-white/12 transition-colors hover:bg-brand hover:ring-brand"
              >
                <span aria-hidden className="size-1.5 rounded-full bg-brand-bright" />
                Email
              </a>
            </li>
            <li>
              <a
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-4 py-2.5 text-[0.75rem] font-semibold tracking-[0.1em] text-white uppercase ring-1 ring-white/12 transition-colors hover:bg-brand hover:ring-brand"
              >
                <span aria-hidden className="size-1.5 rounded-full bg-brand-bright" />
                WhatsApp
              </a>
            </li>
            <li>
              <a
                href="/Ahmed-Islam-CV.pdf"
                download
                className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[0.75rem] font-semibold tracking-[0.1em] text-dark-muted uppercase ring-1 ring-white/12 transition-colors hover:text-white hover:ring-white/30"
              >
                Download CV
              </a>
            </li>
          </ul>

          <form
            data-reveal
            onSubmit={onSubmit}
            className="mt-12 grid gap-8 rounded-[1.75rem] bg-ink-raised p-6 ring-1 ring-white/10 [--reveal-delay:200ms] sm:p-9 lg:grid-cols-2 lg:gap-10"
          >
            {/* ── Side one: what the project is ───────────────── */}
            <div>
              {/* fieldset/legend rather than a bare heading, so the checkboxes are
                  announced as one named group instead of six loose controls. */}
              <fieldset>
                <legend className="text-eyebrow text-brand-bright uppercase">
                  What do you need?
                </legend>
                <p className="mt-2 text-sm text-dark-muted">Pick as many as apply.</p>

                <ul className="mt-5 flex flex-wrap gap-2">
                  {SERVICES.map((service) => (
                    <li key={service.id}>
                      {/* Real checkbox, visually replaced by its own label — keeps
                          keyboard, screen-reader and form-data behaviour for free. */}
                      <input
                        type="checkbox"
                        id={`svc-${service.id}`}
                        name="services"
                        value={service.title}
                        className="peer sr-only"
                      />
                      <label htmlFor={`svc-${service.id}`} className={chipClass}>
                        {service.title}
                      </label>
                    </li>
                  ))}
                </ul>
              </fieldset>

              <div className="mt-8 grid gap-7">
                <ChipGroup
                  name="budget"
                  legend="Budget"
                  options={BUDGETS}
                  defaultValue={BUDGETS[4]}
                />
                <ChipGroup
                  name="timeline"
                  legend="Timeline"
                  options={TIMELINES}
                  defaultValue={TIMELINES[1]}
                />
              </div>
            </div>

            {/* ── Side two: who you are ──────────────────────── */}
            <div className="grid content-start gap-5 lg:border-l lg:border-white/10 lg:pl-10">
              <div>
                <label htmlFor="name" className={labelClass}>
                  Name <span className="text-brand">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Your name"
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="email" className={labelClass}>
                  Email <span className="text-brand">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@company.com"
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="company" className={labelClass}>
                  Company <span className="text-dark-muted/50">(optional)</span>
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  autoComplete="organization"
                  placeholder="Where you work"
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="message" className={labelClass}>
                  Project <span className="text-brand">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  placeholder="What are you building, and what's in the way?"
                  className={`${fieldClass} resize-y`}
                />
              </div>

              {/* Honeypot — hidden from sight, from the a11y tree and from tab order. */}
              <input
                type="text"
                name="_gotcha"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                className="pointer-events-none absolute left-[-9999px] size-0 opacity-0"
              />

              <div className="mt-1 flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-b from-brand-bright to-brand-deep px-6 py-3.5 text-[0.75rem] font-semibold tracking-[0.14em] text-white uppercase shadow-lg shadow-brand/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === 'sending' ? 'Sending' : 'Send enquiry'}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>

                {/* aria-live so the outcome is announced, not just shown. */}
                <p
                  aria-live="polite"
                  className={`text-sm ${status === 'error' ? 'text-brand-bright' : 'text-dark-muted'}`}
                >
                  {status === 'sent' && 'Thanks — I’ll be in touch shortly.'}
                  {status === 'error' && `Something broke. Email me at ${EMAIL} instead.`}
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

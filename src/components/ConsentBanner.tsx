import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { consentNeeded, setConsent, type Choice } from '../analytics'

/** Fired by the footer's "Cookie settings" to bring the banner back. */
export const OPEN_CONSENT = 'consent:open'

/** How long the answer stays on screen before the card leaves, in ms. */
const SETTLE = 1300

type Phase = 'ask' | Choice

/**
 * The cookie question, asked only of visitors in Europe (see analytics.ts).
 *
 * **The concept: consent as a connection.** The site's language is its
 * system diagrams (ServiceDiagram), so the question is one: You → This site
 * ┄┄ Analytics, the last link dashed because it isn't made yet. The diagram
 * previews each answer while the pointer or focus is on its button (Accept
 * lights the link, Decline fades it), then shows the answer itself — a
 * solid, pulsing link and "Connected", or a cut one and "Declined" — before
 * the card leaves. The visitor sees what the choice does, not just a policy
 * sentence.
 *
 * Opens after mount, never during render: the page HTML is built ahead of
 * time and has no idea who is visiting, so it holds no banner, and the first
 * render must match it. Bottom-left, clear of SocialRail. Not a modal and it
 * takes no focus. Accept and Decline weigh the same: a choice nudged by
 * button size isn't consent. Under reduced motion the card leaves at once.
 */
export default function ConsentBanner() {
  const [open, setOpen] = useState(false)
  const [phase, setPhase] = useState<Phase>('ask')
  const [preview, setPreview] = useState<Choice | null>(null)

  useEffect(() => {
    setOpen(consentNeeded())
    const reopen = () => {
      setPhase('ask')
      setPreview(null)
      setOpen(true)
    }
    window.addEventListener(OPEN_CONSENT, reopen)
    return () => window.removeEventListener(OPEN_CONSENT, reopen)
  }, [])

  // Once answered, hold the result for a moment, then go.
  useEffect(() => {
    if (phase === 'ask') return
    const quick = matchMedia('(prefers-reduced-motion: reduce)').matches
    const timer = window.setTimeout(() => setOpen(false), quick ? 0 : SETTLE)
    return () => window.clearTimeout(timer)
  }, [phase])

  if (!open) return null

  const choose = (choice: Choice) => {
    setConsent(choice)
    setPhase(choice)
  }
  // what the diagram shows: the answer once given, else the one being considered
  const shown: Phase = phase !== 'ask' ? phase : (preview ?? 'ask')
  const status = phase === 'granted' ? 'Connected' : phase === 'denied' ? 'Declined' : 'Awaiting choice'

  const button =
    'press flex-1 rounded-full px-5 py-3 text-[0.75rem] font-bold tracking-[0.14em] uppercase disabled:pointer-events-none'
  const hover = (choice: Choice) => ({
    onMouseEnter: () => setPreview(choice),
    onMouseLeave: () => setPreview(null),
    onFocus: () => setPreview(choice),
    onBlur: () => setPreview(null),
  })

  return (
    <section
      aria-labelledby="consent-title"
      className="fixed inset-x-4 bottom-4 z-[60] overflow-clip rounded-[1.75rem] bg-ink p-5 text-white shadow-[0_30px_70px_-24px_rgb(20_19_18/0.75)] ring-1 ring-white/10 motion-safe:animate-rise-in sm:inset-x-auto sm:bottom-6 sm:left-6 sm:w-[25rem] sm:p-6"
    >
      {/* the diagram stage's ground: the same faint grid and warm glow */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 [background-image:linear-gradient(to_right,rgb(255_255_255/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.04)_1px,transparent_1px)] [background-size:1.5rem_1.5rem]"
      />
      <div
        aria-hidden
        className={`absolute -top-24 -right-16 -z-10 size-56 rounded-full blur-[70px] transition-colors duration-700 ${
          shown === 'granted' ? 'bg-brand/35' : 'bg-brand/15'
        }`}
      />

      {/* One label row: what is being asked, and where it stands. */}
      <div className="flex items-center justify-between gap-4">
        <h2 id="consent-title" className="text-eyebrow whitespace-nowrap text-brand-bright uppercase">
          Analytics cookies
        </h2>
        <p
          aria-live="polite"
          className={`flex items-center gap-1.5 text-[0.625rem] font-semibold tracking-[0.12em] whitespace-nowrap uppercase transition-colors ${
            phase === 'granted' ? 'text-brand-bright' : 'text-dark-muted'
          }`}
        >
          <span
            aria-hidden
            className={`size-1.5 rounded-full ${
              phase === 'granted' ? 'bg-brand-bright' : phase === 'denied' ? 'bg-white/30' : 'bg-white/50 motion-safe:animate-pulse'
            }`}
          />
          {status}
        </p>
      </div>

      {/* ── The connection ─────────────────────────────────── */}
      <div aria-hidden className="mt-5 flex items-center">
        <Node label="You" />
        <span className="h-0.5 min-w-5 flex-1 rounded-full bg-white/25" />
        <Node label="This site" mark />
        <Wire state={shown} />
        <Node label="Analytics" icon state={shown} />
      </div>

      <p className="mt-5 text-sm leading-relaxed text-dark-muted">
        With your consent, this site uses Google Analytics cookies to measure how its pages are used. The
        data is never used for advertising or sold to third parties.{' '}
        <Link to="/privacy" className="whitespace-nowrap text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">
          Privacy policy
        </Link>
      </p>

      <div className="mt-5 flex gap-2.5">
        <button
          type="button"
          disabled={phase !== 'ask'}
          onClick={() => choose('granted')}
          {...hover('granted')}
          className={`${button} bg-white text-heading hover:bg-brand hover:text-white`}
        >
          Accept
        </button>
        <button
          type="button"
          disabled={phase !== 'ask'}
          onClick={() => choose('denied')}
          {...hover('denied')}
          className={`${button} text-white ring-1 ring-white/25 hover:ring-white`}
        >
          Decline
        </button>
      </div>
    </section>
  )
}

/** A box in the connection, styled like the service diagrams' nodes. */
function Node({ label, mark = false, icon = false, state }: { label: string; mark?: boolean; icon?: boolean; state?: Phase }) {
  const look =
    state === 'granted'
      ? 'border-brand bg-brand text-white shadow-[0_0_0_4px_rgb(241_86_41/0.2),0_8px_22px_-6px_rgb(241_86_41/0.7)]'
      : state === 'denied'
        ? 'border-dashed border-white/15 bg-ink text-white/30'
        : state === 'ask'
          ? 'border-dashed border-white/25 bg-ink text-white/60'
          : 'border-white/15 bg-ink-raised text-white'
  return (
    <span
      className={`flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[0.6875rem] leading-none font-semibold whitespace-nowrap transition-[background-color,border-color,color,box-shadow] duration-500 ${look}`}
    >
      {mark ? (
        // the site's own mark: the orange full stop every heading ends on
        <span className="size-1.5 rounded-[1px] bg-brand" />
      ) : icon ? (
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-3">
          <path d="M3.4 13.2h3.7V21H3.4zM10.15 7.4h3.7V21h-3.7zM16.9 3h3.7v18h-3.7z" />
        </svg>
      ) : (
        <span className="size-1.5 rounded-full bg-white/60" />
      )}
      {label}
    </span>
  )
}

/** The link to Analytics: dashed while undecided, lit and pulsing once
 *  accepted, cut once declined. */
function Wire({ state }: { state: Phase }) {
  if (state === 'granted')
    return (
      <span className="relative h-0.5 min-w-5 flex-1 overflow-clip rounded-full bg-brand">
        <span className="absolute inset-0 bg-[linear-gradient(90deg,transparent_35%,var(--color-brand-bright)_50%,transparent_65%)] motion-safe:animate-[consent-flow_1.1s_linear_infinite]" />
      </span>
    )
  return (
    <span
      className={`h-0 min-w-5 flex-1 border-t-2 border-dashed transition-[border-color,opacity] duration-500 ${
        state === 'denied' ? 'border-white/15 opacity-40' : 'border-white/30'
      }`}
    />
  )
}

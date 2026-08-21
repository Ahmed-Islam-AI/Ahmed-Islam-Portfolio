import { SECTIONS } from './SectionRail'
import { SERVICES } from '../data/services'
import { SOCIALS } from '../data/socials'

const EMAIL = 'ahmedislam.official@gmail.com'

/** `hero` is the top of the page, not a destination anyone picks from a footer. */
const NAV = SECTIONS.filter((section) => section.id !== 'hero')

const linkClass =
  'text-sm text-dark-muted transition-colors hover:text-white focus-visible:text-white'

/**
 * Page footer. Not a section: no index number, not in SECTIONS, and outside
 * <main> — the rail tracks content, and a footer isn't content.
 *
 * `ink-deep` rather than `ink`, because Contact directly above it is already
 * `ink`; without the step down and the rounded top edge the two merge into one
 * unbroken slab. Keeps `lg:px-20` like every section so the two fixed gutter
 * rails still land in empty margin.
 */
export default function Footer() {
  return (
    // The negative margin is load-bearing, not decoration. `rounded-t` reveals
    // whatever sits *behind* the footer, and that's the body — `paper` — so the
    // two top corners rendered as white notches. Pulling the footer up over
    // Contact puts that section's `ink` behind the curve instead, which is the
    // subtle step the rounding was meant to read as. `z-10` keeps it on top.
    <footer
      id="site-footer"
      // The hairline is what makes the curve legible: ink-deep on ink is only a
      // 7-value step, so without it the rounded edge is invisible and the overlap
      // just looks like a flat join.
      className="relative z-10 -mt-10 overflow-hidden rounded-t-[2.5rem] border-t border-white/[0.08] bg-ink-deep lg:-mt-14"
    >
      <div className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 lg:px-20 lg:pt-20">
        {/* ── Top line: who, where, and whether he's free ─────── */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="type-hero text-h3 text-white">
              Ahmed Islam<span className="text-brand">.</span>
            </p>
            <p className="text-eyebrow mt-2 text-dark-muted uppercase">
              Full-Stack AI Engineer <span className="text-white/25">·</span> Islamabad, PK
            </p>
          </div>

          {/* Green is allowed here and only here — it's the same availability
              signal as the hero pill. See STYLE.md's single-accent rule. */}
          <p className="inline-flex shrink-0 items-center gap-2.5 self-start rounded-full bg-white/[0.06] px-4 py-2 text-[0.6875rem] font-semibold tracking-[0.14em] text-white uppercase ring-1 ring-white/10">
            <span className="relative flex size-2 shrink-0">
              <span className="absolute inline-flex size-full rounded-full bg-success opacity-60 motion-safe:animate-ping" />
              <span className="relative inline-flex size-2 rounded-full bg-success" />
            </span>
            Available for work
          </p>
        </div>

        {/* ── Columns ──────────────────────────────────────────────
            Navigate and Services sit side by side at *every* width. Stacked full
            width on a phone, the three lists ran to nearly three screens of
            scrolling before you reached the wordmark. */}
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 lg:mt-14 lg:grid-cols-[1fr_1fr_auto] lg:gap-16">
          <nav aria-label="Sections">
            <p className="text-eyebrow text-brand-bright uppercase">Navigate</p>
            {/* Two sub-columns only from lg — at 390px the parent column is ~163px
                wide, and splitting that again cannot hold "Certifications". */}
            <ul className="mt-5 grid gap-3 lg:grid-cols-2 lg:gap-y-3.5">
              {NAV.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className={linkClass}>
                    <span className="mr-2 text-[0.6875rem] text-white/25 tabular-nums">
                      {section.index}
                    </span>
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-eyebrow text-brand-bright uppercase">Services</p>
            <ul className="mt-5 grid gap-3.5">
              {SERVICES.map((service) => (
                <li key={service.id}>
                  <a href="#services" className={linkClass}>
                    {service.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Spans both columns below lg, where it's a row of bare icon buttons
              rather than a fifth list of names — the names were what made this
              column as tall as the other two combined. `aria-label` carries the
              name at every width, so nothing is lost when the text is hidden. */}
          <div className="col-span-2 lg:col-span-1">
            <p className="text-eyebrow text-brand-bright uppercase">Elsewhere</p>
            <ul className="mt-5 flex flex-wrap gap-2.5 lg:grid lg:gap-3.5">
              {SOCIALS.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className={`${linkClass} group inline-flex items-center gap-2.5`}
                  >
                    <span className="grid size-11 place-items-center rounded-full bg-white/[0.05] text-white/45 ring-1 ring-white/10 transition-colors group-hover:bg-brand group-hover:text-white group-hover:ring-brand lg:size-4 lg:bg-transparent lg:text-white/30 lg:ring-0 lg:group-hover:bg-transparent lg:group-hover:text-brand">
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-[18px] shrink-0 lg:size-4"
                        aria-hidden
                      >
                        <path d={social.path} />
                      </svg>
                    </span>
                    <span className="hidden lg:inline">{social.name}</span>
                  </a>
                </li>
              ))}
            </ul>

            <a href="/Ahmed-Islam-CV.pdf" download className={`${linkClass} mt-6 inline-block`}>
              <span className="border-b border-white/20 pb-0.5">Download CV</span>
            </a>
          </div>
        </div>

        {/* ── Email, given the weight it deserves ──────────────── */}
        <a
          href={`mailto:${EMAIL}`}
          className="group mt-16 flex flex-wrap items-baseline gap-x-4 gap-y-2 border-t border-white/10 pt-10"
        >
          <span className="text-eyebrow shrink-0 text-dark-muted uppercase">Start here</span>
          <span className="type-hero min-w-0 text-[1.125rem] break-all text-white transition-colors group-hover:text-brand-bright sm:text-[1.5rem] lg:text-[1.875rem]">
            {EMAIL}
          </span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-5 shrink-0 self-center text-brand transition-transform group-hover:translate-x-1"
            aria-hidden
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>
      </div>

      {/* ── The wordmark ─────────────────────────────────────────
          Sized in `vw` so it spans the viewport at every width rather than
          sitting in the content column — that full-bleed scale is the whole
          point. `leading-[0.72]` crops the font's built-in shoulder so the
          letters sit tight to the bottom bar instead of floating above it.

          The fill is a gradient clipped to the glyphs, so the word dissolves
          downward instead of being a flat grey slab. The full stop stays solid
          brand: it's this site's signature gesture (every section heading ends on
          an orange period) blown up to footer scale, and it's the one thing here
          that shouldn't fade. */}
      <p
        aria-hidden
        className="type-hero mt-12 flex select-none justify-center text-[21.5vw] leading-[0.72] tracking-[-0.045em] whitespace-nowrap uppercase lg:mt-16"
      >
        {/* 21.5vw is measured, not guessed: "AHMED." renders 4.238x its font size
            in Archivo at this tracking, so 21.5 x 4.238 = 91vw — wide enough to
            read as full-bleed, narrow enough to clear both gutter rails at 1440.
            At 27vw the A and the full stop were clipped clean off. */}
        <span className="bg-gradient-to-b from-white/[0.18] to-white/[0.06] bg-clip-text text-transparent">
          Ahmed
        </span>
        <span className="text-brand/80">.</span>
      </p>

      {/* ── Bottom bar ───────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-4 pb-8 sm:px-6 lg:px-20">
        {/* Centred while stacked, split left/right once there's room for one line. */}
        <div className="flex flex-col items-center gap-3 border-t border-white/10 pt-6 text-center text-[0.6875rem] font-semibold tracking-[0.12em] text-white/35 uppercase sm:flex-row sm:justify-between sm:text-left">
          {/* Computed, so it can't silently go stale. */}
          <p>© {new Date().getFullYear()} Ahmed Islam</p>
          {/* The emoji is here by request. It's the one exception to STYLE.md's
              "no emoji as icons" rule, and its red is the one non-palette colour
              on the page — swap in an SVG heart in `text-brand` to undo both.
              role/aria-label so it's announced as "love", not read as punctuation
              or skipped entirely. */}
          <p className="flex items-center gap-1.5">
            Built with
            <span role="img" aria-label="love" className="text-[0.875rem] leading-none">
              ❤️
            </span>
            by Ahmed Islam
          </p>
        </div>
      </div>
    </footer>
  )
}

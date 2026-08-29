import { useState } from 'react'
import { useLocation } from 'react-router-dom'

const LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Services', href: '#services' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Projects', href: '#projects' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Contact', href: '#contact' },
]

const linkClass =
  'text-[0.75rem] font-semibold uppercase tracking-[0.12em] transition-colors'

export default function Nav({ active }: { active?: string }) {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  /**
   * Every link in this nav is a bare hash (`#about`), which is correct on `/`
   * and dead anywhere else — on `/projects` the browser resolves it to
   * `/projects#about`, an anchor that doesn't exist, and the click does nothing.
   *
   * So off the home route the hash gets a leading `/`, which navigates home and
   * then jumps to the section. On `/` it stays bare, keeping the native smooth
   * scroll that `scroll-behavior` in index.css already provides.
   */
  const to = (hash: string) => (pathname === '/' ? hash : `/${hash}`)

  // Fixed, not sticky — it overlays the hero background instead of sitting above
  // it in flow, which is what left the white strip behind the pill.
  // No `lg:px-20` on the header: both gutter rails are vertically centred, so the
  // nav never collides with them, and reserving that gutter squeezed the links
  // into the logo at 1024px.
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 sm:pt-6">
      <nav
        aria-label="Main"
        // ring keeps the pill defined over the dark Method band, where an ink
        // pill on an ink background would have no visible edge
        className="mx-auto flex max-w-7xl items-center rounded-2xl bg-ink/95 px-4 py-3 ring-1 ring-white/10 backdrop-blur-md sm:px-5"
      >
        <a href={to('#top')} className="flex shrink-0 items-center gap-2.5">
          <span aria-hidden className="h-8 w-[3px] rounded-full bg-brand" />
          <span className="type-hero text-[0.8125rem] leading-[1.05] tracking-[0.08em] text-white uppercase">
            Ahmed
            <br />
            Islam
          </span>
        </a>

        {/* Right-hand group. The CTA sits in normal flow, so it can no longer
            overlap the Contact link the way it did in the mockup. */}
        <div className="ml-auto flex items-center gap-5 xl:gap-7">
          <ul className="hidden items-center gap-5 lg:flex xl:gap-7">
            {LINKS.map((link) => {
              const on = link.href === `#${active}`
              return (
                <li key={link.href}>
                  <a
                    href={to(link.href)}
                    aria-current={on ? 'true' : undefined}
                    className={`${linkClass} ${
                      on ? 'text-brand-bright' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              )
            })}
          </ul>

          <a
            href={to('#contact')}
            className="hidden shrink-0 rounded-full bg-gradient-to-b from-brand-bright to-brand-deep px-5 py-2.5 text-[0.75rem] font-semibold tracking-[0.12em] whitespace-nowrap text-white uppercase transition hover:brightness-110 lg:block"
          >
            Let&rsquo;s work together
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="grid size-11 place-items-center rounded-full text-white transition-colors hover:bg-white/10 lg:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              className="size-5"
              aria-hidden
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div
          id="mobile-menu"
          className="mx-auto mt-2 max-w-7xl rounded-2xl bg-ink/98 p-3 backdrop-blur-md lg:hidden"
        >
          <ul className="divide-y divide-white/10">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={to(link.href)}
                  onClick={() => setOpen(false)}
                  className="block px-2 py-3 text-[0.8125rem] font-semibold tracking-[0.14em] text-white/80 uppercase transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={to('#contact')}
            onClick={() => setOpen(false)}
            className="mt-3 block rounded-full bg-gradient-to-b from-brand-bright to-brand-deep px-5 py-3 text-center text-[0.75rem] font-semibold tracking-[0.12em] text-white uppercase"
          >
            Let&rsquo;s work together
          </a>
        </div>
      )}
    </header>
  )
}

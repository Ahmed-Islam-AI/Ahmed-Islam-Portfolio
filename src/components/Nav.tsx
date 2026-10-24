import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

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
  const onBlog = pathname.startsWith('/blog')

  const header = useRef<HTMLElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)
  const links = useRef<HTMLUListElement>(null)
  // Where the active-link dot sits, in px from the start of the link row.
  // null = no link is active (hero, experience, method), so the dot hides.
  const [dot, setDot] = useState<number | null>(null)

  // The sheet closes the way any sheet does: Escape, or a tap outside it.
  // Escape hands focus back to the toggle so keyboard users aren't dropped.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      toggle.current?.focus()
    }
    const onDown = (e: PointerEvent) => {
      if (!header.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [open])

  // Measured, not computed from the index: the links are different widths.
  // Re-measured on resize because the row reflows at xl, and once the web font
  // lands (it changes every link's width).
  useLayoutEffect(() => {
    const measure = () => {
      const el = links.current?.querySelector<HTMLElement>('[aria-current]')
      setDot(el ? el.offsetLeft + el.offsetWidth / 2 : null)
    }
    measure()
    window.addEventListener('resize', measure)
    document.fonts?.ready.then(measure)
    return () => window.removeEventListener('resize', measure)
  }, [active])

  // Fixed, not sticky — it overlays the hero background instead of sitting above
  // it in flow, which is what left the white strip behind the pill.
  // No `lg:px-20` on the header: both gutter rails are vertically centred, so the
  // nav never collides with them, and reserving that gutter squeezed the links
  // into the logo at 1024px.
  return (
    <header ref={header} className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 sm:pt-6">
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
        <div className="ml-auto flex items-center gap-3 sm:gap-4 xl:gap-7">
          <ul ref={links} className="relative hidden items-center gap-4 lg:flex xl:gap-7">
            {/* The active-link marker: one dot that slides between links rather
                than a colour change alone, so "where am I" isn't carried by hue.
                Springs on the same curve as the press feedback. */}
            <span
              aria-hidden
              className={`absolute -bottom-2 left-0 size-1 rounded-full bg-brand-bright transition-[translate,opacity] duration-500 ease-spring ${
                dot === null ? 'opacity-0' : 'opacity-100'
              }`}
              // centred by subtracting half its 4px width: an inline `translate`
              // would override a -translate-x-1/2 class, not add to it
              style={dot === null ? undefined : { translate: `${dot - 2}px 0` }}
            />
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

          {/* Blog is a button, not an eighth link in the row: the links jump to
              places on this page, Blog goes to another page, and the shape says
              so. It also had to be — at 1024px the row had 16px to spare. One
              element at every width; below lg it sits beside the menu toggle. */}
          <Link
            to="/blog"
            aria-current={onBlog ? 'page' : undefined}
            className={`press inline-flex shrink-0 items-center rounded-full px-4 py-2 text-[0.75rem] font-bold tracking-[0.12em] uppercase lg:py-2.5 ${
              onBlog ? 'bg-white text-ink' : 'text-white ring-1 ring-white/25 hover:bg-white/10'
            }`}
          >
            Blog
          </Link>

          <a
            href={to('#contact')}
            className="hidden shrink-0 rounded-full bg-gradient-to-b from-brand to-brand-deep px-5 py-2.5 text-[0.75rem] font-bold tracking-[0.12em] whitespace-nowrap text-white uppercase press hover:brightness-110 lg:block"
          >
            {/* Short label below xl: with the Blog button beside it, the full
                label pushed the row 60px past the pill at 1024 (measured). */}
            <span className="xl:hidden">Let&rsquo;s talk</span>
            <span className="hidden xl:inline">Let&rsquo;s work together</span>
          </a>

          <button
            ref={toggle}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="press grid size-11 place-items-center rounded-full text-white hover:bg-white/10 lg:hidden"
          >
            {/* Three bars that fold into an X rather than an icon swap, so the
                control visibly turns into its own undo. */}
            <span aria-hidden className="relative block h-3.5 w-[1.125rem]">
              {['top-0', 'top-1/2 -translate-y-1/2', 'bottom-0'].map((pos, i) => (
                <span
                  key={pos}
                  className={`absolute left-0 h-[1.75px] w-full rounded-full bg-current transition-[translate,rotate,opacity] duration-300 ease-out ${pos} ${
                    !open
                      ? ''
                      : i === 0
                        ? 'translate-y-[6.125px] rotate-45'
                        : i === 1
                          ? 'opacity-0'
                          : '-translate-y-[6.125px] -rotate-45'
                  }`}
                />
              ))}
            </span>
          </button>
        </div>
      </nav>

      {/* Always mounted so it can animate both ways. `invisible` when closed
          takes it out of the tab order and the a11y tree, not just out of
          sight; visibility is in the transition list so that only flips after
          the fade-out has finished. */}
      <div
        id="mobile-menu"
        className={`mx-auto mt-2 max-w-7xl origin-top rounded-2xl bg-ink/98 p-3 backdrop-blur-md transition-[opacity,translate,scale,visibility] lg:hidden ${
          open
            ? 'visible translate-y-0 scale-100 opacity-100 duration-500 ease-spring'
            : 'invisible -translate-y-2 scale-[0.97] opacity-0 duration-200 ease-out'
        }`}
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
          className="mt-3 block rounded-full bg-gradient-to-b from-brand to-brand-deep px-5 py-3 text-center text-[0.75rem] font-bold tracking-[0.12em] text-white uppercase press"
        >
          Let&rsquo;s work together
        </a>
      </div>
    </header>
  )
}

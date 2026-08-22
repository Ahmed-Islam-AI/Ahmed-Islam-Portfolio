import type { RailSurface } from './SectionRail'
import { SOCIALS } from '../data/socials'

export default function SocialRail({
  surface = 'light',
  hidden = false,
}: {
  surface?: RailSurface
  /** Set over the footer, which lists all of these already. */
  hidden?: boolean
}) {
  // On the brand band the hover fill can't be brand — it would dissolve into the
  // background. Ink is the only other colour in the palette that reads there.
  const rest =
    surface === 'light' ? 'bg-ink text-white ring-1 ring-white/10' : 'bg-white text-ink ring-1 ring-ink/10'
  const hover =
    surface === 'brand'
      ? 'hover:bg-ink hover:text-white hover:shadow-ink/35'
      : 'hover:bg-brand hover:text-white hover:shadow-brand/35'

  return (
    // Shows from lg up. Every section reserves a symmetric `lg:px-20` gutter so
    // the rail sits in empty margin rather than on top of content — that gutter
    // is what makes this safe at 1024px, not a wide-screen-only gate.
    <ul
      aria-label="Social profiles"
      // `invisible`, not just `opacity-0` — visibility:hidden also takes the links
      // out of the tab order and the a11y tree, so they can't be focused while
      // faded out.
      className={`fixed top-1/2 right-3 z-40 hidden -translate-y-1/2 flex-col gap-2 transition-opacity duration-300 lg:flex ${
        hidden ? 'invisible opacity-0' : ''
      }`}
    >
      {SOCIALS.map((social) => (
        <li key={social.name}>
          <a
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            title={social.name}
            aria-label={social.name}
            // inverts over the full-bleed bands — an ink circle on an ink
            // background is invisible
            className={`group grid size-11 place-items-center rounded-full transition duration-200 hover:-translate-x-0.5 hover:scale-110 hover:shadow-lg ${rest} ${hover}`}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-[19px]" aria-hidden>
              <path d={social.path} />
            </svg>
          </a>
        </li>
      ))}
    </ul>
  )
}

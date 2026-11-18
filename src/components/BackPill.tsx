import { Link } from 'react-router-dom'

/** The white back pill with a chevron chip, on the service pages and /privacy. A `/#…`
 *  target is a plain <a>, since only a full load does the anchor scroll. */
export default function BackPill({ href, children }: { href: string; children: string }) {
  const className =
    'group press inline-flex items-center gap-2 rounded-full bg-white py-2 pr-4 pl-2.5 text-sm font-semibold text-heading shadow-[0_8px_20px_-14px_rgb(20_19_18/0.45)] ring-1 ring-hairline hover:ring-heading/20'
  const inner = (
    <>
      <span
        aria-hidden
        className="grid size-6 place-items-center rounded-full bg-paper-2 text-heading transition-[translate,background-color,color] duration-300 group-hover:-translate-x-0.5 group-hover:bg-heading group-hover:text-white"
      >
        <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 3.5 5.5 8l4.5 4.5" />
        </svg>
      </span>
      {children}
    </>
  )
  return href.includes('#') ? (
    <a href={href} className={className}>
      {inner}
    </a>
  ) : (
    <Link to={href} className={className}>
      {inner}
    </Link>
  )
}

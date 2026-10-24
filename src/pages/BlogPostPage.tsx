import { useEffect, useState, type MouseEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { bodies, posts } from 'virtual:blog'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { Meta } from './BlogPage'
import type { PostMeta, TocEntry } from '../content/types'

/**
 * One post, `/blog/:slug`.
 *
 * Layout: a ~68ch article column, and from lg a sticky "On this page" column
 * beside it. Below lg the contents collapse into a native <details> above the
 * article: keyboard, screen readers and the open/close state all come free.
 *
 * The body is HTML compiled at build time (`blog.vite.ts`) and loaded as its own
 * chunk, so the index never downloads a post nobody opened. It is our own
 * Markdown from the repo, not user input, which is why it is safe to set as
 * HTML.
 */
export default function BlogPostPage() {
  const { slug = '' } = useParams()
  const index = posts.findIndex((p) => p.slug === slug)
  const post = posts[index]
  const [body, setBody] = useState<{ html: string; toc: TocEntry[] } | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    setBody(null)
    const load = bodies[slug]
    if (!load) return
    let live = true
    load().then((b) => live && setBody(b))
    return () => {
      live = false
    }
  }, [slug])

  useEffect(() => {
    if (!post) return
    const previous = document.title
    document.title = `${post.title} — Ahmed Islam`
    return () => {
      document.title = previous
    }
  }, [post])

  if (!post) return <NotFound />

  // posts are newest first, so the next-newer is one index down
  const newer = posts[index - 1]
  const older = posts[index + 1]

  return (
    <>
      <Nav />
      <ReadingProgress />

      <main id="top" className="min-h-screen bg-paper">
        <div className="pt-nav px-4 pb-28 sm:px-6 lg:px-20 lg:pb-36">
          <div className="mx-auto max-w-6xl">
            <header className="pt-8 lg:pt-12">
              <Link
                to="/blog"
                className="group -my-3 inline-flex items-center gap-2 py-3 text-[0.75rem] font-bold tracking-[0.14em] text-muted uppercase transition-colors hover:text-heading"
              >
                <span aria-hidden className="transition-transform duration-300 group-hover:-translate-x-1">
                  &larr;
                </span>
                All posts
              </Link>

              {/* Mixed case, unlike section headings: a title is a sentence to
                  read, and long wide uppercase is the hardest text to read. */}
              <h1
                data-reveal
                className="type-hero mt-8 max-w-[20ch] text-display leading-[1.02] text-balance text-heading"
              >
                {post.title}
              </h1>
              <p
                data-reveal
                className="text-lead mt-6 max-w-[56ch] text-muted [--reveal-delay:100ms]"
              >
                {post.description}
              </p>
              <div
                data-reveal
                className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-hairline pb-10 [--reveal-delay:160ms]"
              >
                <span className="text-sm font-semibold text-heading">Ahmed Islam</span>
                <Meta post={post} />
              </div>
            </header>

            <div className="mt-12 lg:mt-14 lg:grid lg:grid-cols-[minmax(0,1fr)_14rem] lg:gap-16 xl:gap-24">
              <div className="min-w-0">
                {body && body.toc.length > 0 && (
                  <details className="group mb-10 rounded-2xl bg-white ring-1 ring-hairline lg:hidden">
                    <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-[0.75rem] font-bold tracking-[0.14em] text-heading uppercase [&::-webkit-details-marker]:hidden">
                      On this page
                      <span aria-hidden className="text-brand transition-transform duration-300 group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <Toc toc={body.toc} className="border-t border-hairline px-5 py-4" />
                  </details>
                )}

                {body ? <Article html={body.html} /> : <ArticleSkeleton />}
              </div>

              {body && body.toc.length > 0 && (
                <aside className="hidden lg:block">
                  <div className="sticky top-32">
                    <p className="text-eyebrow text-muted uppercase">On this page</p>
                    <Toc toc={body.toc} tracking className="mt-5" />
                  </div>
                </aside>
              )}
            </div>

            <End newer={newer} older={older} />
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

/** The compiled post. One delegated click listener runs every code block's
 *  copy button, rather than a script per block. */
function Article({ html }: { html: string }) {
  const onClick = (e: MouseEvent<HTMLElement>) => {
    const button = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-copy]')
    const code = button?.closest('figure')?.querySelector('code')
    if (!button || !code) return
    navigator.clipboard.writeText(code.innerText).then(
      () => {
        button.textContent = 'Copied'
        window.setTimeout(() => (button.textContent = 'Copy'), 1600)
      },
      () => (button.textContent = 'Press Ctrl+C'),
    )
  }

  return <article className="prose" onClick={onClick} dangerouslySetInnerHTML={{ __html: html }} />
}

/** Holds the article's place while its chunk loads (a few ms on a warm cache),
 *  so the footer doesn't jump up and back down. */
function ArticleSkeleton() {
  return (
    <div aria-hidden className="max-w-[68ch] space-y-4">
      {[92, 100, 84, 96, 70].map((w) => (
        <div key={w} className="h-4 animate-pulse rounded-full bg-heading/[0.06]" style={{ width: `${w}%` }} />
      ))}
    </div>
  )
}

/**
 * Table of contents. With `tracking`, the entry for the section you're reading
 * lights up — same tick language as SectionRail, so it reads as the same
 * system. The observer line sits a quarter of the way down the viewport: a
 * heading counts as "current" once it has scrolled up past the top quarter.
 */
function Toc({ toc, tracking = false, className = '' }: { toc: TocEntry[]; tracking?: boolean; className?: string }) {
  const [current, setCurrent] = useState(toc[0]?.id)

  useEffect(() => {
    if (!tracking) return
    const headings = toc
      .map((t) => document.getElementById(t.id))
      .filter((el): el is HTMLElement => el !== null)
    const observer = new IntersectionObserver(
      // The observer is only the trigger (a heading crossed the line); which
      // one is current is read from geometry, so a fast scroll that skips a
      // heading entirely still lands on the right entry.
      () => {
        // Current = the last heading above the line. Walk the headings in
        // document order and keep the last one whose top has passed it.
        const line = window.innerHeight * 0.25
        let id = toc[0]?.id
        for (const h of headings) if (h.getBoundingClientRect().top <= line) id = h.id
        setCurrent(id)
      },
      { rootMargin: '0px 0px -75% 0px' },
    )
    headings.forEach((h) => observer.observe(h))
    return () => observer.disconnect()
  }, [toc, tracking])

  return (
    <ol className={`space-y-0.5 ${className}`}>
      {toc.map((entry) => {
        const on = tracking && current === entry.id
        return (
          <li key={entry.id} className={entry.depth === 3 ? 'ps-4' : ''}>
            <a
              href={`#${entry.id}`}
              aria-current={on ? 'location' : undefined}
              className={`group flex items-start gap-3 py-1.5 text-sm leading-snug transition-colors ${
                on ? 'text-heading' : 'text-muted hover:text-heading'
              }`}
            >
              <span
                aria-hidden
                className={`mt-[0.6em] h-px shrink-0 transition-all duration-300 ${
                  on ? 'w-4 bg-brand' : 'w-2 bg-heading/25 group-hover:w-3'
                }`}
              />
              {entry.text}
            </a>
          </li>
        )
      })}
    </ol>
  )
}

/**
 * A 2px line along the top edge that fills as you read. Native
 * `animation-timeline: scroll()`, so no scroll listener; where that isn't
 * supported the line simply isn't drawn (see `.reading-progress`).
 */
function ReadingProgress() {
  return <div aria-hidden className="reading-progress" />
}

/** Where to go when you reach the end: the next post, and the one thing this
 *  site exists for — talking about work. */
function End({ newer, older }: { newer?: PostMeta; older?: PostMeta }) {
  return (
    <footer className="mt-20 lg:mt-28">
      {(newer || older) && (
        <nav aria-label="More posts" className="grid gap-4 sm:grid-cols-2">
          {[
            { post: older, label: 'Previous' },
            { post: newer, label: 'Next' },
          ].map(({ post, label }) =>
            post ? (
              <Link
                key={label}
                to={`/blog/${post.slug}`}
                className={`group press rounded-[1.75rem] bg-white p-6 ring-1 ring-hairline [--press:0.98] hover:ring-heading/20 ${
                  label === 'Next' ? 'sm:col-start-2 sm:text-right' : ''
                }`}
              >
                <span className="text-eyebrow text-muted uppercase">{label}</span>
                <span className="type-hero mt-2 block text-lg leading-snug text-heading transition-colors group-hover:text-brand">
                  {post.title}
                </span>
              </Link>
            ) : null,
          )}
        </nav>
      )}

      <div className="mt-6 flex flex-col gap-6 rounded-[1.75rem] bg-ink px-7 py-9 sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <div>
          <p className="type-hero text-h3 text-white">
            Building something like this<span className="text-brand">?</span>
          </p>
          <p className="mt-2 max-w-[44ch] text-body text-dark-muted">
            I take on AI systems and the full-stack products around them.
          </p>
        </div>
        {/* A plain <a>, like Nav's off-home links: a full load of `/#contact`
            lets the browser do the anchor scroll, which a router <Link> won't. */}
        <a
          href="/#contact"
          className="press inline-flex shrink-0 items-center gap-2.5 self-start rounded-full bg-gradient-to-b from-brand to-brand-deep px-6 py-3.5 text-[0.75rem] font-bold tracking-[0.14em] text-white uppercase shadow-lg shadow-brand/25 hover:brightness-110 sm:self-auto"
        >
          Let&rsquo;s talk
          <span aria-hidden>&rarr;</span>
        </a>
      </div>
    </footer>
  )
}

function NotFound() {
  return (
    <>
      <Nav />
      <main id="top" className="grid min-h-screen place-items-center bg-paper px-4 pt-nav pb-28">
        <div className="max-w-md text-center">
          <p className="text-eyebrow text-muted uppercase">404</p>
          <h1 className="type-hero mt-4 text-h2 text-heading">
            No post here<span className="text-brand">.</span>
          </h1>
          <p className="mt-4 text-body text-muted">It may have moved, or the link has a typo.</p>
          <Link
            to="/blog"
            className="press mt-8 inline-flex items-center gap-2 rounded-full border border-heading/20 px-6 py-3.5 text-[0.75rem] font-bold tracking-[0.14em] text-heading uppercase hover:border-brand hover:text-brand"
          >
            <span aria-hidden>&larr;</span> All posts
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}

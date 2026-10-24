import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { posts } from 'virtual:blog'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import type { PostMeta } from '../content/types'

/** "25 Oct 2026". en-GB to match the site's British spelling; UTC so a post
 *  dated the 25th never renders as the 24th west of Greenwich. */
export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })

/**
 * The blog index, `/blog`. Posts are Markdown in `src/content/blog/`, compiled
 * at build time by `blog.vite.ts`.
 *
 * **Paper, not ink.** Projects is an ink surface because it's a gallery; this is
 * reading, and long reading belongs on the light ground the rest of the site
 * uses for prose.
 *
 * **A lead story, then a list.** The newest post gets the whole width at
 * headline scale; everything older is a hairline row — the same list language
 * as `/projects`, for the same reason: a card grid of posts is the most
 * template-looking blog index there is, and a list is correct at any count.
 * There are no cover images on purpose. A post earns an image inside the post,
 * where it explains something; a stock-style header picture on the index is
 * decoration (see STYLE.md on generated imagery).
 */
export default function BlogPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
    const previous = document.title
    document.title = 'Blog — Ahmed Islam'
    return () => {
      document.title = previous
    }
  }, [])

  const [latest, ...rest] = posts

  return (
    <>
      <Nav />

      <main id="top" className="min-h-screen bg-paper">
        <div className="pt-nav px-4 pb-28 sm:px-6 lg:px-20 lg:pb-36">
          <div className="mx-auto max-w-6xl">
            <header className="pt-10 lg:pt-14">
              <h1 data-reveal className="type-hero text-display leading-[0.92] uppercase">
                <span className="block text-heading">Notes from</span>
                <span className="block text-heading/50">
                  the build<span className="text-brand">.</span>
                </span>
              </h1>
              <p
                data-reveal
                className="text-lead mt-9 max-w-[52ch] text-muted [--reveal-delay:120ms]"
              >
                Guides and short notes on AI engineering and the web: what worked, what
                broke, and the code that fixed it.
              </p>
            </header>

            {latest ? (
              <>
                <Lead post={latest} />
                {rest.length > 0 && (
                  <section aria-labelledby="earlier" className="mt-20 lg:mt-24">
                    <h2 id="earlier" data-reveal className="text-eyebrow text-muted uppercase">
                      Earlier
                    </h2>
                    <ul className="mt-5 border-t border-hairline">
                      {rest.map((post) => (
                        <li key={post.slug}>
                          <Row post={post} />
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </>
            ) : (
              <p
                data-reveal
                className="mt-16 rounded-[1.75rem] bg-paper-2 px-8 py-12 text-lead text-muted ring-1 ring-hairline"
              >
                The first post is being written. Until then, the{' '}
                <Link to="/projects" className="text-heading underline decoration-brand/60 underline-offset-4 hover:text-brand">
                  projects
                </Link>{' '}
                are the best record of the work.
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

/** Date, reading time and tags, in that order — when, how long, what about. */
export function Meta({ post, className = '' }: { post: PostMeta; className?: string }) {
  return (
    <p className={`flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted ${className}`}>
      <time dateTime={post.date} className="tabular-nums">
        {formatDate(post.date)}
      </time>
      <span aria-hidden className="text-heading/30">
        ·
      </span>
      <span>{post.minutes} min read</span>
      {/* No dot before the tags: the pills separate themselves, and on a phone
          where they wrap, a dot was left dangling at the end of the line. */}
      {post.tags.length > 0 && (
        <>
          <span className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-heading ring-1 ring-hairline"
              >
                {tag}
              </span>
            ))}
          </span>
        </>
      )}
    </p>
  )
}

/**
 * The newest post, at headline scale. The whole block is the link. The title is
 * mixed case, not the uppercase of section headings: a post title is a sentence
 * someone reads, and long wide uppercase is the hardest text on the page to
 * read (STYLE.md, Type).
 */
function Lead({ post }: { post: PostMeta }) {
  return (
    <article data-reveal className="mt-14 [--reveal-delay:180ms] lg:mt-20">
      <Link
        to={`/blog/${post.slug}`}
        className="group press block rounded-[1.75rem] bg-white p-7 shadow-[0_24px_60px_-40px_rgb(20_19_18/0.45)] ring-1 ring-hairline [--press:0.99] hover:ring-heading/20 sm:p-10 lg:p-14"
      >
        <p className="text-eyebrow text-brand uppercase">Latest</p>
        <h2 className="type-hero mt-5 max-w-[22ch] text-h2 leading-[1.05] text-balance text-heading transition-colors group-hover:text-brand">
          {post.title}
        </h2>
        <p className="text-lead mt-5 max-w-[58ch] text-muted">{post.description}</p>
        <Meta post={post} className="mt-8" />
        <span className="mt-9 inline-flex items-center gap-2 text-[0.75rem] font-bold tracking-[0.14em] text-heading uppercase">
          Read the post
          <span aria-hidden className="text-brand transition-transform duration-300 group-hover:translate-x-1">
            &rarr;
          </span>
        </span>
      </Link>
    </article>
  )
}

/** An older post. Date in its own column from lg, so the eye can run down the
 *  dates the way it runs down a table of contents. */
function Row({ post }: { post: PostMeta }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      data-reveal
      className="group -mx-4 grid gap-x-10 gap-y-2 border-b border-hairline px-4 py-8 transition-colors hover:bg-white/60 lg:grid-cols-[8rem_minmax(0,1fr)_auto] lg:items-baseline"
    >
      <time dateTime={post.date} className="text-sm text-muted tabular-nums">
        {formatDate(post.date)}
      </time>
      <div className="min-w-0">
        <h3 className="type-hero text-h3 leading-tight text-heading transition-colors group-hover:text-brand">
          {post.title}
        </h3>
        <p className="mt-2 max-w-[62ch] text-body text-muted">{post.description}</p>
      </div>
      <span className="text-sm text-muted">{post.minutes} min</span>
    </Link>
  )
}

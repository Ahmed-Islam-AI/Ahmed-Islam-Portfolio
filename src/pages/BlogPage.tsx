import { useEffect, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { posts } from 'virtual:blog'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import PostCover from '../components/PostCover'
import type { PostMeta } from '../content/types'
import { PAGES } from '../data/pages'

/** "25 Oct 2026". en-GB to match the site's British spelling; UTC so a post
 *  dated the 25th never renders as the 24th west of Greenwich. */
export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })

/** Ties a short word (a, an, and, of…) to the word after it with a no-break
 *  space, so a title never ends a line on "A". `text-balance` evens the lines;
 *  this stops it choosing a break that strands an article. */
export const tie = (title: string) =>
  title.replace(/ (a|an|the|and|or|of|to|in|on|for|&) /gi, (_, word: string) => ` ${word}\u00a0`)

/** Issue number: the oldest post is No. 01. `posts` is newest first. */
export const issueOf = (slug: string) => posts.length - posts.findIndex((p) => p.slug === slug)

/**
 * The blog index, `/blog`. Posts are Markdown in `src/content/blog/`, compiled
 * at build time by `blog.vite.ts`.
 *
 * Editorial, like a newsroom: the newest post as a featured story (cover beside
 * the copy from lg), everything older as a two-column grid of cover cards.
 * Left-aligned like every other page here; only the post header centres.
 * Paper, not ink: this is reading, and the site's reading ground is light.
 */
export default function BlogPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
    const previous = document.title
    document.title = PAGES.blog.title
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
            <header className="flex flex-col gap-8 pt-10 lg:flex-row lg:items-end lg:justify-between lg:pt-14">
              <h1 data-reveal className="type-hero text-display leading-[0.92] uppercase">
                <span className="block text-heading">Notes from</span>{' '}
                <span className="block text-heading/50">
                  the build<span className="text-brand">.</span>
                </span>
              </h1>
              <p
                data-reveal
                className="text-lead max-w-[38ch] text-muted [--reveal-delay:120ms] lg:pb-2"
              >
                Guides and short notes on AI engineering and the web: what worked, what broke,
                and the code that fixed it.
              </p>
            </header>

            {latest ? (
              <>
                <Featured post={latest} />
                {rest.length > 0 && (
                  <section aria-labelledby="more" className="mt-20 lg:mt-24">
                    <h2
                      id="more"
                      data-reveal
                      className="text-eyebrow border-b border-hairline pb-4 text-muted uppercase"
                    >
                      More writing
                    </h2>
                    <ul className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2">
                      {rest.map((post, i) => (
                        <li key={post.slug} data-reveal style={{ '--reveal-delay': `${(i % 2) * 80}ms` } as CSSProperties}>
                          <Card post={post} />
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </>
            ) : (
              <p
                data-reveal
                className="mt-16 rounded-[2rem] bg-white px-8 py-12 text-lead text-muted ring-1 ring-hairline"
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

/** "Data Science · 25 Oct 2026", the eyebrow every post carries. */
export function Kicker({ post, className = '' }: { post: PostMeta; className?: string }) {
  return (
    <p className={`text-eyebrow flex flex-wrap items-center gap-x-2.5 uppercase ${className}`}>
      {post.tags[0] && <span className="text-brand">{post.tags[0]}</span>}
      {post.tags[0] && <span aria-hidden className="size-1 rounded-full bg-heading/25" />}
      <time dateTime={post.date} className="text-muted">
        {formatDate(post.date)}
      </time>
    </p>
  )
}

/** "Read the post →", with the arrow that moves on hover. */
function ReadMore({ label = 'Read the post' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-[0.75rem] font-bold tracking-[0.14em] text-heading uppercase">
      {label}
      <span
        aria-hidden
        className="grid size-7 place-items-center rounded-full bg-heading text-white transition-[translate,background-color] duration-300 group-hover:translate-x-1 group-hover:bg-brand"
      >
        &rarr;
      </span>
    </span>
  )
}

/** The newest post: cover and copy side by side from lg, stacked below. The
 *  whole card is one link, so the target is the full card. */
function Featured({ post }: { post: PostMeta }) {
  return (
    <article data-reveal className="mt-14 [--reveal-delay:180ms] lg:mt-16">
      <Link
        to={`/blog/${post.slug}`}
        className="group press grid overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_70px_-45px_rgb(20_19_18/0.5)] ring-1 ring-hairline [--press:0.99] hover:ring-heading/15 lg:grid-cols-[1.15fr_1fr]"
      >
        <PostCover
          slug={post.slug}
          issue={issueOf(post.slug)}
          className="aspect-[16/10] lg:aspect-auto lg:min-h-[26rem]"
        />
        <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
          <Kicker post={post} />
          <h2 className="type-hero mt-5 text-h2 leading-[1.06] text-balance text-heading">
            {tie(post.title)}
          </h2>
          <p className="mt-4 text-body text-muted">{post.description}</p>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-6">
            <span className="text-sm text-muted">{post.minutes} min read</span>
            <ReadMore />
          </div>
        </div>
      </Link>
    </article>
  )
}

/** An older post in the grid. */
function Card({ post }: { post: PostMeta }) {
  return (
    <Link to={`/blog/${post.slug}`} className="group press block [--press:0.985]">
      <PostCover
        slug={post.slug}
        issue={issueOf(post.slug)}
        size="sm"
        className="aspect-[16/10] rounded-[1.5rem]"
      />
      <Kicker post={post} className="mt-6" />
      <h3 className="type-hero mt-3 text-h3 leading-snug text-balance text-heading transition-colors group-hover:text-brand">
        {tie(post.title)}
      </h3>
      <p className="mt-2 line-clamp-2 text-body text-muted">{post.description}</p>
      <p className="mt-4 text-sm text-muted">{post.minutes} min read</p>
    </Link>
  )
}

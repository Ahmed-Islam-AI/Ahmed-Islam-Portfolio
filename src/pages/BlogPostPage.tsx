import { useEffect, useState, type MouseEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { bodies, posts } from 'virtual:blog'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import PostCover from '../components/PostCover'
import portrait from '../assets/ahmed.webp'
import { SOCIALS } from '../data/socials'
import { Kicker, issueOf, tie } from './BlogPage'
import type { PostMeta, TocEntry } from '../content/types'

const SITE = 'https://ahmedislam.tech'
const iconOf = (name: string) => SOCIALS.find((s) => s.name === name)?.path ?? ''

type Body = { html: string; toc: TocEntry[] }
const loaded: Record<string, Body> = {}

/**
 * Loads a post's body chunk ahead of rendering. The build calls it before
 * rendering a post to HTML (entry-server.tsx), so the article itself is in the
 * page a crawler reads, not the loading skeleton; main.tsx calls it before
 * adopting that HTML, so the browser's first render has the same article.
 */
export async function preloadPost(slug: string) {
  const load = bodies[slug]
  if (load && !loaded[slug]) loaded[slug] = await load()
}

/**
 * One post, `/blog/:slug`. Editorial: a centred header (kicker, title, dek,
 * byline), a wide drawn cover, then a 68ch reading column.
 *
 * The header is the one centred block on the site, and only because a centred
 * masthead is the editorial convention a reader recognises; the article body
 * stays left-aligned, as STYLE.md asks of all running text.
 *
 * Contents: from xl a sticky list in the left margin, beside the column. Below
 * xl a native <details> above the article — keyboard, screen readers and the
 * open state come free.
 *
 * The body is HTML compiled at build time (`blog.vite.ts`) and loaded as its
 * own chunk. It is our own Markdown from the repo, never user input, which is
 * the only reason it is safe to set as HTML.
 */
export default function BlogPostPage() {
  const { slug = '' } = useParams()
  const index = posts.findIndex((p) => p.slug === slug)
  const post = posts[index]
  const [body, setBody] = useState<Body | null>(() => loaded[slug] ?? null)

  useEffect(() => {
    window.scrollTo(0, 0)
    if (loaded[slug]) return setBody(loaded[slug])
    setBody(null)
    let live = true
    preloadPost(slug).then(() => live && setBody(loaded[slug] ?? null))
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
  const hasToc = !!body && body.toc.length > 0

  return (
    <>
      <Nav />
      <ReadingProgress />

      <main id="top" className="min-h-screen bg-paper">
        <div className="pt-nav px-4 pb-28 sm:px-6 lg:px-20 lg:pb-36">
          <div className="mx-auto max-w-6xl">
            {/* ── Back ──────────────────────────────────────────
                No breadcrumb trail ("Blog / Data Science / …"): Ahmed's call,
                2026-11-12, it reads as an AI-generated site. No pill on a
                phone either, same as the service pages. */}
            <nav aria-label="Back" className="pt-8 max-sm:hidden lg:pt-10">
              <BackPill href="/blog">All posts</BackPill>
            </nav>

            {/* ── Masthead ──────────────────────────────────── */}
            <header className="mx-auto mt-8 max-w-3xl text-center sm:mt-12 lg:mt-16">
              <div data-reveal className="flex justify-center">
                <Kicker post={post} className="justify-center" />
              </div>
              <h1
                data-reveal
                className="type-hero mt-6 text-display leading-[1.02] text-balance text-heading [--reveal-delay:80ms]"
              >
                {tie(post.title)}
              </h1>
              <p
                data-reveal
                className="text-lead mx-auto mt-6 max-w-[54ch] text-balance text-muted [--reveal-delay:140ms]"
              >
                {post.description}
              </p>
              <div data-reveal className="mt-9 flex items-center justify-center gap-3.5 [--reveal-delay:200ms]">
                <Avatar className="size-11" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-heading">Ahmed Islam</p>
                  <p className="text-sm text-muted">
                    Full-Stack AI Engineer <span aria-hidden className="text-heading/30">·</span>{' '}
                    {post.minutes} min read
                  </p>
                </div>
              </div>
            </header>

            {/* ── Cover ─────────────────────────────────────── */}
            <div data-reveal className="mt-12 [--reveal-delay:260ms] lg:mt-16">
              <PostCover
                slug={post.slug}
                      issue={issueOf(post.slug)}
                className="aspect-[4/3] rounded-[1.75rem] shadow-[0_40px_80px_-50px_rgb(20_19_18/0.6)] sm:aspect-[16/9] lg:aspect-[21/9] lg:rounded-[2rem]"
              />
            </div>

            {/* ── Body ──────────────────────────────────────────
                Three tracks from xl: contents | 44rem column | empty. 44rem, not 68ch:
                `ch` here would be measured at 16px, the prose sets 68ch at 18px. The empty
                right track is what keeps the column on the page's centre line,
                under the masthead, instead of shoved right by the contents. */}
            <div className="mt-14 lg:mt-20 xl:grid xl:grid-cols-[minmax(0,1fr)_minmax(0,44rem)_minmax(0,1fr)] xl:gap-14">
              {hasToc && (
                <aside className="hidden xl:block">
                  <div className="sticky top-32 ml-auto max-w-56">
                    <p className="text-eyebrow text-muted uppercase">Contents</p>
                    <Toc toc={body.toc} tracking className="mt-5" />
                  </div>
                </aside>
              )}

              <div className="mx-auto min-w-0 max-w-[44rem] xl:col-start-2 xl:mx-0">
                {hasToc && (
                  <details className="group mb-12 overflow-hidden rounded-2xl bg-white ring-1 ring-hairline xl:hidden">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-heading [&::-webkit-details-marker]:hidden">
                      <span className="flex items-center gap-3">
                        <span aria-hidden className="grid size-7 place-items-center rounded-full bg-paper-2 text-xs text-muted tabular-nums">
                          {body.toc.filter((t) => t.depth === 2).length}
                        </span>
                        Contents
                      </span>
                      <svg aria-hidden viewBox="0 0 16 16" className="size-4 text-muted transition-transform duration-300 group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <path d="m4 6 4 4 4-4" />
                      </svg>
                    </summary>
                    <Toc toc={body.toc} className="border-t border-hairline px-5 py-4" />
                  </details>
                )}

                {body ? <Article html={body.html} /> : <ArticleSkeleton />}

                {/* ── After the article ───────────────────── */}
                <div className="mt-16 flex flex-col gap-6 border-t border-hairline pt-8 sm:flex-row sm:items-center sm:justify-between">
                  {post.tags.length > 0 && (
                    <ul aria-label="Topics" className="flex flex-wrap gap-2">
                      {post.tags.map((tag: string) => (
                        <li key={tag} className="rounded-full bg-paper-2 px-3.5 py-1.5 text-sm font-medium text-heading">
                          {tag}
                        </li>
                      ))}
                    </ul>
                  )}
                  <Share post={post} />
                </div>

                <AuthorCard />
              </div>
            </div>

            <End newer={newer} older={older} />
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

function Avatar({ className = '' }: { className?: string }) {
  return (
    <span className={`relative block shrink-0 overflow-hidden rounded-full bg-ink-raised ring-2 ring-white ${className}`}>
      <img src={portrait} alt="" className="absolute inset-x-0 top-0 w-full object-cover object-top" />
    </span>
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

/** Holds the article's place while its chunk loads, so the page doesn't jump. */
function ArticleSkeleton() {
  return (
    <div aria-hidden className="space-y-4">
      {[92, 100, 84, 96, 70].map((w) => (
        <div key={w} className="h-4 animate-pulse rounded-full bg-heading/[0.06]" style={{ width: `${w}%` }} />
      ))}
    </div>
  )
}

/**
 * Contents. A hairline track with the current section's segment drawn in
 * orange over it — position shown by a shape on a line, not by colour alone.
 * With `tracking`, "current" is the last heading that has scrolled past a line
 * a quarter of the way down the viewport.
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
    <ol className={`border-l border-hairline ${className}`}>
      {toc.map((entry) => {
        const on = tracking && current === entry.id
        return (
          <li key={entry.id}>
            <a
              href={`#${entry.id}`}
              aria-current={on ? 'location' : undefined}
              className={`-ml-px block border-l-2 py-1.5 text-sm leading-snug transition-colors duration-300 ${
                entry.depth === 3 ? 'pl-7' : 'pl-4 font-medium'
              } ${on ? 'border-brand text-heading' : 'border-transparent text-muted hover:text-heading'}`}
            >
              {entry.text}
            </a>
          </li>
        )
      })}
    </ol>
  )
}

/** Copy link, LinkedIn, X. Links go to the canonical URL, not localhost. */
function Share({ post }: { post: PostMeta }) {
  const [copied, setCopied] = useState(false)
  const url = `${SITE}/blog/${post.slug}`
  const button =
    'press grid size-10 place-items-center rounded-full bg-white text-heading ring-1 ring-hairline hover:bg-heading hover:text-white hover:ring-heading'

  return (
    <div className="flex items-center gap-2">
      <span className="mr-1 text-sm text-muted">Share</span>
      <button
        type="button"
        aria-label={copied ? 'Link copied' : 'Copy link'}
        onClick={() =>
          navigator.clipboard.writeText(url).then(() => {
            setCopied(true)
            window.setTimeout(() => setCopied(false), 1600)
          })
        }
        className={button}
      >
        <svg aria-hidden viewBox="0 0 24 24" className="size-[1.1rem]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {copied ? (
            <path d="m5 12.5 4.5 4.5L19 7.5" />
          ) : (
            <path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1" />
          )}
        </svg>
      </button>
      {[
        { name: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
        { name: 'X', href: `https://x.com/intent/post?url=${encodeURIComponent(url)}&text=${encodeURIComponent(post.title)}` },
      ].map((s) => (
        <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`Share on ${s.name}`} className={button}>
          <svg aria-hidden viewBox="0 0 24 24" className="size-4" fill="currentColor">
            <path d={iconOf(s.name)} />
          </svg>
        </a>
      ))}
    </div>
  )
}

/** Who wrote it, under every post: a face and two sentences, then the way to
 *  the rest of the site. */
function AuthorCard() {
  return (
    <aside className="mt-10 flex flex-col gap-5 rounded-[1.75rem] bg-white p-6 ring-1 ring-hairline sm:flex-row sm:items-center sm:p-7">
      <Avatar className="size-16" />
      <div className="min-w-0 flex-1">
        <p className="text-eyebrow text-muted uppercase">Written by</p>
        <p className="type-hero mt-1.5 text-xl text-heading">Ahmed Islam</p>
        <p className="mt-1.5 text-body text-muted">
          Full-Stack AI Engineer building production AI systems and the products around them.
        </p>
      </div>
      <Link
        to="/"
        className="press shrink-0 self-start rounded-full px-5 py-2.5 text-[0.75rem] font-bold tracking-[0.14em] text-heading uppercase ring-1 ring-heading/20 hover:bg-heading hover:text-white sm:self-auto"
      >
        About me
      </Link>
    </aside>
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

/** Where to go next: the neighbouring posts, then the one thing this site
 *  exists for — talking about work. */
function End({ newer, older }: { newer?: PostMeta; older?: PostMeta }) {
  return (
    <footer className="mt-24 lg:mt-32">
      {(newer || older) && (
        <nav aria-label="More posts" className="mb-6 grid gap-4 sm:grid-cols-2">
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

      <TalkPanel
        title="Building something like this"
        body="I take on AI systems and the full-stack products around them."
      />
    </footer>
  )
}

/** The white back pill with a chevron chip. Shared with ServicePage. A `/#…`
 *  target is a plain <a>, since only a full load does the anchor scroll. */
export function BackPill({ href, children }: { href: string; children: string }) {
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

/** The ink "Let's talk" panel that closes a post or a service page. */
export function TalkPanel({ title, body, href = '/#contact' }: { title: string; body: string; href?: string }) {
  return (
    <div className="relative isolate overflow-hidden rounded-[2rem] bg-ink px-7 py-12 sm:px-12 sm:py-14">
      <div aria-hidden className="absolute -top-1/2 -right-1/4 -z-10 size-[60%] rounded-full bg-brand/20 blur-[100px]" />
      <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-eyebrow text-brand-bright uppercase">Work with me</p>
          <p className="type-hero mt-3 max-w-[18ch] text-h2 leading-[1.05] text-balance text-white">
            {title}
            <span className="text-brand">?</span>
          </p>
          <p className="mt-3 max-w-[46ch] text-body text-dark-muted">{body}</p>
        </div>
        {/* A plain <a>, like Nav's off-home links: a full load of `/#contact`
            lets the browser do the anchor scroll, which a router <Link> won't. */}
        <a
          href={href}
          data-track="contact_cta"
          data-track-from="talk_panel"
          className="press inline-flex shrink-0 items-center gap-2.5 self-start rounded-full bg-gradient-to-b from-brand to-brand-deep px-6 py-3.5 text-[0.75rem] font-bold tracking-[0.14em] text-white uppercase shadow-lg shadow-brand/25 hover:brightness-110 sm:self-auto"
        >
          Let&rsquo;s talk
          <span aria-hidden>&rarr;</span>
        </a>
      </div>
    </div>
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
            className="press mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-heading ring-1 ring-hairline hover:ring-heading/20"
          >
            <span aria-hidden>&larr;</span> All posts
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}

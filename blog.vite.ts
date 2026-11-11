/**
 * The blog, compiled at build time.
 *
 * Posts are Markdown files in `src/content/blog/`. This plugin turns them into
 * two virtual modules, so neither a Markdown parser nor a syntax highlighter is
 * ever shipped to the browser:
 *
 *   `virtual:blog`         every post's metadata, newest first (small, eager)
 *   `virtual:blog/<slug>`  one post's HTML and table of contents (lazy chunk)
 *
 * It also writes a real HTML page per route into `dist/` — `blog/index.html`
 * and `blog/<slug>.html` — each a copy of the app shell with that page's own
 * <title>, description and Open Graph tags. Two reasons: a LinkedIn or X share
 * then previews the post rather than the home page (crawlers don't run JS), and
 * GitHub Pages serves `/blog/x` from `blog/x.html` with a 200 instead of going
 * through the 404.html shim, which search engines see as a 404. Same trick as
 * `projects.html` in the deploy workflow.
 *
 * `blog/index.html`, NOT `blog.html`: the post pages already make `dist/blog/`
 * a directory, and a directory named like a route is the exact Pages trap that
 * broke /projects (CLAUDE.md). With an index inside it, `/blog` 301s to
 * `/blog/` and is served properly; the router treats both the same. Post
 * images live in `public/blog-images/` for the same reason — a
 * `blog/<slug>/` folder would collide with `blog/<slug>.html`.
 */
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { Marked } from 'marked'
import hljs from 'highlight.js/lib/common'
import type { Plugin } from 'vite'
import type { PostMeta, TocEntry } from './src/content/types.ts'
import { PAGES } from './src/data/pages.ts'
import { SERVICES } from './src/data/services.ts'

const DIR = join(import.meta.dirname, 'src/content/blog')
const SITE = 'https://ahmedislam.tech'
const WORDS_PER_MINUTE = 220

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z]+;/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

/**
 * Frontmatter is a flat `key: value` block. Enough for title, description,
 * date, `tags: [a, b]` and `draft: true`.
 * ponytail: not YAML. No nesting, no multi-line values; reach for a YAML
 * parser if a post ever needs either.
 */
function parseFrontmatter(src: string, file: string) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(src)
  if (!match) throw new Error(`${file}: missing --- frontmatter ---`)
  const data: Record<string, string> = {}
  for (const line of match[1].split(/\r?\n/)) {
    const kv = /^(\w+):\s*(.*)$/.exec(line.trim())
    if (kv) data[kv[1]] = kv[2].replace(/^["']|["']$/g, '')
  }
  for (const key of ['title', 'description', 'date']) {
    if (!data[key]) throw new Error(`${file}: frontmatter needs \`${key}\``)
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date)) throw new Error(`${file}: date must be YYYY-MM-DD`)
  const tags = (data.tags ?? '')
    .replace(/^\[|\]$/g, '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
  return { data, tags, body: src.slice(match[0].length) }
}

function render(body: string) {
  const toc: TocEntry[] = []
  const used = new Set<string>()

  const marked = new Marked({
    renderer: {
      heading({ tokens, depth }) {
        const html = this.parser.parseInline(tokens)
        let id = slugify(html)
        for (let n = 2; used.has(id); n++) id = `${slugify(html)}-${n}`
        used.add(id)
        if (depth === 2 || depth === 3) {
          toc.push({ id, text: html.replace(/<[^>]+>/g, ''), depth })
        }
        return `<h${depth} id="${id}">${html}</h${depth}>\n`
      },

      // Highlighted here, at build time. The copy button is wired by one
      // delegated listener in BlogPostPage.tsx, so there is no per-block script.
      // ```output is what a program printed: labelled "Output", never
      // highlighted, and styled as a printout on paper (`.code-block--output`)
      // so a reader can tell what to run from what it returns.
      code({ text, lang }) {
        const output = lang === 'output'
        const language = !output && lang && hljs.getLanguage(lang) ? lang : undefined
        const code = language ? hljs.highlight(text, { language }).value : escapeHtml(text)
        const label = output
          ? 'Output'
          : language
            ? (hljs.getLanguage(language)?.name ?? language)
            : 'Text'
        const kind = output ? 'code-block code-block--output' : 'code-block'
        return `<figure class="${kind}"><figcaption><span>${escapeHtml(label)}</span><button type="button" data-copy aria-label="Copy ${output ? 'output' : 'code'}">Copy</button></figcaption><pre><code class="hljs">${code}</code></pre></figure>\n`
      },

      // `![alt](src "caption")` becomes a figure. Alt and caption are separate
      // jobs — alt describes the image to someone who can't see it, the
      // caption tells everyone what to take from it — so both are kept.
      image({ href, title, text }) {
        const img = `<img src="${escapeHtml(href)}" alt="${escapeHtml(text)}" loading="lazy" decoding="async" />`
        return title
          ? `<figure class="figure">${img}<figcaption>${escapeHtml(title)}</figcaption></figure>`
          : img
      },

      link({ href, title, tokens }) {
        const external = /^https?:\/\//.test(href)
        const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : ''
        const t = title ? ` title="${escapeHtml(title)}"` : ''
        return `<a href="${escapeHtml(href)}"${t}${attrs}>${this.parser.parseInline(tokens)}</a>`
      },
    },
    hooks: {
      // Wide tables scroll inside their own box instead of widening the page.
      postprocess: (html) =>
        html.replace(/<table>/g, '<div class="table-wrap"><table>').replace(/<\/table>/g, '</table></div>'),
    },
  })

  const html = marked.parse(body, { async: false })
  const words = body.replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length
  return { html, toc, minutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE)) }
}

function loadPosts(includeDrafts: boolean) {
  return readdirSync(DIR)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const src = readFileSync(join(DIR, file), 'utf8')
      const { data, tags, body } = parseFrontmatter(src, file)
      const { html, toc, minutes } = render(body)
      const meta: PostMeta = {
        slug: file.replace(/\.md$/, ''),
        title: data.title,
        description: data.description,
        date: data.date,
        tags,
        minutes,
      }
      return { meta, html, toc, draft: data.draft === 'true' }
    })
    .filter((p) => includeDrafts || !p.draft)
    .sort((a, b) => b.meta.date.localeCompare(a.meta.date))
}

/** Swap the shell's head tags for one page's. The shell must carry each tag
 *  (index.html does); a missing one throws rather than shipping a page that
 *  silently previews as the home page. `jsonLd`, when given, is added as a
 *  second structured-data block beside the shell's Person/WebSite one. */
function withMeta(
  shell: string,
  page: { title: string; description: string; path: string; type: string; jsonLd?: object },
) {
  const replacements: [RegExp, string][] = [
    [/<title>[^<]*<\/title>/, `<title>${escapeHtml(page.title)}</title>`],
    [/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${escapeHtml(page.description)}$2`],
    [/(<meta\s+property="og:title"\s+content=")[^"]*(")/, `$1${escapeHtml(page.title)}$2`],
    [/(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${escapeHtml(page.description)}$2`],
    [/(<meta\s+property="og:url"\s+content=")[^"]*(")/, `$1${SITE}${page.path}$2`],
    [/(<meta\s+property="og:type"\s+content=")[^"]*(")/, `$1${page.type}$2`],
    [/(<link\s+rel="canonical"\s+href=")[^"]*(")/, `$1${SITE}${page.path}$2`],
  ]
  const html = replacements.reduce((html, [re, value]) => {
    if (!re.test(html)) throw new Error(`blog: index.html is missing ${re}`)
    return html.replace(re, value)
  }, shell)
  if (!page.jsonLd) return html
  // `<` escaped so a title containing "</script>" can't close the block early
  const ld = JSON.stringify(page.jsonLd).replace(/</g, '\\u003c')
  return html.replace('</head>', `<script type="application/ld+json">${ld}</script>\n</head>`)
}

const xmlEscape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')

/**
 * Two plugins, because their hooks need different places in Vite's order. The
 * virtual modules resolve in the normal phase. The page writer must run AFTER
 * Vite's own HTML plugin has put `index.html` in the bundle, so it is
 * `enforce: 'post'`; in the normal phase that file doesn't exist yet and the
 * blog pages silently weren't written (measured: dist/ had no blog/ at all).
 */
export default function blog(): Plugin[] {
  const VIRTUAL = 'virtual:blog'
  let includeDrafts = true

  const modules: Plugin = {
    name: 'blog',

    configResolved(config) {
      includeDrafts = config.command === 'serve'
    },

    resolveId(id) {
      if (id === VIRTUAL || id.startsWith(`${VIRTUAL}/`)) return `\0${id}`
    },

    load(id) {
      if (!id.startsWith(`\0${VIRTUAL}`)) return
      const posts = loadPosts(includeDrafts)
      for (const file of readdirSync(DIR)) this.addWatchFile(join(DIR, file))

      if (id === `\0${VIRTUAL}`) {
        // One lazy import per post, written out literally so Rollup can split
        // each post into its own chunk.
        const loaders = posts
          .map((p) => `  ${JSON.stringify(p.meta.slug)}: () => import(${JSON.stringify(`${VIRTUAL}/${p.meta.slug}`)}),`)
          .join('\n')
        return `export const posts = ${JSON.stringify(posts.map((p) => p.meta))}\nexport const bodies = {\n${loaders}\n}\n`
      }

      const slug = id.slice(`\0${VIRTUAL}/`.length)
      const post = posts.find((p) => p.meta.slug === slug)
      if (!post) throw new Error(`blog: no post "${slug}"`)
      return `export const html = ${JSON.stringify(post.html)}\nexport const toc = ${JSON.stringify(post.toc)}\n`
    },

    // Editing a post reloads the page in dev; the virtual modules are rebuilt.
    handleHotUpdate({ file, server }) {
      if (!file.replace(/\\/g, '/').includes('/src/content/blog/')) return
      for (const mod of server.moduleGraph.idToModuleMap.values()) {
        if (mod.id?.startsWith(`\0${VIRTUAL}`)) server.moduleGraph.invalidateModule(mod)
      }
      server.ws.send({ type: 'full-reload' })
      return []
    },
  }

  /**
   * Writes every route's real HTML page, plus the sitemap. Site-wide, not
   * blog-only, despite living in this file: it is the one place that knows
   * every route at build time.
   *
   * `projects.html` used to be a plain `cp` of the home shell in deploy.yml, so
   * /projects told search engines it was the home page (same title,
   * description and canonical). It is written here with its own tags now, and
   * the `cp` is gone. Re-adding it would overwrite this file after the build.
   */
  const pages: Plugin = {
    name: 'site-pages',
    enforce: 'post',
    // not in the SSR build prerender.mjs renders from: it has no index.html
    apply: (_, env) => env.command === 'build' && !env.isSsrBuild,

    generateBundle(_, bundle) {
      const shell = bundle['index.html']
      if (shell?.type !== 'asset') throw new Error('blog: index.html is not in the bundle yet')
      const html = String(shell.source)
      const posts = loadPosts(false)

      this.emitFile({
        type: 'asset',
        fileName: 'projects.html',
        source: withMeta(html, {
          ...PAGES.projects,
          path: '/projects',
          type: 'website',
        }),
      })

      // Only routes that return a 200 on Pages, at the exact URL Pages serves
      // (so `/blog/` with the slash). Posts carry their date as lastmod.
      const urls = [
        { loc: '/' },
        { loc: '/projects' },
        ...SERVICES.map((s) => ({ loc: `/services/${s.id}` })),
        { loc: '/blog/', lastmod: posts[0]?.meta.date },
        ...posts.map(({ meta }) => ({ loc: `/blog/${meta.slug}`, lastmod: meta.date })),
      ]
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source:
          '<?xml version="1.0" encoding="UTF-8"?>\n' +
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
          urls
            .map(
              (u) =>
                `  <url><loc>${xmlEscape(SITE + u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`,
            )
            .join('\n') +
          '\n</urlset>\n',
      })

      // One page per service, so each can rank for its own searches. No
      // `services/index.html`: nothing links to /services, the list is
      // the home page's #services.
      for (const s of SERVICES) {
        this.emitFile({
          type: 'asset',
          fileName: `services/${s.id}.html`,
          source: withMeta(html, {
            title: `${s.seoTitle} — Ahmed Islam`,
            description: s.description,
            path: `/services/${s.id}`,
            type: 'website',
            jsonLd: {
              '@context': 'https://schema.org',
              '@type': 'Service',
              name: s.seoTitle,
              description: s.description,
              url: `${SITE}/services/${s.id}`,
              provider: { '@id': `${SITE}/#person` },
            },
          }),
        })
      }

      this.emitFile({
        type: 'asset',
        fileName: 'blog/index.html',
        source: withMeta(html, {
          ...PAGES.blog,
          // the trailing slash is the URL Pages actually serves (see above)
          path: '/blog/',
          type: 'website',
        }),
      })

      // Not in the sitemap: there is nothing on it to rank for. It still needs
      // its own HTML so Pages serves it with a 200 and it gets prerendered.
      this.emitFile({
        type: 'asset',
        fileName: 'privacy.html',
        source: withMeta(html, { ...PAGES.privacy, path: '/privacy', type: 'website' }),
      })

      // The home page's own head comes from PAGES too, so index.html's
      // literal title and description are only what `npm run dev` shows.
      shell.source = withMeta(html, { ...PAGES.home, path: '/', type: 'website' })

      for (const { meta } of posts) {
        this.emitFile({
          type: 'asset',
          fileName: `blog/${meta.slug}.html`,
          source: withMeta(html, {
            title: `${meta.title} — Ahmed Islam`,
            description: meta.description,
            path: `/blog/${meta.slug}`,
            type: 'article',
            // Lets search engines show the post as an article (date, author).
            // The author points at the Person block every page already carries.
            jsonLd: {
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              headline: meta.title,
              description: meta.description,
              datePublished: meta.date,
              dateModified: meta.date,
              keywords: meta.tags.join(', '),
              url: `${SITE}/blog/${meta.slug}`,
              mainEntityOfPage: `${SITE}/blog/${meta.slug}`,
              image: `${SITE}/og.png`,
              author: { '@id': `${SITE}/#person` },
              publisher: { '@id': `${SITE}/#person` },
            },
          }),
        })
      }
    },
  }

  return [modules, pages]
}

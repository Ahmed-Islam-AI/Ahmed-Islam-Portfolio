/** Writes each route's HTML page and the sitemap. */
import type { Plugin } from 'vite'
import { PAGES } from './src/data/pages.ts'
import { SERVICES } from './src/data/services.ts'

const SITE = 'https://ahmedislam.tech'

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** Swaps the shell's head tags for one page's; `jsonLd` adds a second structured-data block.
 *  Throws if index.html lacks a tag it rewrites (HISTORY.md › SEO and prerendering) */
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
    if (!re.test(html)) throw new Error(`site-pages: index.html is missing ${re}`)
    return html.replace(re, value)
  }, shell)
  if (!page.jsonLd) return html
  // `<` escaped so a title containing "</script>" can't close the block early
  const ld = JSON.stringify(page.jsonLd).replace(/</g, '\\u003c')
  return html.replace('</head>', `<script type="application/ld+json">${ld}</script>\n</head>`)
}

const xmlEscape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')

/** The one place that knows every route. Don't re-add deploy.yml's `cp` of projects.html
 *  (HISTORY.md › SEO and prerendering) */
export default function sitePages(): Plugin {
  return {
    name: 'site-pages',
    // After Vite's HTML plugin, or index.html isn't in the bundle yet (HISTORY.md › SEO and prerendering)
    enforce: 'post',
    // not in the SSR build prerender.mjs renders from: it has no index.html
    apply: (_, env) => env.command === 'build' && !env.isSsrBuild,

    generateBundle(_, bundle) {
      const shell = bundle['index.html']
      if (shell?.type !== 'asset') throw new Error('site-pages: index.html is not in the bundle yet')
      const html = String(shell.source)

      this.emitFile({
        type: 'asset',
        fileName: 'projects.html',
        source: withMeta(html, {
          ...PAGES.projects,
          path: '/projects',
          type: 'website',
        }),
      })

      // Only routes that return a 200 on Pages, at the exact URL Pages serves.
      const urls = [{ loc: '/' }, { loc: '/projects' }, ...SERVICES.map((s) => ({ loc: `/services/${s.id}` }))]
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source:
          '<?xml version="1.0" encoding="UTF-8"?>\n' +
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
          urls.map((u) => `  <url><loc>${xmlEscape(SITE + u.loc)}</loc></url>`).join('\n') +
          '\n</urlset>\n',
      })

      // One page per service, so each can rank for its own searches. No `services/index.html`:
      // nothing links to /services, the list is the home page's #services.
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
    },
  }
}

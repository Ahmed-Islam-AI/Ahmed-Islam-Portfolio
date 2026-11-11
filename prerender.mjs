/**
 * Puts each page's rendered HTML into the page itself. Runs last in
 * `npm run build`, after the client build (which wrote one HTML file per route
 * via blog.vite.ts) and an SSR build of src/entry-server.tsx into dist-ssr/.
 *
 * The routes are read off the HTML files the build wrote, so this never needs
 * its own route list: `index.html` → `/`, `projects.html` → `/projects`,
 * `blog/index.html` → `/blog/`, `services/x.html` → `/services/x`.
 * `404.html` is skipped: it is the GitHub Pages redirect shim, not a page.
 *
 * Each root is marked with `data-route` so main.tsx knows which route the
 * markup belongs to and only adopts it on that route.
 */
import { readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { pathToFileURL } from 'node:url'

const DIST = 'dist'
const EMPTY = '<div id="root"></div>'
const { render } = await import(pathToFileURL(join('dist-ssr', 'entry-server.js')).href)

const pages = readdirSync(DIST, { recursive: true })
  .map((f) => relative(DIST, join(DIST, String(f))).replace(/\\/g, '/'))
  .filter((f) => f.endsWith('.html') && f !== '404.html')

for (const file of pages) {
  const route = '/' + file.replace(/\.html$/, '').replace(/(^|\/)index$/, '$1')
  const path = join(DIST, file)
  const html = readFileSync(path, 'utf8')
  if (!html.includes(EMPTY)) throw new Error(`prerender: ${file} has no empty ${EMPTY}`)
  const markup = await render(route)
  writeFileSync(path, html.replace(EMPTY, `<div id="root" data-route="${route}">${markup}</div>`))
  console.log(`prerendered ${route.padEnd(40)} ${(markup.length / 1024).toFixed(0)} kB`)
}

rmSync('dist-ssr', { recursive: true, force: true })

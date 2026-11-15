/** Fills each built page's root with its rendered HTML; runs last in `npm run build`.
 *  Routes come from the HTML files in dist/; 404.html is the Pages shim, not a page. */
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

/**
 * Renders one route to HTML, at build time, in Node. `prerender.mjs` calls this
 * for every page the build writes and puts the result inside that page's
 * `<div id="root">`, so the text is in the HTML itself: search engines and
 * link previews read it without running any JavaScript. main.tsx then adopts
 * that markup (hydrateRoot) instead of drawing the page again. (Visitors don't
 * see all of it before the bundle loads: `[data-reveal]` content stays hidden
 * until it is revealed, as before.)
 *
 * Nothing that renders may touch `window` or `document` outside an effect.
 * The two things that did (reduced motion, the Contact pre-tick) moved into
 * effects for exactly this reason.
 */
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import App from './App'
import { preloadPost } from './pages/BlogPostPage'

export async function render(url: string) {
  const slug = /^\/blog\/([^/]+)$/.exec(url)?.[1]
  if (slug) await preloadPost(slug)
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  )
}

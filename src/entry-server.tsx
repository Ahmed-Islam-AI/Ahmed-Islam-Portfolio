/** Renders one route to HTML at build time, for prerender.mjs to put in that page's root.
 *  Rendering must not read window/document outside effects (HISTORY.md › SEO and prerendering) */
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import App from './App'

export async function render(url: string) {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  )
}

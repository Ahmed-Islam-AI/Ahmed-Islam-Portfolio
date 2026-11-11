import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { preloadPost } from './pages/BlogPostPage'
import { startAnalytics } from './analytics'
import './index.css'

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// Browser only: entry-server.tsx never imports this file.
startAnalytics()

/**
 * Every page the build writes already holds its own rendered HTML
 * (prerender.mjs), marked with the route it was rendered for. When that is
 * the route we're on, adopt the markup. Otherwise draw from scratch: that is
 * `npm run dev` (no prerender) and an unknown URL, which GitHub Pages answers
 * with 404.html → the home page's HTML, while the address is something else.
 */
const trim = (path: string) => path.replace(/(.)\/$/, '$1')
const prerendered = root.dataset.route

if (prerendered && trim(prerendered) === trim(location.pathname)) {
  // a post's body is its own chunk; load it first, or the first render would
  // be the loading skeleton and disagree with the article in the HTML
  const slug = /^\/blog\/([^/]+?)\/?$/.exec(location.pathname)?.[1]
  ;(slug ? preloadPost(slug) : Promise.resolve()).then(() => hydrateRoot(root, app))
} else {
  createRoot(root).render(app)
}

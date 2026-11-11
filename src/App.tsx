import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ProjectsPage from './pages/ProjectsPage'
import BlogPage from './pages/BlogPage'
import BlogPostPage from './pages/BlogPostPage'
import ServicePage from './pages/ServicePage'
import PrivacyPage from './pages/PrivacyPage'
import ConsentBanner from './components/ConsentBanner'
import { useReveal } from './hooks/useReveal'

export default function App() {
  // Re-runs on route change, so `[data-reveal]` works on /projects for free.
  useReveal()

  // SocialRail lives in Home, not here: it needs the active-section value to
  // invert itself over the dark Method band.
  //
  // `/work/:slug` used to sit here as a stub so project cards had somewhere to
  // land. Deleted 2026-08-30: every card has been an external <a> since the
  // gallery was rebuilt, so nothing had linked to it for over a week.
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/services/:slug" element={<ServicePage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
      </Routes>
      {/* Every route: opens after mount for visitors in Europe (analytics.ts). */}
      <ConsentBanner />
    </>
  )
}

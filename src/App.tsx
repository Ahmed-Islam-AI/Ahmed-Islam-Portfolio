import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import ProjectsPage from './pages/ProjectsPage'
import ServicePage from './pages/ServicePage'
import PrivacyPage from './pages/PrivacyPage'
import ConsentBanner from './components/ConsentBanner'
import { useReveal } from './hooks/useReveal'

export default function App() {
  // Re-runs on route change, so `[data-reveal]` works on /projects for free.
  useReveal()

  // SocialRail lives in Home, not here: it needs the active section to invert over dark bands.
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/services/:slug" element={<ServicePage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        {/* Unknown URLs go home rather than render a blank page. */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {/* Every route: opens after mount for visitors in Europe (analytics.ts). */}
      <ConsentBanner />
    </>
  )
}

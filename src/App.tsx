import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ProjectsPage from './pages/ProjectsPage'
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
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/projects" element={<ProjectsPage />} />
    </Routes>
  )
}

import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import { useReveal } from './hooks/useReveal'

export default function App() {
  useReveal()

  // SocialRail lives in Home, not here: it needs the active-section value to
  // invert itself over the dark Method band.
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* Stub only, so the project cards don't navigate to a blank screen.
          Replace with real detail pages. */}
      <Route
        path="/work/:slug"
        element={
          <div className="grid min-h-screen place-items-center gap-4 px-6 text-center">
            <p className="text-eyebrow text-muted uppercase">Case study coming soon</p>
            <Link to="/#projects" className="text-sm font-semibold text-brand uppercase">
              Back to the work
            </Link>
          </div>
        }
      />
    </Routes>
  )
}

import { useEffect, useState } from 'react'
import Nav from '../components/Nav'
import Hero from '../components/Hero'
import StatsBar from '../components/StatsBar'
import About from '../components/About'
import Work from '../components/Work'
import Stack from '../components/Stack'
import Services from '../components/Services'
import Reviews from '../components/Reviews'
import Method from '../components/Method'
import Projects from '../components/Projects'
import Certifications from '../components/Certifications'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import SectionRail, { SECTIONS, type RailSurface } from '../components/SectionRail'
import SocialRail from '../components/SocialRail'
import { useActiveSection } from '../hooks/useActiveSection'

const SECTION_IDS = SECTIONS.map((section) => section.id)

export default function Home() {
  // One observer, shared by the nav and both gutter rails, so they can never
  // disagree about which section you're in.
  const active = useActiveSection(SECTION_IDS)
  // Which band the gutter rails are over. Computed once and handed to both, so
  // they can never disagree. `brand` is its own case: the surface there IS the
  // accent, so orange signals have to become ink — see RailSurface.
  const surface: RailSurface =
    active === 'certifications'
      ? 'brand'
      : active === 'method' || active === 'projects' || active === 'contact'
        ? 'dark'
        : 'light'

  // The footer lists every social link already, so the fixed rail is redundant
  // there — and it sits right on top of that column. Same centre-line rootMargin
  // as useActiveSection, so it hands over at exactly the point the rest of the
  // page considers you to have left the last section.
  const [inFooter, setInFooter] = useState(false)
  useEffect(() => {
    const el = document.getElementById('site-footer')
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setInFooter(entry.isIntersecting), {
      rootMargin: '-50% 0px -50% 0px',
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Nav active={active} />
      <SectionRail active={active} surface={surface} />
      <SocialRail surface={surface} hidden={inFooter} />

      <main id="top">
        {/* Hero zone — nav, hero and stats bar all sit on one grid background.
            pt clears the fixed nav; the bg layer spans that padding too, so
            there's no white strip behind the pill. */}
        {/* pt-nav is the shared fixed-nav clearance, so the hero can't drift out
            of step with the pinned panels that use the same token. */}
        <div className="pt-nav relative isolate overflow-x-clip">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div className="hero-grid absolute inset-0" />
            <div className="absolute -top-32 -right-32 size-[38rem] rounded-full bg-brand/10 blur-[120px]" />
            <div className="absolute -bottom-40 -left-40 size-[30rem] rounded-full bg-brand-bright/8 blur-[130px]" />
          </div>

          <Hero />
          <StatsBar />
        </div>

        <About />
        <Work />
        <Stack />
        <Services />
        <Reviews />
        <Method />
        <Projects />
        <Certifications />
        <Contact />
      </main>

      <Footer />
    </>
  )
}

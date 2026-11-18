import { useEffect, useState } from 'react'
import { PAGES } from '../data/pages'
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
  // The band under the gutter rails, handed to both so they agree (see RailSurface).
  const surface: RailSurface =
    active === 'certifications'
      ? 'brand'
      : active === 'method' || active === 'projects' || active === 'contact'
        ? 'dark'
        : 'light'

  // SocialRail hides over the footer, which lists every link; same centre line as useActiveSection.
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

  // Arriving by an in-app link, the tab would otherwise keep the last page's title.
  useEffect(() => {
    document.title = PAGES.home.title
  }, [])

  // Land on the address's #section: on a page drawn from scratch it didn't exist when the
  // browser looked. `instant`, or html's smooth scrolling glides through the whole page.
  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1))
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'instant' })
  }, [])

  return (
    <>
      <Nav active={active} />
      <SectionRail active={active} surface={surface} />
      <SocialRail surface={surface} hidden={inFooter} />

      <main id="top">
        {/* Hero zone: nav, hero and stats bar share one background, which spans the pt-nav too. */}
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

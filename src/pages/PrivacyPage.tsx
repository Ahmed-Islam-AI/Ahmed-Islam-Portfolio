import { useEffect } from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { PAGES } from '../data/pages'
import { BackPill } from './BlogPostPage'

const EMAIL = 'hello@ahmedislam.tech'
const external = { target: '_blank', rel: 'noopener noreferrer' } as const

/**
 * `/privacy`. Added 2026-11-11 with Google Analytics: Google's terms require a
 * site using GA to disclose it in a privacy policy, and the consent banner and
 * the footer link here. Rewritten 2026-11-12 in a formal register on Ahmed's
 * request. DRAFT, written from what the site actually does (analytics.ts,
 * Contact.tsx); not legal advice. If the analytics setup or the form's
 * provider changes, this page has to change with it.
 *
 * The 14-month retention it states assumes GA4's retention is set to 14
 * months (the default is 2, which is also "up to 14").
 *
 * Body is plain elements inside `.prose`, the blog's reading styles, so it
 * needs no styling of its own.
 */
export default function PrivacyPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
    const previous = document.title
    document.title = PAGES.privacy.title
    return () => {
      document.title = previous
    }
  }, [])

  return (
    <>
      <Nav />
      <main id="top" className="min-h-screen bg-paper">
        <div className="pt-nav px-4 pb-28 sm:px-6 lg:px-20 lg:pb-36">
          <div className="mx-auto max-w-6xl">
            {/* Same as the service pages: no back pill on a phone. */}
            <nav aria-label="Back" className="pt-8 max-sm:hidden lg:pt-10">
              <BackPill href="/">Home</BackPill>
            </nav>

            <header className="mt-8 sm:mt-12 lg:mt-16">
              <h1 data-reveal className="type-hero text-display leading-[0.92] uppercase">
                <span className="block text-heading">Privacy</span>{' '}
                <span className="block text-heading/50">
                  policy<span className="text-brand">.</span>
                </span>
              </h1>
              <p data-reveal className="text-lead mt-8 max-w-[52ch] text-muted [--reveal-delay:120ms]">
                This policy explains what information ahmedislam.tech collects, how it is used, and the
                choices available to you.
              </p>
              <p data-reveal className="text-eyebrow mt-6 text-muted uppercase [--reveal-delay:160ms]">
                Last updated 12 November 2026
              </p>
            </header>

            <div data-reveal className="prose mt-14 max-w-[44rem] lg:mt-20 [--reveal-delay:200ms]">
              <h2>About this site</h2>
              <p>
                ahmedislam.tech is the professional portfolio of Ahmed Islam, a Full-Stack AI Engineer
                based in Islamabad, Pakistan. Ahmed Islam is responsible for the information collected
                through this site.
              </p>

              <h2>Information collected</h2>
              <p>
                <strong>Analytics data.</strong> Where consent is given or not required, the site uses
                Google Analytics 4 to collect information about your visit: the pages you view, how you
                reached the site (for example, a search engine or a link from another website), your
                approximate location (country and city), and your device and browser type. Google
                Analytics uses cookies to distinguish returning visitors from new ones.
              </p>
              <p>
                <strong>Contact form submissions.</strong> If you submit the contact form, the details you
                provide (your name, email address, company and message, together with the services,
                budget and timeline you select) are delivered by email through FormSubmit.
              </p>

              <h2>How information is used</h2>
              <p>
                Analytics data is used solely to understand which pages are useful and how visitors find
                the site, so that it can be improved. Contact details are used only to respond to your
                enquiry. No information is used for advertising, and no information is sold or rented to
                third parties.
              </p>

              <h2>Cookies and your choices</h2>
              <p>
                Visitors from the European Economic Area, the United Kingdom and Switzerland are asked for
                consent before any analytics cookies are set. Until consent is given, or if it is
                declined, Google receives only anonymous, cookieless signals that cannot identify you.
              </p>
              <p>
                Visitors from every region can review or withdraw their choice at any time through the
                &ldquo;Cookie settings&rdquo; link at the bottom of each page. You can also block cookies
                in your browser settings, or install Google&rsquo;s{' '}
                <a href="https://tools.google.com/dlpage/gaoptout" {...external}>
                  opt-out browser add-on
                </a>
                .
              </p>

              <h2>Third-party services</h2>
              <ul>
                <li>
                  <strong>Google Analytics</strong>, provided by Google LLC, processes analytics data under
                  the{' '}
                  <a href="https://policies.google.com/privacy" {...external}>
                    Google Privacy Policy
                  </a>
                  . Google also explains{' '}
                  <a href="https://policies.google.com/technologies/partner-sites" {...external}>
                    how it uses information from sites that use its services
                  </a>
                  .
                </li>
                <li>
                  <strong>FormSubmit</strong> (
                  <a href="https://formsubmit.co" {...external}>
                    formsubmit.co
                  </a>
                  ) delivers contact form submissions by email.
                </li>
                <li>
                  <strong>Cloudflare</strong> (
                  <a href="https://www.cloudflare.com" {...external}>
                    cloudflare.com
                  </a>
                  ) forwards email sent to {EMAIL} to my mailbox.
                </li>
                <li>
                  <strong>Brevo</strong> (
                  <a href="https://www.brevo.com" {...external}>
                    brevo.com
                  </a>
                  ) delivers my email replies.
                </li>
              </ul>

              <h2>Data retention</h2>
              <p>
                Analytics data is retained in Google Analytics for up to 14 months. Enquiries are kept in
                email for as long as is needed to respond and to maintain any resulting working
                relationship.
              </p>

              <h2>Your rights</h2>
              <p>
                Depending on where you live, you may have the right to access, correct or delete the
                personal information held about you, or to object to its processing. To make a request,
                use the contact details below.
              </p>

              <h2>Changes to this policy</h2>
              <p>
                This policy may be updated from time to time. The date at the top of this page shows when
                it was last revised.
              </p>

              <h2>Contact</h2>
              <p>
                Questions about this policy or about your information can be sent to{' '}
                <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

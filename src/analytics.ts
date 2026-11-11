/**
 * Google Analytics 4, chosen by Ahmed 2026-11-11, with Consent Mode v2.
 *
 * Consent: visitors in the EEA, the UK and Switzerland are `denied` until they
 * accept (Google then sends only cookieless pings); everyone else is
 * `granted`. Google applies that by its own geolocation. The banner
 * (ConsentBanner.tsx) asks only visitors whose time zone is in Europe, since
 * a static site has no server to ask for a country. Ads storage is denied for
 * everyone: the site runs no ads. A choice is kept in localStorage and can be
 * changed from the footer's "Cookie settings".
 *
 * Page views, including in-app navigation (Enhanced Measurement's "browser
 * history events"), outbound clicks (projects, profiles, WhatsApp) and file
 * downloads (the CV) GA4 records by itself. Ours, for "which visits become
 * enquiries":
 *
 *   generate_lead   the contact form went through. GA4's own name for it.
 *                   Params: services, budget, timeline. Never the name, email
 *                   or message.
 *   contact_failed  it didn't
 *   contact_cta     a click towards the form. `from`: nav, about,
 *                   service_hero, service_faq, talk_panel
 *   email_click     a mailto link. `from`: hero, contact, footer
 *
 * GA4 records each event's page, so `from` only separates buttons on one page.
 * Nothing loads outside ahmedislam.tech, so dev and preview never count.
 */

/** GA4 → Admin → Data streams → (web stream) → Measurement ID, `G-…`.
 *  Public, not a secret: it ends up in every visitor's page. */
const MEASUREMENT_ID: string = 'G-QFPNV9V4Q4'

export const analyticsOn = MEASUREMENT_ID !== ''

/** Where consent is asked by law: the EEA, the UK, Switzerland. */
const CONSENT_REGIONS = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV',
  'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO', 'GB', 'CH',
]

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

export type Choice = 'granted' | 'denied'
const KEY = 'analytics-consent'

export function storedChoice(): Choice | null {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'granted' || v === 'denied' ? v : null
  } catch {
    return null // storage blocked: ask again, which is the safe side
  }
}

/** Who the banner is for. Europe/* time zones, plus the Atlantic ones that
 *  are in the EEA (Canaries, Madeira, Azores, Iceland, Faroes). It errs wide:
 *  asking a few extra people is fine, missing someone is not. */
export function inConsentRegion() {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? ''
  return tz.startsWith('Europe/') || /^Atlantic\/(Canary|Madeira|Azores|Reykjavik|Faroe)$/.test(tz)
}

/** Whether to show the banner now. In dev it shows without an ID, so the
 *  banner can be seen before GA is set up (nothing is sent from dev). */
export const consentNeeded = () =>
  (analyticsOn || import.meta.env.DEV) && inConsentRegion() && storedChoice() === null

export function setConsent(choice: Choice) {
  try {
    localStorage.setItem(KEY, choice)
  } catch {
    // remembered for this page only
  }
  window.gtag?.('consent', 'update', { analytics_storage: choice })
}

export const track = (event: string, params?: Record<string, string>) => window.gtag?.('event', event, params)

export function startAnalytics() {
  if (!analyticsOn || location.hostname !== 'ahmedislam.tech') return

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    // gtag.js reads `arguments` objects off the queue, not arrays: a rest
    // parameter here silently breaks it
    window.dataLayer.push(arguments)
  }
  const denied = { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' }
  // the region-specific default wins over the general one for those regions
  window.gtag('consent', 'default', { ...denied, analytics_storage: 'denied', region: CONSENT_REGIONS })
  window.gtag('consent', 'default', { ...denied, analytics_storage: 'granted' })
  const choice = storedChoice()
  if (choice) window.gtag('consent', 'update', { analytics_storage: choice })
  window.gtag('js', new Date())
  window.gtag('config', MEASUREMENT_ID)

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`
  document.head.append(script)

  // Clicks: any element with data-track="<event>", plus data-track-<key>="…"
  // for its params. One listener for the whole site; it only listens, never
  // holds or redirects the click. gtag sends with sendBeacon, so an event
  // survives a click that leaves the page.
  document.addEventListener(
    'click',
    (e) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>('[data-track]')
      if (!el?.dataset.track) return
      const params: Record<string, string> = {}
      for (const [key, value] of Object.entries(el.dataset))
        if (key.startsWith('track') && key !== 'track' && value) params[key[5].toLowerCase() + key.slice(6)] = value
      track(el.dataset.track, params)
    },
    { capture: true },
  )
}

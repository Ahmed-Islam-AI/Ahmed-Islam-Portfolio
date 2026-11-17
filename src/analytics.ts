/** GA4 with Consent Mode v2, only on ahmedislam.tech. Events: generate_lead, contact_failed,
 *  contact_cta, email_click; consent rules and params in (HISTORY.md › Analytics and privacy) */

/** GA4 → Admin → Data streams → Measurement ID; public, not a secret.
 *  Typed `string` on purpose, not as a literal (HISTORY.md › Analytics and privacy) */
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

/** Who the banner is for: Europe/* time zones plus the EEA's Atlantic ones (Canaries, Madeira,
 *  Azores, Iceland, Faroes). Errs wide: asking a few extra people is fine, missing one is not. */
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

  // Clicks: data-track="<event>" plus data-track-<key>="…" params. One listener that never holds
  // or redirects the click; gtag sends with sendBeacon, so an event survives leaving the page.
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

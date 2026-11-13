export interface Project {
  slug: string
  name: string
  status: string
  /**
   * Absolute URL, opened in a new tab. Every project has exactly one — in the
   * source Ahmed supplied, six of the seven had an identical `link` and `github`
   * value and PadelGPT had only a live site, so a second field would have been
   * the same string twice.
   */
  href: string
  /** One factual line: what the thing does. Read off the repo, never invented. */
  summary: string
  /**
   * What it is actually built with. Every entry must resolve in `TechIcon.tsx`
   * or it silently falls back to the generic cube glyph.
   *
   * Note these do NOT have to exist in `Stack.tsx`, unlike `services.ts`. That
   * rule stops Services *selling* outside Ahmed's declared skills; a project's
   * stack is a fact about the project, not a breadth claim. Arduino, ROS and
   * BeautifulSoup belong on a card and not in the skill cloud.
   */
  stack: string[]
  /** Only where the repo's own README states one. Six of seven don't. */
  metric?: string
  /**
   * A REAL capture of a REAL screen, or absent. Absent on all seven today.
   *
   * When present on a featured project it replaces the type-led left column of
   * the featured panel outright. When absent, the project's own name at display
   * scale is the anchor — the site's existing type-led move rather than a
   * graphic invented to fill the gap.
   *
   * Do NOT point this at anything generated. The seven posters this gallery used
   * to render had hallucinated text baked into the pixels ("BeautifulSooup",
   * "TenFolox", "INPISODFRAITE CONTENT DKTBSCTED") and one invented a "97%
   * Confidence" figure that appears in no repo. They live on in
   * `assets-original/project-images/`, outside `public/`, and must stay there.
   */
  image?: { src: string; alt: string }
}

/**
 * REAL — `href` and `name` supplied by Ahmed 2026-08-15; `summary` and `stack`
 * drafted 2026-08-21 from each repo's own README and file tree.
 *
 * DRAFT: the summaries are paraphrased from the READMEs, not written by Ahmed,
 * and the stacks are read off the READMEs and file listings rather than from a
 * `requirements.txt` (none of the repos has one). Both are his to confirm.
 * Nothing here claims a client, and the single `metric` is quoted from his own
 * README rather than derived.
 *
 * `status` is the one derived field and stays factual: `LIVE` for the deployed
 * product, `SOURCE` for the public repos.
 *
 * There is deliberately NO imagery — see `image` above.
 *
 * `accentColor` was removed 2026-08-30 with the scroll-jack rebuild. Its only
 * consumer was the per-project tint on the drifting background word, and there
 * is no longer a travelling word or an active index to drive it. Removing it
 * also restores STYLE.md's single-accent rule cleanly: the spread across the
 * warm range was an explicit, grudging compromise made *for* that effect, not a
 * licence for per-project hues. Don't reintroduce it without an effect needing it.
 */
export const PROJECTS: Project[] = [
  {
    slug: 'padelgpt',
    name: 'PadelGPT',
    status: 'LIVE',
    href: 'https://www.padelos.co/',
    // The one entry with no public README — drawn from the Padelos role in
    // `Work.tsx`, which is CV-derived, so it stays inside what the CV says.
    summary:
      'Platform assistant for the Padelos SaaS. Answers in natural language and calls platform tools to act on club data, not just describe it.',
    stack: ['Python', 'LangGraph', 'LangChain', 'MCP', 'FAISS', 'Redis'],
    /**
     * Supplied by Ahmed 2026-08-30 (`src/assets/projects/padelgpt.webp`),
     * cropped to 16:10 and re-encoded.
     *
     * NOT a capture of the running product — it is a designed mockup: fake
     * browser chrome (traffic lights), an empty chat pane, a typing indicator
     * mid-reply, and violet rather than the site's accent. It is the file this
     * gallery shipped with before 2026-08-21, and it is here because Ahmed
     * asked for it directly after being told what it was. His call, recorded so
     * nobody "fixes" it back out.
     *
     * A real capture of the deployed assistant replaces this the moment one
     * exists, and would be a straight upgrade.
     */
    image: {
      src: '/project-images/padelgpt.webp',
      alt: 'Mockup of the PadelGPT assistant answering a request to show all active memberships.',
    },
  },
  {
    slug: 'segments',
    name: 'Player Segmentation',
    status: 'LIVE',
    href: 'https://www.padelos.co/',
    /**
     * Added 2026-08-30 on Ahmed's instruction, and featured in place of
     * `content-moderation`.
     *
     * The summary is read off the product's own screen and marketing copy in
     * the supplied capture — the prompt "All the players with 0 bookings in the
     * previous 30 days", the resolution steps beneath it, and the feature
     * blurb "AI-powered tools segment players by behaviour, activity, and
     * spending so you act on real data". Nothing here is inferred beyond what
     * that screen states.
     *
     * TODO(Ahmed): `stack` is the ONE unverified field. It mirrors PadelGPT's,
     * since both are AI features of the same platform, but Ahmed has not
     * confirmed what this feature actually runs on. Correct it or trim it.
     */
    summary:
      'Natural-language player segmentation for the Padelos platform. Describe a segment in plain English and it resolves the filter against real booking and spending history.',
    stack: ['Python', 'LangGraph', 'LangChain', 'Redis'],
    /**
     * A REAL capture of the running product — the segment builder mid-resolution.
     * Supplied by Ahmed 2026-08-30 as `src/assets/projects/segments.png`, which
     * is actually an **AVIF** file despite the extension; decoded and re-encoded
     * to WebP here. Cropped top-anchored so the Segment Name field and the
     * prompt both survive: a centred window cut the name field off, and the
     * prompt is the thing that shows what the feature does.
     */
    image: {
      src: '/project-images/segments.webp',
      alt: 'The Padelos segment builder resolving the prompt "All the players with 0 bookings in the previous 30 days" into a filtered player list.',
    },
  },
  {
    slug: 'flintgrab',
    name: 'Flintgrab',
    /**
     * Added 2026-09-20 on Ahmed's instruction, taking `ppe-safety`'s place in
     * `FEATURED` (that project stays in the list, it just isn't featured).
     *
     * **`LIVE` since 2026-11-13, at `flintgrab.ahmedislam.tech`.** The
     * `Flint-Grab-site` repo deploys there through GitHub Pages, and its
     * Download button serves the installer from that repo's `v0.1.0` release.
     * Until then the card was `SOURCE` and linked the repo, because the site's
     * own domain, `flintgrab.com`, was never registered. If it ever is, move
     * `href` there.
     *
     * The desktop app itself is closed source (`UNLICENSED` in its
     * package.json, "proprietary" in its README), so there is no app repo to
     * point at.
     *
     * This is also the first **web/desktop** entry in a gallery that was
     * otherwise all AI/ML — the content gap CLAUDE.md has been flagging, since
     * `services.ts` sells web development with nothing behind it in the gallery.
     */
    status: 'LIVE',
    href: 'https://flintgrab.ahmedislam.tech',
    /**
     * Read off the product's own `index.html` meta description and the app
     * README's opening line, both written by Ahmed. Not paraphrased loosely —
     * the "streaming manifests" framing is his, and it is the thing that says
     * why this is harder than a download button.
     */
    summary:
      'A Windows download manager for social video, which arrives as streaming manifests rather than files. Segmented transfers, pause and resume, and a browser extension that hands off the page session.',
    /**
     * Verified against the app's own `package.json`, not inferred: Electron 44
     * + React 19 + strict TypeScript, Tailwind 4, `better-sqlite3` for the
     * queue, `webtorrent` for torrents. `WebTorrent` has no `simple-icons` slug,
     * so it renders the generic cube — that is the documented fallback, not a
     * missing entry. `Electron` and `TypeScript` were added to `TechIcon.tsx`
     * for this card.
     */
    stack: ['Electron', 'React', 'TypeScript', 'Tailwind CSS', 'SQLite', 'WebTorrent'],
    /**
     * A REAL capture of the real running application — its download queue with
     * live transfers, the throughput graph, and the extension-connected state.
     * Source: `public/assets/screens/queue.png` in the Flintgrab website repo,
     * 1102x721, cropped **top-anchored** to 16:10 so the title bar and wordmark
     * survive (a centred window clipped the top of the logo) and re-encoded to
     * 880x550 WebP. The 32px it loses off the bottom is the status strip.
     *
     * Its lime `#A8E84D` is Flintgrab's own brand accent and breaks this site's
     * single-accent rule. That is allowed and deliberate: a real capture carries
     * its own colours because it is evidence rather than decoration, which is
     * the same licence `segments` uses. See STYLE.md.
     */
    image: {
      src: '/project-images/flintgrab.webp',
      alt: 'The Flintgrab download queue: four active transfers with progress bars, per-file throughput and a live speed graph.',
    },
  },
  {
    slug: 'dukaan',
    name: 'Dukaan',
    /**
     * Added 2026-11-05 on Ahmed's instruction, taking `segments`' place in
     * `FEATURED` (Segments stays in the list).
     *
     * **`APK`, not `LIVE` or `SOURCE`.** It is an Android app, not on the Play
     * Store yet, so there is no site to visit. The repo is public, but Ahmed
     * chose the release page as the destination: it is where a visitor can
     * actually install it (`Dukaan-<version>.apk`). `releases/latest` always
     * opens the newest release, so this link never needs bumping.
     */
    status: 'APK',
    href: 'https://github.com/Ahmed-Islam-AI/Dukaan-Inventory/releases/latest',
    /**
     * Facts from the repo's own README (`D:\inventory_management_app`). "Its
     * first client is a phone shop in Lahore" is the README's claim, and it
     * names no shop, so neither does this. Written with the humanizer skill,
     * then checked with the asd-ste100 skill's linter (0 findings): no
     * semicolons, sentences under 25 words.
     */
    summary:
      'Billing, stock and udhaar (customer credit) for a small shop, in an Android app that works without internet. Its first client is a phone shop in Lahore. It shares invoices on WhatsApp and runs in English or Urdu.',
    /**
     * From the README's "Under the hood" table: Kotlin, Jetpack Compose, Room
     * on SQLite, optional Firebase sync, ML Kit for on-device barcode scanning.
     * Kotlin, Jetpack Compose and ML Kit were added to `TechIcon.tsx` for this
     * card.
     */
    stack: ['Kotlin', 'Jetpack Compose', 'SQLite', 'Firebase', 'ML Kit'],
    /**
     * REAL captures: three screenshots from the app's own README set
     * (`docs/images/screens/` items, home, receipt-invoice), taken from the
     * debug build on an emulator with the README's demo shop data. Composed on
     * Dukaan's own saffron `#E8590C` (from its docs/DESIGN.md) at 880x550 by a
     * scratch Puppeteer script; nothing in the frame is drawn except the
     * backdrop. Its saffron is the product's colour, same licence as Flintgrab's
     * lime and Segments' blue.
     *
     * Not the README's `hero.png`: that banner is half title text and taglines,
     * which would repeat the card's own name beside it.
     */
    image: {
      src: '/project-images/dukaan.webp',
      alt: "Three Dukaan screens with demo data. Left: the item list, with stock and profit per item. Centre: the home screen, with today's cash and a 7-day sales chart. Right: the invoice for a saved sale.",
    },
  },
  {
    slug: 'ppe-safety',
    name: 'Construction Safety System',
    status: 'SOURCE',
    href: 'https://github.com/Ahmed-Islam-AI/PPE-Detection-for-Construction-site-workers',
    summary:
      'Safety monitoring for construction sites: YOLOv8 PPE detection, facial-recognition attendance, and an Arduino/ROS unit that patrols autonomously.',
    stack: ['Python', 'YOLO', 'OpenCV', 'Flask', 'SQLite', 'Arduino', 'ROS'],
    /**
     * Supplied by Ahmed 2026-08-30
     * (`src/assets/projects/autonomous-works-safety-system.png`), cropped and
     * re-encoded. His call, recorded so nobody "fixes" it back out.
     *
     * NOT model output — a generated poster. The crop was chosen to drop its
     * worst parts: the overlaid "AI-Powered Construction Safety System" title
     * at the top and, at the bottom, a logo strip whose Arduino mark reads
     * "AMENIO". What remains is the construction scene and a "PPE DETECTED"
     * overlay that no model produced.
     *
     * **A genuinely real alternative exists and is one line away.** The repo's
     * own `Results/` folder holds true YOLOv8 inference frames — a worker with
     * the model's boxes and confidences on him (`person`, `helmet_on 0.76`,
     * `vest 0.92`) — plus real F1/PR/precision/recall curves and a confusion
     * matrix. Point `src` at one of those and this card carries evidence rather
     * than an illustration.
     */
    image: {
      src: '/project-images/ppe-safety.webp',
      alt: 'Illustration of the construction safety system: a site worker in a hard hat and hi-vis vest with a PPE detection overlay.',
    },
  },
  {
    slug: 'speech-translator',
    // TODO(Ahmed): the name and the repo disagree. This card has read
    // "Multilingual Speech Translator" since 2026-08-15, but the repo's README
    // describes "a real-time audio calling system built using Python and
    // WebSockets" and mentions no translation anywhere. The summary below
    // follows the README, since that is the verifiable source. Confirm which is
    // right — if it does translate, the name is fine and the summary needs the
    // translation step put back.
    name: 'Real-time Audio Streaming',
    status: 'SOURCE',
    href: 'https://github.com/Ahmed-Islam-AI/web-sockets-implementation',
    summary:
      'Two-way audio communication over the web, streaming audio between clients through a WebSocket server.',
    stack: ['Python', 'WebSockets', 'Flask'],
  },
  {
    slug: 'smog-analysis',
    name: 'Smog & Weather Analysis',
    status: 'SOURCE',
    href: 'https://github.com/Ahmed-Islam-AI/Smog-Classification-Web-App',
    summary:
      'Upload an image to classify whether smog is present, or enter a city to pull its current weather conditions.',
    // Inferred from the repo's `saved-model/` directory (a Keras SavedModel) —
    // the README names no libraries. Worth Ahmed confirming.
    stack: ['Python', 'TensorFlow', 'CNNs', 'Flask'],
  },
  {
    slug: 'content-moderation',
    name: 'Content Moderation System',
    status: 'SOURCE',
    href: 'https://github.com/Ahmed-Islam-AI/Itsolera-Internship/tree/main/Content%20Moderation%20Project%201',
    summary:
      'Detects and filters inappropriate content in both text and images — an NLP model for text, a CNN with transfer learning for images.',
    stack: ['Python', 'NLP', 'CNNs', 'Transfer Learning', 'Streamlit'],
    // Quoted from the repo's own README, which states 90% text accuracy, 92%
    // image accuracy, 93% precision, 93% recall and a 92% F1. Not derived.
    metric: '92% image / 90% text accuracy',
  },
  {
    slug: 'phishing-detector',
    name: 'Phishing URL Detector',
    status: 'SOURCE',
    href: 'https://github.com/Ahmed-Islam-AI/Phishing-Url-detection-By-Using-ML',
    summary:
      'Classifies a URL as phishing or legitimate, so a user can be warned before the page loads.',
    stack: ['Python', 'scikit-learn', 'Streamlit'],
  },
  {
    slug: 'ecommerce-scraper',
    name: 'E-commerce Data Scraper',
    status: 'SOURCE',
    href: 'https://github.com/Ahmed-Islam-AI/Web-Scrapper',
    summary:
      'Scrapes product and pricing data from e-commerce and classifieds sites including eBay, Daraz and OLX.',
    stack: ['Python', 'Selenium', 'BeautifulSoup', 'Web scraping'],
  },
]

/**
 * Which three the home section leads with, by slug rather than by array order —
 * so reordering `PROJECTS` can never silently change the picks.
 *
 * The reasoning, so a future edit is a decision rather than a guess: `padelgpt`
 * and `segments` are both shipped features of a live commercial platform, which
 * is the strongest thing on this list, and `flintgrab` is a complete product —
 * a desktop application, a browser extension and a marketing site — and the only
 * non-AI/ML build here, so it is what backs up the web development `services.ts`
 * sells. The rest are one click away on `/projects`.
 *
 * `dukaan` (2026-11-05) adds the third kind of build: an AI product, a desktop
 * app and now a mobile app, instead of two features of the same platform.
 *
 * Three have been rotated out on Ahmed's instruction, and all are still in
 * `PROJECTS` — dropping out of `FEATURED` is not deletion:
 *   - `content-moderation`, 2026-08-30, when `segments` was added. Still the
 *     only project whose README states a measured result, so it keeps its
 *     `metric` on the index page.
 *   - `ppe-safety`, 2026-09-20, when `flintgrab` took its slot. Still the
 *     largest single build here (YOLOv8 + facial recognition + an Arduino/ROS
 *     unit).
 *   - `segments`, 2026-11-05, when `dukaan` took its slot. It and `padelgpt`
 *     are both Padelos features, so the home section had shown one product twice.
 */
export const FEATURED: readonly string[] = ['padelgpt', 'dukaan', 'flintgrab']

/** The three featured projects, in FEATURED order. */
export const FEATURED_PROJECTS: Project[] = FEATURED.map(
  (slug) => PROJECTS.find((project) => project.slug === slug)!,
)

export const LIVE_COUNT = PROJECTS.filter((p) => p.status === 'LIVE').length
export const SOURCE_COUNT = PROJECTS.filter((p) => p.href.includes('github.com')).length

export const GITHUB_PROFILE = 'https://github.com/Ahmed-Islam-AI'

export const isRepo = (href: string) => new URL(href).host === 'github.com'

/** What a card's link opens, for its aria-label. One place, so a new status
 *  can't leave three cards announcing the wrong destination. */
export const destinationOf = (project: Project) =>
  project.status === 'LIVE'
    ? 'live site'
    : project.status === 'APK'
      ? 'download page'
      : 'source repository'

/**
 * The destination, printed in a card or row footer.
 *
 * For a repo this is the **repo name alone**. It used to print host + owner +
 * repo, but `github.com/Ahmed-Islam-AI/` is the identical first 24 characters on
 * six of the seven entries, so `truncate` ate the only part that said anything.
 * The GitHub mark beside the label already carries which host it is.
 *
 * A live site keeps its host, which is the useful thing there.
 */
export function urlLabel(href: string) {
  const url = new URL(href)
  if (url.host === 'github.com') {
    return decodeURIComponent(url.pathname.split('/').filter(Boolean)[1] ?? url.host)
  }
  return url.host.replace(/^www\./, '') + url.pathname.replace(/\/$/, '')
}

/**
 * A `FEATURED` slug matching nothing would render as a blank panel with no
 * error — invisible until someone looked at the page. Fail loudly at boot in dev
 * instead. Same pattern, same reasoning, as the invariant check at the bottom of
 * `data/testimonials.ts`.
 */
if (import.meta.env.DEV) {
  for (const slug of FEATURED) {
    if (!PROJECTS.some((project) => project.slug === slug)) {
      throw new Error(
        `FEATURED names "${slug}", which is not a slug in PROJECTS. ` +
          'Featured slugs must match a real project.',
      )
    }
  }
}

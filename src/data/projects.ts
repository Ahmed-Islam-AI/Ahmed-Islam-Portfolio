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
      src: '/projects/padelgpt.webp',
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
      src: '/projects/segments.webp',
      alt: 'The Padelos segment builder resolving the prompt "All the players with 0 bookings in the previous 30 days" into a filtered player list.',
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
      src: '/projects/ppe-safety.webp',
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
 * is the strongest thing on this list, and `ppe-safety` is the largest build
 * (YOLOv8 + facial recognition + an Arduino/ROS unit). The rest are one click
 * away on `/projects`.
 *
 * `content-moderation` was here until 2026-08-30 and was dropped on Ahmed's
 * instruction when `segments` was added — it is still the only project whose
 * README states a measured result, so it keeps its `metric` on the index page.
 */
export const FEATURED: readonly string[] = ['padelgpt', 'segments', 'ppe-safety']

/** The three featured projects, in FEATURED order. */
export const FEATURED_PROJECTS: Project[] = FEATURED.map(
  (slug) => PROJECTS.find((project) => project.slug === slug)!,
)

export const LIVE_COUNT = PROJECTS.filter((p) => p.status === 'LIVE').length
export const SOURCE_COUNT = PROJECTS.filter((p) => p.href.includes('github.com')).length

export const GITHUB_PROFILE = 'https://github.com/Ahmed-Islam-AI'

export const isRepo = (href: string) => new URL(href).host === 'github.com'

/**
 * The destination, printed in a card or row footer.
 *
 * For a repo this is the **repo name alone**. It used to print host + owner +
 * repo, but `github.com/Ahmed-Islam-AI/` is the identical first 24 characters on
 * six of the seven entries, so `truncate` ate the only part that said anything.
 * The GitHub mark beside the label already carries which host it is.
 *
 * The one live site keeps its host, which is the useful thing there.
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

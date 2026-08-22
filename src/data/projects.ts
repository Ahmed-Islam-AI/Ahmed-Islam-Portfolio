export interface Project {
  slug: string
  name: string
  status: string
  accentColor: string
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
 * There is deliberately NO imagery. The seven `public/projects/*.webp` files
 * this gallery used to render were AI-generated posters with hallucinated text
 * baked into the pixels — "BeautifulSooup", "AFKBSIO", "INPISODFRAITE CONTENT
 * DKTBSCTED" — in blue, green, violet, cyan and magenta, i.e. the loudest
 * colour on a page whose first style rule is that orange is the only accent.
 * Wrapped in fake browser chrome they asserted "this is the real product" over
 * something that was not. Removed 2026-08-21; see CLAUDE.md. Don't reintroduce
 * generated imagery here — a real screenshot of a real screen, or nothing.
 *
 * `accentColor` survives the image removal because it still tints the giant
 * background word, which is what makes the horizontal travel read as movement
 * through something. All seven sit in the warm range so the change is legible
 * without breaking STYLE.md's single-accent rule, and they alternate so two
 * adjacent cards never share a tone.
 */
export const PROJECTS: Project[] = [
  {
    slug: 'padelgpt',
    name: 'PadelGPT',
    status: 'LIVE',
    accentColor: '#f15629', // brand orange
    href: 'https://www.padelos.co/',
    // The one entry with no public README — drawn from the Padelos role in
    // `Work.tsx`, which is CV-derived, so it stays inside what the CV says.
    summary:
      'Platform assistant for the Padelos SaaS. Answers in natural language and calls platform tools to act on club data, not just describe it.',
    stack: ['Python', 'LangGraph', 'LangChain', 'MCP', 'FAISS', 'Redis'],
  },
  {
    slug: 'ppe-safety',
    name: 'Construction Safety System',
    status: 'SOURCE',
    accentColor: '#e8a33d', // amber
    href: 'https://github.com/Ahmed-Islam-AI/PPE-Detection-for-Construction-site-workers',
    summary:
      'Safety monitoring for construction sites: YOLOv8 PPE detection, facial-recognition attendance, and an Arduino/ROS unit that patrols autonomously.',
    stack: ['Python', 'YOLO', 'OpenCV', 'Flask', 'SQLite', 'Arduino', 'ROS'],
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
    accentColor: '#c7401a', // brand-deep
    href: 'https://github.com/Ahmed-Islam-AI/web-sockets-implementation',
    summary:
      'Two-way audio communication over the web, streaming audio between clients through a WebSocket server.',
    stack: ['Python', 'WebSockets', 'Flask'],
  },
  {
    slug: 'smog-analysis',
    name: 'Smog & Weather Analysis',
    status: 'SOURCE',
    accentColor: '#d9762e', // tangerine
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
    accentColor: '#8c3a2a', // clay
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
    accentColor: '#ff6b3d', // brand-bright
    href: 'https://github.com/Ahmed-Islam-AI/Phishing-Url-detection-By-Using-ML',
    summary:
      'Classifies a URL as phishing or legitimate, so a user can be warned before the page loads.',
    stack: ['Python', 'scikit-learn', 'Streamlit'],
  },
  {
    slug: 'ecommerce-scraper',
    name: 'E-commerce Data Scraper',
    status: 'SOURCE',
    accentColor: '#b5652b', // ochre
    href: 'https://github.com/Ahmed-Islam-AI/Web-Scrapper',
    summary:
      'Scrapes product and pricing data from e-commerce and classifieds sites including eBay, Daraz and OLX.',
    stack: ['Python', 'Selenium', 'BeautifulSoup', 'Web scraping'],
  },
]

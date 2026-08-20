export interface Project {
  slug: string
  name: string
  status: string
  accentColor: string
  image: string
  /**
   * Absolute URL, opened in a new tab. Every project has exactly one — in the
   * source Ahmed supplied, six of the seven had an identical `link` and `github`
   * value and PadelGPT had only a live site, so a second field would have been
   * the same string twice.
   */
  href: string
}

/**
 * REAL — supplied by Ahmed 2026-08-15 from his previous portfolio, replacing the
 * four CV-derived placeholders that shipped here first (Padelos MCP Server,
 * Multimodal RAG Tutor and BraTS Tumour Segmentation are no longer in the
 * gallery; they had no link and no real screenshot, and beside seven linked
 * cards they read as broken. All three are still in the CV, which is
 * downloadable from this same page).
 *
 * `href` values are verbatim. `status` is the one derived field and stays
 * factual: `LIVE` for the deployed product, `SOURCE` for the public repos —
 * nothing here claims a metric or a client.
 *
 * Images are in `public/projects/*.webp`, re-encoded from Ahmed's originals at
 * 1280x800 (the card renders 640px wide, so that is retina). Originals are kept
 * outside the build in `assets-original/project-images/`. See the note in
 * CLAUDE.md about how they were cropped — it is not a plain centre crop.
 *
 * `accentColor` drives the monogram plate and the giant background word, which
 * re-tints as the deck scrolls. All seven sit in the warm range so the change is
 * legible without breaking STYLE.md's single-accent rule, and they alternate so
 * two adjacent cards never share a tone.
 */
export const PROJECTS: Project[] = [
  {
    slug: 'padelgpt',
    name: 'PadelGPT',
    status: 'LIVE',
    accentColor: '#f15629', // brand orange
    image: '/projects/padelgpt.webp',
    href: 'https://www.padelos.co/',
  },
  {
    slug: 'ppe-safety',
    name: 'Construction Safety System',
    status: 'SOURCE',
    accentColor: '#e8a33d', // amber
    image: '/projects/ppe-safety.webp',
    href: 'https://github.com/Ahmed-Islam-AI/PPE-Detection-for-Construction-site-workers',
  },
  {
    slug: 'speech-translator',
    name: 'Multilingual Speech Translator',
    status: 'SOURCE',
    accentColor: '#c7401a', // brand-deep
    image: '/projects/speech-translator.webp',
    href: 'https://github.com/Ahmed-Islam-AI/web-sockets-implementation',
  },
  {
    slug: 'smog-analysis',
    name: 'Smog & Weather Analysis',
    status: 'SOURCE',
    accentColor: '#d9762e', // tangerine
    image: '/projects/smog-analysis.webp',
    href: 'https://github.com/Ahmed-Islam-AI/Smog-Classification-Web-App',
  },
  {
    slug: 'content-moderation',
    name: 'Content Moderation System',
    status: 'SOURCE',
    accentColor: '#8c3a2a', // clay
    image: '/projects/content-moderation.webp',
    href: 'https://github.com/Ahmed-Islam-AI/Itsolera-Internship/tree/main/Content%20Moderation%20Project%201',
  },
  {
    slug: 'phishing-detector',
    name: 'Phishing URL Detector',
    status: 'SOURCE',
    accentColor: '#ff6b3d', // brand-bright
    image: '/projects/phishing-detector.webp',
    href: 'https://github.com/Ahmed-Islam-AI/Phishing-Url-detection-By-Using-ML',
  },
  {
    slug: 'ecommerce-scraper',
    name: 'E-commerce Data Scraper',
    status: 'SOURCE',
    accentColor: '#b5652b', // ochre
    image: '/projects/ecommerce-scraper.webp',
    href: 'https://github.com/Ahmed-Islam-AI/Web-Scrapper',
  },
]

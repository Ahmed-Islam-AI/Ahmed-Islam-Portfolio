import type { ReactNode } from 'react'

/** A drawn diagram for a project with no image: no text, numbers or UI chrome, one accent,
 *  stroke-led on the 160x100 viewBox, abstracting the real build (HISTORY.md › Projects). */

const S = { stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

const MARKS: Record<string, ReactNode> = {
  // Agent at the centre calling platform tools. Two satellites filled = a tool
  // actually invoked, which is the thing that distinguishes this from a chatbot.
  padelgpt: (
    <g {...S} fill="none">
      <path d="M80 50 36 28M80 50 36 72M80 50l44-22M80 50l44 22" opacity="0.4" />
      <circle cx="80" cy="50" r="13" />
      <circle cx="80" cy="50" r="4.5" fill="currentColor" stroke="none" />
      <circle cx="36" cy="28" r="7" fill="currentColor" stroke="none" />
      <circle cx="124" cy="72" r="7" fill="currentColor" stroke="none" />
      <circle cx="36" cy="72" r="7" />
      <circle cx="124" cy="28" r="7" />
    </g>
  ),

  // Detection boxes nesting around a figure — what the model actually emits.
  // Only a fallback: ppe-safety ships an image.
  'ppe-safety': (
    <g {...S} fill="none">
      <rect x="54" y="16" width="52" height="72" rx="4" />
      <rect x="66" y="24" width="28" height="20" rx="3" opacity="0.65" />
      <rect x="60" y="50" width="40" height="26" rx="3" opacity="0.65" />
      <path d="M22 16v10M22 16h10M138 16v10M138 16h-10M22 88V78M22 88h10M138 88V78M138 88h-10" />
    </g>
  ),

  // Two endpoints, audio travelling between them.
  'speech-translator': (
    <g {...S} fill="none">
      <circle cx="20" cy="50" r="8" />
      <circle cx="140" cy="50" r="8" />
      <g strokeWidth="3.4">
        <path d="M40 44v12M52 36v28M64 28v44M76 40v20M88 30v40M100 38v24M112 34v32M124 44v12" />
      </g>
    </g>
  ),

  // Haze stratifying over a horizon, thickening downward — and the sun going.
  'smog-analysis': (
    <g {...S} fill="none">
      <circle cx="112" cy="30" r="13" opacity="0.5" />
      <g strokeWidth="3.4" strokeLinecap="round">
        <path d="M26 44h44M84 44h50" opacity="0.3" />
        <path d="M20 56h56M90 56h50" opacity="0.5" />
        <path d="M20 68h120" opacity="0.72" />
        <path d="M20 80h120" />
      </g>
    </g>
  ),

  // A field of content with two items pulled out — the moderation decision.
  'content-moderation': (
    <g {...S} fill="none">
      {/* 3x26 cells + 2x10 gaps = 98 wide, so x starts at 31 to centre on the 160 viewBox;
          2x26 + 10 = 62 tall, so y starts at 19. Recompute both if the cell count changes. */}
      <rect x="31" y="19" width="26" height="26" rx="4" opacity="0.45" />
      <rect x="67" y="19" width="26" height="26" rx="4" opacity="0.45" />
      <rect x="103" y="19" width="26" height="26" rx="4" />
      <path d="M108 24l16 16M124 24l-16 16" />
      <rect x="31" y="55" width="26" height="26" rx="4" opacity="0.45" />
      <rect x="67" y="55" width="26" height="26" rx="4" />
      <path d="M72 60l16 16M88 60l-16 16" />
      <rect x="103" y="55" width="26" height="26" rx="4" opacity="0.45" />
    </g>
  ),

  // One URL in, a binary verdict out: safe, or not.
  'phishing-detector': (
    <g {...S} fill="none">
      <path d="M16 50h50" />
      <circle cx="70" cy="50" r="5" fill="currentColor" stroke="none" />
      <path d="M76 50c14 0 12-22 26-22h12M76 50c14 0 12 22 26 22h12" opacity="0.6" />
      <circle cx="126" cy="28" r="8" />
      <path d="M122 28l3 3 6-6" />
      <circle cx="126" cy="72" r="8" fill="currentColor" stroke="none" opacity="0.9" />
      <path d="M123 69l6 6M129 69l-6 6" stroke="var(--color-ink-raised)" />
    </g>
  ),

  // Structured rows lifted off a page into a dataset.
  'ecommerce-scraper': (
    <g {...S} fill="none">
      <rect x="18" y="20" width="50" height="60" rx="5" />
      <path d="M28 34h30M28 44h30M28 54h20" opacity="0.6" />
      <path d="M74 34h10M74 50h10M74 66h10" opacity="0.45" />
      <path d="M80 30l6 4-6 4M80 46l6 4-6 4M80 62l6 4-6 4" opacity="0.45" />
      <rect x="92" y="26" width="50" height="14" rx="4" fill="currentColor" stroke="none" opacity="0.85" />
      <rect x="92" y="43" width="50" height="14" rx="4" />
      <rect x="92" y="60" width="50" height="14" rx="4" />
    </g>
  ),
}

/** Anything unmapped: nested frames, the same idea as TechIcon's cube fallback. */
const FALLBACK: ReactNode = (
  <g {...S} fill="none">
    <rect x="34" y="20" width="92" height="60" rx="6" />
    <rect x="48" y="32" width="64" height="36" rx="4" opacity="0.5" />
  </g>
)

export default function ProjectMark({ slug, className = '' }: { slug: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 160 100"
      aria-hidden
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
      className={className}
    >
      {MARKS[slug] ?? FALLBACK}
    </svg>
  )
}

import { useEffect, useRef } from 'react'
import TechIcon from './TechIcon'

/** Brand marks only — the concept glyphs repeat too much to read well in a band. */
const MARQUEE_ITEMS = [
  'LangChain',
  'LangGraph',
  'MCP',
  'Anthropic Claude',
  'Google Gemini',
  'LLaMA',
  'Mistral',
  'Ollama',
  'Hugging Face',
  'TensorFlow',
  'PyTorch',
  'scikit-learn',
  'YOLO',
  'FastAPI',
  'Flask',
  'n8n',
  'pandas',
  'Docker',
  'Kubernetes',
  'Git',
  'Bitbucket Pipelines',
  'OpenTelemetry',
  'Redis',
  'PostgreSQL',
  'MySQL',
  'SQLite',
  'MongoDB',
  'Python',
  'JavaScript',
  'C++',
  'Streamlit',
  'Gradio',
]

const BASE_SPEED = 42 // px/sec at rest
const MAX_BOOST = 7 // ceiling so a flick can't turn it into a blur
const DECAY = 2.6 // how fast the boost eases back to 1

/**
 * Infinite icon band. Position is driven by requestAnimationFrame rather than a
 * CSS animation: scroll speed feeds a boost multiplier, and changing a CSS
 * `animation-duration` mid-flight makes the track visibly jump, whereas
 * integrating position by hand stays smooth.
 */
export default function Marquee({ direction = 1 }: { direction?: 1 | -1 }) {
  const track = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = track.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let offset = 0
    let boost = 1
    let lastScrollY = window.scrollY
    let lastFrame = performance.now()
    let frame = 0

    const onScroll = () => {
      const delta = Math.abs(window.scrollY - lastScrollY)
      lastScrollY = window.scrollY
      boost = Math.min(MAX_BOOST, boost + delta * 0.05)
    }

    const tick = (now: number) => {
      const dt = Math.min((now - lastFrame) / 1000, 0.05) // clamp tab-switch jumps
      lastFrame = now

      boost += (1 - boost) * Math.min(1, dt * DECAY)
      offset -= BASE_SPEED * boost * dt * direction

      // The track holds the list twice, so resetting by half its width is seamless.
      const half = el.scrollWidth / 2
      if (half > 0) {
        if (offset <= -half) offset += half
        else if (offset >= 0) offset -= half
      }

      el.style.transform = `translate3d(${offset}px, 0, 0)`
      frame = requestAnimationFrame(tick)
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    // Run only while the band is on screen. This loop used to start on mount and
    // never stop, so both marquees kept animating off-screen icons for the entire
    // life of the page — competing for frames with whichever pinned section you
    // were actually scrolling through. `lastFrame` is re-stamped on resume so the
    // clamped `dt` doesn't have to absorb the whole gap.
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!frame) {
          lastFrame = performance.now()
          frame = requestAnimationFrame(tick)
        }
      } else if (frame) {
        cancelAnimationFrame(frame)
        frame = 0
      }
    })
    io.observe(el)

    return () => {
      window.removeEventListener('scroll', onScroll)
      io.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [direction])

  return (
    <div
      aria-hidden
      // right fade starts at 88% so the band is already transparent where the
      // fixed SocialRail sits, instead of sliding under it
      className="relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_88%,transparent)]"
    >
      <div ref={track} className="flex w-max shrink-0 gap-3 will-change-transform">
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((name, i) => (
          <span
            key={`${name}-${i}`}
            className="grid size-12 shrink-0 place-items-center rounded-full bg-white text-heading/75 shadow-[0_8px_20px_-16px_rgb(20_19_18/0.5)] ring-1 ring-hairline"
          >
            <TechIcon name={name} className="size-5" />
          </span>
        ))}
      </div>
    </div>
  )
}

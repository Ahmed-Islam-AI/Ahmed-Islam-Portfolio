import { useState } from 'react'
import TechIcon from './TechIcon'
import Marquee from './Marquee'

/** Grouped as his CV groups them, extended 2026-08-12 with 13 technologies from
 *  Ahmed's own stack list that the CV omits. PostgreSQL is listed under both
 *  "Memory & Vector Stores" and "Databases" on the CV — kept once, under
 *  Databases, so the cloud has no duplicate pill.
 *
 *  Deliberately NOT added from that list: JSON, YAML, Markdown, VS Code and
 *  Anaconda. They are file formats and tooling, not skills someone hires an AI
 *  engineer for, and a stack cloud containing "Markdown" reads junior. Ahmed's
 *  call, 2026-08-12 — ask before putting them back.
 *
 *  `Front-end` is new and is the group that changes what the site claims: the CV
 *  had JavaScript but no front-end framework, which is why Services used to hedge
 *  web work as "the interface on top of the AI". That hedge is now gone. */
const STACK = [
  {
    id: 'llm',
    label: 'LLM & agentic AI',
    items: [
      'LangChain',
      'LangGraph',
      'MCP',
      'RAG',
      'Tool calling',
      'Multi-agent orchestration',
      'Prompt engineering',
      'Generative AI apps',
      'OpenAI',
      'Anthropic Claude',
      'Google Gemini',
      'LLaMA',
      'Mistral',
      'Ollama',
      'Hugging Face',
      'Groq API',
      'Fine-tuning',
    ],
  },
  {
    id: 'ml',
    label: 'ML & deep learning',
    items: [
      'scikit-learn',
      'TensorFlow',
      'PyTorch',
      'Deep Learning',
      'CNNs',
      'U-Net',
      'YOLO',
      'NLP',
      'Computer Vision',
      'Transfer Learning',
    ],
  },
  {
    id: 'backend',
    label: 'Data & backend',
    items: [
      'FastAPI',
      'Flask',
      'FastMCP',
      'ETL / ELT pipelines',
      'n8n',
      'REST APIs',
      'Socket.io',
      'Postman',
      'pandas',
    ],
  },
  {
    id: 'frontend',
    label: 'Front-end',
    // React and Next.js added on Ahmed's instruction, 2026-08-12, alongside the
    // reframe to full-stack. The CV lists neither — it is another of the places
    // where the CV is now the thing that's behind, not the site.
    items: ['React', 'Next.js', 'HTML', 'CSS', 'Tailwind CSS', 'Bootstrap'],
  },
  {
    id: 'cloud',
    label: 'Cloud & DevOps',
    items: [
      'AWS EC2',
      'CloudWatch',
      'Azure App Service',
      'Google Cloud',
      'Docker',
      'Kubernetes',
      'Bitbucket Pipelines',
      'Git',
      'GitHub',
      'Vercel',
      'Netlify',
      'OpenTelemetry',
      'Langfuse',
    ],
  },
  {
    id: 'memory',
    label: 'Memory & vector stores',
    items: ['FAISS', 'ChromaDB', 'Redis'],
  },
  {
    id: 'db',
    label: 'Databases',
    items: ['PostgreSQL', 'MySQL', 'SQLite', 'MongoDB', 'Firebase'],
  },
  {
    id: 'lang',
    label: 'Languages',
    items: ['Python', 'SQL', 'JavaScript', 'C++'],
  },
  {
    id: 'viz',
    label: 'Visualisation',
    items: ['Power BI', 'Streamlit', 'Gradio'],
  },
]

const ALL = STACK.flatMap((group) => group.items.map((name) => ({ name, cat: group.id })))

export default function Stack() {
  /**
   * One category at a time, at every width, and it only changes when the visitor
   * changes it.
   *
   * There used to be a `hovered` state layered over this, so moving the mouse
   * across the tabs swapped the whole field underneath — a preview nobody asked
   * for that made the section feel twitchy. Selection is now click/tap only, so
   * mouse and touch behave identically. Clicking the active tab is a no-op rather
   * than a toggle-off; `Show all` is the one deliberate way to see all 55.
   */
  const [locked, setLocked] = useState<string | null>(STACK[0].id)
  const active = STACK.find((group) => group.id === locked)
  const shown = active ? active.items.length : ALL.length

  return (
    <section id="skills" className="section-y scroll-mt-28 overflow-hidden bg-paper-2">
      <Marquee direction={1} />

      {/* Padding on the outer wrapper, `max-w-6xl` centred inside it. The section
          itself can't take the padding — the marquees above and below are
          full-bleed — but putting it *inside* the max-width box (as this did)
          centres 1152px in the full viewport and then indents another 80px, which
          landed the index gutter 80px right of every other section. */}
      <div className="mt-16 w-full px-4 sm:px-6 lg:px-20">
        <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[6.5rem_1fr] lg:gap-14">
        <p data-reveal className="text-eyebrow flex gap-2 text-muted/70 uppercase lg:pt-4">
          <span className="text-brand">04</span>
          <span aria-hidden>/</span>
          <span>Skills</span>
        </p>

        <div className="min-w-0">
          <h2 data-reveal className="type-hero text-display leading-[0.92] uppercase">
            <span className="block text-heading">The full</span>
            <span className="block text-heading/25">
              stack<span className="text-brand">.</span>
            </span>
          </h2>

          <p data-reveal className="text-lead mt-9 max-w-[56ch] text-muted [--reveal-delay:120ms]">
            Agents and LLM systems at the centre, with the ETL pipelines, databases and cloud
            plumbing that keep them running in production.
          </p>

          {/* ── Category rail ─────────────────────────────────────
              One horizontal scrolling row below lg, wrapping from lg. The bleed
              (`-mx-4 px-4`) lets it scroll edge to edge instead of stopping at the
              section padding, which is what makes it read as scrollable. Same
              pattern as the Work company rail. */}
          <ul
            data-reveal
            className="mt-10 flex gap-2 overflow-x-auto [--reveal-delay:180ms] max-lg:-mx-4 max-lg:px-4 max-lg:pb-1 sm:max-lg:-mx-6 sm:max-lg:px-6 lg:flex-wrap lg:overflow-visible"
          >
            {STACK.map((group) => {
              const isActive = locked === group.id
              return (
                <li key={group.id} className="shrink-0 lg:shrink">
                  <button
                    type="button"
                    onClick={() => setLocked(group.id)}
                    aria-pressed={isActive}
                    className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-[0.75rem] font-semibold tracking-[0.1em] whitespace-nowrap uppercase ring-1 transition duration-200 ${
                      isActive
                        ? 'bg-ink text-white ring-ink'
                        : 'bg-white text-heading ring-hairline hover:ring-brand/50'
                    }`}
                  >
                    {group.label}
                    <span
                      className={`tabular-nums ${isActive ? 'text-brand-bright' : 'text-muted/60'}`}
                    >
                      {group.items.length}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>

          {/* ── Readout ───────────────────────────────────────── */}
          <p
            data-reveal
            className="text-eyebrow mt-6 flex flex-wrap items-center gap-3 text-muted/70 uppercase [--reveal-delay:220ms]"
          >
            <span className="tabular-nums">
              <span className="text-brand">{String(shown).padStart(2, '0')}</span> / {ALL.length}{' '}
              tools
            </span>
            {active && <span className="text-heading/60">{active.label}</span>}
            {locked && (
              <button
                type="button"
                onClick={() => setLocked(null)}
                className="text-eyebrow rounded-full px-2.5 py-1 text-brand uppercase ring-1 ring-brand/30 transition-colors hover:bg-brand hover:text-white"
              >
                Show all
              </button>
            )}
          </p>

          {/* ── The field ─────────────────────────────────────── */}
          <ul data-reveal className="mt-8 flex flex-wrap gap-2.5 [--reveal-delay:260ms]">
            {ALL.map((skill) => {
              const on = !locked || skill.cat === locked
              return (
                // Filtered-out pills are removed at every width now, not dimmed.
                // STYLE.md's dim-out treatment is still the rule for *small* filter
                // sets; here it left 40+ ghost pills around the four you'd asked
                // for, which buried the selection in its own noise.
                <li
                  key={`${skill.cat}-${skill.name}`}
                  className={`flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium ring-1 transition duration-300 ${
                    on
                      ? 'bg-white text-heading ring-hairline shadow-[0_10px_26px_-20px_rgb(20_19_18/0.55)]'
                      : 'hidden'
                  }`}
                >
                  <TechIcon name={skill.name} className="size-4 shrink-0 text-brand" />
                  {skill.name}
                </li>
              )
            })}
          </ul>
        </div>
        </div>
      </div>

      {/* second band runs the other way, so the two don't read as one belt */}
      <div className="mt-16">
        <Marquee direction={-1} />
      </div>
    </section>
  )
}

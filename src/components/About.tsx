/** Typographic watermark instead of the reference's tech-logo collage — his own
 *  stack set huge and near-invisible. Same effect, no brand assets needed. */
const WATERMARK = [
  { text: 'LangGraph', pos: 'top-[3%] left-[-1%] -rotate-6 text-[6rem] lg:text-[9rem]' },
  { text: 'RAG', pos: 'top-[16%] right-[4%] rotate-12 text-[7rem] lg:text-[11rem]' },
  { text: 'MCP', pos: 'top-[38%] left-[6%] rotate-3 text-[6rem] lg:text-[10rem]' },
  { text: 'FastAPI', pos: 'top-[54%] right-[-2%] -rotate-8 text-[5rem] lg:text-[8rem]' },
  { text: 'React', pos: 'bottom-[8%] left-[-2%] rotate-6 text-[5rem] lg:text-[8rem]' },
  { text: 'Full Stack', pos: 'bottom-[42%] right-[25%] -rotate-3 text-[5rem] lg:text-[8rem]' },
  { text: 'Next.js', pos: 'top-[72%] left-[50%] rotate-[-10deg] text-[4rem] lg:text-[7rem]' },
]

export default function About() {
  return (
    <section
      id="about"
      className="section-y relative isolate scroll-mt-28 overflow-hidden bg-paper-2 px-4 sm:px-6 lg:px-20"
    >
      {/* watermark */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 select-none">
        {WATERMARK.map((mark) => (
          <span
            key={mark.text}
            className={`type-hero absolute whitespace-nowrap text-heading/[0.028] ${mark.pos}`}
          >
            {mark.text}
          </span>
        ))}
      </div>

      {/* Rotated marginal note, lifted from the second reference. vertical-rl
          rather than rotate-90 so the layout box is tall-and-narrow and `right`
          actually positions it; right-24 at 2xl keeps it clear of SocialRail. */}
      <span
        aria-hidden
        className="text-eyebrow absolute top-1/2 right-14 hidden -translate-y-1/2 text-muted/45 uppercase [writing-mode:vertical-rl] xl:block 2xl:right-24"
      >
        Production-first, always
      </span>

      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[6.5rem_1fr] lg:gap-14">
        {/* index gutter */}
        <p data-reveal className="text-eyebrow flex gap-2 text-muted/70 uppercase lg:pt-4">
          <span className="text-brand">02</span>
          <span aria-hidden>/</span>
          <span>About</span>
        </p>

        <div>
          {/* two-tone stacked display heading */}
          <h2 data-reveal className="type-hero text-display leading-[0.92] uppercase">
            <span className="block text-heading">More than</span>
            <span className="block text-heading/25">
              algorithms<span className="text-brand">.</span>
            </span>
          </h2>

          <p
            data-reveal
            className="text-lead mt-10 max-w-[54ch] text-muted [--reveal-delay:120ms]"
          >
            Hi, I&rsquo;m <strong className="font-semibold text-heading">Ahmed Islam</strong>, a
            Full-Stack AI Engineer with a passion for building efficient, scalable, and intelligent
            systems. With 2+ years of experience in the field, I work across the whole build — the
            model, the API behind it, and the interface people actually use.
          </p>

          {/* the thesis of his copy, pulled out so the section isn't three
              identical blocks of grey text */}
          <blockquote
            data-reveal
            className="mt-9 max-w-[50ch] border-l-2 border-brand pl-6 [--reveal-delay:180ms]"
          >
            <p className="text-lead text-heading">
              I believe that AI is about more than just complex algorithms, it&rsquo;s about
              solving tangible problems and creating intuitive, data-driven experiences for users.
            </p>
          </blockquote>

          <p
            data-reveal
            className="text-body mt-9 max-w-[60ch] text-muted [--reveal-delay:240ms]"
          >
            Whether I&rsquo;m working on an NLP model, a data extraction pipeline, a generative AI
            application or a React front end, I bring my commitment to engineering excellence and
            user-centered solutions to every project. I look forward to the opportunity to bring my
            skills and passion to your next challenge.
          </p>

          <div
            data-reveal
            className="mt-10 flex flex-wrap items-center gap-3 [--reveal-delay:300ms]"
          >
            <a
              href="#contact"
              className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-b from-brand-bright to-brand-deep px-6 py-3.5 text-[0.75rem] font-semibold tracking-[0.14em] text-white uppercase shadow-lg shadow-brand/25 transition hover:brightness-110"
            >
              Let&rsquo;s work together
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>

            <a
              href="/Ahmed-Islam-CV.pdf"
              download="Ahmed-Islam-CV.pdf"
              className="group inline-flex items-center gap-2.5 rounded-full border border-heading/20 px-6 py-3.5 text-[0.75rem] font-semibold tracking-[0.14em] text-heading uppercase transition hover:border-brand hover:text-brand"
            >
              Download CV
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4 transition-transform group-hover:translate-y-0.5"
                aria-hidden
              >
                <path d="M12 4v11M7.5 11l4.5 4.5 4.5-4.5M5 20h14" />
              </svg>
            </a>
          </div>

        </div>
      </div>
    </section>
  )
}

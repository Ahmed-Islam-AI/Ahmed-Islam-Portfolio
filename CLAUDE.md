# Ahmed Islam — Portfolio

Personal portfolio for Ahmed Islam, a **Full-Stack AI Engineer** (Islamabad, PK).
Single-page marketing site with room to grow into project detail pages.

**The site sells two things, not one** (repositioned 2026-08-12 on Ahmed's
instruction): AI/agentic engineering *and* web development on its own terms. The
role line reads "Full-Stack AI Engineer" in the hero pill, About, the footer and
`<title>`; `data/services.ts` carries a `web` offer with no AI in it; and React
and Next.js are named in the stack, the hero chips and the About watermark. If you
are tempted to narrow any of that back to "AI Engineer", don't — it was a
deliberate widening, not drift.

**Read [STYLE.md](STYLE.md) before touching anything visual.** It is the design
contract: tokens, type scale, spacing, and the rules that keep this site from
drifting into generic-template territory.

---

## Stack

| Concern | Choice | Notes |
| --- | --- | --- |
| Build | **Vite 8** | `npm run dev`, `npm run build`, `npm run preview` |
| UI | **React 19** + **TypeScript 7** | single `tsconfig.json`, `noEmit`, strict |
| Styling | **Tailwind CSS 4** | CSS-first. **No `tailwind.config.js`** — tokens live in `@theme` in `src/index.css` |
| Routing | **react-router 7** | `BrowserRouter`; only `/` exists so far |
| Icons | **simple-icons** | brand marks only; concepts are hand-drawn (see below) |
| Forms | **Formspree** (planned) | plain `fetch`, no SDK |

Deliberately **not** installed: ESLint/Prettier, an animation library (GSAP,
Framer Motion), an icon component library, a form SDK. Every motion effect here
is IntersectionObserver + CSS or a small rAF loop. Don't add GSAP unless a
section genuinely needs scroll-pinning or a scrubbed timeline — plain reveals
cannot do those, and that is the only thing that would justify the weight.

```
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc --noEmit && vite build
```

---

## Layout of the code

```
src/
  main.tsx              BrowserRouter + Tailwind entry
  App.tsx               route table, mounts SocialRail + useReveal
  index.css             ALL design tokens (@theme), base layer, utilities, motion
  pages/Home.tsx        section order for the landing page
  pages/ProjectsPage.tsx  /projects — the full index, all seven as rows
  hooks/useReveal.ts    scroll-reveal observer, re-runs per route
  hooks/useActiveSection.ts  which section you're in (centre-line observer)
  components/
    Nav.tsx             fixed nav pill + mobile sheet
    Hero.tsx            headline, live-status pill, portrait card, capability chips
    StatsBar.tsx        3 animated count-up stats
    About.tsx           index gutter, two-tone heading, typographic watermark, CV button
    Work.tsx            experience + education switcher with clamped bullets
    Stack.tsx           filterable tech field + two marquees
    Services.tsx        numbered accordion index of what Ahmed sells (DRAFT copy)
    Reviews.tsx         composite pull-quote paragraph + expandable source ledger
    Method.tsx          pinned, scroll-scrubbed 5-step zigzag (DRAFT copy)
    Projects.tsx        featured project + two peers + a door to the full index
    ProjectMark.tsx     drawn schematic per project, where no image is supplied
    Certifications.tsx  pinned scroll-driven card-swap deck on a brand band
    Contact.tsx         two-part enquiry form (services picker + fields)
    Footer.tsx          link columns, email CTA, giant AHMED wordmark
    Marquee.tsx         infinite icon band, scroll-reactive speed
    TechIcon.tsx        name -> SVG path, brand marks + concept glyphs
    SectionRail.tsx     left-gutter progress rail + active section (owns SECTIONS)
    SocialRail.tsx      fixed right-edge social links
  data/projects.ts      Project interface + the 8 real projects (summary/stack DRAFT)
  data/certifications.ts  Certification interface + 11 certifications (6 LinkedIn, 5 CV)
  data/services.ts      Service interface + the 7 service offers (DRAFT copy)
  data/testimonials.ts  Testimonial interface + 5 real LinkedIn recommendations
  data/socials.ts       SOCIALS — shared by SocialRail and Footer
  assets/ahmed.png      hero portrait, transparent cutout
  assets/projects/      Ahmed's supplied card sources — NOT imported, so never
                        bundled; public/projects/*.webp are the processed ones
public/
  Ahmed-Islam-CV.pdf    linked by the Download CV button
  projects/             3 processed card images (see the imagery note below)
  companies/            employer logos (padelos, IR-Solutions, itsolera, bytewise)
```

`assets-original/` is **gone** (deleted 2026-08-30). It held the AI-generated
posters and six CodeBucks template stock images that were never Ahmed's work.
Untracked, so git cannot restore it.

Sections are numbered in the left index gutter and must stay in sync with page
order: `01` hero, `02` about, `03` experience, `04` skills, `05` services,
`06` reviews, `07` method, `08` projects, `09` certifications, `10` contact. The
numeral is hardcoded in each section, so inserting one means renumbering every
section after it *and* `SECTIONS` — Services at 05 pushed method/projects/
certifications to 06/07/08, and Reviews at 06 pushed the same three plus contact
to 07/08/09/10.

---

## Content rules

**The CV is the source of truth for anything factual.**
`public/Ahmed-Islam-CV.pdf` drives the Work/education entries, the skill
groupings in `Stack.tsx`, and the About copy. If the CV changes, update those.

Two places now hold more than the CV does, both on Ahmed's explicit instruction
(2026-08-12), and both are noted where they live: `Stack.tsx` carries 15
technologies the CV omits (13, plus **React and Next.js** added with the
full-stack reframe), and `certifications.ts` carries six certifications the CV
never lists. **The CV is now the thing that's behind**, not the site — that
inverts the rule above for those two files only, so don't "correct" them back.

The same instruction confirmed Ahmed has **shipped real client websites**. That is
why `services.ts` sells web development outright rather than hedging. But **none of
that work is in `data/projects.ts`** — the eight projects there are all AI/ML —
so the Services section is still the only place the
site makes the claim, and it deliberately names no client, no site and no number.
Adding a web project to the gallery is the thing that would let the copy get more
specific.

`data/projects.ts` is **real**, not a seed: eight projects with verbatim URLs.
Seven were supplied 2026-08-15; `segments` was added 2026-08-30 and its copy is
read off the product screen Ahmed supplied rather than invented — but its
`stack` is the one unverified field on it and carries a `TODO(Ahmed)`.
Three CV-derived placeholders were dropped when it was populated (Padelos MCP
Server, Multimodal RAG Tutor, BraTS Tumour Segmentation with its real 0.71 Dice)
— they had no link, and beside the linked cards they read as broken. They are
still in the CV, which is downloadable from the same page. `status` is the one
derived field and stays factual: `LIVE` for the deployed product, `SOURCE` for
the public repos. **Don't invent a metric or a client for a card.**

`summary` and `stack` were added 2026-08-21 and are **DRAFT** — read off each
repo's own README and file tree, not written by Ahmed. The single `metric` is
quoted from the `content-moderation` README. The seven poster images the gallery
used to render are **gone**; see the Projects section below for why, and treat
"a real capture or nothing" as the rule there.

**Never invent biography.** Job titles, dates, employers, degrees, grades and
metrics are Ahmed's professional record. If a value isn't in the CV or hasn't
been given, use an obvious placeholder and say so — do not fill the gap with
something plausible.

**`data/testimonials.ts` is real and quoted verbatim.** Five LinkedIn
recommendations, supplied by Ahmed 2026-08-12, replacing the invented placeholders
the section shipped with. Rules that follow from that:

- **Don't edit the prose.** Not the grammar, not Murtaza's `❤`. STYLE.md's no-emoji
  rule governs the site's own iconography, not what a real person wrote. (It renders
  as the monochrome text glyph, so it doesn't add a second colour either.)
- **`pull` must stay a verbatim contiguous substring of `quote`.** The composite
  shows `pull` and the ledger shows `quote`; a `pull` that isn't literally inside
  its `quote` is a testimonial this site made up. A `import.meta.env.DEV` loop at
  the bottom of the file throws on boot if that ever stops being true.
- **Only Arham describes hiring Ahmed.** The other four are classmates, an FYP
  partner and colleagues. That is why the lead copy says "recommendations" and the
  `relation` field is on every row — calling five LinkedIn endorsements "client
  reviews" would be the invented-credentials problem wearing real names. The
  `relation` values are *read from* each quote, not supplied, so they're the one
  thing in the file worth having Ahmed confirm.
- Dropped from the source data on purpose: `rating` (five identical five-star rows
  carry no information — the same reasoning that replaced the reference design's
  colour-coded dots with counts) and `avatar` (the files live in the old site, and
  five portraits would be a new shape on this page).

Two known content tensions, left as Ahmed's call, not to be silently "fixed":

- The stats bar says **2+ years**; the CV summary says *"a year of production
  experience"*. The 2+ counts from the 2024 Bytewise fellowship.
- **50+ satisfied clients / 70+ projects completed** are not in the CV, which
  lists 4 roles and 4 projects. The CV is downloadable from the same page.

Section headings must not overlap in meaning. `03` is **"Where I've been."** — it
was "Selected work." until projects became "Things I've shipped.", at which point
two headings both claimed the same territory. `03` is the employment + education
timeline; `08` is the project gallery. Reviews is **"In their words."** rather than
"What they said." for the same reason — Services at `05` is already "What I
deliver." and two adjacent `What…` headings read as one section split in half.

Reading the PDF: `Read` with `pages:` fails on this machine (no poppler).
Extract text with a dependency-free Node script — inflate the `stream`/`endstream`
payloads with `zlib`, then pull strings out of the `Tj`/`TJ` text operators.
Link annotations do not survive this, so hyperlink targets are not recoverable.

**Still placeholders** (need Ahmed's real values):

- `data/socials.ts` — Facebook, Instagram, LinkedIn, Upwork URLs. WhatsApp and
  the hero mail button are real (from the CV). Shared by `SocialRail` and the
  footer, so fixing them once fixes both.
- The footer has no Privacy Policy / Terms links, unlike the reference it's modelled
  on: those pages don't exist, and a dead link is worse than no link.
- **`Contact.tsx` has no form endpoint.** `FORMSPREE_ID` is an empty string, and
  until it's filled in the form does not POST — it hands off to the mail client
  with every field prefilled, so the section works today instead of swallowing
  enquiries. Deliberately not guessed: a made-up Formspree ID would POST into a
  stranger's inbox. The `BUDGETS` ranges are form options, not a price list.
- Every nav anchor now resolves — `#services` and `#contact` were the last two
  dangling ones.
- `data/certifications.ts` — **11 entries from two sources that don't overlap.**
  Entries 1-6 came from Ahmed's LinkedIn (real dates, a link); entries 7-11 are the
  CV's, and **`date` is still the literal string `ADD DATE` on all five** (the CV
  has no dates and they are not guessable — it shows in the pill on purpose) with
  no `href`, so those five render as plain cards. Nothing was dropped in the merge
  because both lists are real; **the CV PDF still lists only the five, so it and
  the site now disagree** — Ahmed's to reconcile.
  The six `href`s all point at the same LinkedIn *certifications list*, not at
  per-credential pages, which is why the card affordance reads `View →` and not
  `Verify →`, and why no badge claims `VERIFIED`. Swap in real Credly/Coursera
  URLs per entry and the wording still holds.
- `data/testimonials.ts` — the quotes are real, but the `relation` line on each row
  is inferred from the quote text. Worth Ahmed confirming; see the content rule above.
- The nav has no Experience or Method link even though both ids exist, and lists
  Skills before Experience, so nav order and page order disagree. Reviews *is* in
  the nav; measured at 1024px the seventh link still leaves 16px between the logo
  and the link row, and the pill does not overflow.
- ~~`/work/:slug` stub route~~ — **deleted 2026-08-30** with the Projects rebuild.
  `/projects` is the second route now; project cards stay external `<a>`s.
- No **web** project is in `data/projects.ts`. The seven there are all AI/ML work,
  so the client websites Services sells still have nothing behind them in the
  gallery. That's the one content gap left (see the content rules above).

---

## Icons

`TechIcon.tsx` maps a technology name to a single SVG path.

- **Brand marks** come from `simple-icons` via named imports (tree-shakes; a
  bare `import * as` would add megabytes).
- **Concept glyphs** are hand-drawn in `CONCEPT` for two reasons: some entries
  are ideas with no logo (RAG, tool calling, CNNs, U-Net, NLP, computer vision,
  ETL, REST APIs, fine-tuning), and simple-icons v16 **dropped OpenAI, AWS, Azure,
  Power BI and Groq** for trademark reasons. Google Cloud *is* still in the set, so
  it gets its real mark while AWS and Azure fall back to `CONCEPT.cloud` in the same
  group. Check whether a slug still exists before assuming it does — and note the
  renames: it's `siCss`, not `siCss3`.
- Concept glyph subpaths must all **wind the same way**. `CONCEPT.sliders` (three
  tracks with knobs) draws its circles with sweep flag `1` to match the rects'
  clockwise winding; opposite winding would cancel the overlaps into holes under
  the default nonzero fill rule.
- Concept glyphs are closed silhouettes with **no interior holes**, so they need
  no `fill-rule` and sit beside brand paths without looking like a second set.
- Icons render in brand orange, **never** in their real brand colours — see the
  single-accent rule in STYLE.md.

Adding a technology: add the string to the right group in `Stack.tsx`, then add a
`TechIcon` entry. Unmapped names silently fall back to the `cube` glyph.

**One exception: a `Project.stack` entry needs only the `TechIcon` entry**, not a
place in `Stack.tsx` — that file is Ahmed's curated skill set, and Arduino, ROS
and BeautifulSoup are facts about a project rather than skills he sells. See the
Projects section for the full reasoning.

---

## Motion and interaction

Three effects carry the site. All three are gated on
`prefers-reduced-motion` and all three degrade to plain static content.

### 1. Infinite scroll that feels intentional, not gimmicky

`Marquee.tsx` — two icon bands above and below the tech field, running in
opposite directions so they don't read as one conveyor belt.

Position is integrated by hand in a `requestAnimationFrame` loop rather than a
CSS animation. **This is deliberate:** scroll speed feeds a `boost` multiplier,
and mutating a CSS `animation-duration` mid-flight makes the track visibly jump,
because the browser rescales the animation's current time. Integrating position
per frame stays smooth.

What keeps it from being a gimmick:
- Base drift is slow (42 px/s) — texture, not motion for its own sake.
- Boost is capped (`MAX_BOOST`) so a hard flick can't smear it into a blur.
- Boost eases back to 1 (`DECAY`), so it responds and then settles.
- `dt` is clamped so a backgrounded tab doesn't teleport the track on return.
- An **IntersectionObserver starts and stops the loop.** It used to start on
  mount and never stop, so both bands animated off-screen icons for the life of
  the page. `lastFrame` is re-stamped on resume, so the clamped `dt` doesn't have
  to absorb the whole off-screen gap.
- Edge mask fades both ends; the right fade starts at 88% so the band is already
  transparent where `SocialRail` sits.

The track renders the list **twice** and resets by half its scroll width, which
is what makes the loop seamless. Keep that invariant if you change the items.

### 2. Section-based animation that guides you forward

Two halves: content that assembles as you arrive, and a persistent signal telling
you where you are and how much is left.

**The guidance layer** — `SectionRail.tsx` + `hooks/useActiveSection.ts`.

A fixed rail in the left `lg:px-20` gutter (the mirror of `SocialRail` on the
right, which is why neither sits on content). It shows `01–07`, marks the section
you're in with a longer accent tick, reveals its label on hover, links to each
section, and fills a vertical progress spine as you move down the page.

**The fill and the active tick must come from one progress model.** Both key off
the *horizontal centre line of the viewport* — the same reference
`useActiveSection` uses. `index` is which section the centre line is in; `within`
is how far through that section it has travelled; the fill is
`(index + within) / (SECTIONS.length - 1)`. Tick centres sit at exactly
`i / (n - 1)` of the spine (equal heights, equal gaps), so that fraction lands the
fill's bottom edge on the active tick.

- The fill used to be raw `scrollY / scrollHeight`, a model completely unrelated
  to the observer. With two 220–520vh pinned runways on the page they diverge
  badly: measured mid-Method, the active tick was `05` while the fill had only
  reached `03`. **Don't reintroduce a page-scroll fraction here** — the page's
  scroll height is dominated by runways that occupy one viewport of screen each,
  so it is not proportional to reading position.
- `within` is capped at **0.9**, not 1. At a full 1.0 the fill lands on the *next*
  tick one frame before the observer flips `active` to it, which showed as a
  1-step overshoot at section boundaries. Verified 0 drift at 13 scroll positions.

**Both rails take one `surface` prop (`RailSurface`), not a boolean.** `Home.tsx`
derives it from the active section and hands the same value to both, so they can
never disagree about the band they're over. There are **three** cases, not two:

- `light` — ink SocialRail circles, brand accents.
- `dark` — Method, Projects and Contact. White circles; brand still reads on ink.
- `brand` — Certifications. White circles, but every orange signal has to become
  **ink**: the surface here *is* the accent, so `text-brand` on the active tick
  and `hover:bg-brand` on a social circle both dissolve into the background. This
  was a real bug — `07` was invisible and social hovers vanished.

Adding another full-bleed band means picking one of these three, not adding a
fourth boolean.

`useActiveSection` sets `rootMargin: '-50% 0px -50% 0px'`, collapsing the
observer root to a **zero-height line across the middle of the viewport** so
exactly one section can intersect at a time. Without that, two tall adjacent
sections are both "visible" and the active state flickers between them.

The hook is called once in `Home.tsx` and its result passed to both the rail and
the nav, so the two can never disagree. `SECTIONS` in `SectionRail.tsx` is the
single list of ids — keep it in sync with page order and the index gutters.

**The reveal layer** — `hooks/useReveal.ts` + the `[data-reveal]` rules in
`index.css`.

One IntersectionObserver, mounted once in `App.tsx`, re-running on route change.
Any element with `data-reveal` starts 1.5rem low and transparent, then eases up
as it enters view. Elements are unobserved once revealed — it fires once, it
does not replay on scroll-up, which is what would make it feel gimmicky.

Order within a section is expressed with `[--reveal-delay:NNNms]` on individual
elements, stepping roughly 60–80ms apart, so a section assembles top-to-bottom
and the eye is pulled down the page rather than everything popping at once.

`data-reveal="left"` / `data-reveal="right"` slide a column in from the side it
occupies, so a two-column section assembles toward the centre instead of
everything rising in unison. The variants are declared *after* the base rule
(equal specificity, source order decides); `[data-reveal][data-revealed]` uses two
attributes so it still overrides both.

`rootMargin: '0px 0px -10% 0px'` means content reveals slightly *before* it
reaches the bottom edge, so it's already settled by the time you look at it.

Under reduced motion the hidden state is never applied at all, so content is
simply visible — it does not depend on JS to appear.

There is a **resize sweep** safeguard: an element inside a `display: none`
ancestor never generates an intersection entry, so if a breakpoint change later
reveals its container it would sit at `opacity: 0` forever. The sweep reveals
anything still unrevealed that is now actually on screen. Sections here swap
layouts at `lg`, which is exactly how that trap arises.

Note that `[data-reveal]` elements sitting in the bottom 10% of the viewport are
*correctly* still hidden — that's `rootMargin: '0px 0px -10% 0px'` doing its job,
not a stuck reveal. Account for it when auditing.

**Pinned scrubbing** — `Method.tsx`.

A tall `lg:h-[280vh]` runway with a `lg:sticky lg:top-20` child. Progress drives
an SVG zigzag and pops each step card in as the line reaches it.

**Progress is `(STICK - rect.top) / (rect.height - panel.offsetHeight)`, clamped
to 0–1.** Two elements, no `window.innerHeight` term anywhere. That is the point:

- It was `-rect.top / (rect.height - innerHeight)`, which starts 80px late (the
  panel pins at `top-20`, not at the viewport top) and, on a phone, divides by a
  number that changes every time the address bar slides. Reported as "on mobile
  something is happening" — the ramp lurched mid-scroll.
- With only element geometry in it, the 220vh phone track and the 280vh desktop
  track produce the *same* 0→1 ramp. Verified: 21 scroll positions at 1440x900,
  390x844 and 768x1024 all step 0.000 → 1.000 linearly.
- `STICK` is 80 and **must match `top-20` on the panel**. Deriving it from
  `innerHeight - panel.offsetHeight` looks cleaner and is wrong: when the mobile
  address bar hides, that expression grows but the sticky top is still 80.

**The line and the dot are written from one value, in one frame.** This is the
fix for the dot visibly trailing the line:

- The line used to be declarative (`strokeDashoffset={1 - progress}`) while the
  dot's position came from a `useEffect` keyed on the same `progress`. So the
  line painted in commit N and the dot caught up in commit N+1 — structurally one
  frame behind, every frame, and the gap widened with scroll speed. Both are now
  `style` writes inside the rAF loop.
- **`pathLength={1}` is gone.** It made the dash unit-free, but `getPointAtLength`
  works on the geometric length, so the two only agreed if the browser happened to
  normalise `getTotalLength()` the same way. One measured `len` now feeds both.
  The path is in viewBox units, so its length never changes with the viewport —
  measure once.
- **Neither element takes a `style` prop.** React re-applies `style` on every
  render, so a prop there would clobber the rAF writes each time state ticked.
- Measured after the fix: dot centre to drawn line tip is **≤0.02px** at every
  sampled position, at all three widths.

**Only `stage` goes through React**, a copy of progress quantised to 2%. It
drives the step cards, tool chips and closing pill, which are pass/fail gates at
least 2% apart — so ~50 re-renders across the whole runway instead of one per
frame (and the old code did *two* per scroll event, not one).

`position: sticky` gives the pin for free and the scrub is ~15 lines, which is
why this section still doesn't justify GSAP. Details that matter:

- **Never put `overflow-hidden` on an ancestor of the sticky element.** A clipped
  ancestor becomes the sticky element's scroll container, and since that container
  doesn't scroll, sticky silently stops working — the content renders at the top of
  the runway, far off-screen, with no error. Clip the sticky element itself instead;
  that's fine. This cost real debugging time once already.
- It's full-bleed `bg-ink`, one of the page's three full-bleed bands, so **both
  gutter rails restyle over it** via `surface` in `Home.tsx` (see the rails note
  below). Without that an ink SocialRail circle sits invisible on an ink
  background. The nav pill also carries `ring-white/10` for the same reason.
- The curve is built by `NODES.reduce`, putting both cubic control points on each
  segment's horizontal midpoint. That forces a horizontal tangent at every node,
  which is what makes it read as one continuous wave rather than five arcs glued
  together. `vectorEffect="non-scaling-stroke"` keeps the stroke even despite
  `preserveAspectRatio="none"`.
- `LEFT` percentages must stay in sync with `NODES[i].x / 1000`, or the cards
  drift off their nodes. The last node stops at 855 (85.5%) so the final card
  keeps ~20px clear of `SocialRail` at 1024px.
- **Both paths end at the last node.** The underlay used to run on to `1000,150`
  so the route read as "continuing" — but once progress hit 1 that tail was left
  dangling past the final card with nothing to reach, which read as a bug.
- The closing pill appears at `progress >= 0.92`, with the last tool chip. At 0.98
  it was on screen for only the final 2% of the runway — 36px of scrolling — which
  reads as permanently hidden. It is **progress-gated, not a `data-reveal`
  element**; don't go looking for a broken observer.
- **The travelling dot is an HTML element, not an SVG `<circle>`.**
  `preserveAspectRatio="none"` stretches the viewBox, so a circle renders as an
  ellipse — mild at desktop width, an obvious oval at 390px. It's positioned with
  percentages of the same viewBox, so it stays on the curve without inheriting
  the scale.
- **The dot is always rendered.** It used to be gated on
  `progress > 0.01 && progress < 0.995`, so it vanished at both ends while the
  line stayed drawn — which read as the two coming apart at exactly the moment
  the eye was checking them. At p=0 it parks on the first node, at p=1 the last.
- **The pinned panel is `h-[calc(100svh-5rem)]`, not `100vh`.** On a phone
  `100vh` is the *large* viewport — the height with the address bar hidden — so
  the panel was taller than the visible area whenever the bar was showing, and
  the closing pill sat below a fold that cannot be scrolled while pinned. `svh`
  always fits. Progress doesn't care either way; it measures this element.
  Verified at 390x844: panel spans 80→844, pill clears the fold by 40px.
- `TOOLS[].at` thresholds sit just past each phase, so tools cascade in one by one
  behind the line. `max-lg:` overrides force them all visible where there's no scrub.

- A second, static path underneath in `white/12` shows **the route ahead** —
  that's what makes it read as guidance rather than a reveal.
- The travelling dot uses `getPointAtLength`, which works in **viewBox units**, so
  it stays aligned however the SVG scales. A CSS `offset-path` would not: it
  resolves against the element's containing block, not the viewBox.
- Step cards are a fixed `h-18` — wrapping details otherwise gave them ragged
  heights. Path nodes sit at y=80/160 to clear the 72px cards.
- **The pinned card must fit the viewport.** While pinned the page isn't scrolling
  the card, so anything below the fold is unreachable. It measures ~712px at
  `top-20`; if you add content here, re-check that.
- `#method` opts out of scroll-snap (see below).
- Under reduced motion the runway collapses — the height class is applied
  conditionally, not via a `lg:` variant. It used to be a static `lg:h-[280vh]`,
  which meant reduced-motion visitors scrolled 280vh past a card frozen at
  progress 1.
- **The pin runs at every width**, not just `lg`. It used to swap to a plain
  vertical `<ol>` timeline below `lg`, which changed the content rather than
  adapting it. Below `lg` each card shrinks to the phase word alone (`Scope`,
  `Design`, …) — five 224px cards cannot sit side by side on a phone, and 56px is
  what the node spacing allows. Measured at 390px: cards land at 31–87, 99–155,
  167–223, 235–291, 294–350, so they never overlap or leave the viewport.
- The `max-lg:` overrides that used to force the tool chips and the closing pill
  permanently visible are gone — with the scrub running at every width they
  contradicted it.

Its copy is **one of two DRAFT sections not derived from the CV** (Services is the
other) — the five phases are inferred from what the CV says Ahmed does. It's marked
DRAFT in the file. Reviews is also not CV-derived, but its content is real supplied
testimonials rather than positioning copy.

**Projects** — `Projects.tsx` + `pages/ProjectsPage.tsx`.

**Rebuilt 2026-08-30. This is no longer a scroll effect at all** — it was the
page's third pinned band and is now an ordinary `section-y` section.

What it was: a `PACE * 7` = **5.95 viewport-height** runway (at the 7 projects it then had) with a `sticky top-0`
panel, vertical progress driving a `translate` on a horizontal card row, plus a
drifting `SHIPPED` word tinted per project. What it delivered: seven identical
`ink-raised` rectangles at identical size, so the one live SaaS product read
exactly like a BeautifulSoup scraper. Six screens of scroll-jacking to present
what was structurally a flat list — and it sat between Method (~2.8vh) and
Certifications (~5.4vh), closing the page on ~14 viewport heights of back-to-back
pinned bands. Reported as "not looking professional", and the effect was not the
problem; the undifferentiated payload was.

**Measured after the rebuild: 5355px → 1282px at 1440x900 (5.95 → 1.42 viewport
heights).**

Deleted with it, and none of it should come back without a reason better than "it
looked dynamic": the rAF loop and its IntersectionObserver gate, `focusCard`
(which only existed because a transformed row can't be scrolled into view by the
browser), `PACE`, `REPEAT`, `WORD_DRIFT`, the `active` index, and the separate
reduced-motion branch — `[data-reveal]` is already gated on
`prefers-reduced-motion` in `index.css`, so one render path now covers both.

The `lg:short:` steps went too. `short` exists to defend a *pinned* panel's fold
budget; with nothing pinned there is no unreachable fold.

**What the home section is now: three projects, one door.**

- A **featured panel** (asymmetric, ~40/60 from `lg`, stacks below) and two peer
  cards, then a gradient-pill CTA to `/projects`. `FEATURED` in `data/projects.ts`
  picks the three **by slug, not by array order**, so reordering `PROJECTS` can't
  silently change them. A slug that resolves to nothing throws in dev — same
  `import.meta.env.DEV` guard pattern as `data/testimonials.ts`. Currently
  `padelgpt`, `segments`, `ppe-safety`; `content-moderation` was dropped from it
  on Ahmed's instruction when `segments` was added 2026-08-30.
- **The featured panel's anchor is its visual; the name sits beside it at
  `text-h2`.** This flipped once, deliberately. While no project had imagery the
  anchor was the name at `text-display` — the right call for a card with nothing
  to look at. Once every card gained a visual, a display-scale name *beside* one
  gave the panel two things competing to be seen first, and measured at 1440 it
  stranded ~150px of dead space in the copy column. `lg:items-center` now
  balances the shorter copy against the taller visual. **If a project ever has no
  visual at all, bring the display-scale name back** — the objection was
  competition, not the name.
- An oversized ghosted numeral was drafted as the anchor and rejected: every
  giant-faded-text precedent here (About's watermark, the footer's `AHMED.`, the
  old `SHIPPED`) is *section-scale background*, never in-card, so it would have
  been a new pattern claiming to be an existing one.
- **There is no background watermark.** A single-line `SHIPPED` was tried and
  measured at both widths: at `top-1/2` it lands in the gap between the panel and
  the cards, where brand-on-ink at 0.045 is a maroon smudge — plainly visible on
  a phone, neither legible enough to be a word nor faint enough to be ground.
  Cut. Texture here has to be designed against the new layout, not inherited.
- **`min-w-0` on the peer-card grid items AND on the card root.** Load-bearing,
  and the same trap as the Work grid column: grid items default to
  `min-width: auto`, so the longest repo path
  (`PPE-Detection-for-Construction-site-workers`) pushed each card to 379.5px
  inside a 358px track and put the page 6px past a 390px viewport. `truncate` on
  the path does not help — min-content width propagates up before it applies.
- **One exit, not three.** `All repositories →` used to sit top-right beside the
  count pill; it now closes `/projects`. Users satisfice, so a top-right link
  straight to raw GitHub siphoned clicks before the visitor had seen a single
  project. The count pill stays (derived, so it can't drift).
- The section keeps `bg-ink` and index `08`, so `SECTIONS`, the numbering and
  `Home.tsx`'s `surface` derivation are all untouched. It takes normal `section-y`
  padding now — the "pinned bands take no section padding" rule stopped applying
  the moment the runway came out.

**`/projects` — `pages/ProjectsPage.tsx`, the full index.**

All eight as **full-width hairline-separated rows**, not a card grid. Two reasons,
both hard: `lg:grid-cols-3` of eight cards is the single most recognisable
AI-generated layout there is, and reusing the home card would make the two
surfaces read as the same page twice. A list is also the form that scales — at
eight a three-across grid already leaves an orphan row.

- No index numeral in its eyebrow. `0N /` is the home page's section counter and
  `08` has nothing to count against on a standalone route.
- `useReveal` already re-runs per route in `App.tsx`, so reveals work for free.
  One `window.scrollTo(0, 0)` on mount, because react-router keeps scroll
  position across routes.
- `bg-ink` to match section 08 — Projects is an ink surface everywhere.

**A second route breaks bare hash links, so Nav and Footer are route-aware.**
Every internal link on this site is a bare `#about`; on `/projects` the browser
resolves that to `/projects#about` and the click does nothing. Both now derive a
`to(hash)` helper from `useLocation` that prefixes a `/` when off the home route.
Hero, About, Reviews and SectionRail also use bare hashes but only ever render on
`/`, so they were left alone — **if any of them ever renders on another route,
they need the same fix.**

**`BrowserRouter` + a second route needs a host rewrite**, or a hard load of
`/projects` 404s. Host is unknown, so all three ship and each is inert where it
doesn't apply: `vercel.json`, `public/_redirects` (Netlify), and
`public/404.html` + a four-line decoder in `index.html` (GitHub Pages, which
can't do rewrites). Verified against `npm run preview`: `/projects` returns 200.

**Project cards are external links.** Every card is an `<a target="_blank">` at a
live site or a public GitHub repo — six repos, two features of one deployed product.

- `urlLabel(project.href)` prints the **repo name alone** for a GitHub link, and
  the host for the one live site. It used to print host + owner + repo inside
  fake browser chrome, but `github.com/Ahmed-Islam-AI/` is the identical first
  24 characters on six of the eight cards, so `truncate` ate the only part that
  carried information. The GitHub mark beside the label says which host it is.
  It lives in `data/projects.ts` with `isRepo`, since both surfaces need them.
- `Project` has one `href`, not `link` + `github`. In the source Ahmed supplied,
  six of the original seven had the identical string in both fields and PadelGPT had only a
  live site — a second field would have been the same URL twice.

**Imagery: three supplied images, five drawn marks (2026-08-30).**

Every card carries a visual. `Visual` in `Projects.tsx` picks: `project.image` if
set, otherwise a `ProjectMark`. Both the home cards and the index rows use it, so
setting `image` upgrades a project everywhere at once.

**What is actually in the three images — this matters, and it is Ahmed's call,
not drift.** He supplied all three on 2026-08-30 in `src/assets/projects/` and
asked for them by name after being shown what two of them were. Recorded here so
nobody "corrects" them back out:

| Card | File | What it really is |
| --- | --- | --- |
| `segments` | `segments.webp` | **A real capture** of the running Padelos segment builder |
| `padelgpt` | `padelgpt.webp` | A designed **mockup** — fake browser chrome, empty chat pane |
| `ppe-safety` | `ppe-safety.webp` | A **generated poster** — the "PPE DETECTED" box is not model output |

- `segments.png` as supplied is **AVIF despite the `.png` extension** — check the
  magic bytes, not the name, if you reprocess it. Cropped top-anchored so the
  Segment Name field and the prompt both survive.
- `padelgpt.webp` is the same file this gallery shipped with before 2026-08-21.
- `autonomous-works-safety-system.png` → `ppe-safety.webp` was cropped
  deliberately to drop its worst parts: the overlaid "AI-Powered Construction
  Safety System" title, and a bottom logo strip whose Arduino mark reads
  **"AMENIO"**.
- All three were re-encoded to 880x550 WebP. Originals stay in
  `src/assets/projects/` and are not imported, so they never enter the bundle.

**`ppe-safety` has a genuinely real alternative, one line away.** Its own repo's
`Results/` folder holds true YOLOv8 inference frames — a worker with the model's
boxes and confidences on him (`person`, `helmet_on 0.76`, `vest 0.92`) — plus
real F1/PR/precision/recall curves and a confusion matrix. That is evidence
rather than illustration, and swapping `image.src` to it is a straight upgrade if
Ahmed ever wants it.

**The five drawn marks.** `ProjectMark.tsx` — a flat geometric schematic per
project, single accent, no dependency. **These are diagrams, not pictures, and
that distinction is the entire reason they are permitted.** No text, no numbers,
no chrome, no UI: nothing a viewer could mistake for a screenshot. Same category
as the hand-drawn `CONCEPT` glyphs in `TechIcon.tsx`, at card scale, and each
abstracts something true about the build (a tool-call graph for the agent, a
waveform between two endpoints for the audio streamer, rows lifted off a page for
the scraper). They are placeholders with a defined exit — set `image` and the
mark disappears.

**Why so few real captures.** Every repo was checked on 2026-08-30: none of the
six source projects carries a screenshot anywhere, and several have no UI to
capture at all (`ecommerce-scraper` is two `.py` files and two `.csv`s).
`padelos.co`'s public landing page shows no product UI and never uses the name
"PadelGPT" — its AI features are branded "AI Club Manager" and "AI Concierge" —
so a capture of it would be a marketing page rather than Ahmed's work.

**Five of the eight are runnable web apps** (Flask/Streamlit), so Ahmed can
capture them himself. **That is the highest-value thing left in this section**,
and a real capture of the deployed PadelGPT assistant most of all.

**The rule, unchanged.** The section shipped with seven AI-generated posters until
2026-08-21 and that is why it got flagged: **hallucinated text baked into the
pixels** — "BeautifulSooup" and "OL" for OLX, "TenFolox" for TensorFlow, "NLTX"
for NLTK, "INPISODFRAITE CONTENT DKTBSCTED", "AFKBSIO" — plus a **"97%
Confidence"** figure that appears in no repo, all inside fake browser chrome that
asserts "this is the real product" over something that is not.

**The line is whether a viewer could believe they are looking at the product.**
A real capture is always right. A flat, textless, single-accent diagram is fine —
nobody mistakes an orange line drawing for a screenshot. What earns scrutiny is
the middle, and two cards now sit there by Ahmed's explicit choice. **Don't add a
third without asking him**, and never one carrying invented text or numbers.

`assets-original/` **no longer exists** — deleted 2026-08-30, along with the six
leftover CodeBucks template stock images (`agency-website`, `crypto-screener`,
`devdreaming`, `fashion-studio`, `nft-collection`, `portfolio-cover`) that were
never Ahmed's work. It was untracked, so git cannot restore it.

**What the card shows instead** — index numeral, name, one-line summary, stack
chips, optional metric, repo path:

- The **stack chips reuse the Work switcher's markup verbatim**
  (`Work.tsx`'s stack-tag list), so "a technology" looks identical in both
  sections. Change the chip once, in both places. `StackChips` and `Destination`
  are exported from `Projects.tsx` and shared with `ProjectsPage.tsx`.
- **`Project.stack` entries do NOT have to exist in `Stack.tsx`** — this is a
  deliberate divergence from the icon rule below, and from the invariant
  `services.ts` follows. That invariant exists so Services can't *sell* outside
  Ahmed's declared skills; a project's stack is a fact about the project. Arduino,
  ROS and BeautifulSoup belong on a card and not in the skill cloud, for the same
  "reads junior" reason that kept JSON, YAML and Markdown out of it. They still
  need a `TechIcon` entry or they fall back to the generic cube.
- **`metric` is optional and only where the repo's own README states one.** Today
  that is `content-moderation` alone (90% text / 92% image accuracy, quoted, not
  derived). Don't add one anywhere else without a source — the no-invented-metrics
  rule is unchanged.
- `summary` and `stack` are **DRAFT**, read off each repo's README and file tree
  on 2026-08-21 rather than written by Ahmed. None of the repos has a
  `requirements.txt`, so `smog-analysis`'s TensorFlow entry is inferred from its
  `saved-model/` directory. Both fields are his to confirm.
- **`speech-translator` has an unresolved name conflict.** The card read
  "Multilingual Speech Translator" from 2026-08-15; the repo's README describes
  "a real-time audio calling system built using Python and WebSockets" and
  mentions no translation anywhere. The card now follows the README, since that
  is the verifiable source, and carries a `TODO(Ahmed)`. Don't resolve it by
  guessing.

**Pinned card-swap deck** — `Certifications.tsx`.

The third sticky-runway section. Progress drives a continuous *card index* `t`
rather than a pixel offset, and every card positions itself from `i - t`.

- **`t` is stepped, not linear.** `raw = p * N - 0.5` (the half-slot offset gives
  the first and last card a settle instead of being on top for one instant), then
  within each slot `HOLD` flattens both ends and a smoothstep eases the middle.
  That hold is the whole effect — without it the deck slides continuously and
  never reads as one card being dealt over another. `HOLD = 0` removes it.
- **The deck runs at every width**, like Method and Projects. It used to fall back
  to a plain list of five cards below `lg`, which lost the effect entirely.
- Cards are `absolute inset-0`, so the deck container **must carry its own
  height** — and a uniform one, or the progress underline moves as cards swap.
  It's `h-[19rem] sm:h-[17.5rem] xl:h-[18.5rem]` — taller on the narrowest screens,
  because the card's own text wraps to more lines there. Re-check the fold if you
  add a line of copy.
- `zIndex` is `100 - abs(d) * 10` plus a `d >= 0` bias. The bias breaks the tie
  mid-swap (both cards at `abs(d) = 0.5`) so the incoming card crosses over the
  outgoing one rather than under it.
- **Inactive cards are transparent but still in the layout**, so they're
  `aria-hidden` and `pointer-events-none`, plus `tabIndex={-1}` when a card has an
  `href`. Without that a click lands on an invisible card and keyboard users tab
  into one they can't see. Verified: only the active card is in the a11y tree.
- The background colour is a prop landing on `--cert-bg`, defaulting to
  `--color-brand`. It's the page's only full-bleed brand band — see the rails note
  above for why that needs `surface="brand"`, and STYLE.md for why it's still one
  accent.
- `PACE` (vh of runway per card) is the speed knob; track height is
  `100 * (cards * PACE + 1)` vh. It went **0.6 → 0.4 when the deck grew from 5 cards
  to 11** — at 0.6 the section alone was 7.6 viewport heights, which is a long time
  to spend inside one band. 0.4 puts it at 5.4 and each card still gets a visible
  hold. Re-check this if the count changes again.
- Card heights are fixed (`h-[19rem] sm:h-[17.5rem] xl:h-[18.5rem]`), so a long
  credential name can silently overflow. Verified with all 11: nothing clips at
  1440 or 390, and the longest name is "Python for Data Science, AI & Development".

**Services** — `Services.tsx` + `data/services.ts`.

Not a scroll effect, but it is the page's one accordion, so the reasoning belongs
somewhere:

- **Deliberately not a grid of icon cards.** The card grid is already this page's
  dominant shape (Work, Projects, Certifications all use one), and a three-across
  icon grid is the single most template-looking thing a portfolio can contain — see
  STYLE.md's anti-slop list. It's a numbered index instead, reusing the site's own
  index-gutter language, and the open row inverts to `bg-ink`, which is STYLE.md's
  interactive-state rule applied at full width.
- **Seven offers, not six.** `web` — "Web apps & websites" — was added with the
  full-stack reframe and sits *beside* `web-apps` ("Full-stack AI products")
  rather than replacing it. One is a site or an app; the other is a product with
  a model inside it. A visitor who wants the first should not have to read an
  agent pitch to find it. Both the Contact form's service chips and the footer's
  Services column read from this array, so adding an offer updates all three.
- **One row is always open** (`useState(SERVICES[0].id)`); clicking a row opens it
  rather than toggling, so the section can never collapse to seven blank lines.
- The reveal animates **`grid-template-rows` from `0fr` to `1fr`**, which
  transitions to the content's natural height without measuring it. `height: auto`
  cannot be transitioned, and a fixed max-height would clip the longer rows.
- Copy is **DRAFT**, one of two sections not taken from the CV (Method is the other).
  Nothing in it claims a client or a metric. Every `stack` entry is a name that
  exists in `Stack.tsx`, so the offer stays inside what Ahmed works with — keep
  that invariant when editing, or the chip falls back to the generic cube glyph.

**Reviews** — `Reviews.tsx` + `data/testimonials.ts`.

Also not a scroll effect. The five recommendations are set as **one running
paragraph**, not five cards — the unit of design is the sentence. Picking a run
pulls that voice out of the composite and lights up its source in the ledger below.

**The composite is an index of pull-quotes; the ledger holds the originals.** That
split is the whole reason the section survived real testimonials. The supplied
LinkedIn recommendations run 11 to 141 words, and five of those end to end is an
essay — the first draft assumed ~20-word quotes and only worked because the
placeholder copy was written to fit. Now each `pull` is a verbatim excerpt, so the
paragraph stays ~88 words whatever the sources do, and the full text expands in the
row. **Any future testimonial is handled by choosing its `pull`, not by resizing
anything.**

- **Deliberately not a card set.** Work, Projects and Certifications are all card
  sets already, and STYLE.md asks the next new section to find its own form. This
  one borrows the site's own vocabulary instead: solid-over-ghost two-tone for the
  active/inactive runs, `SectionRail`'s tick for the ledger rows, and the same
  plus-becomes-minus control Services uses, so "this opens" reads identically in
  both places.
- **Hover only ever changes colour; expanding is a click.** Two states, `active`
  and `open`. If hover expanded rows, sweeping the mouse across the composite would
  open and close them underneath it — thrashing the page height and pulling content
  out from under the cursor. Clicking a *run* sets both, so tapping a quote lands
  you on its source with the full text already open; the jump alone would leave you
  staring at a collapsed row.
- Nothing is open by default. The composite is complete on its own, and five
  collapsed rows keep the section at ~1200px instead of ~2600px.
- **Inactive runs are `text-muted`, NOT the `heading/25` ghost.** The ghost tone is
  for display text; at body scale it fails the contrast floor in STYLE.md, and four
  unreadable quotes is not a design. So the whole composite is legible at rest and
  the highlight is pure enhancement — which is also what makes it work on touch,
  where there is no hover at all. Don't "strengthen" the effect by ghosting harder.
- **Each run is an `<a>`, not a `<button>`.** A button is atomic inline-level and
  cannot break across lines, which destroys the running paragraph. An anchor wraps
  normally, is focusable for free, and jumping to its own source is exactly what a
  footnote reference should do when tapped. The `<sup>` marker carries `no-underline`
  so the active run's rule stops at the quote instead of leaving a stray dash.
  The **ledger rows are `<button>`**, since their job is to expand — which is why the
  run→row link only runs one way now. That's the direction that matters: excerpt to
  original.
- The attribution is **always visible** — nothing is hidden behind hover, so the
  section is complete with zero interaction, and only the full prose is behind a
  click. Measured: rows 56px at desktop, 99–119px at 390 where they wrap to three
  lines; the plus buttons clear `SocialRail` by 24px at 1024 and 88px at 1440.
- The composite's runs are `<q>`, so the curly quote marks come from the UA and
  aren't in the data — keep them out of `testimonials.ts` or they double up. The
  expanded panel is a plain `<blockquote>` with no marks, because a marked-up
  400px block of quotation reads as decoration.
- The chip is `sm:ms-auto`, not `ms-auto`. Below `sm` the row wraps to three lines
  and a right-flung chip reads as detached from the row it belongs to.
- Copy is **real** — see the content rules above. The lead says "recommendations",
  not "client reviews", on purpose.

**Contact** — `Contact.tsx`.

One `<form>` split across two columns: the left half is what the project is
(service checkboxes from `data/services.ts`, budget, timeline), the right half is
who you are (name, email, company, message). They stack below `lg`, which is why
the lead copy must never say "on the left / on the right".

- **The service chips are real `<input type="checkbox">`** made `sr-only` with the
  label styled off `peer-checked:`. Don't swap them for `<div onClick>`: this keeps
  keyboard operation, the a11y tree and `FormData` serialisation for free, and the
  checkbox `value` is the service title, so submissions are readable without a
  lookup table.
- The checkbox group is a `fieldset`/`legend`, so it's announced as one named group
  rather than six loose controls.
- **Honeypot** (`_gotcha`) is off-screen, `aria-hidden` and `tabIndex={-1}`; the
  submit handler bails if it's filled. That's the whole spam defence — no captcha.
- **Budget and Timeline are radio chips, NOT dropdowns** — `ChipGroup` at the top
  of the file. They *were* styled native `<select>`s, and that part was right for
  the closed control: `appearance-none` matched it to the inputs beside it exactly.
  The problem is the popup list, which the OS draws — Windows rendered it white
  with a blue highlight regardless of `color-scheme: dark` and regardless of
  styling the `<option>`s. There is no CSS that reliably wins that on every
  browser/OS pair, so the fix was to not open a popup at all.
  A custom `div` listbox would also solve it and was rejected for the usual
  reasons: arrow keys, type-ahead, Escape, click-outside, `aria-activedescendant`,
  and losing the native picker sheet on mobile. Radios cost none of that —
  arrow-key navigation inside a group is free, they serialise into `FormData`
  under `name` exactly as the select did, and the value is still the readable
  string. **Don't put the dropdowns back**; the same OS popup comes back with them.
- **`chipClass` is one string shared by the service checkboxes and both radio
  groups**, so "an option you can pick" looks identical everywhere in the form.
  Change it once.
- Status is announced via `aria-live="polite"`, not just coloured.
- Validation is HTML5 (`required`, `type="email"`); verified an empty form is
  invalid, a filled one valid, and `not-an-email` rejected.

**Footer** — `Footer.tsx`.

**Not a section.** No index number, absent from `SECTIONS`, and rendered outside
`<main>` — the rail tracks content, and a footer isn't content. It keeps
`lg:px-20` anyway, because the two fixed gutter rails don't stop existing there.

- `bg-ink-deep`, not `ink`. Contact directly above it is already `ink`; without the
  step down *and* the `rounded-t-[2.5rem]` edge the two merge into one unbroken
  slab.
- **The `-mt-10 lg:-mt-14` is load-bearing.** `rounded-t` reveals whatever is
  *behind* the footer, and that's the body — `paper` — so the two top corners
  rendered as **white notches**. Pulling the footer up over Contact puts ink behind
  the curve instead. `z-10` keeps it painting on top. Don't remove the negative
  margin without also solving what sits behind those corners.
- `border-t border-white/[0.08]` is what makes the curve legible at all: ink-deep on
  ink is a 7-value step, so without the hairline the rounded edge is invisible and
  the overlap just looks like a flat join.
- **Below `lg` the footer is a 2-column grid, not a stack.** Navigate and Services
  sit side by side; Elsewhere spans both rows underneath as a row of bare icon
  buttons (`aria-label` carries each name, `hidden lg:inline` on the text). Stacked
  full width with names, the three lists ran to roughly three phone screens before
  you reached the wordmark — the Elsewhere column alone was as tall as the other
  two combined. Navigate only splits into two sub-columns from `lg`: at 390px each
  parent column is ~167px, and splitting that again cannot hold "Certifications".
- The bottom bar is **centred while stacked**, then splits left/right from `sm`.
- **`SocialRail` hides over the footer** (`hidden` prop → `invisible opacity-0`,
  which also drops the links out of the tab order). The footer lists all five
  already, and the fixed rail sat directly on that column. Gated on the same
  centre-line `rootMargin` as `useActiveSection`, via an observer on `#site-footer`
  in `Home.tsx`. `SectionRail` deliberately stays — it still reads `09`, which is
  where you were.
- **The giant `AHMED.` is sized from a measurement, not a guess.** "AHMED."
  renders **4.238x its font size** in Archivo at `tracking-[-0.045em]`, so `21.5vw`
  gives ~91vw of width: full-bleed enough to land, narrow enough to clear both
  gutter rails at 1440. It was `27vw` first, which clipped the `A` and the full stop
  clean off the screen. Re-measure with a `Range` over the text node if you change
  the word or the tracking — the element's own `getBoundingClientRect` is useless
  here, it reports the clipped container.
- The fill is a gradient **clipped to the glyphs** (`bg-clip-text`), so the word
  dissolves downward instead of being a flat grey slab. It stops at `white/[0.06]`
  rather than transparent; at 0 the lower half of every letter vanished.
- **The full stop stays solid brand.** Every section heading on this site ends on
  an orange period; this is that gesture at footer scale, and it's the one part
  that must not fade.
- A footer taller than half the viewport broke `useActiveSection`: while the centre
  line sits inside it, *no* section intersects, so on a restored scroll position or
  a deep link near the end nothing ever fired and the rail claimed section `01` at
  the bottom of the document. The hook now seeds `active` from geometry on mount —
  the last section whose top is above the centre line. Verified `09` both after a
  real scroll to the bottom and after reloading while parked there.

### 3. No scroll snapping — removed 2026-08-12

The page used to run `scroll-snap-type: y proximity` on `html` from `lg` up.
**It is gone. Don't reintroduce it.**

Even at `proximity` it read as the page catching on every section edge: you stop
scrolling, the browser re-targets, and the wheel feels like it is fighting you.
The tell was already in the code — three of the ten sections (`#method`,
`#projects`, `#certifications`) had to opt out with `scroll-snap-align: none`,
because snapping wants to land on fixed points while scrubbing wants continuous
freedom and together they stutter. When a third of the page has to opt out of an
effect, the effect does not fit the page.

`scroll-padding-top: 7.5rem` and `scroll-behavior: smooth` on `html` stay. Those
are what anchor links need — a `#section` link lands clear of the fixed nav pill
and glides there — and neither has anything to do with snapping.

**Per-frame scroll work is budgeted.** Four things read scroll position, and each
one is either rAF-coalesced or gated on an IntersectionObserver, because a scroll
event can fire several times per frame:

- `Method`, `Certifications` — rAF loop, started and stopped by an
  IntersectionObserver on the runway. **Projects no longer does any per-frame
  scroll work at all** — its runway was removed 2026-08-30.
- `Marquee` — same IO gate. Both bands used to start their rAF loop on mount and
  never stop, so off-screen icons animated for the life of the page, competing
  for frames with whichever pinned section you were actually scrolling through.
- `SectionRail` — a scroll listener, but coalesced to one measurement per frame
  via a `requestAnimationFrame` flag. It reads a rect (forcing layout) and then
  sets state, so uncoalesced it re-rendered more often than the screen refreshes.

A new scroll-driven effect gets the same treatment. Writing to `style` from the
loop and keeping React out of the hot path is the pattern — see Method below.

---

## Layout invariants that will bite you

These each cost real debugging time. Don't undo them.

- **Every section heading is `text-display`.** Method and Projects were on the
  smaller `text-h2` step, which read as those two sections being less important.
  Both are pinned panels, so the bigger heading has to be paid for out of the
  fold — see the `short` variant below. In Projects that budget is what the
  card's fixed `lg:w-[23rem]` and `max-h-[30rem]` are sized against.
- **`short` is a custom variant** (`@custom-variant short (max-height: 820px)`) in
  `index.css`. The pinned panels are height-constrained, not width-constrained, so
  a `lg:` breakpoint cannot express "a 1280x720 laptop". Anything below the fold in
  a pinned section is unreachable, because the page is not scrolling the panel
  while it is stuck. Method uses `lg:short:` to step the curve, the step cards and
  three margins down together; measured fold margin is 71px at 1440x900, 40px at
  1366x768 and 20px at 1280x720.
  - The curve height and the step-card height are **coupled**: `NODES` sit at
    y=80/160 of a 240 viewBox specifically to clear the cards, so shrinking the
    curve alone puts the line through a card. Change both or neither.
- **One max-width everywhere: `max-w-6xl` (1152px).** Hero and StatsBar used to be
  `max-w-7xl`, so the hero column started 128px wider than every section below it
  and nothing lined up down the left edge. The **nav keeps `max-w-7xl`** on
  purpose — it's a floating pill, not a content column, and narrowing it squeezed
  the links into the logo at 1024px (see Nav.tsx).
- **Padding goes OUTSIDE `max-w-6xl`, never inside it.** `px-4 sm:px-6 lg:px-20`
  on the wrapper, `mx-auto max-w-6xl` on the child. Reversing the order centres
  the max-width box in the *full* viewport and then indents 80px further, which
  lands the index gutter 80px off. All six sections' index gutters now measure the
  same x (144px at 1440); Stack sat at 224 and Projects at 80 before this was
  fixed. Stack can't put the padding on its `<section>` — the marquees are
  full-bleed — so it has an inner padded wrapper instead.
- **Vertical rhythm is one token pair in `index.css`**, not per-section classes:
  `--space-section` (5rem / 7rem at lg) via the `section-y` utility, and
  `--space-nav` (5.5rem / 6.5rem) via `pt-nav` for fixed-nav clearance. Change the
  rhythm there.
  - The two pinned bands (Method, Certifications) carry **no** section padding,
    deliberately. Projects did until its runway was removed 2026-08-30 and it went
    back to normal `section-y`. Their child
    is exactly one viewport tall and pins to it, so outer padding only adds dead
    scroll — and on a full-bleed band it's invisible, so you'd be paying ~224px of
    scrolling per section for nothing. They use `pt-nav` internally instead, which
    is the padding that actually affects what you see.
- **`lg:px-20` on every section — but NOT the nav.** This is the gutter the two
  rails live in; remove it from a section and the fixed rails sit on top of
  content. The nav is excluded on purpose: both rails are vertically centred so
  they never reach it, and reserving the gutter there squeezed the nav links into
  the logo at 1024px.
- **Stack shows exactly one category at a time, at every width.** `locked` starts
  at `STACK[0].id`; filtered-out pills are `hidden`, not dimmed; and clicking the
  active tab is a no-op rather than a toggle-off, so the field is never empty.
  `Show all` is the one deliberate route to all 68.
  - **Five entries from Ahmed's own stack list are deliberately absent**: JSON, YAML,
    Markdown, VS Code and Anaconda. They're file formats and tooling, not things
    anyone hires an AI engineer for, and a stack cloud containing "Markdown" reads
    junior. His call, 2026-08-12 — ask before putting them back.
  - **The `frontend` group is what un-hedged Services.** The CV had JavaScript but no
    front-end, so `web-apps` used to sell "the interface on top of the AI". With
    HTML/CSS/Tailwind/Bootstrap in the stack it now sells the front end outright. If
    that group ever goes, put the hedge back. **React and Next.js** joined it with
    the full-stack reframe, and they are what the `web` service offer and the hero's
    "React & Next.js" chip name — those three move together.
  - **Selection is click/tap only.** A `hovered` state used to layer over `locked`
    so moving the mouse across the tabs swapped the whole field underneath. That
    preview made the section feel twitchy and meant mouse and touch behaved
    differently. All the `onMouseEnter`/`onFocus`/`onBlur` handlers are gone — don't
    reintroduce them.
  - Below `lg` the tab row is one horizontally scrolling rail that **bleeds past the
    section padding** (`max-lg:-mx-4 max-lg:px-4`) so it scrolls edge to edge.
    Without the bleed it stops short and stops reading as scrollable. Eight tabs
    wrapped to four rows otherwise.
- **`min-w-0` on the Work grid column.** Grid items default to
  `min-width: auto`, so the company rail's min-content width propagated up and
  pushed the page 211px past a 390px viewport — and stopped the rail's
  `overflow-x-auto` from ever engaging.
- **`content-start items-start` on the Work stack-tag list.** It's a flex
  container with `min-h-24`; without these, flex's default `align-items: stretch`
  makes every tag a tall box.
- **Work card height is pinned three ways** so switching company doesn't jump:
  the bullet list is a fixed `COLLAPSED_H` (not a max — a max still let 2-bullet
  roles shrink the card), the tag row reserves two rows via `min-h-24`, and the
  Read-more button is always rendered (faded, `aria-hidden`, `tabIndex={-1}`)
  because conditionally rendering it removed 34px on short roles.
- **Nav is `fixed`, not `sticky`.** Sticky sat in flow and consumed the top
  ~88px before the hero background could start, leaving a white strip behind
  the pill.
- **The hero's background layer lives on the hero-zone wrapper in `Home.tsx`**,
  not inside `Hero.tsx`, so one grid+glow spans nav, hero and stats bar.
- **Hero capability chips must not overhang more than ~3%** on the right, or
  they cross into the SocialRail gutter. That applies from `lg`, where they float
  around the portrait. Below `lg` they are **overlaid inside the portrait** over
  its existing bottom scrim; they used to sit in a row under the card, which read
  as a detached list rather than part of the portrait. The
  "Production-first AI / Ahmed Islam" caption that used to sit on the image is
  **gone at every width** — the name is already in the nav, the H1 copy and the
  page title, and on mobile it collided with the chips.
- **About's rotated marginal note uses `writing-mode: vertical-rl`**, not
  `rotate-90`. Rotation leaves a wide layout box, so `right-*` positions the
  pre-rotation box and the text hangs off-screen.

---

## Verifying changes

`npm run build` runs `tsc --noEmit` first, so type errors fail the build.
`noUnusedLocals` is on — orphaned constants break it, which is a feature.

**Anything visual must be checked in a real browser at two widths minimum**
(~1280–1440 desktop and 390 mobile). Measuring beats eyeballing: most bugs in
this codebase's history were layout maths that looked plausible and were wrong.
Useful checks:

```js
// horizontal overflow — should always be false
document.documentElement.scrollWidth > window.innerWidth

// card height stability across the Work switcher — should be identical
document.querySelector('#experience ul').parentElement.getBoundingClientRect().height
```

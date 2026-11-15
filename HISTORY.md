# History

Why the code is the way it is: the decisions, the approaches tried and rejected, and
the bugs that were measured and fixed. Dated changes are in CHANGELOG.md, and the
rules that follow from all this are in CLAUDE.md, which points here as
`(HISTORY.md › <Area>)`.

## Site layout

The layout invariants below each cost real debugging time. Don't undo them.

### Section numbering, and the eyebrows that were removed (2026-10-21)

Sections are numbered only in `SectionRail` (`SECTIONS`), which must stay in sync
with page order: `01` hero, `02` about, `03` experience, `04` skills, `05`
services, `06` reviews, `07` method, `08` projects, `09` certifications, `10`
contact. The `0N / NAME` eyebrow each section used to carry in its own left
gutter column was **removed 2026-10-21** on Ahmed's call (it duplicated the rail
and read as AI-template); content now starts at the `max-w-6xl` edge. Don't
bring it back — see STYLE.md "Section anatomy".

### No breadcrumb trails (2026-11-12)

**No breadcrumb trails, anywhere** (Ahmed, 2026-11-12). Nothing like
`Blog / Data Science / Title` or `Services / RAG & knowledge systems` above
a heading, and no other path-style label strings (`Home › …`, `/ category`).
He removed them from the service pages and then the blog post because they
"look like an AI-generated website". A sub-page gets at most one back pill
(`BackPill`), shown from `sm` up, never on a phone. This holds for every new
page and every new section: don't add a trail "for SEO" or "for context".
Search engines get breadcrumbs from JSON-LD if ever needed, not from the page.

### Every section heading is `text-display`

- **Every section heading is `text-display`.** Method and Projects were on the
  smaller `text-h2` step, which read as those two sections being less important.
  Both are pinned panels, so the bigger heading has to be paid for out of the
  fold — see the `short` variant below. In Projects that budget is what the
  card's fixed `lg:w-[23rem]` and `max-h-[30rem]` are sized against.

### The `short` variant: pinned panels are height-constrained

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

### One max-width everywhere: `max-w-6xl`

- **One max-width everywhere: `max-w-6xl` (1152px).** Hero and StatsBar used to be
  `max-w-7xl`, so the hero column started 128px wider than every section below it
  and nothing lined up down the left edge. The **nav keeps `max-w-7xl`** on
  purpose — it's a floating pill, not a content column, and narrowing it squeezed
  the links into the logo at 1024px (see Nav.tsx).

### Padding goes outside `max-w-6xl`, never inside it

- **Padding goes OUTSIDE `max-w-6xl`, never inside it.** `px-4 sm:px-6 lg:px-20`
  on the wrapper, `mx-auto max-w-6xl` on the child. Reversing the order centres
  the max-width box in the *full* viewport and then indents 80px further, which
  lands the index gutter 80px off. All six sections' index gutters now measure the
  same x (144px at 1440); Stack sat at 224 and Projects at 80 before this was
  fixed. Stack can't put the padding on its `<section>` — the marquees are
  full-bleed — so it has an inner padded wrapper instead. Method's pinned panel
  had the same bug: its content wrapper put the padding inside the max-w
  container, which pushed the column a further 80px in. It now uses the order
  About and Work use: `px-4 sm:px-6 lg:px-20` outside, `max-w-6xl` centred within.

### `lg:px-20` on every section, but not the nav

- **`lg:px-20` on every section — but NOT the nav.** This is the gutter the two
  rails live in; remove it from a section and the fixed rails sit on top of
  content. The nav is excluded on purpose: both rails are vertically centred so
  they never reach it, and reserving the gutter there squeezed the nav links into
  the logo at 1024px.

### Nav is `fixed`, not `sticky`

- **Nav is `fixed`, not `sticky`.** Sticky sat in flow and consumed the top
  ~88px before the hero background could start, leaving a white strip behind
  the pill.

## Nav

### Nav links and page order

- The nav has no Experience or Method link even though both ids exist, and lists
  Skills before Experience, so nav order and page order disagree. Reviews *is* in
  the nav; measured at 1024px the seventh link still leaves 16px between the logo
  and the link row, and the pill does not overflow.

- Every nav anchor now resolves — `#services` and `#contact` were the last two
  dangling ones.

The orange CTA reads "Let's work together" at every width again since the Blog button
went (2026-11-13): measured 40px between the logo and the links at 1024, row inside the
pill at 1024/1100/1280/1440. Why it was "Let's talk" below `xl` for a while is under Blog.

### The header: `fixed`, no gutter, `pointer-events-none`

The header is `fixed`, not `sticky`: it overlays the hero background instead of
sitting above it in flow, which is what left a white strip behind the pill (Site
layout › Nav is `fixed`). There is no `lg:px-20` on the header: both gutter rails
are vertically centred, so the nav never collides with them, and reserving that
gutter squeezed the links into the logo at 1024px. The header is
`pointer-events-none`, with `pointer-events-auto` on the pill and the sheet: the
header is a full-width fixed box, and its empty padding must not catch taps meant
for the page under it (see the mobile menu below).

### The pill's ring, and the CTA in normal flow

`ring-1 ring-white/10` keeps the pill defined over the dark Method band, where an
ink pill on an ink background would have no visible edge. The CTA sits in normal
flow in the right-hand group, so it can no longer overlap the Contact link the way
it did in the mockup.

### A second route breaks bare hash links, so Nav and Footer are route-aware

Every internal link on this site is a bare `#about`; on `/projects` the browser
resolves that to `/projects#about` and the click does nothing. Both now derive a
`to(hash)` helper from `useLocation` that prefixes a `/` when off the home route,
which navigates home and then jumps to the section. On `/` the hash stays bare,
keeping the native smooth scroll that `scroll-behavior` in index.css already
provides.
Hero, About, Reviews and SectionRail also use bare hashes but only ever render on
`/`, so they were left alone — **if any of them ever renders on another route,
they need the same fix.**

### The mobile menu is always mounted (2026-10-24)

- **The mobile menu is always mounted** and hides with `invisible`, so it can
  animate both ways while staying out of the tab order. Escape returns focus to
  the toggle; a pointerdown outside the header closes it. `invisible` takes the
  closed sheet out of the tab order and the a11y tree, not just out of sight, and
  `visibility` is in the transition list so it only flips after the fade-out has
  finished.

### The mobile menu is `absolute`, and the header `pointer-events-none` (2026-11-12)

- **The mobile menu is `absolute` below the pill, with the header
  `pointer-events-none`** (pill and sheet `auto`). Fixed 2026-11-12. In flow,
  the closed sheet's ~400px still made the fixed header 481px tall, and that
  transparent box caught every tap on the top half of a phone screen:
  Experience companies, skill tabs and Show all, Services rows, the blog's
  Contents, FAQs. They only worked once scrolled into the lower half, which
  read as "sometimes works" (measured: `elementFromPoint` returned the header at
  y≈460). Live from 2026-10-24 until found. Measured after:
  header 84px, the open sheet at the identical box (16, 92, 358×389), and a
  15-check tap test with every control at y≈300 passes (it fails 11 of them on
  the old build). **Anything fixed and full-width gets `pointer-events-none`
  on its empty parts.**

### The menu toggle

Three bars fold into an X rather than an icon swap, so the control visibly turns
into its own undo.

### The nav dot's position is measured

- The nav dot's position is **measured** (`offsetLeft` of the
  `[aria-current]` link, re-measured on resize and `document.fonts.ready`). An
  inline `translate` style would override a `-translate-x-1/2` class, so the
  half-width is subtracted in the number instead. Verified within 0.3px.
  It is measured rather than computed from the link index because the links are
  different widths; it is re-measured on resize because the row reflows at `xl`,
  and once the web font lands because the font changes every link's width.
- The active-link marker is one dot that slides between links rather than a
  colour change alone, so "where am I" isn't carried by hue. It springs on the
  same curve (`ease-spring`) as the press feedback (Styles and tokens).

## Rails

### SectionRail: the guidance layer

**The guidance layer** — `SectionRail.tsx` + `hooks/useActiveSection.ts`.

A fixed rail in the left `lg:px-20` gutter (the mirror of `SocialRail` on the
right, which is why neither sits on content). It shows the section numbers (`01–07` when this was written, `01–10` now), marks the section
you're in with a longer accent tick, reveals its label on hover, links to each
section, and fills a vertical progress spine as you move down the page.

### The fill and the active tick come from one progress model

**The fill and the active tick must come from one progress model.** Both key off
the *horizontal centre line of the viewport* — the same reference
`useActiveSection` uses. `index` is which section the centre line is in; `within`
is how far through that section it has travelled; the fill is
`(index + within) / (SECTIONS.length - 1)`. Tick centres sit at exactly
`i / (n - 1)` of the spine (equal heights, equal gaps), so that fraction lands the
fill's bottom edge on the active tick. The fill is therefore always between the
active tick and the next one, and reaches the next tick when `active` flips to it.

- The fill used to be raw `scrollY / scrollHeight`, a model completely unrelated
  to the observer. With two 220–520vh pinned runways on the page (three when this
  was fixed: Projects still had its runway) they diverge
  badly: measured mid-Method, the active tick was `05` while the fill had only
  reached `03`. **Don't reintroduce a page-scroll fraction here** — the page's
  scroll height is dominated by runways that occupy one viewport of screen each,
  so it is not proportional to reading position.
- `within` is capped at **0.9**, not 1. At a full 1.0 the fill lands on the *next*
  tick one frame before the observer flips `active` to it, which showed as a
  1-step overshoot at section boundaries. Verified 0 drift at 13 scroll positions.

### Both rails take one `surface` prop, with three cases

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

`SocialRail` is mounted in `Home.tsx`, not `App.tsx`, because it needs the active
section to invert itself over the dark bands.

### `useActiveSection`: a zero-height line across the middle

`useActiveSection` sets `rootMargin: '-50% 0px -50% 0px'`, collapsing the
observer root to a **zero-height line across the middle of the viewport** so
exactly one section can intersect at a time. Without that, two tall adjacent
sections are both "visible" and the active state flickers between them.

The hook is called once in `Home.tsx` and its result passed to both the rail and
the nav, so the two can never disagree. `SECTIONS` in `SectionRail.tsx` is the
single list of ids — keep it in sync with page order and the index gutters.

### Why the rail shows five social links

`SocialRail` shows from `lg` up. Every section reserves a symmetric `lg:px-20`
gutter so the rail sits in empty margin rather than on top of content; that
gutter is what makes it safe at 1024px, not a wide-screen-only gate. It renders
`RAIL_SOCIALS`, not the full `SOCIALS` list: the rail is a quiet signpost, not a
directory. The five are the ones a visitor might act on: message him, check his
professional profile, read his code, hire him, or follow him. Everything else is
one scroll away in the footer. GitHub was added to the rail 2026-08-30 on Ahmed's
instruction: for an engineer it is arguably the profile that matters most, and at
five the rail still measures comfortably clear. Six is where this needs
re-measuring, not assuming.

The rail/footer split and the 1024x600 measurement that caps the rail at five
(460px tall at nine, overlapping the nav by 16px) are under Content and data ›
Socials. Why `SocialRail` hides over the footer, and how a tall footer broke
`useActiveSection`, are under Footer.

## Reveal and motion

### Three effects

Three effects carry the site. All three are gated on
`prefers-reduced-motion` and all three degrade to plain static content.

They were numbered in the old CLAUDE.md: 1, the marquee, is now under Stack and marquee; 2 is split between Rails (the guidance layer) and this section (the reveal layer); 3, no scroll snapping, is below. Method, Certifications and the old Projects runway each have their own area.

### The reveal layer

Two halves: content that assembles as you arrive, and a persistent signal telling
you where you are and how much is left.

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

It is IntersectionObserver + CSS transitions rather than an animation library, on
purpose. Swap in GSAP/ScrollTrigger only if a section needs pinning or
scrub-linked timelines, which plain reveals can't do.

### Headings rise line by line

Section headings rise line by line out of a mask, solid line first, then the
ghost (`:is(h1, h2)[data-reveal] > .block` in `index.css`). The heading itself
stops moving; each `.block` line does. Page H1s built the same way
(ProjectsPage, ServicePage) get it too; a heading without `.block` lines keeps the
plain reveal. Translate and the clip's bottom inset run on the same curve, so the
mask edge stays put while the text slides up through it. Negative insets leave
room for the caps, which overflow the 0.92 line box.

### Nothing is revealed until Archivo has loaded (2026-11-12)

**Nothing is revealed until Archivo has loaded** (or 2.5s have passed),
since 2026-11-12. The pages arrive as prerendered HTML, so on a first visit
the reveals could run before the font, and the hero faded in set in the
system font ("I BUILD PRODUCTS / THAT WORK / BEYOND THE / DEMO.") then
re-wrapped to "I BUILD / PRODUCTS THAT / …" when Archivo landed. Reported on a phone; reproduced by delaying the font 2s: the old
build showed the system font for 2s then jumped, the fixed one shows Archivo
from the first visible frame. `whenFontsReady` uses `document.fonts.load`,
not `fonts.ready`, which resolves at once if loading hasn't started. It is
created once, so every reveal after the first waits for nothing. Revealed text
is hidden until it is revealed anyway, so waiting costs nothing visible; the
2.5s cap stops a slow font hiding the page for long. The font is self-hosted and
preloaded (STYLE.md "Type"; Styles and tokens › Self-hosted Archivo), so the gate
rarely waits.

### The resize sweep

There is a **resize sweep** safeguard: an element inside a `display: none`
ancestor never generates an intersection entry, so if a breakpoint change later
reveals its container it would sit at `opacity: 0` forever. The sweep reveals
anything still unrevealed that is now actually on screen. Sections here swap
layouts at `lg`, which is exactly how that trap arises. It also covers a restored
scroll position landing past an element before the observer attaches.

### Bottom 10% still hidden is correct

Note that `[data-reveal]` elements sitting in the bottom 10% of the viewport are
*correctly* still hidden — that's `rootMargin: '0px 0px -10% 0px'` doing its job,
not a stuck reveal. Account for it when auditing.

### Micro-motion and scroll-linked moments (2026-10-24)

Branch `design/apple-polish`, from an HIG-based audit. Rules are in STYLE.md
"Motion"; these are the traps.

The scroll-linked moments (`.scroll-recede`, `.scroll-rise`, `.scroll-read`,
`.scroll-unveil` in `index.css`) are native scroll-driven animations: no library
and no scroll listener, the compositor runs them. Where `animation-timeline`
isn't supported (Firefox today) the page is the same page without them, and none
of them run under reduced motion.

- **`overflow-hidden` freezes a `view()` timeline**, silently, exactly the way
  it breaks `sticky`: `hidden` makes the box a scroll container, the timeline
  tracks that box, and it never scrolls. About's thesis sweep sat at one value
  until the section went `overflow-clip`, which clips the watermark identically.
  Any ancestor of a `.scroll-*` element must not be `overflow-hidden`.
- **A `.scroll-*` class never goes on a `[data-reveal]` element.** The
  animation's opacity would override the reveal's transition. Put it on a
  wrapper: Hero's headline and portrait wrappers (`scroll-recede`; it was the
  copy column before the hero grid split into four children), StatsBar's
  `<section>` (`scroll-rise`), the Visual frame.
- `view()` honours `scroll-padding-top` (7.5rem on `html`), so "leaving the
  top" means passing under the nav pill, not the viewport edge. That is why the
  hero starts receding at ~70px of scroll rather than ~170.
- `scroll-read` sweeps a background across the text, so it must be an inline
  `<span>`: inline boxes lay the background across every line as one strip,
  which is what makes it light up line 1, then line 2 (`box-decoration-break:
  slice`, the default). About's thesis sweep finishes by the time the quote
  reaches mid-screen, so a reader who stops is never left on half-lit text.

The nav, Work and Stack items from the same audit are under Nav, Experience, and Stack and marquee.

### No scroll snapping (removed 2026-08-12)

The page used to run `scroll-snap-type: y proximity` on `html` from `lg` up.
It was removed 2026-08-12 on Ahmed's report of laggy, sticky scrolling.
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

### Per-frame scroll work is budgeted

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
  sets state, so uncoalesced it re-rendered more often than the screen refreshes,
  for a bar that only ever moves a few pixels (`queued` / `measure` in
  `SectionRail.tsx`).

A new scroll-driven effect gets the same treatment. Writing to `style` from the
loop and keeping React out of the hot path is the pattern — see Method.

## Hero

### The portrait file

`src/assets/ahmed.webp` is the hero portrait (the blog repo keeps a copy for its byline), a
transparent cutout: 790x1110 WebP q82 with alpha, 82 kB. Shown at most 370x520,
so this is ~2x. Measured on Slow 4G, desktop: the photo is the LCP element and
arrives at 3.3s, vs 9.7s as the PNG. `src/assets/ahmed.png` is the 1.2 MB PNG
master it was encoded from. NOT imported, so never shipped; re-encode from it
(Pillow, quality=82, method=6, alpha_quality=90), don't import it back.

### The background layer lives on the hero-zone wrapper

- **The hero's background layer lives on the hero-zone wrapper in `Home.tsx`**,
  not inside `Hero.tsx`, so one grid+glow spans nav, hero and stats bar. The
  wrapper's `pt-nav` clears the fixed nav, and the background layer spans that
  padding too, so there is no white strip behind the pill. `pt-nav` is the shared
  fixed-nav clearance, so the hero can't drift out of step with the pinned panels
  that use the same token.

### Capability chips

- **Hero capability chips must not overhang more than ~3%** on the right, or
  they cross into the SocialRail gutter. That applies from `lg`, where they float
  around the portrait. Below `lg` they are **overlaid inside the portrait** over
  its existing bottom scrim; they used to sit in a row under the card, which read
  as a detached list rather than part of the portrait. The
  "Production-first AI / Ahmed Islam" caption that used to sit on the image is
  **gone at every width** — the name is already in the nav, the H1 copy and the
  page title, and on mobile it collided with the chips.
- The floating chips' positions (`CAPABILITIES`) are hand-tuned so they clear
  each other and the portrait. In the mockup "Production observability" landed on
  top of the caption and "Multi-agent systems" was clipped by the ring. "React &
  Next.js" took the slot "Production observability" held, as part of the
  full-stack reframe. It stays four chips, not five: a fifth has nowhere to go.
  "React & Next.js" is shorter than the label it replaced, so the right-hand
  overhang only got smaller.

### Four grid children

The hero grid has four children, not two: headline, closing line, portrait,
pitch. The copy had to be broken apart because the portrait sits *inside* it on a
phone (heading → tagline → face → pitch → buttons), and `order` can't express that
while they're nested: the portrait has to be their sibling. At `lg` all four are
placed explicitly: column 1 holds headline (row 1), pitch (row 2) and closing line
(row 3); column 2 holds the portrait spanning all three. That reproduces the old
two-column layout exactly, including the closing line staying at the foot of the
column. DOM order and `lg` visual order therefore differ by one block, which is
fine because nothing reordered is focusable, so tab order is unaffected.

- **The closing line** is at DOM position 2, so on a phone it lands between the
  headline and the portrait. At `lg` it is placed into row 3 instead, the foot of
  the copy column, the signature under the CTAs it has always been. Grid placement
  is what lets one element be second on a phone and last on a desktop without a
  second copy of it in the markup. No rule above it: the CTA row already ends the
  copy block, so a hairline separated something that was already separate. `58ch`
  keeps it to two lines from `lg`; at three lines of wide-tracked caps it read as a
  paragraph, which an eyebrow-style line shouldn't be. Phones and 1024 still need
  three lines; `text-balance` evens them out instead of stranding "LAUNCH." alone
  on the last line.
- **The portrait** is third in the DOM so it reads (and is announced) after the
  headline and its tagline. It uses `self-center` rather than `items-center` on
  the grid: the copy is the taller column at every `lg` width, so the portrait
  centres against it while the copy blocks stay stacked tight in column 1.
- **The pitch** carries `lg:mt-7`, restoring the gap the lead paragraph used to
  carry as its own `mt-7`; below `lg` the grid's `gap-y-10` spaces it off the
  portrait instead.
- **The primary CTA** ("See the work") carries a label: the mockup's two
  icon-only circles gave no hint what they do. The mail button keeps the circle.
- `scroll-recede`, on the headline and on the portrait, eases the hero back as it
  leaves through the top, so the stats card reads as the next thing.

### The H1

The home H1 is the role pill plus the tagline; why, and what was measured, is under SEO and prerendering › Titles and headings. Why the hero no longer re-wraps from the system font on a first visit is under Reveal and motion.

The pill is the H1's first line. The role words people search for ("Full-Stack AI
Engineer") were in a `<p>` above a heading that named no skill at all, so the one
H1 on the page said nothing a search engine could match. Same pixels: the pill and
the line keep their own reveals, and the `{' '}` between the two blocks renders as
nothing but keeps them two phrases in the text. "Available for new work." was
inside the pill; it is a status, not part of the heading, so it is now a separate
sr-only `<p>` outside the H1.

- The live dot is green because green reads "available"; orange is the brand
  accent and would read as decoration rather than status. The footer's
  availability pill is the same signal (Footer).
- The "· Web & Agentic" tail of the pill is hidden below `sm` (`max-sm:hidden`)
  because it wrapped to a second line at 390px.
- The headline changed "systems" to "products" so the line covers a website as
  well as an agent. "Beyond the demo" is the sharpest phrase on the page and
  stays; the pill above and the lead below carry the specifics.

## Stats bar

### The numbers and the CV

Two known content tensions, left as Ahmed's call, not to be silently "fixed":

- The stats bar says **2+ years**; the CV summary says *"a year of production
  experience"*. The 2+ counts from the 2024 Bytewise fellowship.
- **50+ satisfied clients / 70+ projects completed** are not in the CV, which
  lists 4 roles and 4 projects. The CV is downloadable from the same page.

Both are left for Ahmed to decide, not to be silently "fixed". Hero and StatsBar used to be `max-w-7xl`; see Site layout. StatsBar's `<section>` carries its `.scroll-*` class rather than a `[data-reveal]` child; see Reveal and motion.

### Count-up duration

`DURATION` is 2400ms, long enough that the climb reads as counting, not a blur.
It was 1500ms, and with ease-out most of that was spent in the first half-second.

### Below `sm`, a one-stat carousel

The list is a `ul` rather than a `dl`: the icon is a sibling of the value/label
pair, and `dl > div` may only contain `dt`/`dd`. Below `sm` it is a
one-stat-at-a-time carousel: native horizontal scroll with mandatory snap, so
swiping works with no gesture code; the `-mx-6` bleed makes each slide the card's
full width. From `sm` it is the 3-up grid, unchanged. It used to be a
free-scrolling rail on phones, which left the second stat cut off at the card edge
and the third out of sight, with nothing saying there was more.

### Autoplay, and the swipe that stops it

`active` is the stat on screen. `seen` latches each stat the first time it is on
screen, so a stat counts up when you can see it rather than finishing off the edge
of the card. `auto` goes false for good the moment the visitor swipes the rail:
they've taken over. There are no page dots (tried, and cut on Ahmed's call
2026-10-25: they read as clutter on a three-number card), so a swipe is the one
way to stop the motion, which is the "mechanism to stop" WCAG 2.2.2 asks of
auto-moving content.

`touching` means a finger is on the rail. The rail scrolling while it is true is a
swipe, which stops the autoplay. A touch alone doesn't: a thumb resting on the
card while scrolling the *page* never scrolls the rail sideways.

Autoplay always moves forward: after the last stat it scrolls onto a clone of the
first, and the next tick jumps from the clone to the real first one instantly
(identical pixels, so the jump can't be seen) before scrolling on to the second.
That is what makes the loop seamless instead of rewinding across all three. It is
off under reduced motion, off screen, and once touched.

## About

### The rotated marginal note uses `writing-mode`

- **About's rotated marginal note uses `writing-mode: vertical-rl`**, not
  `rotate-90`. Rotation leaves a wide layout box, so `right-*` positions the
  pre-rotation box and the text hangs off-screen.

### The thesis sweep and `overflow-clip`

About's thesis sweep sat frozen until the section went `overflow-clip`; see Reveal and motion › Micro-motion.

## Experience

### `min-w-0` on the Work grid column

- **`min-w-0` on the Work grid column.** Grid items default to
  `min-width: auto`, so the company rail's min-content width propagated up and
  pushed the page 211px past a 390px viewport — and stopped the rail's
  `overflow-x-auto` from ever engaging.

### `content-start items-start` on the stack-tag list

- **`content-start items-start` on the Work stack-tag list.** It's a flex
  container with `min-h-24`; without these, flex's default `align-items: stretch`
  makes every tag a tall box.

### Card height is pinned three ways

- **Work card height is pinned three ways** so switching company doesn't jump:
  the bullet list is a fixed `COLLAPSED_H` (not a max — a max still let 2-bullet
  roles shrink the card, 408px vs 611px; short roles get trailing space instead,
  so the stack tags land at the same spot on every tab), the tag row reserves two
  rows via `min-h-24`, and the Read-more button is always rendered (faded,
  `aria-hidden`, `tabIndex={-1}`) because conditionally rendering it removed 34px
  on short roles.
  - `min-h-24` is measured: 89px including `pt-6`. Padelos' 10 tags wrap to two
    rows, the shorter roles fit one, and the difference was jumping the card
    25px. Bump it if an entry ever needs three.

### The detail panel replays `animate-rise-in`

- Switching company crossfades rather than cutting: Work's detail panel replays
  `animate-rise-in` by remounting keyed blocks, and the bullets are keyed by their
  own text so they remount anyway. The bullet `<ul>` is deliberately **not**
  keyed: its ResizeObserver attaches once.

### The company switcher

- It uses plain buttons with `aria-current` rather than ARIA tab roles:
  `role="tab"` promises arrow-key navigation this doesn't implement.
- The rail shows a monogram, not the logo: itsolera and bytewise are wide
  wordmarks and are unreadable squeezed into 40px. The real logo goes in the
  panel header where it has room.

The heading "Where I've been." and why it isn't "Selected work." are under Content and data. Service pages quote `EXPERIENCE` by index; see Service pages.

## Stack and marquee

### Marquee: infinite scroll that feels intentional, not gimmicky

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

### Stack shows all 70 tools by default (2026-11-13)

- **Stack shows all 70 tools by default** (Ahmed, 2026-11-13; it used to open
  on the first category, with the rest behind `Show all`). `locked` starts at
  `null`; a tab filters to one group,
  and filtered-out pills are removed, not dimmed. Clicking the active tab is a
  no-op rather than a toggle-off, so the field is never empty, and `Show all`
  returns to the full set.

### How `STACK` is grouped (2026-08-12)

Grouped as Ahmed's CV groups them, extended 2026-08-12 with 13 technologies from
Ahmed's own stack list that the CV omits. PostgreSQL is listed under both "Memory
& Vector Stores" and "Databases" on the CV; it is kept once, under Databases, so
the cloud has no duplicate pill.

### Five entries are deliberately absent (2026-08-12)

- **Five entries from Ahmed's own stack list are deliberately absent**: JSON, YAML,
  Markdown, VS Code and Anaconda. They're file formats and tooling, not things
  anyone hires an AI engineer for, and a stack cloud containing "Markdown" reads
  junior. His call, 2026-08-12 — ask before putting them back.

### The `frontend` group is what un-hedged Services

- **The `frontend` group is what un-hedged Services.** The CV had JavaScript,
  FastAPI and REST APIs but no front-end, so `web-apps` (now `full-stack-ai`) used
  to sell "the interface on top of the AI". Ahmed added HTML, CSS, Tailwind and
  Bootstrap to the stack on 2026-08-12 and asked for the hedge removed, so it now
  sells the front end outright. If that group ever goes, put the hedge back.
  **React and Next.js** joined it with the full-stack reframe (Ahmed, 2026-08-12;
  the CV lists neither), and they are what the `web` service offer and the hero's
  "React & Next.js" chip name — those three move together.

### Selection is click/tap only

- **Selection is click/tap only.** A `hovered` state used to layer over `locked`
  so moving the mouse across the tabs swapped the whole field underneath. That
  preview made the section feel twitchy and meant mouse and touch behaved
  differently. All the `onMouseEnter`/`onFocus`/`onBlur` handlers are gone — don't
  reintroduce them.

### Below `lg` the tab row bleeds past the padding

- Below `lg` the tab row is one horizontally scrolling rail that **bleeds past the
  section padding** (`max-lg:-mx-4 max-lg:px-4`) so it scrolls edge to edge.
  Without the bleed it stops short and stops reading as scrollable. Eight tabs
  wrapped to four rows otherwise. From `lg` the row wraps. Same pattern as the
  Work company rail.

### Pills are filtered out of the DOM (2026-10-24)

- Stack's pills are filtered out of the DOM now, not `hidden`, so a category
  switch mounts fresh pills and `animate-rise-in` cascades them in. The stagger
  caps at 20 steps, or "Show all" would take 1s to land.
- Filtered-out pills are removed at every width, not dimmed. STYLE.md's dim-out
  treatment is still the rule for *small* filter sets; here it left 40+ ghost
  pills around the four you'd asked for, which buried the selection in its own
  noise.

Why `Stack.tsx` holds 15 technologies the CV omits is under Content and data. Why the marquees are not in the prerendered HTML is under SEO and prerendering.

## Services

### The page's one accordion

**Services** — `Services.tsx` + `data/services.ts`.

Not a scroll effect, but it is the page's one accordion, so the reasoning belongs
somewhere:

### Deliberately not a grid of icon cards

- **Deliberately not a grid of icon cards.** The card grid is already this page's
  dominant shape (Work, Projects, Certifications all use one), and a three-across
  icon grid is the single most template-looking thing a portfolio can contain — see
  STYLE.md's anti-slop list. It's a numbered index instead, reusing the site's own
  index-gutter language, and the open row inverts to `bg-ink`, which is STYLE.md's
  interactive-state rule applied at full width.
- The open row is a raised ink slab; closed rows are separated by a hairline
  instead of a border-box, so the list reads as an index rather than stacked
  cards (six when this was written, seven now). The toggle is a plus that becomes
  a minus: cheaper than an icon, and it reads as "expand" without a label.
  Reviews uses the same control.

### Seven offers, not six

- **Seven offers, not six.** `web` — "Web apps & websites" — was added with the
  full-stack reframe and sits *beside* `web-apps` ("Full-stack AI products")
  rather than replacing it. One is a site or an app; the other is a product with
  a model inside it. A visitor who wants the first should not have to read an
  agent pitch to find it. The Contact form's service chips, the footer's
  Services column and the service pages all read from this array, so adding an
  offer updates all four (and adds a page, which needs its page fields filled).

(The ids were renamed 2026-11-11, so `web` is now `web-development` and `web-apps` is `full-stack-ai`; see Service pages.)

### One row is always open

- **One row is always open** (`useState(SERVICES[0].id)`); clicking a row opens it
  rather than toggling, so the section can never collapse to seven blank lines.

### The reveal animates `grid-template-rows`

- The reveal animates **`grid-template-rows` from `0fr` to `1fr`**, which
  transitions to the content's natural height without measuring it. `height: auto`
  cannot be transitioned, and a fixed max-height would clip the longer rows.
  Reviews.tsx uses the same trick.

### Copy is DRAFT, and every `stack` entry is in `Stack.tsx`

- Copy is **DRAFT**, one of two sections not taken from the CV (Method is the other).
  Nothing in it claims a client or a metric. Every `stack` entry is a name that
  exists in `Stack.tsx`, so the offer stays inside what Ahmed works with — keep
  that invariant when editing, or the chip falls back to the generic cube glyph.

## Service pages

### A page per service (2026-11-11)

- **A page per service** (`/services/<id>`, `pages/ServicePage.tsx`), because
  Google ranks pages, not sites: one home page cannot rank for seven services.

### The service `id` is the URL slug

- The service `id` **is the URL slug** (renamed 2026-11-11 from `agents`,
  `rag`, `web`… to `agentic-ai`, `rag-development`, `web-development`…, so
  the URLs carry search words). Renaming one breaks every link to its page.

### `data/services.ts` holds the page copy and stays plain data

- `data/services.ts` holds the page copy too (`seoTitle`, `description`,
  `heading`, `problem`, `graph`, `steps`, `experience`, `projects`,
  `faqs`), and `site-pages.vite.ts` imports it in Node to write each page's head
  tags, a `Service` JSON-LD block and the sitemap entries. **So that file
  must stay plain data**: no imports, no `import.meta.env` (undefined in
  Node). Its cross-reference checks (project slugs, diagram node ids, CV
  entries and point indexes) live in ServicePage.tsx for that reason.

### DRAFT positioning, and CV lines quoted by index

- `problem`, `steps` and `faqs` are DRAFT positioning. The only claims
  about Ahmed's own work are in "Where I've done it", and those are his CV
  lines **quoted** from `EXPERIENCE` (exported from Work.tsx) by index, not
  retold. `web-development` has no CV entry, so that chapter shows only
  Flintgrab there.

### Rebuilt as a sticky story the same day

- **Rebuilt as a story the same day**, after Ahmed rejected v1 ("very short,
  not animated, not professional"). He chose a *sticky* story over pinned
  scenes. Order: hero (the system's diagram draws itself) → the problem
  (`scroll-read`, on paper-2 because that sweep's ghost colour is mixed
  against paper-2) → how I build it → what you get (ink band) → where I've
  done it → questions (`<details name>`, one open at a time) → other
  services + talk panel. It is built from the site's own vocabulary: two-tone
  display headings, the hero grid, `scroll-read`, the Services index rows, the
  /projects rows, the blog's back pill and talk panel. Every chapter is plain
  content under reduced motion; nothing on the page depends on animation to be
  read.

### The diagram

- **The diagram** is `ServiceDiagram.tsx`: nodes are HTML boxes placed by
  percentage over an SVG with the same 400×340 aspect, so nothing stretches.
  Hero mode draws everything in; story mode shows unbuilt nodes dashed, the
  current step's nodes orange, and a pulse only on links touching them.
  Its boxes are sized in `cqw`/`em` against **the diagram's own width**
  (a size container), not the viewport: viewport steps collided at 1024,
  where two columns make it narrower than on a phone. Below 20rem the
  icons drop out instead of the text shrinking. Checked with every box
  enlarged at 1440/1280/1024/768/390/360: no overlaps.
- The two modes are props. Hero is `assemble`: the whole system drawing itself
  in, with a pulse along every link. Story is `built` + `active`: the same system
  as a blueprint, nodes not built yet dashed, each step filling its nodes in
  orange, solid once done. It is a diagram, not a picture of a product: generic
  parts, single accent, the same licence as `ProjectMark`. It is one `role="img"`
  with a text label, so the boxes inside are hidden from assistive tech.
  Everything inside is in `em`, so a box scales with its text and the whole
  drawing scales as one; under 20rem (a 360px phone) the text stops shrinking at
  10px and the icons drop out (`@max-[20rem]:hidden`), which is what keeps
  neighbours apart there.
- The animation CSS is `.diagram-edge`, `.diagram-pulse` and `.diagram-assemble`
  in `index.css`: the hero copy assembles itself, nodes pop in and edges draw,
  and live edges carry a pulse from one node to the next. Pulse paths (and the
  hero's edges, which draw in) use `pathLength="1"`, so one dash value fits every
  edge length. `pathLength` is set only there: the story's dashed "not built
  yet" links keep dashes in real units, so a short link and a long one dash
  alike. No pulses and no assembly under reduced motion: the diagram is simply
  drawn.

### Sticky story traps

- **Sticky story traps.** Below `lg` the story is block layout, not grid: a
  sticky grid item only moves inside its own grid area, which in one column
  is its own row, so it never sticks. The current step comes from an
  IntersectionObserver band at ~60% on desktop and ~74% on a phone, where
  the diagram covers the top ~450px; at 60% the current step's title was
  still behind it. The exact bands are `'-58% 0px -38% 0px'` from `lg` and
  `'-72% 0px -24% 0px'` below it, set once on mount, so a resize across `lg` only
  shifts where steps switch; nothing breaks. No pinning and no scroll-jacking:
  the page scrolls normally and only the diagram is `sticky`. From `lg` it is a
  grid item with `self-start`, so its area is the full height of the steps
  beside it. The progress fill writes `style.scale`, not `transform`:
  Tailwind 4's `scale-y-0` is the `scale` property, and the two multiply.

### Graph labels

- Graph labels stay ≤ ~13 characters and three to a row at x = 72/200/328;
  re-run an overlap check at 360 and 1024 if you move a node.

### Ways in

- Ways in: the open Services row's "More on …" link (its text names the
  service, which is also what search engines read from a link), the footer's
  Services column, each page's "Other services" list, the sitemap. The closed
  accordion panels are only collapsed and transparent, so they are `inert`, or
  their links would take Tab focus unseen.

### Contact buttons and the `?service=` param

- Both contact buttons go to `/?service=<id>#contact`. Contact ticks that
  service after mount, then **removes the param** from the address
  (`navigate(…, { replace: true })`): left there, it rode along for the rest
  of the visit (`/?service=x#top` after a logo click) and into bookmarks.
  Home then scrolls to the hash itself, because when the page is drawn from
  scratch (dev, unknown URLs) `#contact` didn't exist yet when the browser
  looked, and the visit stayed at the top. That scroll uses `behavior:
  'instant'`, or html's smooth scrolling would glide through the whole page; on
  the built pages it's a no-op or a small nudge. Measured: lands with the
  contact heading ~220px down, in dev and in the built site.

### No `/services` route

- No `services/index.html` and no `/services` route: the list is the home
  page's `#services`, which is where "All services" goes.

### No breadcrumb trail, and no back pill on phones (2026-11-12)

- **No breadcrumb trail, and no back pill on phones** (Ahmed, 2026-11-12):
  "Services / RAG & knowledge systems" repeated the H1 right under it and
  "looks AI generated". The "All services" pill stays from `sm`. Same on
  /privacy and, since the same day, the blog post. On a phone the nav pill and
  the Back gesture already do this job.

## Reviews

### One running paragraph

**Reviews** — `Reviews.tsx` + `data/testimonials.ts`.

Also not a scroll effect. The five recommendations are set as **one running
paragraph**, not five cards — the unit of design is the sentence. Picking a run
pulls that voice out of the composite and lights up its source in the ledger below.

### The composite is an index of pull-quotes; the ledger holds the originals

**The composite is an index of pull-quotes; the ledger holds the originals.** That
split is the whole reason the section survived real testimonials. The supplied
LinkedIn recommendations run 11 to 141 words, and five of those end to end is an
essay — the first draft assumed ~20-word quotes and only worked because the
placeholder copy was written to fit. Now each `pull` is a verbatim excerpt, so the
paragraph stays ~88 words whatever the sources do, and the full text expands in the
row. **Any future testimonial is handled by choosing its `pull`, not by resizing
anything.**

### Deliberately not a card set

- **Deliberately not a card set.** Work, Projects and Certifications are all card
  sets already, and STYLE.md asks the next new section to find its own form. This
  one borrows the site's own vocabulary instead: solid-over-ghost two-tone for the
  active/inactive runs, `SectionRail`'s tick for the ledger rows, and the same
  plus-becomes-minus control Services uses, so "this opens" reads identically in
  both places. The expanding panel uses the same `grid-template-rows` 0fr → 1fr
  trick as Services.

### Hover only ever changes colour; expanding is a click

- **Hover only ever changes colour; expanding is a click.** Two states, `active`
  and `open`. If hover expanded rows, sweeping the mouse across the composite would
  open and close them underneath it — thrashing the page height and pulling content
  out from under the cursor. Clicking a *run* sets both, so tapping a quote lands
  you on its source with the full text already open; the jump alone would leave you
  staring at a collapsed row.

### Nothing is open by default

- Nothing is open by default. The composite is complete on its own, and five
  collapsed rows keep the section at ~1200px instead of ~2600px.

### Inactive runs are `text-muted`, not the ghost tone

- **Inactive runs are `text-muted`, NOT the `heading/25` ghost.** The ghost tone is
  for display text; at body scale it fails the contrast floor in STYLE.md, and four
  unreadable quotes is not a design. So the whole composite is legible at rest and
  the highlight is pure enhancement — which is also what makes it work on touch,
  where there is no hover at all. Don't "strengthen" the effect by ghosting harder.

### Each run is an `<a>`; ledger rows are `<button>`

- **Each run is an `<a>`, not a `<button>`.** A button is atomic inline-level and
  cannot break across lines, which destroys the running paragraph. An anchor wraps
  normally, is focusable for free, and jumping to its own source is exactly what a
  footnote reference should do when tapped. The `<sup>` marker carries `no-underline`
  so the active run's rule stops at the quote instead of leaving a stray dash.
  The **ledger rows are `<button>`**, since their job is to expand — which is why the
  run→row link only runs one way now. That's the direction that matters: excerpt to
  original.

### The attribution is always visible

- The attribution is **always visible** — nothing is hidden behind hover, so the
  section is complete with zero interaction, and only the full prose is behind a
  click. Measured: rows 56px at desktop, 99–119px at 390 where they wrap to three
  lines; the plus buttons clear `SocialRail` by 24px at 1024 and 88px at 1440.

### Runs are `<q>`; the expanded panel is a plain `<blockquote>`

- The composite's runs are `<q>`, so the curly quote marks come from the UA and
  aren't in the data — keep them out of `testimonials.ts` or they double up. The
  expanded panel is a plain `<blockquote>` with no marks, because a marked-up
  400px block of quotation reads as decoration.

### The chip is `sm:ms-auto`

- The LinkedIn chip is `sm:ms-auto`, not `ms-auto`. Below `sm` the row wraps to three lines
  and a right-flung chip reads as detached from the row it belongs to.

### Copy is real

- Copy is **real** — see Content and data. The lead says "recommendations",
  not "client reviews", on purpose.

## Method

### Pinned scrubbing

**Pinned scrubbing** — `Method.tsx`.

A tall `lg:h-[280vh]` runway with a `lg:sticky lg:top-20` child. Progress drives
an SVG zigzag and pops each step card in as the line reaches it.

### Progress uses element geometry only

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

### The line and the dot are written from one value, in one frame

**The line and the dot are written from one value, in one frame.** This is the
fix for the dot visibly trailing the line:

- The line used to be declarative (`strokeDashoffset={1 - progress}`) while the
  dot's position came from a `useEffect` keyed on the same `progress`. So the
  line painted in commit N and the dot caught up in commit N+1 — structurally one
  frame behind, every frame, and the gap widened with scroll speed. Both are now
  `style` writes inside the rAF loop.
- **The orange line is revealed by a clip, not a dash** (since 2026-11-12). A
  `<clipPath>` (`#method-drawn`) rect in viewBox units, its width set to the dot's `x` each
  frame. The dash version was wrong at every width: **`non-scaling-stroke`
  lays dashes out in screen pixels**, but the dash was sized from
  `getTotalLength()`, which is in viewBox units. Measured on the old build:
  on desktop the line fell up to 81px behind the dot, on a phone it ran
  78px ahead, and Ahmed saw an orange tail at the far end before scrolling
  (reported 2026-11-12): stretched to 1150px, the screen path is longer than the
  dash, so the pattern repeated, sitting at the far end at p=0 and sliding ahead
  of the dot as you scrolled. The clip works because the wave only ever moves
  rightwards (every control point sits on its segment's horizontal midpoint), so
  "drawn up to the dot" is exactly "everything left of the dot's x". **Don't bring
  a dash back on a `non-scaling-stroke` path.**
- **Neither the dot nor the clip rect takes its position from React.** React
  re-applies `style` on every render, so a prop there would clobber the rAF
  writes each time state ticked. The rect's `width="0"` is static, so React
  never touches it after the first render.
- Measured after the fix, reading the screen pixels along the curve: no orange
  past the dot and no gap behind it, at p = 0…1 at 1680, 1440, 1280 and 390,
  at 1×, 1.5× and 3× pixel density.

### Only `stage` goes through React

**Only `stage` goes through React**, a copy of progress quantised to 2%. It
drives the step cards, tool chips and closing pill, which are pass/fail gates at
least 2% apart — so ~50 re-renders across the whole runway instead of one per
frame (and the old code did *two* per scroll event, not one: setState on every
scroll event, then a second time from an effect).

### Details that matter

`position: sticky` gives the pin for free and the scrub is ~15 lines, which is
why this section still doesn't justify GSAP. Details that matter:

- **Never put `overflow-hidden` on an ancestor of the sticky element.** A clipped
  ancestor becomes the sticky element's scroll container, and since that container
  doesn't scroll, sticky silently stops working — the content renders at the top of
  the runway, far off-screen, with no error. Clip the sticky element itself instead;
  that's fine: Method's bloom is clipped by the sticky child. This cost real
  debugging time once already.
- It's full-bleed `bg-ink`, one of the page's three full-bleed bands, so **both
  gutter rails restyle over it** via `surface` in `Home.tsx` (see Rails). Without that an ink SocialRail circle sits invisible on an ink
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
- The closing pill ("No agent ships unevaluated") appears at `progress >= 0.92`,
  with the last tool chip. At 0.98 it was on screen for only the final 2% of the
  runway — 36px of scrolling on desktop — which
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
  behind the line.

- A second, static path underneath in `white/12` shows **the route ahead** —
  that's what makes it read as guidance rather than a reveal.
- The travelling dot uses `getPointAtLength`, which works in **viewBox units**, so
  it stays aligned however the SVG scales. A CSS `offset-path` would not: it
  resolves against the element's containing block, not the viewBox.
- Step cards are a fixed `h-18` — wrapping details otherwise gave them ragged
  heights. Path nodes sit at y=80/160 to clear the 72px cards. The curve and the
  cards are coupled: shrinking one without the other puts the line through a
  card, so both step down together on a short viewport (Site layout › The
  `short` variant).
- **The pinned card must fit the viewport.** While pinned the page isn't scrolling
  the card, so anything below the fold is unreachable. It measures ~712px at
  `top-20`; if you add content here, re-check that.
- `#method` used to opt out of scroll-snap; snapping is gone entirely (see Reveal and motion).
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

The `short` variant that steps the curve, the step cards and three margins down on short laptops, and the coupling between curve height and card height, are under Site layout.

### Copy is DRAFT

Its copy is **one of two DRAFT sections not derived from the CV** (Services is the
other) — the five phases are inferred from what the CV says Ahmed does (versioned
prompts, a rubric-graded evaluation pipeline, vector-store memory, Docker +
Bitbucket CI, CloudWatch observability). It's marked DRAFT in the file: reword
freely, it's positioning, not fact. Reviews is also not CV-derived, but its content is real supplied
testimonials rather than positioning copy.

## Projects

### Rebuilt 2026-08-30: no longer a scroll effect

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
problem; the undifferentiated payload was. Big effect over undifferentiated
content is what read as gimmick. What replaced it is hierarchy: one featured
project at real scale, two peers beside it, and a door to the rest.

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

The peer card (`Card`) is unchanged from the card the old travelling row used,
minus the scroll-driven `on` ring (there is no active index any more) and minus
the `lg:short:` steps.

### `accentColor` removed (2026-08-30)

`accentColor` was removed from `PROJECTS` with the rebuild. Its only consumer was
the per-project tint on the drifting background word, and there is no longer a
travelling word or an active index to drive it. Removing it also restores
STYLE.md's single-accent rule cleanly: the spread across the warm range was an
explicit, grudging compromise made *for* that effect, not a licence for
per-project hues. Don't reintroduce it without an effect needing it.

### What the home section is now: three projects, one door

- A **featured panel** (asymmetric, ~40/60 from `lg`, stacks below) and two peer
  cards, then a gradient-pill CTA to `/projects`. `FEATURED` in `data/projects.ts`
  picks the three **by slug, not by array order**, so reordering `PROJECTS` can't
  silently change them. A slug that resolves to nothing throws in dev — same
  `import.meta.env.DEV` guard pattern as `data/testimonials.ts`. Currently
  `padelgpt`, `dukaan`, `flintgrab`: an AI product, a mobile app and a desktop
  app. Three were rotated out on Ahmed's instruction and **all remain in
  `PROJECTS`** — leaving `FEATURED` is not deletion: `content-moderation`
  (2026-08-30, when `segments` arrived), `ppe-safety` (2026-09-20, when
  `flintgrab` took its slot) and `segments` (2026-11-05, when `dukaan` took
  its slot; it and `padelgpt` were two features of one product).
  The reasoning, so a future edit is a decision rather than a guess: `padelgpt`
  (and `segments`, while it was featured) are shipped features of a live
  commercial platform, the strongest thing on the list; `flintgrab` is a complete
  product (a desktop application, a browser extension and a marketing site) and
  the only non-AI/ML build, so it is what backs up the web development
  `services.ts` sells; `dukaan` (2026-11-05) adds a third kind of build instead of
  two features of the same platform. `content-moderation` is still the only
  project whose README states a measured result, so it keeps its `metric` on the
  index page; `ppe-safety` is still the largest single build (YOLOv8 + facial
  recognition + an Arduino/ROS unit). The rest are one click away on `/projects`.
- The dev check exists because a `FEATURED` slug matching nothing would render
  as a blank panel with no error, invisible until someone looked at the page.

### The featured panel's anchor is its visual

- **The featured panel's anchor is its visual; the name sits beside it at
  `text-h2`.** This flipped once, deliberately. While no project had imagery the
  anchor was the name at `text-display` — the right call for a card with nothing
  to look at. Once every card gained a visual, a display-scale name *beside* one
  gave the panel two things competing to be seen first, and measured at 1440 it
  stranded ~150px of dead space in the copy column, because the visual had grown
  taller than the copy. `lg:items-center` now
  balances the shorter copy against the taller visual. **If a project ever has no
  visual at all, bring the display-scale name back** — the objection was
  competition, not the name.

### No ghosted numeral

- An oversized ghosted numeral was drafted as the anchor and rejected: every
  giant-faded-text precedent here (About's watermark, the footer's `AHMED.`, the
  old `SHIPPED`) is *section-scale background*, never in-card, so it would have
  been a new pattern claiming to be an existing one: decoration carrying no
  information.

### No background watermark

- **There is no background watermark.** The old seven-row `SHIPPED` block existed
  to fill a 100vh pinned panel and to carry the per-project `accentColor` tint as
  the cards travelled; both jobs are gone. A single-line `SHIPPED` was tried and
  measured at both widths: at `top-1/2` it lands in the gap between the panel and
  the cards, where brand-on-ink at 0.045 is a maroon smudge — plainly visible on
  a phone, neither legible enough to be a word nor faint enough to be ground.
  Cut. Texture here has to be designed against the new layout, not inherited.

### `min-w-0` on the peer cards

- **`min-w-0` on the peer-card grid items AND on the card root.** Load-bearing,
  and the same trap as the Work grid column: grid items default to
  `min-width: auto`, so the longest repo path
  (`PPE-Detection-for-Construction-site-workers`) pushed each card to 379.5px
  inside a 358px track and put the page 6px past a 390px viewport. `truncate` on
  the path does not help — min-content width propagates up before it applies.

### One exit, not three

- **One exit, not three.** `All repositories →` used to sit top-right beside the
  count pill; it now closes `/projects`, the point where "and here is the rest" is
  the right offer. Users satisfice (they take the first reasonable option), so a
  top-right link straight to raw GitHub siphoned clicks before the visitor had
  seen a single project. The only way out of the home section is the CTA at the
  bottom. The count pill stays (derived, so it can't drift).

### Still `bg-ink` and index `08`

- The section keeps `bg-ink` and index `08`, so `SECTIONS`, the numbering and
  `Home.tsx`'s `surface` derivation are all untouched. It takes normal `section-y`
  padding now — the "pinned bands take no section padding" rule stopped applying
  the moment the runway came out.

### `/projects`: the full index

All ten as **full-width hairline-separated rows**, not a card grid. Two reasons,
both hard: `lg:grid-cols-3` of eight cards is the single most recognisable
AI-generated layout there is, and reusing the home card would make the two
surfaces read as the same page twice. A list is also the form that scales — at
nine a three-across grid still reads as a template, and every added project
makes the list stronger rather than lumpier. At seven entries a three-across grid
already left an orphan row, and at ten it still does: a list is correct at any
count, which matters because this is the page that grows. STYLE.md asks each new
surface to find its own form.

- Each row (`Row`): numeral, name, summary, stack, status, destination.
  Hairline-separated rather than boxed: bordered cards stacked vertically are a
  card grid with one column, the shape this page exists to avoid. The whole row
  is the link, so the target is far larger than the 44px floor. It uses the same
  `Visual` as the home cards, capped on mobile so a full-bleed thumbnail doesn't
  turn each row into its own screen.

- No index numeral in its eyebrow. `0N /` is the home page's section counter and
  `08` has nothing to count against on a standalone route.
- `useReveal` already re-runs per route in `App.tsx`, so reveals work for free.
  One `window.scrollTo(0, 0)` on mount, because react-router keeps scroll
  position across routes: arriving from the home CTA, well down the home page,
  would otherwise drop the visitor into the middle of the list.
- `bg-ink` to match section 08 — Projects is an ink surface everywhere, per
  STYLE.md's closing-bands rhythm.

### The `/work/:slug` stub route (deleted 2026-08-30)

- ~~`/work/:slug` stub route~~ — **deleted 2026-08-30** with the Projects rebuild.
  It sat in the route table as a stub so project cards had somewhere to land;
  every card had been an external `<a>` since the gallery was rebuilt, so nothing
  had linked to it for over a week. `/projects` is the second route now; project
  cards stay external `<a>`s.

### Project cards are external links

**Project cards are external links.** Every card is an `<a target="_blank">` at a
live site, a public GitHub repo or a release page. Three are live: two features
of one deployed product (Padelos) and, since 2026-11-13, `flintgrab.ahmedislam.tech`.

- `urlLabel(project.href)` prints the **repo name alone** for a GitHub link, and
  the host for a live site. It used to print host + owner + repo inside
  fake browser chrome, but `github.com/Ahmed-Islam-AI/` is the identical first
  24 characters on most cards (six of seven when this was built, seven of ten
  today), so `truncate` ate the only part that
  carried information. The GitHub mark beside the label says which host it is.
  It lives in `data/projects.ts` with `isRepo`, since both surfaces need them.
- `Project` has one `href`, not `link` + `github`. In the source Ahmed supplied,
  six of the original seven had the identical string in both fields and PadelGPT had only a
  live site — a second field would have been the same URL twice.

### Flintgrab's link and status (`LIVE` since 2026-11-13)

`flintgrab` was added 2026-09-20 on Ahmed's instruction, taking `ppe-safety`'s
place in `FEATURED`. It has been `LIVE` since 2026-11-13, at
`flintgrab.ahmedislam.tech`: the `Flint-Grab-site` repo deploys there through
GitHub Pages (Hosting and domain › Domain and email), and its Download button
serves the installer from that repo's `v0.1.0` release. Until then the card was
`SOURCE` and linked the repo, because the site's own domain, `flintgrab.com`, was
never registered. If it ever is, move `href` there. The desktop app itself is
closed source (`UNLICENSED` in its package.json, "proprietary" in its README), so
there is no app repo to point at.

Its `stack` is verified against the app's own `package.json`, not inferred:
Electron 44 + React 19 + strict TypeScript, Tailwind 4, `better-sqlite3` for the
queue, `webtorrent` for torrents. The icons this needed are under Icons.

### Imagery: five supplied images, five drawn marks

**Imagery: five supplied images, five drawn marks.**

Every card carries a visual. `Visual` in `Projects.tsx` picks: `project.image` if
set, otherwise a `ProjectMark`. Both the home cards and the index rows use it, so
setting `image` upgrades a project everywhere at once.

**What is actually in each image — this matters, and two of them are Ahmed's
explicit call, not drift.** Recorded here so nobody "corrects" them back out:

| Card | File | What it really is |
| --- | --- | --- |
| `flintgrab` | `flintgrab.webp` | **A real capture** of the running app — its live download queue |
| `segments` | `segments.webp` | **A real capture** of the running Padelos segment builder |
| `padelgpt` | `padelgpt.webp` | A designed **mockup** — fake browser chrome, empty chat pane |
| `ppe-safety` | `ppe-safety.webp` | A **generated poster** — the "PPE DETECTED" box is not model output |
| `dukaan` | `dukaan.webp` | **Three real screenshots** (Items, Home, Invoice) from the app's README set, demo shop data, composed on Dukaan's own saffron `#E8590C` |

- **`flintgrab.webp`** (2026-09-20), a real capture of the running application
  (its download queue with live transfers, the throughput graph and the
  extension-connected state), came from
  `D:\Data_Folder\FlintGrab-Website\public\assets\screens\queue.png`, 1102x721,
  cropped **top-anchored** to 16:10 so the title bar and wordmark survive — a
  centred window clipped the top of the logo. The 32px lost off the bottom is the
  status strip. Its lime `#A8E84D` is Flintgrab's own brand accent and breaks this
  site's single-accent rule on purpose: a real capture keeps its own colours
  because it is evidence rather than decoration, same licence `segments` uses
  (STYLE.md). That repo also has
  `screens/settings.png` if a second view is ever wanted.
- `segments.png` (supplied by Ahmed 2026-08-30 as `src/assets/projects/segments.png`)
  is **AVIF despite the `.png` extension** — check the magic bytes, not the name,
  if you reprocess it; it was decoded and re-encoded to WebP. It shows the
  segment builder mid-resolution. Cropped top-anchored so the Segment Name field
  and the prompt both survive: a centred window cut the name field off, and the
  prompt is the thing that shows what the feature does.
- `padelgpt.webp` is the same file this gallery shipped with before 2026-08-21,
  supplied again by Ahmed 2026-08-30 (`src/assets/projects/padelgpt.webp`),
  cropped to 16:10 and re-encoded. It is a designed mockup, not a capture of the
  running product: fake browser chrome (traffic lights), an empty chat pane, a
  typing indicator mid-reply, and violet rather than the site's accent. It is
  here because Ahmed asked for it directly after being told what it was. A real
  capture of the deployed assistant replaces it the moment one exists, and would
  be a straight upgrade.
- `autonomous-works-safety-system.png` → `ppe-safety.webp` was cropped
  deliberately to drop its worst parts: the overlaid "AI-Powered Construction
  Safety System" title, and a bottom logo strip whose Arduino mark reads
  **"AMENIO"**. It was supplied by Ahmed 2026-08-30 (in `src/assets/projects/`).
  What remains is the construction scene and a "PPE DETECTED" overlay that no
  model produced. (Earlier comments in `Projects.tsx` and `ProjectMark.tsx`
  called this image "genuine YOLOv8 output" and "a real capture"; superseded: the
  real YOLOv8 output is the repo's `Results/` frames, below. The card still never
  renders a mark, because it has an `image`.)
- `dukaan.webp` (2026-11-05) is three real screenshots from the app's own README
  set (`docs/images/screens/`: items, home, receipt-invoice), taken from the
  debug build on an emulator with the README's demo shop data, and composed on
  Dukaan's saffron `#E8590C` (from its `docs/DESIGN.md`) at 880x550 by a scratch
  Puppeteer script; nothing in the frame is drawn except the backdrop. Its
  saffron is the product's colour, the same licence as Flintgrab's lime and
  Segments' blue. Not the README's `hero.png`: that banner is half title text and
  taglines, which would repeat the card's own name beside it.
- All five are 880x550 WebP in `public/project-images/` (renamed from `projects/` 2026-10-21: a folder named like the `/projects` route made GitHub Pages serve it as a directory, 301 to `/projects/` then 404). **Sources are not kept in this
  repo** — `src/assets/projects/` was deleted after the first three were
  processed (2.8MB that never entered the bundle), so each entry records where
  its original came from instead.

### `ppe-safety` has a genuinely real alternative

**`ppe-safety` has a genuinely real alternative, one line away.** Its own repo's
`Results/` folder holds true YOLOv8 inference frames — a worker with the model's
boxes and confidences on him (`person`, `helmet_on 0.76`, `vest 0.92`) — plus
real F1/PR/precision/recall curves and a confusion matrix. That is evidence
rather than illustration, and swapping `image.src` to it is a straight upgrade if
Ahmed ever wants it.

### The five drawn marks

**The five drawn marks.** `ProjectMark.tsx` — a flat geometric schematic per
project, single accent, no dependency. **These are diagrams, not pictures, and
that distinction is the entire reason they are permitted.** No text, no numbers,
no chrome, no UI: nothing a viewer could mistake for a screenshot. Same category
as the hand-drawn `CONCEPT` glyphs in `TechIcon.tsx`, at card scale, and each
abstracts something true about the build (a tool-call graph for the agent, a
waveform between two endpoints for the audio streamer, rows lifted off a page for
the scraper). They are placeholders with a defined exit — set `image` on the
project in `data/projects.ts` and the photo replaces the mark automatically.
Prefer a real screenshot every time, and don't treat the marks as the finished
state. Rules if you add one (`MARKS` in `ProjectMark.tsx`): no text, no numbers,
no UI chrome, single accent, stroke-led geometry on the 160x100 viewBox, and it
must abstract something true about the project.

### Why so few real captures

**Why so few real captures.** Every repo was checked on 2026-08-30: none of the
six source projects carries a screenshot anywhere, and several have no UI to
capture at all (`ecommerce-scraper` is two `.py` files and two `.csv`s).
`padelos.co`'s public landing page shows no product UI and never uses the name
"PadelGPT" — its AI features are branded "AI Club Manager" and "AI Concierge" —
so a capture of it would be a marketing page rather than Ahmed's work.

**Five of the nine are runnable web apps** (Flask/Streamlit), so Ahmed can
capture them himself. **That is the highest-value thing left in this section**,
and a real capture of the deployed PadelGPT assistant most of all — it is the
one featured card still carrying a mockup.

### The image rule

**The rule, unchanged.** The `image` field's rule is a real capture of a real
screen, or nothing; never anything generated. (When it was written its comment
added "Absent on all seven today"; five projects carry an image now, and two of
those are the exceptions below.) The section shipped with seven AI-generated posters until
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

### `assets-original/` is gone (2026-08-30)

`assets-original/` **no longer exists** — deleted 2026-08-30. It held the
AI-generated posters (in `assets-original/project-images/`, outside `public/`,
where the `image` field's comment said they must stay), along with the six
leftover CodeBucks template stock images
(`agency-website`, `crypto-screener`, `devdreaming`, `fashion-studio`,
`nft-collection`, `portfolio-cover`) that were never Ahmed's work. It was
untracked, so git cannot restore it.

### What the card shows instead

**What the card shows instead** — index numeral, name, one-line summary, stack
chips, optional metric, repo path:

- The **stack chips reuse the Work switcher's markup verbatim**
  (`Work.tsx`'s stack-tag list), so "a technology" looks identical in both
  sections. Change the chip once, in both places. `StackChips` and `Destination`
  are exported from `Projects.tsx` and shared with `ProjectsPage.tsx`.
- **`Project.stack` entries do NOT have to exist in `Stack.tsx`** — this is a
  deliberate divergence from the icon rule (see Icons), and from the invariant
  `services.ts` follows. That invariant exists so Services can't *sell* outside
  Ahmed's declared skills; a project's stack is a fact about the project, not a
  breadth claim. Arduino,
  ROS and BeautifulSoup belong on a card and not in the skill cloud, for the same
  "reads junior" reason that kept JSON, YAML and Markdown out of it. They still
  need a `TechIcon` entry or they fall back to the generic cube.
- **`metric` is optional and only where the repo's own README states one.** With
  seven projects the comment said "Six of seven don't"; today it is still
  `content-moderation` alone (90% text / 92% image accuracy, quoted, not
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
  is the verifiable source (the card's name is now "Real-time Audio Streaming"),
  and carries a `TODO(Ahmed)`. If it does translate, the original name is fine
  and the summary needs the translation step put back. Don't resolve it by
  guessing.

## Certifications

### Pinned card-swap deck

**Pinned card-swap deck** — `Certifications.tsx`.

The page's other sticky-runway section, after Method (it was the third while
Projects had a runway). Progress drives a continuous *card index* `t`
rather than a pixel offset, and every card positions itself from `i - t`.

### Details

- **`t` is stepped, not linear.** `raw = p * N - 0.5` (the half-slot offset gives
  the first and last card a settle instead of being on top for one instant), then
  within each slot `HOLD` flattens both ends and a smoothstep eases the middle.
  That hold is the whole effect — without it the deck slides continuously and
  never reads as one card being dealt over another. `HOLD` is the fraction of
  each slot spent fully settled at each end: 0.35 means a card holds still for
  the first and last 35% of its slot and swaps across the middle 30%. `HOLD = 0`
  removes it.
- **The deck runs at every width**, like Method (and Projects' old runway). It
  used to fall back to a plain list of five cards below `lg`, which lost the
  effect entirely. The rAF loop runs only while the runway is on screen (an
  IntersectionObserver). (Earlier, while the deck was `display: none` below `lg`,
  that observer was also the mobile guard; superseded now that it runs at every
  width.)
- Under reduced motion a plain stacked list is rendered instead of the runway
  (the `reduced` branch), so there is no scroll-driven transform and no duplicate
  set of cards sitting hidden in the DOM.
- Cards are `absolute inset-0`, so the deck container **must carry its own
  height** — and a uniform one, or the progress underline moves as cards swap.
  It's `h-[19rem] sm:h-[17.5rem] xl:h-[18.5rem]` — taller on the narrowest screens,
  because the card's own text wraps to more lines there. Re-check the fold if you
  add a line of copy.
- `d` is the signed distance from the top of the deck: negative = already dealt
  (slides up and out), positive = still to come (waits below, scaled down). Both
  fade, so only the card at d ≈ 0 is fully opaque.
- `zIndex` is `100 - abs(d) * 10` plus a `d >= 0` bias. The bias breaks the tie
  mid-swap (both cards at `abs(d) = 0.5`) so the incoming card crosses over the
  outgoing one rather than under it.
- **Inactive cards are transparent but still in the layout**, so they're
  `aria-hidden` and `pointer-events-none`, plus `tabIndex={-1}` when a card has an
  `href`. Without that a click lands on an invisible card and keyboard users tab
  into one they can't see. Verified: only the active card is in the a11y tree.
- The background colour is a prop landing on `--cert-bg`, defaulting to
  `--color-brand`. It's the page's only full-bleed brand band — see Rails for why that needs `surface="brand"`, and STYLE.md for why it's still one
  accent.
- `PACE` (viewport heights of runway per card) is the speed knob; track height is
  `100 * (cards * PACE + 1)` vh, the extra one for the settle at the ends. It went **0.6 → 0.4 when the deck grew from 5 cards
  to 11** — at 0.6 the section alone was 7.6 viewport heights, which is a long time
  to spend inside one band. 0.4 puts it at 5.4 and each card still gets a visible
  hold. Re-check this if the count changes again.
- Card heights are fixed (`h-[19rem] sm:h-[17.5rem] xl:h-[18.5rem]`), so a long
  credential name can silently overflow. Verified with all 11: nothing clips at
  1440 or 390, and the longest name is "Python for Data Science, AI & Development".

Where the 11 entries came from is under Content and data.

## Contact

### FormSubmit (2026-10-21)

- **`Contact.tsx` posts to FormSubmit** (`formsubmit.co/ajax/<EMAIL>`, chosen by
  Ahmed 2026-10-21 — no account). The first submission only sends Ahmed an
  "Activate Form" email; nothing is delivered until he clicks it. Honeypot field is
  `_honey`, FormSubmit's own. The `BUDGETS` ranges are form options, not a price list.
  **Changing `EMAIL` needs a new activation**: the endpoint is the address itself.
  FormSubmit relays each submission to `EMAIL`: no account, no key. Until the
  activation link is clicked, submissions are not delivered and the form shows
  the error state.
- `EMAIL` is `hello@ahmedislam.tech`, which Cloudflare Email Routing forwards to
  Ahmed's Gmail; replies go out through Brevo (Hosting and domain › Domain and
  email). `WHATSAPP` is from the CV.

### One form, two halves

**Contact** — `Contact.tsx`.

One `<form>` split across two columns: the left half is what the project is
(service checkboxes from `data/services.ts`, budget, timeline), the right half is
who you are (name, email, company, message). They stack below `lg`, which is why
the lead copy must never say "on the left / on the right".

### Details

- **The service chips are real `<input type="checkbox">`** made `sr-only` with the
  label styled off `peer-checked:`. Don't swap them for `<div onClick>`: this keeps
  keyboard operation, the a11y tree and `FormData` serialisation for free, and the
  checkbox `value` is the service title, so submissions are readable without a
  lookup table.
- The checkbox group is a `fieldset`/`legend`, so it's announced as one named group
  rather than seven loose controls (six when this was written).
- **Honeypot** (`_honey`, FormSubmit's own; it was `_gotcha` before the move to FormSubmit) is off-screen, `aria-hidden` and `tabIndex={-1}`; the
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

### The `?service=` pre-tick, and dropping the param

A service page's "Start a project" links to Contact with `?service=<id>`, so that
service arrives ticked. Done after mount, not as `defaultChecked`: the page is
HTML rendered at build time, which has no query string, and React keeps the
build-time attributes when the first render disagrees. Then the param is dropped
from the address: its job is done, and left there it rode along for the rest of
the visit (`/?service=x#top` after clicking the logo) and into any bookmark or
shared link. `replace`, so Back doesn't return to it; the hash is kept and nothing
scrolls. How Home then lands on `#contact` is under Service pages.

## Footer

### Not a section

**Footer** — `Footer.tsx`.

**Not a section.** No index number, absent from `SECTIONS`, and rendered outside
`<main>` — the rail tracks content, and a footer isn't content. It keeps
`lg:px-20` anyway, because the two fixed gutter rails don't stop existing there.

### The step down to `ink-deep` and the rounded edge

- `bg-ink-deep`, not `ink`. Contact directly above it is already `ink`; without the
  step down *and* the `rounded-t-[2.5rem]` edge the two merge into one unbroken
  slab.
- **The `-mt-10 lg:-mt-14` is load-bearing.** `rounded-t` reveals whatever is
  *behind* the footer, and that's the body — `paper` — so the two top corners
  rendered as **white notches**. Pulling the footer up over Contact puts that
  section's ink behind the curve instead, which is the subtle step the rounding
  was meant to read as. `z-10` keeps it painting on top. Don't remove the negative
  margin without also solving what sits behind those corners.
- `border-t border-white/[0.08]` is what makes the curve legible at all: ink-deep on
  ink is a 7-value step, so without the hairline the rounded edge is invisible and
  the overlap just looks like a flat join.

### Below `lg` the footer is a 2-column grid

- **Below `lg` the footer is a 2-column grid, not a stack.** Navigate and Services
  sit side by side; Elsewhere spans both rows underneath as a row of bare icon
  buttons (`aria-label` carries each name, `hidden lg:inline` on the text). Stacked
  full width with names, the three lists ran to roughly three phone screens before
  you reached the wordmark — the Elsewhere column alone was as tall as the other
  two combined. Navigate only splits into two sub-columns from `lg`: at 390px each
  parent column is ~167px (the code comment had ~163px), and splitting that again
  cannot hold "Certifications".
- The bottom bar is **centred while stacked**, then splits left/right from `sm`.
- Until 2026-11-13 a Blog link closed the Navigate list, with an arrow in its
  number slot for "this leaves the page". It went when the blog was unlinked (see Blog).
- The availability pill is green, here and in the hero only: it is the same
  availability signal as the hero pill (STYLE.md's single-accent rule).

### `SocialRail` hides over the footer

- **`SocialRail` hides over the footer** (`hidden` prop → `invisible opacity-0`,
  which also drops the links out of the tab order). The footer lists every link
  already, and the fixed rail sat directly on that column. Gated on the same
  centre-line `rootMargin` as `useActiveSection`, via an observer on `#site-footer`
  in `Home.tsx` (`inFooter`), so the rail hands over at exactly the point the
  rest of the page considers you to have left the last section. `invisible`
  rather than `opacity-0` alone also takes the links out of the a11y tree, so they
  can't be focused while faded out. `SectionRail` deliberately stays — it still reads `09`, which is
  where you were.

### The giant `AHMED.`

- **The giant `AHMED.` is sized in `vw`** so it spans the viewport at every width
  rather than sitting in the content column; that full-bleed scale is the whole
  point. `leading-[0.72]` crops the font's built-in shoulder so the letters sit
  tight to the bottom bar instead of floating above it.
- **Its size is from a measurement, not a guess.** "AHMED."
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

### The copyright year

The year is computed, so it can't silently go stale. The page HTML carries the
build's year; after New Year, until the next deploy, the browser's year differs,
and with `suppressHydrationWarning` that one text node may keep the old one
rather than fail the whole page's hydration.

### The heart emoji

The "Built with" line's emoji is here by request. It's the one exception to
STYLE.md's "no emoji as icons" rule, and its red is the one non-palette colour on
the page; swap in an SVG heart in `text-brand` to undo both. It carries
`role="img"`/`aria-label="love"` so it's announced as "love", not read as
punctuation or skipped entirely.

### A tall footer broke `useActiveSection`

- A footer taller than half the viewport broke `useActiveSection`: while the centre
  line sits inside it, *no* section intersects, so on a restored scroll position or
  a deep link near the end nothing ever fired and the rail claimed section `01` at
  the bottom of the document. The hook now seeds `active` from geometry on mount, rather than trusting `ids[0]` —
  the last section whose top is above the centre line; ordinary scrolling then
  passes through every section and the observer takes over. Verified `09` both after a
  real scroll to the bottom and after reloading while parked there.

The footer's Privacy link and Cookie settings button are under Analytics and privacy.

## Blog

### Moved to blog.ahmedislam.tech (2026-11-13)

On Ahmed's instruction the blog left this site for its own repo, **`my-blogs`**, served at
**blog.ahmedislam.tech**, and gained a second kind of post, the case study. Everything that
rendered posts went with it: `BlogPage`, `BlogPostPage`, `PostCover`, the Markdown compiler
(`marked` and `highlight.js`), the code-block and syntax styles and the reading-progress line.
**Its design history went too, to `my-blogs/HISTORY.md`.** Why a subdomain: Ahmed's call; the
trade-off is that search engines treat a subdomain largely as its own site, so posts no
longer add weight to ahmedislam.tech.

**Then, the same day, unlinked entirely** (Ahmed: "it is a totally separate thing, so
keep it separate"). The first version kept a Blog button in the nav, a Blog link in the
footer, forwarding pages for the old `/blog` addresses and a line in /privacy saying the
policy covered the blog. All four are gone. **Nothing on this site links to the blog or
names it.** The nav's orange CTA went back to "Let's work together" at every width, since
the short label only existed to make room for the button (see Nav). Old `/blog` URLs, like
any unknown URL, now redirect home through a `*` route instead of rendering a blank page;
the one post's search listing will drop out on its own.

What remains from the move:

- `BackPill` and `TalkPanel` moved out of `BlogPostPage.tsx` into their own files, since the
  service pages and /privacy use them.
- `.prose` stays in `index.css`, trimmed to the element styles /privacy uses (Reading
  surface in the blog repo's HISTORY.md says why it is hand-written).
- The plugin file was `blog.vite.ts` until the move. It now only writes the site's own pages,
  so it is `site-pages.vite.ts`.

### Reached from the nav, never the landing page (2026-10-25)

Superseded 2026-11-13: the blog left the site and its button went with it. Kept for the
nav measurements.

`/blog` and `/blog/:slug` (now blog.ahmedislam.tech), reached from a **Blog button in the nav pill** (and a
footer link), never from the landing page — Ahmed's call. It is a button and
not an eighth link because the links scroll this page and Blog leaves it; it
also could not be a link, since the row had 16px to spare at 1024. The orange
CTA reads "Let's talk" below `xl` to make room: with the Blog button beside it,
the full "Let's work together" label pushed the row 60px past the pill at 1024
(measured). Measured 42px of clearance at 1024 afterwards, no overflow at
1024/1100/1280/1440. The Blog button is one element at every width; below `lg`
it sits beside the menu toggle.

## SEO and prerendering

### What crawlers read: one real HTML page per route (2026-11-11)

The site is a client-rendered SPA, so what search engines can read without
running JS is the `<head>` of each HTML file. That is where the SEO lives:

- **One real HTML page per route**, written at build by the `site-pages`
  plugin in `site-pages.vite.ts`: `projects.html`, `services/<id>.html` and
  `privacy.html`, each with its own title, description, canonical and
  `og:*`. A LinkedIn or X share then previews that page rather than the home
  page (crawlers don't run JS), and GitHub Pages serves `/projects` from
  `projects.html` with a 200 instead of going through the 404.html shim, which
  search engines see as a 404. It is the one place that knows every route at
  build time. `projects.html` used to be a `cp` of the home shell in
  `deploy.yml`, so /projects claimed to be the home page (same title,
  description and canonical). **The `cp` is gone —
  re-adding it overwrites the real page after the build.**
- **`sitemap.xml`** is generated by the same plugin from the real routes (only
  URLs that return a 200 on Pages). The blog has its own sitemap on its own site.
  **`public/robots.txt`** points to it.

The page per service is under Service pages.

### Structured data

- **Structured data.** `index.html` carries a Person + WebSite JSON-LD block
  (`#person-ld`) that every copied page inherits; each service page adds a
  `Service` block via `withMeta`'s `jsonLd`. The blog repo repeats the Person
  block with the same `@id`, so posts and portfolio are one author. The Person `sameAs` repeats
  the profile links from `data/socials.ts` (not WhatsApp, a chat link). A DEV
  check in `socials.ts` warns if the two drift; add a link in both places.

### Titles and headings (SEO step 2)

**Titles and headings (SEO step 2).** The voice stays; the search words go
where search engines weigh them, with no visible text changed:

- **`data/pages.ts` is the one source** for the home, /projects and /privacy
  titles and descriptions. `site-pages.vite.ts` writes them into each page's head
  (the home page's too, rewriting the shell) and the pages set
  `document.title` from the same object. They used to be hand-typed twice,
  and arriving at home by an in-app link kept the previous page's title.
  Services keep their own (`seoTitle`). Titles lead with
  the name and carry the words people search for; Google shows about 60
  characters, so the most important words go first. Descriptions stay under
  ~160. `pages.ts` is imported by `site-pages.vite.ts` in Node, so it stays plain data.
  index.html's literal title/description are only what dev shows; keep them
  equal. Home sets its title in an effect because the other pages restore
  whatever title was there when they mounted.
- **The home H1 is the role pill plus the tagline**: "Full-Stack AI Engineer ·
  Web & Agentic" + "I build products that work beyond the demo." The pill
  used to be a `<p>` above an H1 that named no skill. Measured: pill,
  headline and lead are pixel-identical at 1440 and 390. Don't move the pill
  back out of the `<h1>`; the "available" status is a separate sr-only `<p>`
  now, since it isn't part of the heading.
- The section H2s ("What I deliver.", "Things I've shipped.") were left as
  they are, on purpose: the service pages now carry the keyword headings, and
  rewording the home page's for search would trade the voice for little.
- The Person JSON-LD carries `description`, `knowsAbout` (15 skills, all in
  Stack.tsx or the CV) and `alumniOf`. Keep `knowsAbout` to things the site
  shows evidence for.

### Prerendered HTML (SEO step 2)

**Prerendered HTML (SEO step 2).** Every page's HTML now contains its
rendered content, not an empty `<div id="root">`, so crawlers that don't run
JS (Bing often, every link-preview bot) read the text. `npm run build` is now
three steps: the client build (which writes the per-route HTML), an SSR build
of `src/entry-server.tsx` into `dist-ssr/`, then `node prerender.mjs`, which
fills each page's root and deletes `dist-ssr/`. Routes are read off the HTML
files the build wrote, so a new route needs no list here: `index.html` → `/`,
`projects.html` → `/projects`, `services/x.html` → `/services/x`. `404.html` is
skipped: it is the GitHub Pages redirect shim, not a page. Each root is marked with `data-route`, and `main.tsx` adopts
the markup with `hydrateRoot` when `data-route` matches the URL, and falls back
to `createRoot` otherwise (dev, and unknown URLs served 404.html → home HTML).
Visitors don't see all of it before the bundle loads: `[data-reveal]` content
stays hidden until it is revealed, as before.

Rules this imposes, each one learned while wiring it up:

- **Nothing may read `window`, `document` or `matchMedia` while rendering**,
  only in effects. The build has no browser, and the browser's first render
  must match the build's HTML exactly: on a mismatch React 19 keeps the
  build-time attributes and does not patch them. That is why reduced motion
  is `hooks/useReducedMotion` (false first, real value after mount, so
  reduced-motion visitors get one re-render a moment later; reading `matchMedia`
  in a `useState` initialiser made the two disagree) and the Contact `?service=`
  pre-tick is an effect, not `defaultChecked`. The consent banner opens after
  mount for the same reason.
- **Two-tone headings carry `{' '}` between their `.block` lines.** On screen
  it is nothing (whitespace between blocks); in the text a crawler reads, it
  is what stops "Agentic AI" + "systems." becoming "Agentic AIsystems.".
- **The marquees fill in after mount** and are not in the HTML: both bands draw
  every icon twice, and those 128 brand paths, aria-hidden and well below the
  fold, were 224 kB of the home page's 427 kB. `h-12` on the track holds the
  row's height meanwhile. Big decorative SVG belongs after mount; text belongs
  in the HTML.
- **Keep the root div in `index.html` empty and written exactly as it is.**
  `prerender.mjs` finds it by that exact text (`EMPTY`) and fills it with each
  page's rendered HTML. Don't quote that markup in a comment in `index.html`
  either, or the text match could hit the comment.
- **Verify with the production build**, not dev (dev never hydrates):
  `npm run build && npx vite preview`, then on every route check that no node
  under `#root` is replaced on load and the console has no errors. Measured
  2026-11-11: all 11 routes adopt their HTML with 0 errors; with JS off the
  home page has ~1,680 words, the post ~2,550, each service page 560–790.

## Analytics and privacy

### Google Analytics 4 with Consent Mode (SEO step 2)

**Analytics (SEO step 2).** Google Analytics 4, Ahmed's choice over Umami
(2026-11-11), with Consent Mode v2 and a **Europe-only banner**, also his
choice. Everything is in `src/analytics.ts`. **`MEASUREMENT_ID` is
`G-QFPNV9V4Q4`** (2026-11-12): property "ahmedislam.tech", added to the GA
account Firebase created for Dukaan, kept separate from its
`dukaan-inventory` property. The setup page also showed a Tag Manager
snippet (`GTM-K2X52LHZ`); it is not used, gtag.js talks to GA directly.
With the ID emptied, nothing loads, no banner shows and the minifier drops
the GA code entirely.

### Consent

- **Consent.** Two `consent default` calls: `denied` for the EEA/UK/CH
  (Google applies it by its own geolocation, and sends only cookieless pings
  until they accept), `granted` everywhere else; ads storage denied for
  everyone, since the site runs no ads. The banner asks only visitors whose **time
  zone** is in Europe: a static site has no server to ask for a country, so
  it errs wide. A choice goes to localStorage and is re-sent as a `consent
  update` on every load; Decline sends `denied` explicitly, because outside
  the region the default is `granted`. Footer "Cookie settings" reopens it
  (an `OPEN_CONSENT` window event). Accept and Decline are the same size.

### Events

- **Events.** GA4 records page views itself, including in-app navigation
  (Enhanced Measurement's "browser history events"), outbound clicks (projects,
  profiles, WhatsApp) and file downloads (the CV). The site's own events, for
  "which visits become enquiries":
  - `generate_lead`: the contact form went through, GA4's own name for it.
    Params: services, budget, timeline; what was asked for, never who (not the
    name, email or message).
  - `contact_failed`: it didn't.
  - `contact_cta`: a click towards the form. `from`: nav, about, service_hero,
    service_faq, talk_panel.
  - `email_click`: a mailto link. `from`: hero, contact, footer.

  GA4 records each event's page, so `from` only separates buttons on one page.

### Clicks are tagged with `data-track`, not Umami's attribute

- **Clicks are tagged with `data-track="event"` + `data-track-<key>`**, read
  by one capture listener (`startAnalytics`) for the whole site. It only
  listens, never holds or redirects the click, and gtag sends with sendBeacon, so
  an event survives a click that leaves the page. Not Umami's `data-umami-event`: its handler holds
  same-tab links and reloads the page at their href, which broke in-app
  navigation and turned the CV `download` into a page visit.

### `MEASUREMENT_ID: string`, typed wide on purpose

- **`MEASUREMENT_ID: string`, typed wide on purpose.** As a bare `''` literal,
  `MEASUREMENT_ID !== ''` is a type error the moment a real ID replaces it,
  so adding the ID would have failed the build. Found by testing with one. The
  ID is at GA4 → Admin → Data streams → (web stream) → Measurement ID; it is
  public, not a secret, since it ends up in every visitor's page.

### Only `ahmedislam.tech` loads it

- Only `ahmedislam.tech` loads it, so dev and preview never count. To test the
  real path, serve dist/ under that hostname with Puppeteer request
  interception, stub gtag.js and FormSubmit, and read `window.dataLayer`.

### `/privacy`

- **`/privacy` describes this setup and FormSubmit.** Change it if either
  changes. It is prerendered but kept out of the sitemap. Rewritten
  2026-11-12 in a formal register on Ahmed's request ("professional
  sentences"), with the usual sections (controller, data, use, cookies,
  third parties, retention, rights, changes, contact). Its "up to 14 months"
  retention assumes GA4's data retention is set to 14 months (the default is 2,
  which is also "up to 14"). It was added because Google's terms require a site
  using GA to disclose it in a privacy policy; the consent banner and the footer
  link to it. It is DRAFT, written from what the site actually does
  (`analytics.ts`, `Contact.tsx`); not legal advice. The body is plain elements
  inside `.prose`, the reading styles the blog used, so it needs no styling of its own.

### The banner's concept: consent as a connection

- **The banner's concept is consent as a connection** (Ahmed asked for
  "attractive, a unique concept"): a mini diagram, You → This site ┄┄
  Analytics, in the service diagrams' node style, the last link dashed because
  it isn't made yet. Hover/focus on a button previews its effect on the link
  (Accept lights it, Decline fades it); the answer shows as "Connected" (solid,
  pulsing link) or "Declined" (cut link) for 1.3s before the card leaves. One
  label row ("Analytics cookies" + status) keeps it at 283px: a separate
  eyebrow and heading said the same thing and made it 334px. The link is 2px:
  at 1px the orange read as grey. The visitor sees what the choice does, not
  just a policy sentence.
- The banner (`ConsentBanner.tsx`) opens after mount, never during render: the page HTML is built
  ahead of time and has no idea who is visiting, so it holds no banner, and the
  first render must match it. It sits bottom-left, clear of `SocialRail`. It is
  not a modal and takes no focus. Accept and Decline weigh the same: a choice
  nudged by button size isn't consent. Under reduced motion the card leaves at
  once.

### The footer's Privacy and Cookie settings links (2026-11-11)

- The footer has a **Privacy** link since 2026-11-11 (`/privacy`, added with
  Google Analytics, whose terms require one) and, once GA is configured, a
  **Cookie settings** button (EU consent law: a choice has to be as easy to
  change as to make). `-my-3 py-3` keeps their 44px target without growing the
  bottom bar. Still no Terms link: that page doesn't exist,
  and a dead link is worse than no link.

## Icons

### `TechIcon.tsx`: brand marks and concept glyphs

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
- **`Electron` and `TypeScript` were added 2026-09-20 for Flintgrab's card** and
  are deliberately NOT in `Stack.tsx` — that file is Ahmed's curated skill set and
  his to change; a project's stack is a fact about the project. `WebTorrent` has
  no simple-icons slug, so that chip renders the generic cube: the documented
  fallback, not a missing entry.
- **Kotlin, Jetpack Compose and ML Kit** were added for Dukaan's card
  (2026-11-05), same reasoning as Electron. ML Kit gets the hand-drawn scan
  glyph: it is what the app uses it for (on-device barcode scanning), simple-icons
  has no ML Kit mark, and Google's own logo would claim more than the card means.
- **Deep Learning uses `nodes`** rather than `layers`: it's the canonical
  net-graph glyph, and it keeps the ML group from showing four identical stacks
  (CNNs, U-Net, Transfer Learning). `nodes` is also used for RAG; the comment
  reasoned that RAG lives in a different tab and only one tab renders at a time.
  Since 2026-11-13 the field shows every tool by default, so the two now appear
  together in the full set; within one tab the ML group still has no repeat.
- **BeautifulSoup shares the funnel** with `Web scraping`: simple-icons has no
  BeautifulSoup mark, the two only ever appear on the same card, and a repeated
  glyph there reads as one idea rather than two mistakes.

### Adding a technology

Adding a technology: add the string to the right group in `Stack.tsx`, then add a
`TechIcon` entry. Unmapped names silently fall back to the `cube` glyph.

**One exception: a `Project.stack` entry needs only the `TechIcon` entry**, not a
place in `Stack.tsx` — that file is Ahmed's curated skill set, and Arduino, ROS
and BeautifulSoup are facts about a project rather than skills he sells. See
Projects › What the card shows instead for the full reasoning.

### Social icons: mixed sources, and that is forced

**Icon sources are mixed, and that is forced.** The four added in 2026-08
(GitHub, Medium, LeetCode, X) come from `simple-icons` as named imports, like
`TechIcon.tsx`: accurate, maintained, and tree-shakes. The other five keep
hand-written paths because **`siLinkedin`
does not exist in simple-icons v16** — dropped for trademark reasons, exactly
like OpenAI/AWS/Azure. With LinkedIn permanently hand-drawn there is no version
of the file that is purely one or the other. Check a slug exists before assuming.

## Content and data

### The two-offer positioning (2026-08-12)

**The site sells two things, not one** (repositioned 2026-08-12 on Ahmed's
instruction): AI/agentic engineering *and* web development on its own terms. The
role line reads "Full-Stack AI Engineer" in the hero pill, About, the footer and
`<title>`; `data/services.ts` carries a `web` offer with no AI in it; and React
and Next.js are named in the stack, the hero chips and the About watermark. If you
are tempted to narrow any of that back to "AI Engineer", don't — it was a
deliberate widening, not drift.

### The CV is the source of truth, with two inversions (2026-08-12)

**The CV is the source of truth for anything factual.**
`public/Ahmed-Islam-CV.pdf` drives the Work/education entries, the skill
groupings in `Stack.tsx`, and the About copy. If the CV changes, update those.

Two places now hold more than the CV does, both on Ahmed's explicit instruction
(2026-08-12), and both are noted where they live: `Stack.tsx` carries 15
technologies the CV omits (13, plus **React and Next.js** added with the
full-stack reframe), and `certifications.ts` carries six certifications the CV
never lists. **The CV is now the thing that's behind**, not the site — that
inverts the rule above for those two files only, so don't "correct" them back.

### Client websites, and Flintgrab (2026-09-20)

The same instruction confirmed Ahmed has **shipped real client websites**. That is
why `services.ts` sells web development outright rather than hedging. But **none of
that work is in `data/projects.ts`** — that was true until 2026-09-20, when
`flintgrab` was added: a Windows desktop app, a browser extension and a
marketing site, built in Electron/React/TypeScript/Tailwind. It is the first
non-AI/ML entry in the gallery and the first thing standing behind what
`services.ts` sells. The Services copy still names no client, no site and no
number — it now *could* point at Flintgrab, which is Ahmed's call to make.

Flintgrab's `summary` is Ahmed's wording: read off the product's own
`index.html` meta description and the app README's opening line, both written by
him. Not paraphrased loosely: the "streaming manifests" framing is his, and it is
the thing that says why this is harder than a download button. Its link, status
and stack are under Projects.

### `data/projects.ts` is real

`data/projects.ts` is **real**, not a seed: ten projects with verbatim URLs.
Seven were supplied 2026-08-15 (`href` and `name`); `segments` was added
2026-08-30 on Ahmed's instruction (featured in place of `content-moderation`),
and its copy is read off the product screen Ahmed supplied rather than invented:
the prompt "All the players with 0 bookings in the previous 30 days", the
resolution steps beneath it, and the feature blurb "AI-powered tools segment
players by behaviour, activity, and spending so you act on real data". Nothing
is inferred beyond what that screen states. Its `stack` is the one unverified
field on it and carries a `TODO(Ahmed)`: it mirrors PadelGPT's, since both are
AI features of the same platform, but Ahmed has not confirmed what this feature
runs on. Correct it or trim it.
`flintgrab` followed on 2026-09-20 and `dukaan` on 2026-11-05.

### `dukaan` (2026-11-05)

**`dukaan`** is an offline Android app (billing, stock, udhaar) whose source is
`D:\inventory_management_app`, public as `Ahmed-Islam-AI/Dukaan-Inventory`. It
took `segments`' place in `FEATURED`.
Every fact on its card is from that repo's README. Its `status` is **`APK`**, a
third value beside `LIVE` and `SOURCE`: not on the Play Store, so there is no
site to visit. The repo is public, but Ahmed chose the release page as the
destination because that is where a visitor can install it
(`Dukaan-<version>.apk`); `releases/latest` always opens the newest release, so
the link never needs bumping. Screen-reader
labels come from `destinationOf()` in `data/projects.ts` ("download page" for
`APK`), so a new status is one edit, not three. Its copy was run through the
humanizer skill on Ahmed's instruction, then checked with the asd-ste100
linter (0 findings: no semicolons, sentences under 25 words). "Its first client
is a phone shop in Lahore" is the README's claim, and it names no shop, so
neither does the card. Its `stack` is from the README's "Under the hood" table:
Kotlin, Jetpack Compose, Room on SQLite, optional Firebase sync, ML Kit for
on-device barcode scanning.
Three CV-derived placeholders were dropped when it was populated (Padelos MCP
Server, Multimodal RAG Tutor, BraTS Tumour Segmentation with its real 0.71 Dice)
— they had no link, and beside the linked cards they read as broken. They are
still in the CV, which is downloadable from the same page. `status` is the one
derived field and stays factual: `LIVE` for a deployed product (three today:
`padelgpt`, `segments`, `flintgrab`), `SOURCE` for the public repos, `APK` for
Dukaan. **Don't invent a metric or a client for a card.**

### `summary` and `stack` are DRAFT (2026-08-21)

`summary` and `stack` were added 2026-08-21 and are **DRAFT** — read off each
repo's own README and file tree, not written by Ahmed (Flintgrab's are the
exception, above). A `summary` is "one factual line: what the thing does. Read
off the repo, never invented." Nothing claims a client. The single `metric` is
quoted from the `content-moderation` README. The seven poster images the gallery
used to render are **gone**; see Projects for why, and treat
"a real capture or nothing" as the rule there.

### Never invent biography

**Never invent biography.** Job titles, dates, employers, degrees, grades and
metrics are Ahmed's professional record. If a value isn't in the CV or hasn't
been given, use an obvious placeholder and say so — do not fill the gap with
something plausible.

### `data/testimonials.ts` is real and quoted verbatim (2026-08-12)

**`data/testimonials.ts` is real and quoted verbatim.** Five LinkedIn
recommendations, supplied by Ahmed 2026-08-12, replacing the invented placeholders
the section shipped with. Rules that follow from that:

- **Don't edit the prose.** Not the grammar, not Murtaza's `❤`. STYLE.md's no-emoji
  rule governs the site's own iconography, not what a real person wrote. (It renders
  as the monochrome text glyph, so it doesn't add a second colour either.)
- **`pull` must stay a verbatim contiguous substring of `quote`.** The composite
  shows `pull` and the ledger shows `quote`; a `pull` that isn't literally inside
  its `quote` is a testimonial this site made up. A `import.meta.env.DEV` loop at
  the bottom of the file throws on boot if that ever stops being true; it is
  cheap enough to run on every dev boot, and the guard strips it from the
  production bundle. Keep a `pull` to ~18-25 words; longer runs stop reading as a
  single voice in the flow.
- **Only Arham describes hiring Ahmed.** The other four are classmates, an FYP
  partner and colleagues. That is why the lead copy says "recommendations" and the
  `relation` field is on every row — calling five LinkedIn endorsements "client
  reviews" would be the invented-credentials problem wearing real names. The
  `relation` values are *read from* each quote, not supplied, so they're the one
  thing in the file worth having Ahmed confirm.
- Dropped from the source data on purpose: `rating` (five identical five-star rows
  carry no information — the same reasoning that replaced the reference design's
  colour-coded category dots with counts; if a rating ever varies, it becomes
  worth showing) and `avatar` (the files live in the old site,
  `/images/walloflove/`, not in this repo, and five portraits would be a new
  shape on this page, so check STYLE.md first if you add them).
- Ordered strongest-first for the composite: Arham is the only one describing a
  paid engagement, so his line opens the paragraph, and Murtaza's eleven words
  close it.

### Section headings must not overlap in meaning

Section headings must not overlap in meaning. `03` is **"Where I've been."** — it
was "Selected work." until projects (then numbered 06) became "Things I've shipped.", at which point
two headings both claimed the same territory. `03` is the employment + education
timeline; `08` is the project gallery. Reviews is **"In their words."** rather than
"What they said." for the same reason — Services at `05` is already "What I
deliver." and two adjacent `What…` headings read as one section split in half.

### Reading the CV PDF

Reading the PDF: `Read` with `pages:` fails on this machine (no poppler).
Extract text with a dependency-free Node script — inflate the `stream`/`endstream`
payloads with `zlib`, then pull strings out of the `Tj`/`TJ` text operators.
Link annotations do not survive this, so hyperlink targets are not recoverable.

### Placeholders, open and closed

**Still placeholders** (need Ahmed's real values):

- ~~`data/socials.ts` placeholders~~ — **all real as of 2026-08-30.** Nine links,
  supplied by Ahmed. See the socials note below for the rail/footer split.

- `data/certifications.ts` — **11 entries from two sources that don't overlap.**
  Entries 1-6 came from Ahmed's LinkedIn (real dates, a link); entries 7-11 are the
  CV's; their dates and the LinkedIn `href` were supplied by Ahmed 2026-10-21
  (the CV itself has no dates). Nothing was dropped in the merge
  because both lists are real; **the CV PDF still lists only the five, so it and
  the site now disagree** — Ahmed's to reconcile.
  All eleven `href`s (six until 2026-10-21) use one constant, `LINKEDIN_CERTS`,
  and point at the same LinkedIn *certifications list*, not at
  per-credential pages, which is why the card affordance reads `View →` and not
  `Verify →`, and why no badge claims `VERIFIED`. Swap in real Credly/Coursera
  URLs per entry (a one-line change on that entry) and the wording still holds.
  The two sources were merged 2026-08-12. Entries 1-6 carry skills taken from
  the credential itself; 7-11 are verbatim from the CERTIFICATIONS block of
  Ahmed-Islam-CV.pdf, and their `detail` still restates each course's own
  subject: swap in the real credential ID once known. `badges` are topic tags,
  never status claims.
- `data/testimonials.ts` — the quotes are real, but the `relation` line on each row
  is inferred from the quote text. Worth Ahmed confirming; see the content rule above.

- ~~No **web** project in `data/projects.ts`~~ — **closed 2026-09-20** by
  `flintgrab`. The remaining gap is narrower: Flintgrab is Ahmed's own product,
  not *client* website work, so the client sites Services sells are still
  unrepresented. A client site would need the client's permission to name.

The other placeholder items live with their areas: Privacy/Terms under Analytics and privacy, FormSubmit under Contact, the nav anchors and nav order under Nav, `/work/:slug` under Projects.

### Writing rules: `asd-ste100` (2026-11-11)

**Writing rules.** The `asd-ste100` skill (Simplified Technical English,
installed globally 2026-11-11) was applied, on Ahmed's call, to the blog post,
the project summaries and the image alt text only. It is built for technical
and factual text and says so itself ("not for creative or marketing copy"), so
the hero, About, Services and Method keep their voice, and the testimonials are
verbatim and never edited. Its linter is
`python ~/.claude/skills/asd-ste100/scripts/ste-lint.py <file>`; the blog post
and the project text both lint at 0 findings. A semicolon or a 26-word sentence
in those is a regression.

### Socials: the rail shows five, the footer shows nine (2026-08-30)

`data/socials.ts` holds all nine real links (2026-08-30). **The two consumers
deliberately render different sets**, which is the thing to preserve:

- **`Footer`** maps `SOCIALS` — all nine: WhatsApp, LinkedIn, GitHub, Upwork,
  Medium, LeetCode, X, Instagram, Facebook.
- **`SocialRail`** maps `RAIL_SOCIALS` — the five flagged `rail: true`
  (WhatsApp, LinkedIn, GitHub, Upwork, Instagram).

Two reasons, and the second is measured:

1. STYLE.md's rule for both gutter rails is that they stay quiet at rest and
   never compete with content. Nine stacked circles is a menu bolted to the edge
   of the page, not a signpost.
2. **The rail's length is a layout constraint.** It is `size-11` + `gap-2`,
   centred on the viewport, so it stands `n * 44 + (n - 1) * 8` px tall. At nine
   that is 460px, and measured at **1024x600 it overlapped the fixed nav by
   16px**. At five it is 252px and clears the nav by 88px at that same size.
   A `import.meta.env.DEV` check in `socials.ts` warns if that stops holding.

Adding a link means adding it to `SOCIALS` only. **Five is the tested ceiling —
don't flag a sixth `rail: true` without re-measuring at 1024x600** — put it in
the footer, which is where the complete set belongs.

All nine URLs were supplied by Ahmed 2026-08-30. The four placeholders that
shipped (Facebook, Instagram, LinkedIn, Upwork) are gone; WhatsApp was already
real, from the CV. The order is deliberate: WhatsApp first because it is the one
direct-contact channel, then the professional profiles a hiring visitor actually
wants (LinkedIn, GitHub, Upwork), then proof of work (Medium, LeetCode), then the
social accounts.

Why the social icons come from two sources is under Icons.

## Hosting and domain

### GitHub Pages, and the SPA rewrite

**`BrowserRouter` + a second route needs a host rewrite**, or a hard load of
`/projects` 404s. Host is unknown, so all three ship and each is inert where it
doesn't apply: `vercel.json`, `public/_redirects` (Netlify), and
`public/404.html` + a four-line decoder in `index.html` (GitHub Pages, which
can't do rewrites). Verified against `npm run preview`: `/projects` returns 200.
**Correction (2026-10-21):** only the Pages half was ever in the repo; `vercel.json`
and `_redirects` never were. The host is now **GitHub Pages** at `ahmedislam.tech`,
deployed by `.github/workflows/deploy.yml` on every push to `main`, with
`public/404.html` (whose encoder matches the decoder in `index.html`). The
decoder is the inline script in `index.html`: it puts the real path back before
React Router reads the URL, and is a no-op on every other host, and on Pages for
any URL that didn't come through 404.html, because nothing else produces a `?/`
query. No
`CNAME` file: an Actions deploy ignores it; the domain lives in repo Settings → Pages.

### Never name a folder like a route

`public/project-images/` was renamed from `projects/` 2026-10-21: a folder named
like the `/projects` route made GitHub Pages serve it as a directory, 301 to
`/projects/` then 404. The blog followed the same rule while it lived here
(`blog/index.html`, not `blog.html`; images in `blog-images/`). The blog's own repo
applies the rule to post slugs.

### Domain and email (2026-11-12)

The site's address is **`hello@ahmedislam.tech`** (Hero, Contact + its FormSubmit
endpoint, Footer, Privacy, README). It replaced `ahmedislam.official@gmail.com`,
which is still where the mail lands. All of it is on free plans:

- **DNS is on Cloudflare** (nameservers `anirban`/`sharon.ns.cloudflare.com`);
  the domain is still *registered* at Namify, whose DNS records page is now
  unused. **The GitHub Pages records are "DNS only" (grey cloud), on purpose**:
  GitHub issues and renews the HTTPS certificate itself, and the proxy can break
  that. Ignore Cloudflare's "proxy your records" prompts.
- **Receiving**: Cloudflare Email Routing forwards `hello@` to the Gmail. One
  rule, catch-all off.
- **Sending**: Brevo's free SMTP relay (300/day), used from Thunderbird and
  iPhone Mail as a `hello@` identity. Not Gmail's "Send mail as": Google ends it
  for outside addresses in January 2027. Brevo adds a tracking pixel to HTML
  mail, which cost 2.5 points on mail-tester; the `hello@` identity sends
  **plain text**, and scored 10/10.
- **Keep exactly one SPF record** (`v=spf1 include:_spf.mx.cloudflare.net ~all`).
  Brevo authenticates through DKIM (`brevo1`/`brevo2._domainkey`) and DMARC
  (`p=none`), not SPF. A second SPF TXT invalidates both.
- **Subdomains** are a `CNAME` to `ahmed-islam-ai.github.io`, DNS only, plus
  the custom domain set in that repo's Settings → Pages. The account has
  verified `ahmedislam.tech` on GitHub (`_github-pages-challenge-…` TXT), so no
  one else can claim a subdomain of it. First one: `flintgrab.` (repo
  `Flint-Grab-site`, its own Actions deploy; the 180 MB installer is a
  release asset, since it's over GitHub's 100 MB file limit). Second:
  `blog.` (repo `my-blogs`, 2026-11-13; see Blog).

## Styles and tokens

### Tailwind 4, CSS-first

There is no `tailwind.config.js`: the tokens live in `@theme` in `src/index.css`, with the base layer, utilities and motion. The `short` custom variant is defined there too; why it exists is under Site layout.

### Self-hosted Archivo (2026-11-12)

Archivo is self-hosted since 2026-11-12 (`public/fonts`, SIL OFL: `OFL.txt`
beside it). It came from Google Fonts until then: two extra connections before
the font could even start, and every visitor's IP sent to Google, which EU courts
have ruled needs consent. These are Google's own files and rules (v25), minus the
Vietnamese subset the site never uses. Variable: weight 400–700, width 85–125%;
`type-hero` sets the width axis with `font-variation-settings`.

The Latin file (`/fonts/archivo-latin.woff2`) is preloaded in `index.html`, so it
starts with the HTML instead of after the stylesheet has been read. A font
preload needs `crossorigin` even on the same origin, or it is fetched twice. Why
reveals wait for it is under Reveal and motion.

### The mono stack (`--font-mono`)

The one place a second family is allowed, and only for machine metadata: repo
paths, index numerals, status pills. It is the system stack, so it costs no font
request and no dependency; see the amended type rule in STYLE.md. Archivo still
carries every heading and every sentence.

### `--text-display` deviates from the style guide

Display is `clamp(2.5rem, 5.2vw, 4.5rem)` rather than the guide's 48→96px,
because 96px overflows a two-column hero, which is what the approved mockup uses.
Restore the guide's clamp for any full-width display.

### Vertical rhythm is one token pair

- **Vertical rhythm is one token pair in `index.css`**, not per-section classes:
  `--space-section` (5rem / 7rem at lg) via the `section-y` utility, and
  `--space-nav` (5.5rem / 6.5rem) via `pt-nav` for fixed-nav clearance. Change the
  rhythm there. `--space-nav` is not rhythm, but it lives beside it so the two
  can't drift apart.
  - The two pinned bands (Method, Certifications) carry **no** section padding,
    deliberately. Projects did until its runway was removed 2026-08-30 and it went
    back to normal `section-y`. Their child
    is exactly one viewport tall and pins to it, so outer padding only adds dead
    scroll — and on a full-bleed band it's invisible, so you'd be paying ~224px of
    scrolling per section for nothing. They use `pt-nav` internally instead, which
    is the padding that actually affects what you see.

### Tailwind 4's `scale-*` is the `scale` property

`scale-y-0` sets the `scale` property, not `transform`, and the two multiply. That is why the service-page progress fill writes `style.scale`; see Service pages › Sticky story traps.

### Motion tokens

One curve family for the whole site (`--default-transition-*`, `--ease-out`,
`--ease-spring`), so a hover, an accordion and a reveal all decelerate the same
way. Overriding Tailwind's defaults here retunes every bare `transition` /
`transition-colors` / `ease-out` at once. `ease-out` is the reveal curve (quick
out, soft landing). `ease-spring` is a damped spring (zeta 0.72, 3.8% overshoot)
sampled into `linear()`, for things that should feel physical: presses, the nav
indicator, the menu sheet.

### Press feedback (`press`)

The control gives under the finger and springs back. It uses the individual
`scale` property, so it composes with any `transform` the element already carries
(reveal offsets, hover nudges) instead of overwriting it. `--press` lets big
targets (full-width rows, cards) give less than a pill. Not gated on reduced
motion: it tracks the gesture directly, which HIG lists as the acceptable kind.

### Hidden scrollbars (`no-scrollbar`)

Hides the native scrollbar on the horizontal rails (the Stack category tabs, the
Work company switcher, the StatsBar figures). On Windows those render as a
permanent grey slab across the bottom of a card rather than the overlay bar macOS
draws, which reads as a broken element instead of an affordance. Hidden, NOT
disabled: the rail still scrolls by swipe, wheel, drag and keyboard, and each one
bleeds its content past the padding so the clipped edge is what signals "there's
more". That was always the affordance here, which is why the bleed exists on all
three. `scrollbar-width` covers Firefox and Chrome 121+; the pseudo-element covers
older WebKit and Safari.

### `edge-mask-x` (unused)

The `edge-mask-x` utility fades a full-bleed row to transparent where the two
gutter rails sit. Padding can't do this: it only clears the gutters for the first
and last item, not the ones travelling through the middle. Nothing in `src/` uses
it now: Marquee carries its own inline mask, and the Projects lane it was also
written for was removed on 2026-08-30. Tailwind emits no CSS for an unused
utility. (Earlier its comment named Marquee and the Projects lane as its users;
superseded.)

# Ahmed Islam — Portfolio

Personal portfolio for Ahmed Islam, a **Full-Stack AI Engineer** (Islamabad, PK).
Single-page marketing site with room to grow into project detail pages.

**The site sells two things, not one**: AI/agentic engineering *and* web
development on its own terms. The role line reads "Full-Stack AI Engineer" in the
hero pill, About, the footer and `<title>`; `data/services.ts` carries a
`web-development` offer with no AI in it; React and Next.js are named in the
stack, the hero chips and the About watermark. Don't narrow any of that back to
"AI Engineer": it was a deliberate widening, not drift (HISTORY.md › Content and data).

**Read [STYLE.md](STYLE.md) before touching anything visual.** It is the design
contract: tokens, type scale, spacing, and the rules that keep this site from
drifting into generic-template territory.

**No breadcrumb trails, anywhere.** Nothing like `Blog / Data Science / Title` or
`Services / RAG & knowledge systems` above a heading, and no other path-style
label strings (`Home › …`, `/ category`). A sub-page gets at most one back pill
(`BackPill`), shown from `sm` up, never on a phone. This holds for every new page
and section: don't add a trail "for SEO" or "for context". Search engines get
breadcrumbs from JSON-LD if ever needed, not from the page (HISTORY.md › Site layout).

## Comments, CHANGELOG.md and HISTORY.md

- A code comment is at most 2 lines, preferably 1. It says what the code can't: a constraint, a magic number, a trap. No narration ("used to be", "changed on", "Ahmed's call", "measured…").
- The reason behind a decision goes in HISTORY.md under its area. The code may carry a one-line pointer `(HISTORY.md › <Area>)`.
- Every change worth noting gets a dated line in CHANGELOG.md, newest first.
- When a change reverses or supersedes something in HISTORY.md, update that entry instead of leaving a contradiction.
- This file holds the rules. Each rule's pointer leads to its reason; read it before undoing the rule.

## Stack

| Concern | Choice | Notes |
| --- | --- | --- |
| Build | **Vite 8** | `npm run dev`, `npm run build`, `npm run preview` |
| UI | **React 19** + **TypeScript 7** | `tsconfig.json` (browser, `noEmit`, strict) + `tsconfig.node.json` (Node-side files) |
| Styling | **Tailwind CSS 4** | CSS-first. **No `tailwind.config.js`**: tokens live in `@theme` in `src/index.css` |
| Routing | **react-router 7** | `BrowserRouter`: `/`, `/projects`, `/services/:slug`, `/privacy`; anything else redirects to `/` |
| Icons | **simple-icons** | brand marks only; concepts are hand-drawn |
| Forms | **FormSubmit** | plain `fetch`, no SDK (Formspree was the original plan) |
| Analytics | **GA4** (gtag.js) | Consent Mode v2, all in `src/analytics.ts` |

Deliberately **not** installed: ESLint/Prettier, an animation library (GSAP,
Framer Motion), an icon component library, a form SDK. Every motion effect here
is IntersectionObserver + CSS or a small rAF loop. Don't add GSAP unless a
section needs scroll-pinning or a scrubbed timeline that `position: sticky` plus
a rAF loop cannot do; only that would justify the weight.

```
npm install
npm run dev        # http://localhost:5173 (never hydrates)
npm run build      # tsc (app + node) → vite build → SSR build → node prerender.mjs
npx vite preview   # serve dist/; the only place to check hydration
```

## Layout of the code

```
src/
  main.tsx                  BrowserRouter entry; hydrateRoot when data-route matches, else createRoot
  App.tsx                   route table, runs useReveal
  entry-server.tsx          renders one route to a string, for prerender.mjs
  index.css                 ALL design tokens (@theme), base layer, utilities, motion, .prose
  analytics.ts              GA4 + Consent Mode; MEASUREMENT_ID lives here
  pages/Home.tsx            section order; mounts both rails and derives their `surface`
  pages/ProjectsPage.tsx    /projects, every project as a row
  pages/ServicePage.tsx     /services/:slug, one page per entry in data/services.ts
  pages/PrivacyPage.tsx     /privacy, what GA4 and the form collect (DRAFT, not legal advice)
  hooks/useReveal.ts        scroll-reveal observer, re-runs per route
  hooks/useActiveSection.ts which section the viewport's centre line is in
  hooks/useReducedMotion.ts false on first render, real value after mount
  components/Nav.tsx        fixed nav pill + mobile sheet
  components/Hero.tsx       headline, status pill, portrait card, capability chips
  components/StatsBar.tsx   3 animated count-up stats
  components/About.tsx      two-tone heading, typographic watermark, CV button
  components/Work.tsx       experience + education switcher (exports EXPERIENCE)
  components/Stack.tsx      filterable tech field + two marquees (Ahmed's curated skills)
  components/Services.tsx   numbered accordion of the 7 offers
  components/ServiceDiagram.tsx  the service pages' system diagram
  components/Reviews.tsx    composite pull-quote paragraph + source ledger
  components/Method.tsx     pinned, scroll-scrubbed 5-step zigzag
  components/Projects.tsx   featured project + two peers + door to /projects (exports StackChips, Destination)
  components/ProjectMark.tsx  drawn schematic per project without an image
  components/Certifications.tsx  pinned card-swap deck on a brand band
  components/Contact.tsx    two-part enquiry form
  components/Footer.tsx     link columns, email CTA, giant AHMED wordmark
  components/Marquee.tsx    infinite icon band, scroll-reactive speed
  components/TechIcon.tsx   name → SVG path, brand marks + concept glyphs
  components/SectionRail.tsx  left-gutter progress rail (owns SECTIONS)
  components/SocialRail.tsx   fixed right-edge social links
  components/ConsentBanner.tsx  the Europe-only cookie banner
  components/BackPill.tsx   the white back pill on the service pages and /privacy
  components/TalkPanel.tsx  the ink "Let's talk" panel that closes a service page
  data/projects.ts          the 10 real projects, FEATURED, urlLabel, isRepo, destinationOf
  data/certifications.ts    11 certifications (6 LinkedIn, 5 CV)
  data/services.ts          the 7 offers + their page copy; plain data, imported by Node
  data/testimonials.ts      5 real LinkedIn recommendations, verbatim
  data/socials.ts           SOCIALS (footer, 9) and RAIL_SOCIALS (rail, 5)
  data/pages.ts             title + description for home, /projects, /privacy
  assets/ahmed.webp         hero portrait (HISTORY.md › Hero)
  assets/ahmed.png          PNG master; never imported
public/
  Ahmed-Islam-CV.pdf        linked by the Download CV button
  project-images/           processed card images, 880x550 WebP
  companies/                employer logos (padelos, IR-Solutions, itsolera, bytewise)
  og.png                    1200x630 share image for every page
  fonts/                    Archivo, self-hosted (Latin + Latin Extended woff2, OFL.txt)
  404.html, robots.txt      GitHub Pages SPA fallback; robots points at the sitemap
site-pages.vite.ts          writes per-route HTML and sitemap.xml
prerender.mjs               fills each built page's root with its rendered HTML
.github/workflows/deploy.yml  builds and deploys to GitHub Pages on push to main
```

`assets-original/` (untracked) and `src/assets/projects/` are gone; don't look for them (HISTORY.md › Projects).

**Sections** are numbered only in `SECTIONS` in `SectionRail.tsx`, which must
match page order: `01` hero, `02` about, `03` experience, `04` skills, `05`
services, `06` reviews, `07` method, `08` projects, `09` certifications, `10`
contact. No `0N / NAME` eyebrow in a section's gutter; content starts at the
`max-w-6xl` edge (HISTORY.md › Site layout).

## Content rules

- **The CV is the source of truth for anything factual.** `public/Ahmed-Islam-CV.pdf` drives the Work/education entries, the skill groupings in `Stack.tsx`, and the About copy. If the CV changes, update those.
- **Two inversions, on Ahmed's instruction:** `Stack.tsx` carries 15 technologies the CV omits (including React and Next.js), and `certifications.ts` carries six certifications the CV never lists. There the CV is behind, not the site; don't "correct" them back (HISTORY.md › Content and data).
- **Never invent biography.** Job titles, dates, employers, degrees, grades and metrics are Ahmed's professional record. If a value isn't in the CV or hasn't been given, use an obvious placeholder and say so.
- **Never invent a metric or a client** for a project card or a service. A project `metric` appears only where the repo's own README states one (today only `content-moderation`). Services name no client, site or number.
- `data/projects.ts` is real: ten projects with verbatim URLs. `status` is factual: `LIVE` (deployed), `SOURCE` (public repo) or `APK` (`dukaan`, links to `releases/latest`). Screen-reader labels come from `destinationOf()`, so a new status is one edit (HISTORY.md › Content and data).
- **`data/testimonials.ts` is real and quoted verbatim.** Don't edit the prose, not the grammar, not Murtaza's `❤` (STYLE.md's no-emoji rule governs the site's own iconography, not what a real person wrote). Keep quote marks out of the data.
- **`pull` must stay a verbatim contiguous substring of `quote`.** A DEV loop at the bottom of the file throws on boot if it isn't.
- **They are "recommendations", never "client reviews".** Only Arham describes hiring Ahmed; the others are classmates, an FYP partner and colleagues. Keep the `relation` field on every row. No `rating` or `avatar` fields (HISTORY.md › Content and data).
- **DRAFT copy, not from the CV:** Services, Method, the service pages' `problem`, `steps` and `faqs`, project `summary`/`stack` and `/privacy`. The only claims about Ahmed's own work on a service page are CV lines quoted from `EXPERIENCE` by index.
- **Known content tensions, Ahmed's call, don't silently "fix" them:** the stats bar says **2+ years** while the CV says *"a year of production experience"* (the 2+ counts from the 2024 Bytewise fellowship); **50+ satisfied clients / 70+ projects completed** are not in the CV, which lists 4 roles and 4 projects (HISTORY.md › Stats bar).
- **Section headings must not overlap in meaning.** `03` is "Where I've been.", `05` "What I deliver.", `06` "In their words.", `08` "Things I've shipped." (HISTORY.md › Content and data).
- **Image truth:** the line is whether a viewer could believe they are looking at the product. A real capture is always right; a flat, textless, single-accent diagram (`ProjectMark`) is fine. Two cards sit in the middle by Ahmed's choice (`padelgpt` mockup, `ppe-safety` poster). **Don't add a third without asking him**, and never one carrying invented text or numbers (HISTORY.md › Projects).
- Reading the CV PDF: `Read` with `pages:` fails on this machine (no poppler). Use a dependency-free Node script: inflate the `stream`/`endstream` payloads with `zlib`, then pull strings out of the `Tj`/`TJ` operators. Hyperlink targets are not recoverable this way.

## Open items and TODOs

- **No Terms page**, so no Terms link: a dead link is worse than none.
- **FormSubmit** sends Ahmed an "Activate Form" email on the first submission; nothing is delivered until he clicks it. **Changing `EMAIL` in `Contact.tsx` needs a new activation**: the endpoint is the address itself. The `BUDGETS` ranges are form options, not a price list.
- **Certifications:** the site has 11, the CV PDF lists only five; Ahmed's to reconcile. The six LinkedIn `href`s all point at one certifications *list*, which is why the card reads `View →`, not `Verify →`, and nothing claims `VERIFIED`. Real per-credential URLs can be swapped in without changing that wording.
- **Testimonials:** each `relation` is inferred from the quote text; worth Ahmed confirming.
- **Nav:** no Experience or Method link, and Skills is listed before Experience, so nav order and page order disagree. Measured at 1024px the seven links leave 16px beside the logo (HISTORY.md › Nav).
- **Client websites** that Services sells are not in `data/projects.ts` (Flintgrab is Ahmed's own product). A client site needs the client's permission to name. The Services copy could now point at Flintgrab; Ahmed's call.
- `segments`'s `stack` carries a `TODO(Ahmed)`. `speech-translator` has an unresolved name conflict and a `TODO(Ahmed)`; don't resolve it by guessing. Project `summary`/`stack` are his to confirm (HISTORY.md › Projects).
- A real capture of the deployed PadelGPT assistant is the highest-value missing image; `ppe-safety` has real YOLOv8 frames in its repo's `Results/` folder, one line away (HISTORY.md › Projects).

## Writing rules

The `asd-ste100` skill (Simplified Technical English) applies to the project
summaries and the image alt text only. It is for technical and
factual text, not marketing copy, so the hero, About, Services and Method keep
their voice, and the testimonials are never edited. Linter:
`python ~/.claude/skills/asd-ste100/scripts/ste-lint.py <file>`. The project text
lints at 0 findings; a semicolon or a 26-word sentence in those
is a regression (HISTORY.md › Content and data).

## Domain, email and hosting

- The site is **GitHub Pages at `ahmedislam.tech`**, deployed by `.github/workflows/deploy.yml` on every push to `main`. No `CNAME` file (an Actions deploy ignores it); the domain lives in repo Settings → Pages. The encoder in `public/404.html` must match the decoder in `index.html` (HISTORY.md › Hosting and domain).
- **Never name a `public/` folder like a route**: hence `project-images/` (HISTORY.md › Hosting and domain).
- The site's address is **`hello@ahmedislam.tech`** (Hero, Contact and its FormSubmit endpoint, Footer, Privacy, README). Cloudflare Email Routing forwards it to `ahmedislam.official@gmail.com` (one rule, catch-all off).
- **DNS is on Cloudflare**; the domain is registered at Namify, whose DNS page is unused. **Keep the GitHub Pages records "DNS only" (grey cloud)** and ignore Cloudflare's proxy prompts: GitHub issues the HTTPS certificate itself.
- **Sending** is Brevo's free SMTP relay (300/day) as a plain-text `hello@` identity in Thunderbird and iPhone Mail, not Gmail's "Send mail as".
- **Keep exactly one SPF record** (`v=spf1 include:_spf.mx.cloudflare.net ~all`). Brevo authenticates through DKIM (`brevo1`/`brevo2._domainkey`) and DMARC (`p=none`); a second SPF TXT invalidates both.
- **Subdomains** are a `CNAME` to `ahmed-islam-ai.github.io`, DNS only, plus the custom domain in that repo's Settings → Pages. `flintgrab.` (repo `Flint-Grab-site`) and `blog.` (repo `my-blogs`).

---

## Rules by area

Each rule is a trap that has already cost time. The pointer leads to why.

### Site layout and styles

- Every section heading is `text-display` (HISTORY.md › Site layout).
- One content max-width, `max-w-6xl`; only the nav pill keeps `max-w-7xl` (HISTORY.md › Site layout).
- Padding goes outside the max-width: `px-4 sm:px-6 lg:px-20` on the wrapper, `mx-auto max-w-6xl` on the child (HISTORY.md › Site layout).
- `lg:px-20` on every section, footer included, because the two fixed rails live in that gutter; never on the nav (HISTORY.md › Site layout).
- Nav is `fixed`, not `sticky` (HISTORY.md › Site layout).
- Pinned panels are height-constrained: step them down with the `short` variant (`max-height: 820px`), not a width breakpoint. Anything below the fold of a pinned panel is unreachable (HISTORY.md › Site layout).
- Vertical rhythm is `--space-section` (`section-y`) and `--space-nav` (`pt-nav`) in `index.css`; change it there. The pinned bands (Method, Certifications) take no section padding, only `pt-nav` inside (HISTORY.md › Styles and tokens).
- Grid items holding long unbreakable content need `min-w-0`; `truncate` alone doesn't help (HISTORY.md › Experience).
- Anything fixed and full-width gets `pointer-events-none` on its empty parts (HISTORY.md › Nav).
- Tailwind 4's `scale-*` sets the `scale` property: write `style.scale`, not `transform`, or the two multiply (HISTORY.md › Styles and tokens).

### Nav and rails

- Nav and Footer build internal links with `to(hash)`. Hero, About, Reviews and SectionRail use bare `#hash` and only render on `/`; if one ever renders elsewhere it needs the same fix (HISTORY.md › Nav).
- The mobile menu stays mounted (hidden with `invisible`) and is `absolute` below the pill; the header is `pointer-events-none`, pill and sheet `auto` (HISTORY.md › Nav).
- The nav dot's position is measured from the `[aria-current]` link, half-width subtracted in the number, not with a `-translate-x-1/2` class (HISTORY.md › Nav).
- The rail's fill and active tick come from one centre-line model: fill = `(index + within) / (SECTIONS.length - 1)`, `within` capped at 0.9. Never a page-scroll fraction (HISTORY.md › Rails).
- `useActiveSection` uses `rootMargin: '-50% 0px -50% 0px'`, is called once in `Home.tsx` and feeds both rail and nav (HISTORY.md › Rails).
- It seeds `active` from geometry on mount, because the tall footer can hold the centre line (HISTORY.md › Footer).
- Both rails take one `surface` prop: `light`, `dark` or `brand`. A new full-bleed band picks one of these, never a fourth boolean (HISTORY.md › Rails).
- `SocialRail` shows the five `rail: true` links; the footer shows all nine. Add a link to `SOCIALS` only; five is the tested ceiling, so re-measure at 1024x600 before flagging a sixth (HISTORY.md › Content and data).
- `SocialRail` hides over the footer; `SectionRail` stays (HISTORY.md › Footer).

### Reveal and motion

- Every motion effect is gated on `prefers-reduced-motion` and degrades to static content. Under reduced motion the reveal's hidden state is never applied.
- `[data-reveal]` fires once and never replays. Order with `[--reveal-delay:NNNms]`, ~60–80ms apart. The `left`/`right` variants are declared after the base rule (HISTORY.md › Reveal and motion).
- An element in the bottom 10% of the viewport is correctly still hidden (`rootMargin: '0px 0px -10% 0px'`), not a stuck reveal (HISTORY.md › Reveal and motion).
- Reveals wait for Archivo, via `document.fonts.load` (not `fonts.ready`), or 2.5s (HISTORY.md › Reveal and motion).
- Keep `useReveal`'s resize sweep: it reveals elements that sat inside a `display: none` ancestor (HISTORY.md › Reveal and motion).
- Never put `overflow-hidden` on an ancestor of a sticky element or a `view()` timeline; use `overflow-clip`, or clip the sticky element itself (HISTORY.md › Method).
- A `.scroll-*` class never goes on a `[data-reveal]` element; put it on a wrapper (HISTORY.md › Reveal and motion).
- `scroll-read` goes on an inline `<span>` (HISTORY.md › Reveal and motion).
- No scroll snapping. `scroll-padding-top: 7.5rem` and `scroll-behavior: smooth` on `html` stay (HISTORY.md › Reveal and motion).
- Per-frame scroll work is rAF-coalesced or IntersectionObserver-gated. Write `style` from the loop and keep React out of the hot path (HISTORY.md › Reveal and motion).

### Hero, About, Experience

- The hero's background layer lives on the hero-zone wrapper in `Home.tsx`, not in `Hero.tsx` (HISTORY.md › Hero).
- Hero chips overhang at most ~3% on the right from `lg`; below `lg` they sit inside the portrait. No caption on the portrait (HISTORY.md › Hero).
- Re-encode `ahmed.webp` from `ahmed.png` (Pillow, quality=82, method=6, alpha_quality=90); never import the PNG (HISTORY.md › Hero).
- The role pill sits inside the home `<h1>`; the "available" status is a separate sr-only `<p>` (HISTORY.md › SEO and prerendering).
- About's rotated note uses `writing-mode: vertical-rl`, not `rotate-90` (HISTORY.md › About).
- Work card height is pinned three ways: a fixed `COLLAPSED_H`, a `min-h-24` tag row, and a Read-more button that is always rendered (HISTORY.md › Experience).
- The Work stack-tag list keeps `content-start items-start` (HISTORY.md › Experience).
- Work's bullet `<ul>` is not keyed; its ResizeObserver attaches once (HISTORY.md › Experience).

### Stack and marquee

- `Stack.tsx` is Ahmed's curated skill set. JSON, YAML, Markdown, VS Code and Anaconda stay out; ask him before adding them (HISTORY.md › Stack and marquee).
- Stack shows every tool by default (`locked` starts at `null`). A tab filters, the active tab is a no-op, `Show all` resets; filtered pills leave the DOM (HISTORY.md › Stack and marquee).
- Tab selection is click/tap only; no hover or focus previews (HISTORY.md › Stack and marquee).
- The `frontend` group, the `web-development` offer and the hero's "React & Next.js" chip move together (HISTORY.md › Stack and marquee).
- Below `lg` the tab rail bleeds past the padding with `max-lg:-mx-4 max-lg:px-4` (HISTORY.md › Stack and marquee).
- The marquee integrates position in a rAF loop, not a CSS animation; it is IO-gated, and renders its list twice and resets at half the scroll width (HISTORY.md › Stack and marquee).
- Marquees fill in after mount and stay out of the prerendered HTML (HISTORY.md › SEO and prerendering).

### Services and service pages

- The Services accordion keeps one row open; a click opens, never toggles; the reveal animates `grid-template-rows` `0fr` → `1fr` (HISTORY.md › Services).
- Closed accordion panels are `inert` (HISTORY.md › Service pages).
- Every service `stack` entry must exist in `Stack.tsx` (HISTORY.md › Services).
- A new offer feeds the Contact chips, the footer column and a service page, so fill its page fields (HISTORY.md › Services).
- The service `id` is the URL slug; renaming one breaks every link to its page (HISTORY.md › Service pages).
- `data/services.ts` stays plain data: no imports, no `import.meta.env` (Node imports it). Its cross-reference checks live in `ServicePage.tsx` (HISTORY.md › Service pages).
- Below `lg` the sticky story is block layout, not grid (HISTORY.md › Service pages).
- `ServiceDiagram` boxes are sized in `cqw`/`em` against the diagram's own width. Labels stay ≤ ~13 characters, three to a row at x = 72/200/328; re-check overlaps at 360 and 1024 after moving a node (HISTORY.md › Service pages).
- Contact buttons go to `/?service=<id>#contact`. Contact ticks the service in an effect, then removes the param with `navigate(…, { replace: true })`; Home scrolls to the hash itself (HISTORY.md › Service pages).
- No `/services` route or `services/index.html`; "All services" goes to `/#services` (HISTORY.md › Service pages).

### Reviews

- A new testimonial is handled by choosing its `pull`, never by resizing anything (HISTORY.md › Reviews).
- Hover only changes colour; expanding is a click (HISTORY.md › Reviews).
- Inactive runs are `text-muted`, never the `heading/25` ghost (HISTORY.md › Reviews).
- Runs are `<a>` (so they wrap), ledger rows are `<button>` (HISTORY.md › Reviews).
- Runs are `<q>`, so the UA draws the quote marks; the expanded panel is a plain `<blockquote>` (HISTORY.md › Reviews).

### Method

- Progress is `(STICK - rect.top) / (rect.height - panel.offsetHeight)`, clamped to 0–1, with no `innerHeight` term. `STICK` is 80 and must match `top-20` (HISTORY.md › Method).
- The line's clip and the dot are written from one value in one rAF frame, through `style`; neither takes its position from React. Only `stage`, quantised to 2%, goes through React (HISTORY.md › Method).
- Reveal the orange line with a `<clipPath>` rect; never a dash on a `non-scaling-stroke` path (HISTORY.md › Method).
- The dot is an HTML element, not an SVG `<circle>`, and is always rendered (HISTORY.md › Method).
- `LEFT` percentages equal `NODES[i].x / 1000`; the last node stops at 855 (HISTORY.md › Method).
- `NODES` sit at y=80/160 to clear the `h-18` step cards: change the curve height and the card height together (HISTORY.md › Site layout).
- Both paths end at the last node (HISTORY.md › Method).
- The closing pill is gated on `progress >= 0.92`, not a `data-reveal` (HISTORY.md › Method).
- The pinned panel is `h-[calc(100svh-5rem)]`, not `100vh`, and must fit the viewport (~712px at `top-20`) (HISTORY.md › Method).
- The pin runs at every width; under reduced motion the runway height class is dropped (HISTORY.md › Method).

### Projects

- `FEATURED` picks by slug, not array order; leaving it is not deletion (HISTORY.md › Projects).
- Projects is an ordinary section: no runway, no rAF, no scroll-jacked row (HISTORY.md › Projects).
- `/projects` is hairline rows, never a card grid (HISTORY.md › Projects).
- No background watermark, and no ghosted numeral in a card (HISTORY.md › Projects).
- One exit: the CTA to `/projects`; the raw GitHub link closes `/projects` (HISTORY.md › Projects).
- If a project ever has no visual, bring back its display-scale name (HISTORY.md › Projects).
- `Project` has one `href`. `urlLabel` and `isRepo` live in `data/projects.ts` (HISTORY.md › Projects).
- `Visual` shows `project.image`, else a `ProjectMark`; setting `image` upgrades a project everywhere (HISTORY.md › Projects).
- Project stack chips reuse the Work stack-tag markup; change both together (HISTORY.md › Projects).
- A `Project.stack` entry needs a `TechIcon` entry but not a place in `Stack.tsx` (HISTORY.md › Projects).
- Check an image's magic bytes, not its extension, before reprocessing (HISTORY.md › Projects).

### Certifications

- `t` is stepped (`HOLD` plus a smoothstep), not linear (HISTORY.md › Certifications).
- The deck carries its own uniform height (`h-[19rem] sm:h-[17.5rem] xl:h-[18.5rem]`); re-check the fold and clipping after adding copy (HISTORY.md › Certifications).
- Inactive cards are `aria-hidden`, `pointer-events-none`, and `tabIndex={-1}` when they have an `href` (HISTORY.md › Certifications).
- `PACE` is 0.4 for 11 cards; re-check it if the count changes (HISTORY.md › Certifications).

### Contact

- Service chips are real `sr-only` checkboxes styled with `peer-checked:`, in a `fieldset`/`legend`; the value is the service title (HISTORY.md › Contact).
- Budget and Timeline are radio chips; don't bring back `<select>` (HISTORY.md › Contact).
- `chipClass` is shared by all three groups; change it once (HISTORY.md › Contact).
- The lead copy never says "on the left / on the right": the halves stack below `lg` (HISTORY.md › Contact).
- The honeypot is `_honey`; status is announced with `aria-live="polite"`; validation is HTML5 (HISTORY.md › Contact).

### Footer

- The footer is not a section: outside `<main>`, not in `SECTIONS` (HISTORY.md › Footer).
- `-mt-10 lg:-mt-14` with `z-10` keeps paper out of the rounded corners; keep `border-t border-white/[0.08]` (HISTORY.md › Footer).
- `AHMED.` is `21.5vw`, from a measurement; re-measure with a `Range` if the word or tracking changes. Its full stop stays solid brand (HISTORY.md › Footer).
- Below `lg` the footer is a 2-column grid (HISTORY.md › Footer).

### Blog

- The blog is a separate site and repo (`my-blogs`). **Nothing on this site links to it or mentions it**: no nav button, no footer link, no forwarding pages, no line in /privacy. Don't add one back without Ahmed asking (HISTORY.md › Blog).
- Unknown URLs, the old `/blog` addresses among them, redirect home through the `*` route in `App.tsx`.

### SEO and prerendering

- Nothing reads `window`, `document` or `matchMedia` while rendering, only in effects; use `hooks/useReducedMotion` (HISTORY.md › SEO and prerendering).
- Two-tone headings carry `{' '}` between their `.block` lines (HISTORY.md › SEO and prerendering).
- Big decorative SVG renders after mount; text belongs in the HTML (HISTORY.md › SEO and prerendering).
- Don't re-add a `cp` of the home shell to `projects.html` in `deploy.yml` (HISTORY.md › SEO and prerendering).
- The page-writing plugin runs in the `post` phase. `withMeta` throws if `index.html` loses a tag it rewrites (title, description, canonical, og:title/description/url/type); don't delete them (HISTORY.md › SEO and prerendering).
- `data/pages.ts` is the one source for the home, /projects and /privacy titles and descriptions. `index.html`'s literal title and description must equal the home entry (HISTORY.md › SEO and prerendering).
- The sitemap lists only URLs that return 200; `/privacy` stays out (HISTORY.md › SEO and prerendering).
- A new profile link goes in both `data/socials.ts` and the Person `sameAs` in `index.html` (not WhatsApp) (HISTORY.md › SEO and prerendering).
- `knowsAbout` lists only skills the site shows evidence for (HISTORY.md › SEO and prerendering).
- The home H2s keep their voice; don't reword them for search (HISTORY.md › SEO and prerendering).

### Analytics and privacy

- `MEASUREMENT_ID` is `G-QFPNV9V4Q4`, typed `string` on purpose. Emptying it removes GA entirely. `GTM-K2X52LHZ` is not used (HISTORY.md › Analytics and privacy).
- Only `ahmedislam.tech` loads GA, so dev and preview never count (HISTORY.md › Analytics and privacy).
- Consent: `denied` by default for EEA/UK/CH, `granted` elsewhere, ads storage denied for all. The banner asks visitors with a European time zone; Decline sends `denied` explicitly; Accept and Decline are the same size (HISTORY.md › Analytics and privacy).
- Tag clicks with `data-track="event"` + `data-track-<key>`, never Umami's `data-umami-event` (HISTORY.md › Analytics and privacy).
- Events record what was asked for, never who (HISTORY.md › Analytics and privacy).
- `/privacy` describes GA and FormSubmit; change it when either changes. Its 14-month retention assumes GA4 is set to 14 months (HISTORY.md › Analytics and privacy).

### Icons

- Brand marks are named `simple-icons` imports, never `import * as` (HISTORY.md › Icons).
- Check a slug exists before using it: v16 dropped OpenAI, AWS, Azure, Power BI, Groq and LinkedIn, and it's `siCss`, not `siCss3` (HISTORY.md › Icons).
- Concept glyphs are closed silhouettes with no holes, every subpath wound the same way (HISTORY.md › Icons).
- Icons render in brand orange, never in brand colours (STYLE.md).
- Adding a technology: add the string to its `Stack.tsx` group, then a `TechIcon` entry. Unmapped names fall back to the `cube` glyph (HISTORY.md › Icons).

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

**Hydration is checked on the production build**, not dev:
`npm run build && npx vite preview`, then on every route confirm that no node
under `#root` is replaced on load and the console has no errors (HISTORY.md › SEO and prerendering).

**GA's real path** is tested by serving `dist/` under the `ahmedislam.tech`
hostname with Puppeteer request interception, stubbing gtag.js and FormSubmit,
and reading `window.dataLayer` (HISTORY.md › Analytics and privacy).

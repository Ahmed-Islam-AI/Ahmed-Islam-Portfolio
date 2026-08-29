# Style guide — Ahmed Islam portfolio

The design contract for this site. Read it before changing anything visual.

**Tokens are the interface.** Every colour, font and type size below exists as a
token in the `@theme` block of `src/index.css`. Use `bg-brand`, `text-muted`,
`text-display` — never a raw hex, never an arbitrary `text-[19px]`. If you need a
value that doesn't exist, add a token rather than a one-off.

Tailwind 4 is CSS-first here: **there is no `tailwind.config.js`.** Editing
`@theme` in `src/index.css` is how you change the design system.

---

## The one rule that matters most

**Orange is the only accent.** Near-black carries drama, warm off-white carries
content, and `#F15629` is the single colour allowed to mean something.

This is not a preference, it is what stops the site looking like a template. It
has already been defended twice against reference designs:

- A reference coded its skill categories with seven pastel dot colours. We used
  per-category **counts** instead — more information than a colour legend, and no
  rainbow.
- Technology icons render in orange, **never** in their real brand colours. 55
  brand palettes at once is noise, not identity.
- Projects' giant background word used to tint per project, which is why
  `accentColor` held a spread across the **warm** range. Both the word and the
  field were **removed 2026-08-30** with the section rebuild: no travelling word
  means nothing to tint, so the compromise is no longer needed and the rule holds
  cleanly again. Don't reintroduce per-project hues without an effect that needs
  them.

Green appears in exactly one place: the `success` token on the "available for
work" dot, because green is the universal availability signal and orange there
would read as decoration rather than status. Do not introduce a third accent.

**Certifications is a full-bleed `brand` band** — the one place the accent is used
as a surface rather than a highlight. That is still one accent, but it inverts the
rule locally: on that band orange can no longer *signal*, because a signal has to
differ from its ground. So there, accents become **ink**: the active `SectionRail`
tick, the headline's full stop, the progress spine, the social-circle hover. The
white cards keep brand for their highlight mark, since those sit on `paper`.

Both gutter rails take a three-way `surface` prop for exactly this reason — see
CLAUDE.md. A second brand band is fine; a band in some *other* colour is not.

---

## Type

**Archivo** site-wide, one family, variable, loaded from Google Fonts in
`index.html`.

> Supersedes the earlier Montserrat decision (2026-07-26). Montserrat is the most
> common font in AI-generated portfolios and reads templated. Archivo is
> Swiss-industrial with a real width axis, which suits AI-infra work. **Do not
> revert this.**

Use the `type-hero` utility for display text — it sets the family, weight 700 and
`font-variation-settings: 'wdth' 104`, opening the width axis slightly for
industrial weight. Body text inherits Archivo 400 from `body`.

**One family for content; system monospace for machine metadata only.** The
`--font-mono` token (`ui-monospace, SFMono-Regular, Menlo, Consolas`) is the
single sanctioned exception, added 2026-08-21 with the Projects rebuild. It is
the *system* stack deliberately — no font request, no dependency — and it is
allowed on exactly one class of thing: values a machine produced or that name a
machine artefact. Today that is the project cards' index numerals, `LIVE` /
`SOURCE` status pills, repo paths, the derived counts pill, and the one quoted
accuracy metric.

It is **not** for prose, headings, eyebrows, buttons or labels. If you are
reaching for `font-mono` on a sentence, the answer is Archivo. The point of the
distinction is that a repo path *looks like* a repo path; a second family used
decoratively just breaks the single-family rule with extra steps.

| Role | Token | Value |
| --- | --- | --- |
| Display | `text-display` | `clamp(2.5rem, 5.2vw, 4.5rem)`, lh `0.98`, tracking `-0.02em` |
| Section H2 | `text-h2` | `clamp(2rem, 4vw, 3rem)`, lh `1.05`, tracking `-0.01em` |
| H3 | `text-h3` | `1.5rem` |
| Lead | `text-lead` | `1.25rem` / `1.6` |
| Body | `text-body` | `1.0625rem` / `1.7` |
| Eyebrow | `text-eyebrow` | `0.8125rem`, uppercase, tracking `0.16em`, weight 600 |

> `--text-display` deviates from the written brief's 48→96px. 96px overflows the
> two-column hero the approved mockup uses. Restore the larger clamp only for a
> genuinely full-width display heading.

**Case is hierarchy.** The hero H1 is uppercase; section H2s are mixed case. That
contrast is deliberate — don't flatten it.

Measure: cap body copy with `max-w-[NNch]`, roughly 44–62ch. Long uppercase
wide-tracked text is hard to read; keep eyebrows to one short line.

---

## Colour tokens

| Token | Hex | Use |
| --- | --- | --- |
| `brand` | `#F15629` | the accent — base |
| `brand-bright` | `#FF6B3D` | hover, gradient top, numerals on dark |
| `brand-deep` | `#C7401A` | pressed, gradient bottom |
| `ink` | `#121212` | nav pill, dark surfaces |
| `ink-deep` | `#0B0B0B` | scrims |
| `ink-raised` | `#1C1A1A` | raised card on dark (stats bar, work card) |
| `paper` | `#FAF7F4` | page background |
| `paper-2` | `#F1ECE7` | alternating section band |
| `hairline` | `#E4DED8` | borders on light |
| `heading` | `#141312` | headings and body on light |
| `muted` | `#5C5651` | secondary text on light |
| `dark-muted` | `#B9B4AF` | secondary text on dark |
| `success` | `#2E9E5B` | availability dot only |

Hairline on dark is `white/12`. Ghosted display text is `heading/25`. Watermark
text is `heading/[0.028]` — if you can comfortably read it, it's too strong.

Signature gradient: `linear-gradient(180deg, brand-bright, brand-deep)` on pill
CTAs. Hover is `brightness-110`, not a colour swap.

**The hero is light.** The written brief describes a dark `#121212` hero; the
approved mockup is warm `#FAF7F4` with a dark floating nav. The mockup wins.

---

## Section anatomy

Every content section follows the same skeleton. Match it:

```tsx
<section id="…" className="scroll-mt-28 px-4 py-20 sm:px-6 lg:px-20 lg:py-28">
  <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[6.5rem_1fr] lg:gap-14">
    <p data-reveal className="text-eyebrow flex gap-2 text-muted/70 uppercase lg:pt-4">
      <span className="text-brand">0N</span><span aria-hidden>/</span><span>Name</span>
    </p>
    <div className="min-w-0">
      <h2 data-reveal className="type-hero text-display leading-[0.92] uppercase">
        <span className="block text-heading">First line</span>
        <span className="block text-heading/25">second<span className="text-brand">.</span></span>
      </h2>
      …
    </div>
  </div>
</section>
```

Three things are load-bearing:

1. **`lg:px-20`** — the gutter `SocialRail` occupies. Non-negotiable on new sections.
2. **Left index gutter** (`0N / NAME`) — numbers must match page order.
3. **Two-tone stacked heading** — solid line over a `heading/25` ghost line, with
   the full stop in orange. This is the site's signature; keep it consistent.

Alternate backgrounds so sections separate without rules: hero zone `paper` +
grid, about `paper-2`, experience `paper`, skills `paper-2`, services `paper`,
reviews `paper-2`. The page then closes on three full-bleed bands: method `ink`,
projects `ink`, certifications `brand`.

**Don't reach for a card grid by default.** Work, Projects and Certifications are
all card sets already; a fourth would flatten the page into one repeated shape.
Services is a numbered accordion index for exactly that reason, Reviews is one
running paragraph of pull-quotes over an expandable source ledger rather than five
testimonial cards, and the next new section should look for its own form too.

Vertical rhythm comes from **one token pair**, not per-section classes: the
`section-y` utility (`--space-section`, 5rem / 7rem at `lg`) and `pt-nav`
(`--space-nav`) for fixed-nav clearance. Both live in `src/index.css`; change the
rhythm there and every section follows. The two pinned bands (Method, Certifications) take no section
padding — see CLAUDE.md for why. Within a column, step `mt-9`/`mt-10`/`mt-12`
between blocks. Don't invent new spacing values.

**One content max-width: `max-w-6xl` (1152px).** Every content wrapper on the page
uses it, so all sections share one grid. The nav is the single exception
(`max-w-7xl`) because it's a floating pill rather than a content column.

**Every section H2 is `text-display`** — no section gets a smaller heading step,
or it reads as the lesser section. The two pinned panels pay for that out of their
fold budget via the `short` variant; see CLAUDE.md before adding content to them.

---

## Components

**Radii.** Pills and chips `rounded-full`; cards `rounded-[1.75rem]`; the hero
portrait `rounded-[2rem]`; small tags and icon plates `rounded-lg` / `rounded-xl`.

**Elevation is subtle and warm**, never a grey box-shadow:
`shadow-[0_10px_26px_-20px_rgb(20_19_18/0.55)]`. Prefer `ring-1 ring-hairline`
for definition over a heavy shadow.

**Buttons.** Primary is a gradient pill, uppercase, `text-[0.75rem]`, tracking
`0.14em`, with a directional icon that shifts on hover. Secondary is the same
shape, outlined `border-heading/20`, hovering to brand. Icon-only buttons need an
`aria-label` — and if a button's purpose isn't obvious from its icon, give it a
label instead. (The mockup's bare `↓` circle became "SEE THE WORK" for this
reason.)

**Interactive state.** For a *small* filter set, filtered-out items drop to
`text-heading/25` with
`ring-heading/8` and `scale-[0.97]`; active items get a white fill, hairline ring
and soft shadow. Selected nav/tab items invert to `bg-ink text-white`.

---

## Motion

Full detail in [CLAUDE.md](CLAUDE.md). The design rules:

- **Everything is gated on `prefers-reduced-motion`.** Hidden states must never
  be applied under reduced motion — content is visible by default and motion is
  the enhancement.
- **Reveals fire once.** Never replay on scroll-up.
- **Stagger, don't cascade.** 60–80ms between siblings via `[--reveal-delay:]`.
  Anything longer feels sluggish.
- **Easing is `cubic-bezier(0.22, 1, 0.36, 1)`** for reveals — quick out, soft
  landing. Hovers use `duration-200`, reveals `0.8s`, filters `duration-300`.
- **Snap is `proximity`, never `mandatory`.**
- Transforms and opacity only. No animating layout properties.
- **The two gutters are a pair.** `SectionRail` (progress, left) and `SocialRail`
  (links, right) both live in the `lg:px-20` gutter. Keep them symmetric and
  quiet at rest — thin ticks, labels only on hover. If either starts competing
  with content for attention, it's wrong.

---

## Accessibility floor

Not optional, and not to be simplified away:

- Icon-only controls carry `aria-label`; decorative SVGs carry `aria-hidden`.
- Animated numbers keep an `sr-only` span with the final value so screen readers
  aren't read a ticking digit.
- Don't use `role="tab"` without arrow-key handling — plain buttons with
  `aria-current` are honest. The Work switcher does this deliberately.
- Focus is visible everywhere: `:focus-visible` outlines in brand orange with
  `outline-offset: 3px`.
- Interactive targets ≥ 44px.
- Body text on `paper` must stay at or above `muted` (`#5C5651`, ~6.7:1). Small
  uppercase wide-tracked text needs `heading/80` or darker.
- Anything hidden but space-reserving must be `aria-hidden` **and**
  `tabIndex={-1}`, or keyboard users tab into invisible controls.

---

## Anti-slop checklist

Things that would make this site look generic. Avoid all of them:

- Multi-colour category dots or real brand-coloured logos.
- Purple/blue gradient hero, glassmorphism cards, generic drop shadows.
- Centred everything — this site is left-aligned with an index gutter.
- Emoji as icons.
- Identical grey paragraph blocks: differentiate lead / pull-quote / body.
- Sections that all animate identically on entry with no stagger.
- Placeholder lorem text, or invented credentials to fill a layout.
- Adding a dependency for something a few lines of CSS handles.
- **Generated imagery standing in for a product screenshot.** The Projects
  gallery shipped with seven AI-made poster cards until 2026-08-21; four had
  hallucinated text baked into the pixels ("BeautifulSooup", "TenFolox",
  "AFKBSIO", "INPISODFRAITE CONTENT DKTBSCTED"), one invented a "97%
  Confidence" figure that appears in no repo, and all seven sat in fake browser
  chrome, off-palette.

  **The line is whether a viewer could believe they are looking at the product.**
  A real capture of a real screen is always fine, including its own colours —
  `segments` is one, and it outranks the single-accent rule because it is
  evidence rather than decoration. A flat, textless, single-accent *diagram* is
  also fine, and is what the five imageless projects carry (`ProjectMark.tsx`);
  nobody mistakes an orange line drawing for a screenshot. The middle — a
  photo-real render of a product that does not exist — is what got this section
  flagged.

  **Two cards sit in that middle by Ahmed's explicit choice** (`padelgpt` is a
  mockup, `ppe-safety` a generated poster; he asked for both by name after being
  shown what they were). Don't quietly swap them out, and **don't add a third
  without asking him.** See CLAUDE.md.

---

## Two knowing exceptions

Both were asked for directly. Don't "fix" them, and don't treat either as a
precedent.

- **The footer credit uses a ❤️ emoji**, against the anti-slop rule above, and its
  red is the only non-palette colour on the page. An SVG heart in `text-brand`
  undoes both in one line if that trade stops being worth it.
- **Stack hides filtered-out pills rather than dimming them.** The dim-out is still
  the rule for small filter sets; with 55 pills it left 40+ ghosts crowding the four
  you selected.

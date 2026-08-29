import { siGithub, siLeetcode, siMedium, siX } from 'simple-icons'

/**
 * The full set — **the footer lists all of these.** The fixed right-edge rail
 * does NOT: it shows only the five marked `rail`, see `RAIL_SOCIALS` below.
 *
 * **All nine URLs are real**, supplied by Ahmed 2026-08-30. The four placeholders
 * that shipped here (Facebook, Instagram, LinkedIn, Upwork) are gone; WhatsApp
 * was already real, from the CV.
 *
 * Order is deliberate: WhatsApp first because it is the one direct-contact
 * channel, then the professional profiles a hiring visitor actually wants
 * (LinkedIn, GitHub, Upwork), then proof-of-work (Medium, LeetCode), then the
 * social accounts.
 *
 * **Icon sources are mixed, and that is forced, not sloppy.** The four added in
 * 2026-08 come from `simple-icons` as named imports, the same way `TechIcon.tsx`
 * does it — accurate, maintained, and tree-shakes. The other five keep
 * hand-written paths because **`siLinkedin` does not exist in simple-icons v16**
 * (dropped for trademark reasons, exactly like OpenAI/AWS/Azure — see the icon
 * note in CLAUDE.md). With LinkedIn permanently hand-drawn there is no version of
 * this file that is purely one or the other, so the working paths stay put.
 * Check a slug exists before assuming it does.
 */
export const SOCIALS = [
  {
    name: 'WhatsApp',
    rail: true,
    href: 'https://wa.me/923008760724',
    path: 'M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.39a9.86 9.86 0 0 0 4.74 1.2h.01c5.46 0 9.9-4.44 9.9-9.9 0-2.64-1.03-5.13-2.9-7A9.82 9.82 0 0 0 12.04 2Zm0 18.05h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.1.82.83-3.03-.2-.31a8.17 8.17 0 0 1-1.25-4.36c0-4.53 3.69-8.22 8.22-8.22 2.2 0 4.26.86 5.81 2.41a8.16 8.16 0 0 1 2.4 5.82c0 4.53-3.69 8.2-8.22 8.2Zm4.5-6.15c-.24-.12-1.46-.72-1.69-.8-.22-.09-.39-.13-.55.12-.17.25-.64.8-.78.97-.15.16-.29.19-.53.06-.25-.12-1.04-.38-1.98-1.22-.74-.66-1.23-1.47-1.38-1.71-.14-.25-.01-.38.11-.5.11-.11.29-.29.43-.44.15-.14.19-.24.29-.41.1-.16.05-.3-.02-.43-.06-.12-.55-1.33-.76-1.83-.2-.48-.4-.41-.55-.42h-.47c-.17 0-.44.06-.66.31-.23.25-.87.85-.87 2.06 0 1.22.89 2.39 1.01 2.55.13.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.6.19 1.13.16 1.56.1.47-.07 1.46-.6 1.67-1.18.2-.58.2-1.07.14-1.18-.06-.1-.22-.16-.46-.28Z',
  },
  {
    name: 'LinkedIn',
    rail: true,
    href: 'https://www.linkedin.com/in/ahmed-islam-ai/',
    // Hand-drawn on purpose: simple-icons v16 has no `siLinkedin`.
    path: 'M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13Zm1.78 13.02H3.56V9h3.56v11.45Z',
  },
  {
    name: 'GitHub',
    rail: true,
    href: 'https://github.com/Ahmed-Islam-AI',
    path: siGithub.path,
  },
  {
    name: 'Upwork',
    rail: true,
    href: 'https://www.upwork.com/freelancers/~013d744c3e6673db44',
    path: 'M18.56 13.16c-1.1 0-2.13-.47-3.07-1.23l.23-1.08.01-.04c.2-1.14.84-3.06 2.83-3.06a2.7 2.7 0 0 1 0 5.41Zm0-8.14c-2.54 0-4.51 1.65-5.31 4.37-1.22-1.84-2.15-4.04-2.69-5.9H7.83v7.12a2.55 2.55 0 0 1-5.1 0V3.49H0v7.11a5.44 5.44 0 0 0 5.28 5.47 5.44 5.44 0 0 0 5.28-5.47V9.42c.53 1.1 1.19 2.22 1.98 3.22l-1.67 7.87h2.8l1.21-5.71c1.07.68 2.29 1.11 3.69 1.11a5.44 5.44 0 0 0 5.44-5.45 5.44 5.44 0 0 0-5.44-5.44Z',
  },
  {
    name: 'Medium',
    href: 'https://ahmed-islam.medium.com/',
    path: siMedium.path,
  },
  {
    name: 'LeetCode',
    href: 'https://leetcode.com/u/user9234eM/',
    path: siLeetcode.path,
  },
  {
    name: 'X',
    href: 'https://x.com/DevAhmedAI',
    path: siX.path,
  },
  {
    name: 'Instagram',
    rail: true,
    href: 'https://www.instagram.com/ahmedislam.ai',
    path: 'M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.55.22.95.47 1.36.88.41.41.66.81.88 1.36.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.55-.47.95-.88 1.36-.41.41-.81.66-1.36.88-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.67 3.67 0 0 1-1.36-.88 3.67 3.67 0 0 1-.88-1.36c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.55.47-.95.88-1.36.41-.41.81-.66 1.36-.88.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07Zm0 2.12c-3.15 0-3.5.01-4.73.07-.94.04-1.4.19-1.72.32-.35.13-.6.29-.86.55-.26.26-.42.51-.55.86-.13.32-.28.78-.32 1.72-.06 1.23-.07 1.58-.07 4.73s.01 3.5.07 4.73c.4.94.19 1.4.32 1.72.13.35.29.6.55.86.26.26.51.42.86.55.32.13.78.28 1.72.32 1.23.06 1.58.07 4.73.07s3.5-.01 4.73-.07c.94-.04 1.4-.19 1.72-.32.35-.13.6-.29.86-.55.26-.26.42-.51.55-.86.13-.32.28-.78.32-1.72.06-1.23.07-1.58.07-4.73s-.01-3.5-.07-4.73c-.04-.94-.19-1.4-.32-1.72a2.3 2.3 0 0 0-.55-.86 2.3 2.3 0 0 0-.86-.55c-.32-.13-.78-.28-1.72-.32-1.23-.06-1.58-.07-4.73-.07Zm0 3.6a6.12 6.12 0 1 1 0 12.24 6.12 6.12 0 0 1 0-12.24Zm0 2.12a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm6.36-2.36a1.43 1.43 0 1 1 0-2.86 1.43 1.43 0 0 1 0 2.86Z',
  },
  {
    name: 'Facebook',
    href: 'https://facebook.com/AhmedIslamAI',
    path: 'M14.02 8.5h2.23V5.36c-.39-.05-1.6-.16-3-.16-2.96 0-5 1.86-5 5.28v2.6H5.6v3.6h2.65V24h3.63v-7.32h2.65l.41-3.6h-3.06v-2.25c0-1.04.28-1.75 1.7-1.75Z',
  },
]

/**
 * What the fixed right-edge rail shows — a deliberate subset, not the full list.
 *
 * **The rail is a quiet signpost, not a directory.** STYLE.md's rule for both
 * gutter rails is that they stay quiet at rest and never compete with content;
 * nine stacked circles is a menu bolted to the side of the page. The footer is
 * where the complete set belongs, and it already lists all nine.
 *
 * It is also a hard layout constraint. The rail is `size-11` + `gap-2`, centred
 * on the viewport, so it stands `n * 44 + (n - 1) * 8` px tall:
 *
 *   - 9 entries = 460px. Measured at 1024x600 that **overlapped the fixed nav by
 *     16px** — the rail's own top sat above the nav's bottom edge.
 *   - 5 entries = 252px, which clears the nav by 88px at that same size.
 *
 * The five are the ones a visitor might actually act on: message him, check his
 * professional profile, read his code, hire him, or follow him. Everything else
 * is one scroll away in the footer.
 *
 * GitHub was added 2026-08-30 on Ahmed's instruction — for an engineer it is
 * arguably the profile that matters most, and at five the rail still measures
 * comfortably clear. **Six is where this needs re-measuring, not assuming.**
 */
export const RAIL_SOCIALS = SOCIALS.filter((social) => social.rail)

if (import.meta.env.DEV) {
  const height = RAIL_SOCIALS.length * 44 + (RAIL_SOCIALS.length - 1) * 8
  // 1024x600 is the tightest case the rail renders at (it is `lg:flex`, so it
  // never shows below 1024 wide). Nav bottom sits at 86px there.
  const topAt600 = 300 - height / 2
  if (topAt600 < 96) {
    console.warn(
      `RAIL_SOCIALS renders a ${height}px rail — at 1024x600 its top lands at ` +
        `${topAt600}px, against a nav that ends at 86px. Five entries is the tested ` +
        `ceiling; ` +
        'put the rest in the footer, which lists all of SOCIALS.',
    )
  }
}

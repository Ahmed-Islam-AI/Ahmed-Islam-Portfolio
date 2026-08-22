export interface Testimonial {
  id: string
  /**
   * The run that appears in the composite paragraph. MUST be a verbatim,
   * contiguous substring of `quote` — this is an excerpt, not a summary. Keep it
   * to ~18-25 words; longer runs stop reading as a single voice in the flow.
   */
  pull: string
  /** The full recommendation, verbatim. Shown when the source row is opened. */
  quote: string
  name: string
  /**
   * How they know Ahmed. Read from the quote itself, not invented — but these are
   * a reading, so correct them if any is wrong. Only Arham describes hiring him;
   * the rest are classmates, project partners and colleagues, which is why the
   * section says "recommendations" and not "clients".
   */
  relation: string
  location: string
}

/**
 * Real LinkedIn recommendations, supplied by Ahmed 2026-08-12. Verbatim — do not
 * tidy the grammar, and do not strip the ❤ from Murtaza's: STYLE.md's no-emoji
 * rule is about the site's own iconography, not about editing what a real person
 * wrote.
 *
 * Deliberately dropped from the source data:
 * - `rating: 5` on all five. Five identical five-star rows carry no information —
 *   same reasoning that replaced the reference design's colour-coded category dots
 *   with counts. If one day a rating varies, it becomes worth showing.
 * - `avatar`. The image files live in the old site (`/images/walloflove/`) and
 *   aren't in this repo. The ledger reads cleanly without them; if you add them,
 *   they're a new shape on this page, so check STYLE.md first.
 *
 * Ordered strongest-first for the composite: Arham is the only one describing a
 * paid engagement, so his line opens the paragraph, and Murtaza's eleven words
 * close it.
 */
export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'arham',
    pull: 'Working with Ahmed felt less like hiring an engineer and more like gaining a partner who genuinely cared about the outcome.',
    quote:
      'Working with Ahmed felt less like hiring an engineer and more like gaining a partner who genuinely cared about the outcome. He took a rough idea I had around AI and turned it into a polished, production-ready solution — explaining every decision in plain language along the way. What stood out most was his reliability: clear updates, zero surprises, and models that actually performed in the real world. If you want someone who blends deep AI/ML expertise with the rare ability to just get things done, Ahmed is the one. I’d work with him again in a heartbeat.',
    name: 'Arham Khan',
    relation: 'Client',
    location: 'Hyderabad, Pakistan',
  },
  {
    id: 'rida',
    pull: 'With a strong grasp of complex concepts, he not only shares insightful opinions but also motivates others.',
    quote:
      'It has been a pleasure working with Ahmed. His collaborative nature makes every project enjoyable and productive. With a strong grasp of complex concepts, he not only shares insightful opinions but also motivates others. I have had the opportunity to work with him on AI and deep learning tasks, and his expertise has consistently contributed to our success.',
    name: 'Rida Abid',
    relation: 'Worked together on AI & deep learning',
    location: 'Gujrat, Pakistan',
  },
  {
    id: 'haseeb',
    pull: 'He has developed solid expertise in Artificial Intelligence and Machine Learning, not just in theory but also through practical implementation.',
    quote:
      'I had the pleasure of studying alongside Ahmed at the University of Haripur. During that time, I witnessed firsthand his strong dedication to learning and his passion for technology. He has developed solid expertise in Artificial Intelligence and Machine Learning, not just in theory but also through practical implementation. Whether it was projects, discussions, or collaborative learning, his insights were always sharp and well-grounded. If you’re looking for someone who combines technical depth with a collaborative mindset, I highly recommend Ahmed for any opportunity in AI/ML.',
    name: 'Abdul Haseeb',
    relation: 'Studied together, University of Haripur',
    location: 'Wah Cantt, Pakistan',
  },
  {
    id: 'mubashir',
    pull: 'His ability to troubleshoot issues and find efficient workarounds played a crucial role in the success of our work.',
    quote:
      'I am pleased to write this for Ahmed Islam, with whom I had the privilege of working closely during our Final Year Project (FYP). Ahmed is an exceptionally talented individual with a deep understanding of Artificial Intelligence and Machine Learning, and a genuine passion for using technology to solve real-world problems. Throughout our FYP, Ahmed consistently demonstrated remarkable dedication and technical proficiency. He was not only well-versed in core AI and ML concepts but also proactive in exploring new frameworks, optimizing models, and integrating innovative solutions into our project. His ability to troubleshoot issues and find efficient workarounds played a crucial role in the success of our work. I have no doubt that Ahmed will excel in any opportunity he pursues and will continue to contribute significantly to the field of AI and Machine Learning. I strongly recommend him without reservation.',
    name: 'Mubashir Nisar',
    relation: 'Final Year Project partner',
    location: 'Khanpur, Pakistan',
  },
  {
    id: 'murtaza',
    pull: 'He was amazing to work with and really compromising personality ❤',
    quote: 'He was amazing to work with and really compromising personality ❤',
    name: 'Murtaza Arif',
    relation: 'Worked together',
    location: 'Islamabad, Pakistan',
  },
]

// The composite shows `pull` and the ledger shows `quote`, so a `pull` that isn't
// literally inside its `quote` is a testimonial this site made up — the exact thing
// the content rules forbid. Cheap enough to check on every dev boot; stripped from
// the production bundle by the `import.meta.env.DEV` guard.
if (import.meta.env.DEV) {
  for (const t of TESTIMONIALS) {
    if (!t.quote.includes(t.pull)) {
      throw new Error(`testimonials: "${t.id}" pull-quote is not verbatim inside its full quote`)
    }
  }
}

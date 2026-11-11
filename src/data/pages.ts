/**
 * Title and description for each page that isn't generated from data
 * (services and posts carry their own, in services.ts and the post's
 * frontmatter).
 *
 * One source for both places a title lives: `blog.vite.ts` writes it into the
 * page's HTML head at build (what search engines and link previews read), and
 * the page sets `document.title` from it when you arrive by an in-app link.
 * They were two hand-typed strings before, free to drift apart.
 *
 * Titles lead with the name and carry the words people search for; Google
 * shows about 60 characters, so the most important words go first.
 * Descriptions stay under ~160. Imported by blog.vite.ts in Node: plain data.
 */
export const PAGES = {
  home: {
    title: 'Ahmed Islam — Full-Stack AI Engineer | Agentic AI, RAG & Web Apps',
    description:
      'Full-Stack AI Engineer in Islamabad, Pakistan, building agentic AI systems, RAG pipelines, machine learning models and React and Next.js web apps.',
  },
  projects: {
    title: 'AI & Web Development Projects — Ahmed Islam',
    description:
      'Projects by Ahmed Islam: AI features for a live SaaS platform, machine-learning models, an Android app for small shops and a Windows download manager.',
  },
  privacy: {
    title: 'Privacy Policy — Ahmed Islam',
    description:
      'How ahmedislam.tech collects and uses information through Google Analytics and its contact form, and the choices available to visitors.',
  },
  blog: {
    title: 'AI & Data Science Blog — Ahmed Islam',
    description:
      'Guides and notes on AI engineering and the web: what worked, what broke, and the code that fixed it.',
  },
}

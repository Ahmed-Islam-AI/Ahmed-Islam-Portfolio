/** Shared by the build plugin (`blog.vite.ts`) and the pages that render posts. */

export interface PostMeta {
  slug: string
  title: string
  description: string
  /** ISO date, `YYYY-MM-DD` */
  date: string
  tags: string[]
  /** Reading time, from the word count with code blocks left out */
  minutes: number
}

export interface TocEntry {
  id: string
  text: string
  depth: 2 | 3
}

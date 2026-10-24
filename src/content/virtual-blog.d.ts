// The modules `blog.vite.ts` generates from src/content/blog/*.md.

declare module 'virtual:blog' {
  import type { PostMeta, TocEntry } from './types'
  /** Every published post, newest first. Drafts are included in dev only. */
  export const posts: PostMeta[]
  /** One lazy chunk per post, keyed by slug. */
  export const bodies: Record<string, () => Promise<{ html: string; toc: TocEntry[] }>>
}

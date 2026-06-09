import 'server-only'
import { marked } from 'marked'
import DOMPurify from 'isomorphic-dompurify'
import dbConnect from '@/lib/db/mongodb'
import Blog, { type IBlog } from '@/lib/db/models/blog'
import { categories } from './categories'
import type { Post, PostHeading, PostSummary } from './types'

/* ------------------------------------------------------------------ */
/* Category mapping: free-text DB category -> site category slug       */
/* ------------------------------------------------------------------ */

export function slugifyCategory(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/&/g, ' ')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

const categoryLookup = new Map<string, string>()
for (const c of categories) {
  categoryLookup.set(c.slug, c.slug)
  categoryLookup.set(slugifyCategory(c.name), c.slug)
  categoryLookup.set(slugifyCategory(c.shortName), c.slug)
}

/** Maps a free-text DB category to a known category slug (or a slugified fallback). */
export function mapCategory(raw: string): string {
  if (!raw) return 'miscellaneous'
  const slug = slugifyCategory(raw)
  return categoryLookup.get(slug) ?? slug
}

/* ------------------------------------------------------------------ */
/* Content rendering: markdown/HTML -> sanitized HTML with heading ids */
/* ------------------------------------------------------------------ */

function isHtml(content: string): boolean {
  return /^\s*</.test(content)
}

function slugifyHeading(text: string, used: Set<string>): string {
  const base =
    text
      .toLowerCase()
      .replace(/<[^>]*>/g, '')
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .substring(0, 60) || 'section'
  let id = base
  let n = 1
  while (used.has(id)) id = `${base}-${n++}`
  used.add(id)
  return id
}

/** Adds ids to h2/h3 elements and extracts them for the table of contents. */
function processHeadings(html: string): {
  html: string
  headings: PostHeading[]
} {
  const headings: PostHeading[] = []
  const used = new Set<string>()
  const processed = html.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (match, level, attrs: string, inner: string) => {
      const text = inner.replace(/<[^>]*>/g, '').trim()
      if (!text) return match
      const existing = /id=["']([^"']+)["']/.exec(attrs)
      const id = existing ? existing[1] : slugifyHeading(text, used)
      headings.push({ id, text, level: level === '2' ? 1 : 2 })
      if (existing) return match
      return `<h${level}${attrs} id="${id}">${inner}</h${level}>`
    },
  )
  return { html: processed, headings }
}

function renderContent(content: string): {
  html: string
  headings: PostHeading[]
} {
  const rawHtml = isHtml(content)
    ? content
    : (marked.parse(content, { async: false }) as string)
  const clean = DOMPurify.sanitize(rawHtml, {
    ADD_ATTR: ['target', 'rel'],
  })
  return processHeadings(clean)
}

function readingTimeOf(content: string): number {
  const words = content
    .replace(/<[^>]*>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

/* ------------------------------------------------------------------ */
/* DB blog -> Post mapping                                             */
/* ------------------------------------------------------------------ */

type BlogDoc = Pick<
  IBlog,
  | 'title'
  | 'url'
  | 'excerpt'
  | 'content'
  | 'category'
  | 'imageUrl'
  | 'publishedAt'
  | 'viewCount'
  | 'createdAt'
  | 'updatedAt'
>

function toIso(d: Date | undefined, fallback: Date): string {
  return (d ?? fallback).toISOString()
}

function mapSummary(doc: BlogDoc): PostSummary {
  return {
    slug: doc.url,
    title: doc.title,
    excerpt: doc.excerpt,
    category: mapCategory(doc.category),
    author: 'admin',
    publishedAt: toIso(doc.publishedAt, doc.createdAt),
    updatedAt: toIso(doc.updatedAt, doc.createdAt),
    readingTime: readingTimeOf(doc.content ?? ''),
    image: doc.imageUrl,
    imageAlt: doc.title,
    tags: [doc.category],
  }
}

function mapPost(doc: BlogDoc): Post {
  const { html, headings } = renderContent(doc.content ?? '')
  return {
    ...mapSummary(doc),
    agencies: [],
    body: [{ type: 'html', html }],
    headings,
  }
}

/* ------------------------------------------------------------------ */
/* Queries (all fail soft so builds/pages work without a database)     */
/* ------------------------------------------------------------------ */

/** Published now: status published, or scheduled whose time has passed. */
function publishedFilter() {
  const now = new Date()
  return {
    $or: [
      { status: 'published' },
      { status: 'scheduled', scheduledAt: { $lte: now } },
    ],
  }
}

const SUMMARY_FIELDS =
  'title url excerpt content category imageUrl publishedAt viewCount createdAt updatedAt'

async function connect(): Promise<boolean> {
  try {
    const conn = await dbConnect()
    return conn !== null
  } catch (error) {
    console.error('[content] Database connection failed:', error)
    return false
  }
}

export async function getAllPosts(): Promise<PostSummary[]> {
  if (!(await connect())) return []
  try {
    const docs = await Blog.find(publishedFilter())
      .select(SUMMARY_FIELDS)
      .sort({ publishedAt: -1, createdAt: -1 })
      .lean<BlogDoc[]>()
    return docs.map(mapSummary)
  } catch (error) {
    console.error('[content] getAllPosts failed:', error)
    return []
  }
}

export async function getPost(slug: string): Promise<Post | null> {
  if (!slug || !(await connect())) return null
  try {
    const doc = await Blog.findOne({ url: slug.toLowerCase(), ...publishedFilter() })
      .select(SUMMARY_FIELDS)
      .lean<BlogDoc | null>()
    return doc ? mapPost(doc) : null
  } catch (error) {
    console.error('[content] getPost failed:', error)
    return null
  }
}

export async function getLatestPosts(limit = 6): Promise<PostSummary[]> {
  if (!(await connect())) return []
  try {
    const docs = await Blog.find(publishedFilter())
      .select(SUMMARY_FIELDS)
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(limit)
      .lean<BlogDoc[]>()
    return docs.map(mapSummary)
  } catch (error) {
    console.error('[content] getLatestPosts failed:', error)
    return []
  }
}

/** Featured = the most recent posts (DB has no featured flag). */
export async function getFeaturedPosts(limit = 4): Promise<PostSummary[]> {
  return getLatestPosts(limit)
}

/** Trending = most viewed published posts; falls back to latest. */
export async function getTrendingPosts(limit = 5): Promise<PostSummary[]> {
  if (!(await connect())) return []
  try {
    const docs = await Blog.find(publishedFilter())
      .select(SUMMARY_FIELDS)
      .sort({ viewCount: -1, publishedAt: -1 })
      .limit(limit)
      .lean<BlogDoc[]>()
    const posts = docs.map(mapSummary)
    return posts.length ? posts : getLatestPosts(limit)
  } catch (error) {
    console.error('[content] getTrendingPosts failed:', error)
    return []
  }
}

export async function getPostsByCategory(slug: string): Promise<PostSummary[]> {
  const all = await getAllPosts()
  return all.filter((p) => p.category === slug)
}

export async function getRelatedPosts(
  post: Pick<Post, 'slug' | 'category'>,
  limit = 3,
): Promise<PostSummary[]> {
  const all = await getAllPosts()
  const sameCategory = all.filter(
    (p) => p.slug !== post.slug && p.category === post.category,
  )
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit)
  const others = all.filter(
    (p) => p.slug !== post.slug && p.category !== post.category,
  )
  return [...sameCategory, ...others].slice(0, limit)
}

/** Internal-linking helper: older published posts for the helpful-links widget. */
export async function getOlderBlogPosts(
  currentPublishedAt: string,
  currentSlug: string,
  limit = 5,
): Promise<{ title: string; url: string }[]> {
  const cutoff = new Date(currentPublishedAt).getTime()
  if (!currentSlug || Number.isNaN(cutoff)) return []
  const all = await getAllPosts()
  return all
    .filter(
      (p) =>
        p.slug !== currentSlug &&
        new Date(p.publishedAt).getTime() < cutoff,
    )
    .slice(0, limit)
    .map((p) => ({ title: p.title, url: p.slug }))
}

export async function getCategoryCounts(): Promise<Record<string, number>> {
  const counts: Record<string, number> = {}
  for (const c of categories) counts[c.slug] = 0
  const all = await getAllPosts()
  for (const p of all) counts[p.category] = (counts[p.category] ?? 0) + 1
  return counts
}

/** Fire-and-forget view counter — never blocks or throws into rendering. */
export function incrementViewCount(slug: string): void {
  void (async () => {
    try {
      if (!(await connect())) return
      await Blog.updateOne({ url: slug.toLowerCase() }, { $inc: { viewCount: 1 } })
    } catch {
      /* view counting must never break the page */
    }
  })()
}

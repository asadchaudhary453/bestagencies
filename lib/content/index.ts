import { posts } from './posts'
import { categories, getCategory } from './categories'
import { authors, getAuthor } from './authors'
import type { Post } from './types'

export { categories, getCategory, authors, getAuthor }
export type { Post }

const byDateDesc = (a: Post, b: Post) =>
  new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()

export function getAllPosts(): Post[] {
  return [...posts].sort(byDateDesc)
}

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug)
}

export function getFeaturedPosts(limit = 4): Post[] {
  return getAllPosts()
    .filter((p) => p.featured)
    .slice(0, limit)
}

export function getTrendingPosts(limit = 5): Post[] {
  const trending = getAllPosts().filter((p) => p.trending)
  return (trending.length ? trending : getAllPosts()).slice(0, limit)
}

export function getLatestPosts(limit = 6): Post[] {
  return getAllPosts().slice(0, limit)
}

export function getPostsByCategory(slug: string): Post[] {
  return getAllPosts().filter((p) => p.category === slug)
}

export function getPostsByAuthor(slug: string): Post[] {
  return getAllPosts().filter((p) => p.author === slug)
}

/**
 * Internal-linking helper: returns up to `limit` posts published strictly
 * before `currentCreatedAt`, excluding the current post, sorted newest-first.
 * Only `title` and `url` (slug) are returned. Invalid inputs yield [].
 * Note: this content library has no draft state — every post is published.
 */
export function getOlderBlogPosts(
  currentCreatedAt: string,
  currentId: string,
  limit = 5,
): { title: string; url: string }[] {
  const cutoff = new Date(currentCreatedAt).getTime()
  if (!currentId || typeof currentId !== 'string' || Number.isNaN(cutoff)) {
    return []
  }
  return getAllPosts()
    .filter(
      (p) =>
        p.slug !== currentId && new Date(p.publishedAt).getTime() < cutoff,
    )
    .sort(byDateDesc)
    .slice(0, limit)
    .map((p) => ({ title: p.title, url: p.slug }))
}

export function getRelatedPosts(post: Post, limit = 3): Post[] {
  const sameCategory = getAllPosts().filter(
    (p) => p.slug !== post.slug && p.category === post.category,
  )
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit)
  const others = getAllPosts().filter(
    (p) => p.slug !== post.slug && p.category !== post.category,
  )
  return [...sameCategory, ...others].slice(0, limit)
}

/** Levenshtein distance capped at `max` for cheap typo tolerance. */
function editDistance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1
  const prev: number[] = new Array(b.length + 1)
  for (let j = 0; j <= b.length; j++) prev[j] = j
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0]
    prev[0] = i
    let rowMin = prev[0]
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j]
      prev[j] = Math.min(
        prev[j] + 1,
        prev[j - 1] + 1,
        diag + (a[i - 1] === b[j - 1] ? 0 : 1),
      )
      diag = tmp
      if (prev[j] < rowMin) rowMin = prev[j]
    }
    if (rowMin > max) return max + 1
  }
  return prev[b.length]
}

/**
 * Fuzzy, scored search. Tolerates typos (edit distance <= 2 on words of 5+
 * chars, <= 1 on 4-char words) and ranks exact > prefix > fuzzy matches.
 * Optionally restricted to a single category.
 */
export function searchPosts(query: string, categorySlug?: string): Post[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const terms = q.split(/\s+/).filter(Boolean)

  const pool = categorySlug
    ? getAllPosts().filter((p) => p.category === categorySlug)
    : getAllPosts()

  const scored = pool
    .map((p) => {
      const fields = [
        { text: p.title.toLowerCase(), weight: 4 },
        { text: p.tags.join(' ').toLowerCase(), weight: 3 },
        {
          text: p.agencies.map((a) => a.name).join(' ').toLowerCase(),
          weight: 3,
        },
        { text: p.category.replace(/-/g, ' '), weight: 2 },
        { text: p.excerpt.toLowerCase(), weight: 1 },
      ]
      let score = 0
      for (const term of terms) {
        let termScore = 0
        for (const f of fields) {
          if (f.text.includes(term)) {
            termScore = Math.max(termScore, f.weight * 3)
            continue
          }
          for (const word of f.text.split(/[^a-z0-9]+/)) {
            if (!word) continue
            if (word.startsWith(term) || term.startsWith(word)) {
              termScore = Math.max(termScore, f.weight * 2)
            } else if (term.length >= 4 && word.length >= 4) {
              const maxDist = term.length >= 5 ? 2 : 1
              if (editDistance(term, word, maxDist) <= maxDist) {
                termScore = Math.max(termScore, f.weight)
              }
            }
          }
        }
        if (termScore === 0) return null
        score += termScore
      }
      return { post: p, score }
    })
    .filter((r): r is { post: Post; score: number } => r !== null)

  return scored.sort((a, b) => b.score - a.score).map((r) => r.post)
}

export function getCategoryCounts(): Record<string, number> {
  return categories.reduce<Record<string, number>>((acc, c) => {
    acc[c.slug] = getPostsByCategory(c.slug).length
    return acc
  }, {})
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

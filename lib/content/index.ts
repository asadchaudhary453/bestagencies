import { categories, getCategory as getKnownCategory } from './categories'
import { authors, getAuthor } from './authors'
import type { Category, Post, PostSummary } from './types'

export { categories, authors, getAuthor }
export type { Post, PostSummary }

/**
 * Resolves a category slug. Known slugs return the designed category;
 * unknown slugs (free-text categories from the database) get a basic
 * auto-generated category page definition.
 */
export function getCategory(slug: string): Category | undefined {
  const known = getKnownCategory(slug)
  if (known) return known
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) return undefined
  const name = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
  return {
    slug,
    name,
    shortName: name,
    title: `Best ${name} Guides & Reviews`,
    description: `Independently researched ${name.toLowerCase()} guides, rankings and reviews from the Best Agencies editorial team.`,
    blurb: `Guides and reviews covering ${name.toLowerCase()}.`,
    icon: 'LayoutGrid',
  }
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
 * Fuzzy, scored search over a pool of posts. Tolerates typos (edit distance
 * <= 2 on words of 5+ chars, <= 1 on 4-char words) and ranks exact > prefix
 * > fuzzy matches. Optionally restricted to a single category.
 */
export function searchPosts(
  pool: PostSummary[],
  query: string,
  categorySlug?: string,
): PostSummary[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const terms = q.split(/\s+/).filter(Boolean)

  const scoped = categorySlug
    ? pool.filter((p) => p.category === categorySlug)
    : pool

  const scored = scoped
    .map((p) => {
      const fields = [
        { text: p.title.toLowerCase(), weight: 4 },
        { text: p.tags.join(' ').toLowerCase(), weight: 3 },
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
    .filter((r): r is { post: PostSummary; score: number } => r !== null)

  return scored.sort((a, b) => b.score - a.score).map((r) => r.post)
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

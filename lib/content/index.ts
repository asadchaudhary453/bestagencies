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

export function searchPosts(query: string): Post[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return getAllPosts().filter((p) => {
    const haystack = [
      p.title,
      p.excerpt,
      p.category,
      ...p.tags,
      ...p.agencies.map((a) => a.name),
    ]
      .join(' ')
      .toLowerCase()
    return haystack.includes(q)
  })
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

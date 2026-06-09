import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/site'
import { categories } from '@/lib/content'
import { getAllPosts } from '@/lib/content/data'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url
  const posts = await getAllPosts()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/agencies`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/categories`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/about`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/write-for-us`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/contact`, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${base}/terms`, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${base}/category/${c.slug}`,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${base}/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...categoryRoutes, ...postRoutes]
}

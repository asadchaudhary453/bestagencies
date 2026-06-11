import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/site'
import { categories } from '@/lib/content'
import { getAllPosts } from '@/lib/content/data'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url
  const posts = await getAllPosts()
  const lastModified = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified, changeFrequency: 'weekly', priority: 1 },
    {
      url: `${base}/agencies`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${base}/categories`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${base}/about`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${base}/write-for-us`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${base}/contact`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${base}/terms`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${base}/site-map`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${base}/category/${c.slug}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 1,
  }))

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${base}/${p.slug}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 1,
  }))

  return [...staticRoutes, ...categoryRoutes, ...postRoutes]
}

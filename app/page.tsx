import {
  getFeaturedPosts,
  getLatestPosts,
  getTrendingPosts,
} from '@/lib/content/data'
import { Hero } from '@/components/home/hero'
import { CategoryGrid } from '@/components/home/category-grid'
import { LatestTrending } from '@/components/home/latest-trending'
import { AdvertisementCard } from '@/components/ads/advertisement-card'

export const revalidate = 300

export default async function HomePage() {
  const [featured, latestRaw, trendingRaw] = await Promise.all([
    getFeaturedPosts(5),
    getLatestPosts(11),
    getTrendingPosts(10),
  ])
  const pool = featured.length ? featured : latestRaw.slice(0, 5)
  const [lead, ...secondary] = pool

  // Exclude posts already shown in the hero so sections stay unique.
  const heroSlugs = new Set(pool.map((p) => p.slug))
  const latest = latestRaw.filter((p) => !heroSlugs.has(p.slug)).slice(0, 6)
  const trending = trendingRaw
    .filter((p) => !heroSlugs.has(p.slug))
    .slice(0, 5)

  return (
    <main>
      {lead && <Hero lead={lead} secondary={secondary.slice(0, 4)} />}
      <CategoryGrid />
      {(latest.length > 0 || trending.length > 0) && (
        <LatestTrending latest={latest} trending={trending} />
      )}
      <section className="mx-auto max-w-6xl px-4 py-4 pb-12 sm:px-6 lg:py-8 lg:pb-16">
        <AdvertisementCard variant="horizontal" />
      </section>
    </main>
  )
}

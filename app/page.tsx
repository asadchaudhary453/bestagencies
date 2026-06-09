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
  const [featured, latest, trending] = await Promise.all([
    getFeaturedPosts(5),
    getLatestPosts(6),
    getTrendingPosts(5),
  ])
  const pool = featured.length ? featured : latest.slice(0, 5)
  const [lead, ...secondary] = pool

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

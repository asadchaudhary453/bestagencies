import {
  getFeaturedPosts,
  getLatestPosts,
  getTrendingPosts,
} from '@/lib/content'
import { Hero } from '@/components/home/hero'
import { CategoryGrid } from '@/components/home/category-grid'
import { LatestTrending } from '@/components/home/latest-trending'
import { AdvertisementCard } from '@/components/ads/advertisement-card'

export default function HomePage() {
  const featured = getFeaturedPosts(5)
  const pool = featured.length ? featured : getLatestPosts(5)
  const [lead, ...secondary] = pool
  const latest = getLatestPosts(6)
  const trending = getTrendingPosts(5)

  return (
    <main>
      <Hero lead={lead} secondary={secondary.slice(0, 4)} />
      <CategoryGrid />
      <LatestTrending latest={latest} trending={trending} />
      <section className="mx-auto max-w-6xl px-4 py-4 pb-12 sm:px-6 lg:py-8 lg:pb-16">
        <AdvertisementCard variant="horizontal" />
      </section>
    </main>
  )
}

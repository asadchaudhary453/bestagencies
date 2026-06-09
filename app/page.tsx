import {
  getFeaturedPosts,
  getLatestPosts,
  getTrendingPosts,
} from '@/lib/content'
import { Hero } from '@/components/home/hero'
import { TrustBand } from '@/components/home/trust-band'
import { CategoryGrid } from '@/components/home/category-grid'
import { LatestTrending } from '@/components/home/latest-trending'
import { NewsletterCta } from '@/components/home/newsletter-cta'

export default function HomePage() {
  const featured = getFeaturedPosts(5)
  const pool = featured.length ? featured : getLatestPosts(5)
  const [lead, ...secondary] = pool
  const latest = getLatestPosts(6)
  const trending = getTrendingPosts(5)

  return (
    <main>
      <Hero lead={lead} secondary={secondary.slice(0, 4)} />
      <TrustBand />
      <CategoryGrid />
      <LatestTrending latest={latest} trending={trending} />
      <NewsletterCta />
    </main>
  )
}

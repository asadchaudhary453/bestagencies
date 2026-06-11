import type { Metadata } from 'next'
import Link from 'next/link'
import { categories } from '@/lib/content'
import {
  getAllPosts,
  getPostsByCategory,
  getCategoryCounts,
} from '@/lib/content/data'
import { SITE } from '@/lib/site'
import { PageHeader } from '@/components/layout/page-header'
import { PostsGrid } from '@/components/posts/posts-grid'
import { PostsPagination } from '@/components/posts/posts-pagination'
import { AdvertisementCard } from '@/components/ads/advertisement-card'
import { cn } from '@/lib/utils'

const POSTS_PER_PAGE = 24

export const metadata: Metadata = {
  title: 'All Categories & Rankings',
  description:
    'Browse every independently researched guide and ranking — across digital marketing, business, tech, home, health, property and more.',
  alternates: { canonical: '/agencies' },
  openGraph: {
    title: `All Categories & Rankings | ${SITE.name}`,
    description:
      'Browse every independently researched guide and ranking across all categories.',
    url: `${SITE.url}/agencies`,
    type: 'website',
  },
}

export default async function AgenciesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>
}) {
  const { category, page } = await searchParams
  const [counts, allPosts] = await Promise.all([
    getCategoryCounts(),
    getAllPosts(),
  ])
  const activeCategory = categories.find((c) => c.slug === category)
  const filteredPosts = activeCategory
    ? await getPostsByCategory(activeCategory.slug)
    : allPosts

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE))
  const currentPage = Math.min(
    Math.max(1, Number.parseInt(page ?? '1', 10) || 1),
    totalPages,
  )
  const posts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE,
  )

  return (
    <main>
      <PageHeader
        eyebrow="The full library"
        title="All Categories & Rankings"
        description="Independent, methodology-driven guides across every category. Filter by category to narrow your shortlist."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'All Categories' }]}
      />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        <div data-reveal className="mb-8 flex flex-wrap gap-2">
          <Link
            href="/agencies"
            className={cn(
              'rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-primary hover:text-primary',
              !activeCategory && 'border-primary bg-primary text-primary-foreground hover:text-primary-foreground',
            )}
          >
            All ({allPosts.length})
          </Link>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/agencies?category=${c.slug}`}
              className={cn(
                'rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-primary hover:text-primary',
                activeCategory?.slug === c.slug &&
                  'border-primary bg-primary text-primary-foreground hover:text-primary-foreground',
              )}
            >
              {c.shortName} ({counts[c.slug] ?? 0})
            </Link>
          ))}
        </div>
        <PostsGrid posts={posts} />
        <PostsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/agencies"
          searchParams={{ category }}
        />
        <div className="mt-12">
          <AdvertisementCard variant="horizontal" />
        </div>
      </section>
    </main>
  )
}

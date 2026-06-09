import type { Metadata } from 'next'
import { Suspense } from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { SearchResults } from '@/components/search/search-results'
import { Skeleton, PostsGridSkeleton } from '@/components/skeletons'
import { getAllPosts } from '@/lib/content/data'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search Best Agencies for agency rankings, reviews and guides.',
  alternates: { canonical: '/search' },
  robots: { index: false, follow: true },
}

export default async function SearchPage() {
  const posts = await getAllPosts()
  return (
    <main>
      <PageHeader
        eyebrow="Find a ranking"
        title="Search"
        description="Look up agencies, categories and guides across the whole library."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Search' }]}
      />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        <Suspense
          fallback={
            <div aria-busy="true">
              <Skeleton className="mb-10 h-16 w-full rounded-full" />
              <PostsGridSkeleton count={6} />
            </div>
          }
        >
          <SearchResults posts={posts} />
        </Suspense>
      </section>
    </main>
  )
}

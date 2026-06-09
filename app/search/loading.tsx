import {
  Skeleton,
  PageHeaderSkeleton,
  PostsGridSkeleton,
} from '@/components/skeletons'

export default function SearchLoading() {
  return (
    <main aria-busy="true" aria-label="Loading search">
      <PageHeaderSkeleton />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        <Skeleton className="mb-10 h-16 w-full rounded-full" />
        <Skeleton className="mb-6 h-4 w-40" />
        <PostsGridSkeleton count={6} />
      </section>
    </main>
  )
}

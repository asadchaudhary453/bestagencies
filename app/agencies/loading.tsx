import {
  Skeleton,
  PageHeaderSkeleton,
  PostsGridSkeleton,
} from '@/components/skeletons'

export default function AgenciesLoading() {
  return (
    <main aria-busy="true" aria-label="Loading rankings">
      <PageHeaderSkeleton />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        {/* Filter pills */}
        <div className="mb-8 flex flex-wrap gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-full" />
          ))}
        </div>
        <PostsGridSkeleton count={9} />
      </section>
    </main>
  )
}

import { Skeleton, PostCardSkeleton } from '@/components/skeletons'

export default function HomeLoading() {
  return (
    <main aria-busy="true" aria-label="Loading homepage">
      {/* Hero */}
      <section className="border-b border-border bg-paper">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:py-16">
          <div className="flex flex-col justify-center gap-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-4/5" />
            <div className="mt-2 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <Skeleton className="mt-3 h-11 w-40 rounded-full" />
          </div>
          <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
        </div>
      </section>

      {/* Category / latest grid */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        <Skeleton className="mb-8 h-8 w-56" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </main>
  )
}

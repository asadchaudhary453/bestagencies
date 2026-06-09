import { Skeleton, PageHeaderSkeleton } from '@/components/skeletons'

export default function CategoriesLoading() {
  return (
    <main aria-busy="true" aria-label="Loading categories">
      <PageHeaderSkeleton />
      <section className="bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5"
              >
                <Skeleton className="size-11 rounded-xl" />
                <Skeleton className="h-5 w-3/4" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                </div>
                <Skeleton className="mt-2 h-3 w-16" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

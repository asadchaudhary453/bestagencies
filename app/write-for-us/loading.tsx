import { Skeleton, PageHeaderSkeleton } from '@/components/skeletons'

export default function WriteForUsLoading() {
  return (
    <main aria-busy="true" aria-label="Loading page">
      <PageHeaderSkeleton />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        {/* Benefit cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="space-y-3 rounded-2xl border border-border bg-card p-6"
            >
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-5/6" />
            </div>
          ))}
        </div>
        {/* Two columns */}
        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, col) => (
            <div key={col} className="space-y-3">
              <Skeleton className="h-7 w-1/2" />
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

import { Skeleton, PageHeaderSkeleton } from '@/components/skeletons'

export default function TermsLoading() {
  return (
    <main aria-busy="true" aria-label="Loading page">
      <PageHeaderSkeleton />
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="space-y-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="space-y-3 rounded-2xl border border-border bg-card p-6"
            >
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

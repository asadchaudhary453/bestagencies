import { Skeleton } from '@/components/skeletons'

export default function ArticleLoading() {
  return (
    <main aria-busy="true" aria-label="Loading article">
      {/* Header */}
      <header className="border-b border-border bg-paper">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
          <Skeleton className="mb-6 h-3.5 w-56" />
          <Skeleton className="mb-5 h-6 w-24 rounded-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="mt-3 h-10 w-3/4" />
          <div className="mt-5 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Skeleton className="h-7 w-7 rounded-full" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </header>

      {/* Hero image */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="sm:-mt-10">
          <Skeleton className="aspect-[16/9] w-full rounded-2xl" />
        </div>
      </div>

      {/* Body + sidebar */}
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_260px] lg:py-16">
        <div className="min-w-0 max-w-3xl">
          <div className="mb-8 flex items-center justify-between border-b border-border pb-6">
            <div className="flex items-center gap-3">
              <Skeleton className="h-11 w-11 rounded-full" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-7 w-1/2" />
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-7 w-2/5" />
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-5/6" />
            <Skeleton className="h-3.5 w-4/6" />
            <Skeleton className="h-3.5 w-3/4" />
          </div>
        </aside>
      </div>
    </main>
  )
}

import { Skeleton, PostsGridSkeleton } from '@/components/skeletons'

export default function CategoryLoading() {
  return (
    <main aria-busy="true" aria-label="Loading category">
      {/* Dark category hero */}
      <section className="border-b border-border bg-ink">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
          <Skeleton className="mb-6 h-3.5 w-52 bg-ink-foreground/15" />
          <Skeleton className="mb-6 size-14 rounded-2xl bg-ink-foreground/15" />
          <Skeleton className="mb-4 h-4 w-24 bg-ink-foreground/15" />
          <Skeleton className="h-10 w-2/3 max-w-md bg-ink-foreground/15" />
          <div className="mt-5 space-y-2">
            <Skeleton className="h-4 w-full max-w-xl bg-ink-foreground/15" />
            <Skeleton className="h-4 w-3/4 max-w-lg bg-ink-foreground/15" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        <Skeleton className="mb-8 h-6 w-28" />
        <PostsGridSkeleton count={6} />
      </section>
    </main>
  )
}

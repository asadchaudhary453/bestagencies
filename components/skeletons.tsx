import { cn } from '@/lib/utils'

/** Base skeleton block — opacity-pulse only, no layout shift. */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn('skeleton', className)} />
}

/** Mirrors PostCard: image, badge, title, excerpt, meta row. */
export function PostCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <Skeleton className="aspect-[16/10] w-full rounded-none" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <Skeleton className="h-5 w-5/6" />
        <Skeleton className="h-5 w-2/3" />
        <div className="mt-1 space-y-2">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-4/5" />
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-3.5 w-10" />
        </div>
      </div>
    </div>
  )
}

/** Mirrors PostsGrid: responsive 3-column grid of card skeletons. */
export function PostsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  )
}

/** Mirrors PageHeader: eyebrow, title, description on the paper band. */
export function PageHeaderSkeleton() {
  return (
    <section className="border-b border-border bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        <Skeleton className="mb-6 h-3.5 w-48" />
        <Skeleton className="mb-4 h-4 w-28" />
        <Skeleton className="h-10 w-2/3 max-w-md" />
        <div className="mt-5 space-y-2">
          <Skeleton className="h-4 w-full max-w-xl" />
          <Skeleton className="h-4 w-3/4 max-w-lg" />
        </div>
      </div>
    </section>
  )
}

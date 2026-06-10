import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Builds the list of page items to render: numbers plus ellipsis markers.
 * Always shows first, last, current, and one neighbor on each side.
 */
function getPageItems(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const pages = new Set<number>([1, total, current - 1, current, current + 1])
  const sorted = [...pages]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b)
  const items: (number | 'ellipsis')[] = []
  let prev = 0
  for (const p of sorted) {
    if (p - prev > 1) items.push('ellipsis')
    items.push(p)
    prev = p
  }
  return items
}

export function Pagination({
  currentPage,
  totalPages,
  basePath,
}: {
  currentPage: number
  totalPages: number
  /** Path without the page query, e.g. `/category/digital-marketing` */
  basePath: string
}) {
  if (totalPages <= 1) return null

  const hrefFor = (page: number) =>
    page === 1 ? basePath : `${basePath}?page=${page}`

  const items = getPageItems(currentPage, totalPages)

  return (
    <nav
      aria-label="Pagination"
      className="mt-12 flex items-center justify-center gap-1.5"
    >
      {currentPage > 1 ? (
        <Link
          href={hrefFor(currentPage - 1)}
          rel="prev"
          className="inline-flex h-10 items-center gap-1 rounded-full border border-border bg-card px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Previous</span>
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className="inline-flex h-10 cursor-not-allowed items-center gap-1 rounded-full border border-border bg-card px-4 text-sm font-semibold text-muted-foreground/50"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Previous</span>
        </span>
      )}

      <div className="flex items-center gap-1.5">
        {items.map((item, i) =>
          item === 'ellipsis' ? (
            <span
              key={`e-${i}`}
              aria-hidden="true"
              className="px-1 text-sm text-muted-foreground"
            >
              &hellip;
            </span>
          ) : (
            <Link
              key={item}
              href={hrefFor(item)}
              aria-current={item === currentPage ? 'page' : undefined}
              className={cn(
                'inline-flex size-10 items-center justify-center rounded-full text-sm font-semibold transition-colors',
                item === currentPage
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border bg-card text-foreground hover:bg-muted',
              )}
            >
              {item}
            </Link>
          ),
        )}
      </div>

      {currentPage < totalPages ? (
        <Link
          href={hrefFor(currentPage + 1)}
          rel="next"
          className="inline-flex h-10 items-center gap-1 rounded-full border border-border bg-card px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className="inline-flex h-10 cursor-not-allowed items-center gap-1 rounded-full border border-border bg-card px-4 text-sm font-semibold text-muted-foreground/50"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </span>
      )}
    </nav>
  )
}

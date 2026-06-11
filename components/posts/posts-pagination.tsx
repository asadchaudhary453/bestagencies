import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

function buildHref(basePath: string, page: number, params: Record<string, string | undefined>) {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value)
  }
  if (page > 1) search.set('page', String(page))
  const qs = search.toString()
  return qs ? `${basePath}?${qs}` : basePath
}

/** Returns page numbers to render, with `null` marking an ellipsis. */
function getPageItems(current: number, total: number): (number | null)[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const items: (number | null)[] = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  if (start > 2) items.push(null)
  for (let p = start; p <= end; p++) items.push(p)
  if (end < total - 1) items.push(null)
  items.push(total)
  return items
}

export function PostsPagination({
  currentPage,
  totalPages,
  basePath,
  searchParams = {},
}: {
  currentPage: number
  totalPages: number
  basePath: string
  searchParams?: Record<string, string | undefined>
}) {
  if (totalPages <= 1) return null

  return (
    <Pagination className="mt-12">
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious
              href={buildHref(basePath, currentPage - 1, searchParams)}
            />
          </PaginationItem>
        )}
        {getPageItems(currentPage, totalPages).map((item, i) =>
          item === null ? (
            <PaginationItem key={`ellipsis-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink
                href={buildHref(basePath, item, searchParams)}
                isActive={item === currentPage}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext
              href={buildHref(basePath, currentPage + 1, searchParams)}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  )
}

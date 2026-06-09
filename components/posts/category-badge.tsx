import Link from 'next/link'
import { getCategory } from '@/lib/content'

export function CategoryBadge({
  slug,
  className = '',
}: {
  slug: string
  className?: string
}) {
  const category = getCategory(slug)
  if (!category) return null
  return (
    <Link
      href={`/category/${category.slug}`}
      className={`inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground ${className}`}
    >
      {category.shortName}
    </Link>
  )
}

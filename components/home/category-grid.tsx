import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { CategoryIcon } from '@/components/brand/category-icon'
import { categories, getCategoryCounts } from '@/lib/content'

export function CategoryGrid() {
  const counts = getCategoryCounts()
  return (
    <section className="border-b border-border bg-paper">
      <div className="mx-auto max-w-7xl px-4 py-14 lg:py-20">
        <div
          data-reveal
          className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
        >
          <div className="flex flex-col gap-3">
            <span className="eyebrow">Explore the directory</span>
            <h2 className="section-title">Browse by category</h2>
            <p className="max-w-2xl text-pretty leading-relaxed text-muted-foreground">
              Every guide is independently researched and refreshed each
              quarter. Pick a category to see our current shortlist.
            </p>
          </div>
          <Link
            href="/categories"
            className="link-underline shrink-0 text-sm font-semibold text-primary"
          >
            View all categories
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {categories.map((category, i) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              data-reveal
              data-reveal-delay={(i % 4) + 1}
              className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-border bg-card p-5 card-lift"
            >
              <div className="flex items-center justify-between">
                <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <CategoryIcon name={category.icon} />
                </span>
                <ArrowUpRight
                  className="size-4 text-muted-foreground transition-colors duration-300 group-hover:text-primary"
                  aria-hidden="true"
                />
              </div>
              <div>
                <h3 className="font-heading text-base font-bold leading-snug text-foreground text-balance sm:text-lg">
                  {category.name}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {category.blurb}
                </p>
              </div>
              <span className="mt-auto text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                {counts[category.slug] ?? 0}{' '}
                {(counts[category.slug] ?? 0) === 1 ? 'guide' : 'guides'}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

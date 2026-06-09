import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { categories, getCategoryCounts } from '@/lib/content'
import { SITE } from '@/lib/site'
import { PageHeader } from '@/components/layout/page-header'
import { CategoryIcon } from '@/components/brand/category-icon'

export const metadata: Metadata = {
  title: 'All Categories',
  description:
    'Browse every category — from digital marketing and business to home, health, property, food, travel and more. Find independent, research-backed guides in one place.',
  alternates: { canonical: '/categories' },
  openGraph: {
    title: `All Categories | ${SITE.name}`,
    description:
      'Browse every category and find independent, research-backed guides in one place.',
    url: `${SITE.url}/categories`,
    type: 'website',
  },
}

export default function CategoriesPage() {
  const counts = getCategoryCounts()

  return (
    <main>
      <PageHeader
        eyebrow="The directory"
        title="Browse all categories"
        description="Explore every category we cover. Each one is independently researched and refreshed each quarter — pick a category to see our current shortlist."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Categories' }]}
      />

      <section className="bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
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
                  <h2 className="font-heading text-base font-bold leading-snug text-foreground text-balance sm:text-lg">
                    {category.name}
                  </h2>
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
    </main>
  )
}

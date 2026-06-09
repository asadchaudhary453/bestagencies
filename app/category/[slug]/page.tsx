import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { categories, getCategory } from '@/lib/content'
import { getPostsByCategory } from '@/lib/content/data'
import { SITE } from '@/lib/site'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { CategoryIcon } from '@/components/brand/category-icon'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { PostsGrid } from '@/components/posts/posts-grid'
import { AdvertisementCard } from '@/components/ads/advertisement-card'
import { breadcrumbJsonLd } from '@/components/layout/breadcrumbs'
import { JsonLd, collectionPageJsonLd } from '@/components/seo/json-ld'

export const revalidate = 300
export const dynamicParams = true

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const category = getCategory(slug)
  if (!category) return {}
  return {
    title: category.title,
    description: category.description,
    alternates: { canonical: `/category/${category.slug}` },
    openGraph: {
      title: `${category.title} | ${SITE.name}`,
      description: category.description,
      url: `${SITE.url}/category/${category.slug}`,
      type: 'website',
    },
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const category = getCategory(slug)
  if (!category) notFound()

  const posts = await getPostsByCategory(slug)
  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'Categories', href: '/categories' },
    { label: category.shortName },
  ]

  return (
    <main>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd
        data={collectionPageJsonLd({
          name: category.title,
          description: category.description,
          url: `${SITE.url}/category/${category.slug}`,
          posts,
        })}
      />
      {/* Category hero */}
      <section className="relative overflow-hidden border-b border-border bg-ink text-ink-foreground">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-primary/20 blur-3xl"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
          <Breadcrumbs items={crumbs} className="mb-6 [&_*]:text-ink-foreground/70" />
          <span className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <CategoryIcon name={category.icon} className="h-7 w-7" />
          </span>
          <p className="eyebrow mb-4 text-ink-foreground/90 before:bg-ink-foreground/40">
            Category
          </p>
          <h1 className="font-heading text-4xl font-bold leading-[1.05] tracking-tight text-balance lg:text-5xl">
            {category.title}
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-ink-foreground/80">
            {category.description}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        {posts.length > 0 ? (
          <>
            <div className="mb-8 flex items-center justify-between">
              <h2 className="font-heading text-xl font-semibold">
                {posts.length} {posts.length === 1 ? 'guide' : 'guides'}
              </h2>
            </div>
            <PostsGrid posts={posts} />
          </>
        ) : (
          <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-accent text-primary">
              <Sparkles className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2 className="font-heading text-xl font-bold">
              Guides coming soon
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Our research team is evaluating {category.shortName.toLowerCase()}{' '}
              providers right now. Check back soon — rankings are on the way.
            </p>
            <Link
              href="/categories"
              className="mt-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Browse other categories
            </Link>
          </div>
        )}
      </section>
      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:pb-16">
        <AdvertisementCard variant="horizontal" />
      </section>
    </main>
  )
}

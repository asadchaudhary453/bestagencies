import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  categories,
  getCategory,
  getPostsByCategory,
} from '@/lib/content'
import { SITE } from '@/lib/site'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { CategoryIcon } from '@/components/brand/category-icon'
import { PostsGrid } from '@/components/posts/posts-grid'
import { NewsletterCta } from '@/components/home/newsletter-cta'
import { breadcrumbJsonLd } from '@/components/layout/breadcrumbs'
import { JsonLd, collectionPageJsonLd } from '@/components/seo/json-ld'

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

  const posts = getPostsByCategory(slug)
  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'Categories', href: '/agencies' },
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
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-heading text-xl font-semibold">
            {posts.length} {posts.length === 1 ? 'guide' : 'guides'}
          </h2>
        </div>
        <PostsGrid
          posts={posts}
          emptyMessage="New rankings for this category are coming soon."
        />
      </section>
      <NewsletterCta />
    </main>
  )
}

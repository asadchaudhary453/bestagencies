import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Clock, Calendar, ArrowLeft, RefreshCw } from 'lucide-react'
import {
  getAllPosts,
  getPost,
  getAuthor,
  getCategory,
  getRelatedPosts,
  getOlderBlogPosts,
  formatDate,
} from '@/lib/content'
import { SITE } from '@/lib/site'
import {
  ArticleJsonLd,
  ItemListJsonLd,
  BreadcrumbJsonLd,
} from '@/components/seo/json-ld'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { ArticleBody } from '@/components/article/article-body'
import {
  TableOfContents,
  type TocItem,
} from '@/components/article/table-of-contents'
import { ShareButtons } from '@/components/article/share-buttons'
import { ComparisonTable } from '@/components/article/comparison-table'
import { ReadingProgress } from '@/components/article/reading-progress'
import { RelatedPosts } from '@/components/article/related-posts'
import { HelpfulLinks } from '@/components/article/helpful-links'
import { WriteForUsWidget } from '@/components/article/write-for-us-widget'
import { AdvertisementCard } from '@/components/ads/advertisement-card'
import { CategoryBadge } from '@/components/posts/category-badge'

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  const author = getAuthor(post.author)
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    alternates: { canonical: `/${post.slug}` },
    authors: author ? [{ name: author.name }] : undefined,
    openGraph: {
      type: 'article',
      title: `${post.title} | ${SITE.name}`,
      description: post.excerpt,
      url: `${SITE.url}/${post.slug}`,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: author ? [author.name] : undefined,
      images: [{ url: post.image, alt: post.imageAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const author = getAuthor(post.author)
  const category = getCategory(post.category)
  const related = getRelatedPosts(post, 3)
  const olderPosts = getOlderBlogPosts(post.publishedAt, post.slug, 5)

  const toc: TocItem[] = post.body
    .filter(
      (b): b is Extract<typeof b, { type: 'heading' | 'subheading' }> =>
        b.type === 'heading' || b.type === 'subheading',
    )
    .map((b) => ({
      id: b.id,
      text: b.text,
      level: b.type === 'heading' ? 1 : 2,
    }))

  const crumbs = [
    { label: 'Home', href: '/' },
    ...(category
      ? [{ label: category.shortName, href: `/category/${category.slug}` }]
      : []),
    { label: post.title },
  ]

  return (
    <main>
      <ReadingProgress />
      <ArticleJsonLd post={post} />
      <ItemListJsonLd post={post} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          ...(category
            ? [{ name: category.name, url: `/category/${category.slug}` }]
            : []),
          { name: post.title, url: `/${post.slug}` },
        ]}
      />

      {/* Article header */}
      <header className="relative overflow-hidden border-b border-border bg-paper">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-28 size-80 rounded-full bg-primary/10 blur-3xl"
        />
        <div className="relative mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
          <Breadcrumbs items={crumbs} className="mb-6" />
          <CategoryBadge slug={post.category} />
          <h1 className="mt-5 font-heading text-3xl font-bold leading-[1.1] tracking-tight text-balance sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            {author && (
              <span className="flex items-center gap-2">
                <Image
                  src={author.avatar || '/placeholder.svg'}
                  alt={author.name}
                  width={28}
                  height={28}
                  className="h-7 w-7 rounded-full object-cover"
                />
                <span className="font-semibold text-foreground">
                  {author.name}
                </span>
              </span>
            )}
            <span className="hidden h-4 w-px bg-border sm:block" />
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              <time dateTime={post.publishedAt}>
                {formatDate(post.publishedAt)}
              </time>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" aria-hidden="true" />
              {post.readingTime} min read
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <RefreshCw className="h-3 w-3" aria-hidden="true" />
              Updated{' '}
              <time dateTime={post.updatedAt}>
                {formatDate(post.updatedAt)}
              </time>
            </span>
          </div>
        </div>
      </header>

      {/* Hero image */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <figure className="sm:-mt-10">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-border shadow-[0_30px_60px_-30px_rgba(30,41,59,0.45)]">
            <Image
              src={post.image || '/placeholder.svg'}
              alt={post.imageAlt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
            />
          </div>
          <figcaption className="mt-3 text-center text-xs text-muted-foreground">
            {post.imageAlt}
          </figcaption>
        </figure>
      </div>

      {/* Body + sidebar */}
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_260px] lg:py-16">
        <article className="min-w-0 max-w-3xl">
          <div className="mb-8 flex items-center justify-between border-b border-border pb-6">
            {author && (
              <div className="flex items-center gap-3">
                <Image
                  src={author.avatar || '/placeholder.svg'}
                  alt={author.name}
                  width={44}
                  height={44}
                  className="h-11 w-11 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {author.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{author.role}</p>
                </div>
              </div>
            )}
            <ShareButtons slug={post.slug} title={post.title} />
          </div>

          <ComparisonTable agencies={post.agencies} />

          <ArticleBody blocks={post.body} agencies={post.agencies} />

          <p className="mt-10 rounded-xl border border-border bg-accent/40 p-5 text-sm leading-relaxed text-muted-foreground">
            Want your brand featured in front of decision-makers? Publish a
            guest post or get a link insertion in our guides through{' '}
            <a
              href="https://aamax.co/service/guest-posts-and-link-insertions#place-order"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary transition-colors hover:text-primary/80"
            >
              AAMAX&apos;s guest post and link insertion service
            </a>
            .
          </p>

          <HelpfulLinks olderPosts={olderPosts} />

          {/* Sponsored + Write for Us shown inline on small screens where the sidebar is hidden */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:hidden">
            <AdvertisementCard variant="compact" />
            <WriteForUsWidget />
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            {category && (
              <Link
                href={`/category/${category.slug}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                More {category.shortName} guides
              </Link>
            )}
            <Link
              href="/agencies"
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
            >
              Back to all rankings
            </Link>
          </div>
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-5">
            <TableOfContents items={toc} />
            <AdvertisementCard variant="sidebar" />
            <WriteForUsWidget />
          </div>
        </aside>
      </div>

      <RelatedPosts posts={related} />
    </main>
  )
}

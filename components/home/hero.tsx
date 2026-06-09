import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Clock, ShieldCheck } from 'lucide-react'
import type { Post } from '@/lib/content'
import { getAuthor, getCategory } from '@/lib/content'
import { PostRow } from '@/components/posts/post-row'

export function Hero({
  lead,
  secondary,
}: {
  lead: Post
  secondary: Post[]
}) {
  const author = getAuthor(lead.author)
  const category = getCategory(lead.category)

  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Immersive feature */}
          <article className="group relative lg:col-span-8 animate-fade-up">
            <Link
              href={`/${lead.slug}`}
              className="relative block aspect-[4/3] w-full overflow-hidden rounded-3xl sm:aspect-[16/10]"
            >
              <Image
                src={lead.image || '/placeholder.svg'}
                alt={lead.imageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              {/* Gradient scrim for legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/35 to-ink/5" />

              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-6 sm:p-9">
                <div className="flex flex-wrap items-center gap-3">
                  {category && (
                    <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary-foreground">
                      {category.shortName}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
                    <ShieldCheck className="size-3.5" aria-hidden="true" />
                    Editor&apos;s pick
                  </span>
                </div>
                <h1 className="max-w-3xl font-heading text-3xl font-bold leading-[1.05] text-white text-balance sm:text-4xl lg:text-5xl">
                  {lead.title}
                </h1>
                <p className="hidden max-w-2xl text-pretty leading-relaxed text-white/80 sm:block">
                  {lead.excerpt}
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/70">
                  <span className="font-medium text-white">
                    {author?.name ?? 'Editorial'}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3.5" aria-hidden="true" />
                    {lead.readingTime} min read
                  </span>
                  <span className="ml-auto hidden items-center gap-2 font-semibold text-white transition-transform duration-300 group-hover:translate-x-1 sm:flex">
                    Read the ranking
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </span>
                </div>
              </div>
            </Link>
          </article>

          {/* Latest rankings rail */}
          <aside className="flex flex-col lg:col-span-4 animate-fade-up delay-100">
            <div className="mb-5 flex items-center justify-between border-b border-border pb-3">
              <h2 className="font-heading text-lg font-bold">Latest Posts</h2>
              <Link
                href="/categories"
                className="link-underline text-xs font-semibold uppercase tracking-[0.12em] text-primary"
              >
                All
              </Link>
            </div>
            <div className="flex flex-col divide-y divide-border">
              {secondary.map((post, i) => (
                <div key={post.slug} className="py-4 first:pt-0">
                  <PostRow post={post} index={i} />
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

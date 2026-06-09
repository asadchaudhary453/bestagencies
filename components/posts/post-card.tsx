import Image from 'next/image'
import Link from 'next/link'
import { Clock } from 'lucide-react'
import type { PostSummary } from "@/lib/content/types"
import { formatDate, getAuthor } from '@/lib/content'
import { CategoryBadge } from './category-badge'

export function PostCard({
  post,
  priority = false,
  index = 0,
}: {
  post: PostSummary
  priority?: boolean
  index?: number
}) {
  const author = getAuthor(post.author)
  return (
    <article
      data-reveal
      data-reveal-delay={(index % 3) + 1}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card card-lift"
    >
      <Link
        href={`/${post.slug}`}
        className="relative block aspect-[16/10] overflow-hidden"
      >
        <Image
          src={post.image || '/placeholder.svg'}
          alt={post.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          priority={priority}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </Link>
      <span className="absolute left-3 top-3 z-10">
        <CategoryBadge slug={post.category} />
      </span>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-heading text-lg font-bold leading-snug text-balance">
          <Link
            href={`/${post.slug}`}
            className="transition-colors group-hover:text-primary"
          >
            {post.title}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>
        <div className="mt-auto flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="font-semibold text-foreground">
              {author?.name ?? 'Editorial'}
            </span>
            <span aria-hidden="true">·</span>
            <time dateTime={post.publishedAt}>
              {formatDate(post.publishedAt)}
            </time>
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" aria-hidden="true" />
            {post.readingTime}m
          </span>
        </div>
      </div>
    </article>
  )
}

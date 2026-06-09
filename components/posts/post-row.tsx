import Image from 'next/image'
import Link from 'next/link'
import type { PostSummary } from "@/lib/content/types"
import { formatDate } from '@/lib/content'
import { CategoryBadge } from './category-badge'

export function PostRow({ post, index }: { post: PostSummary; index?: number }) {
  return (
    <article className="group flex items-start gap-4">
      {typeof index === 'number' && (
        <span className="font-heading text-2xl font-bold text-primary/30 tabular-nums">
          {String(index + 1).padStart(2, '0')}
        </span>
      )}
      <Link
        href={`/${post.slug}`}
        className="relative hidden aspect-square w-20 shrink-0 overflow-hidden rounded-lg sm:block"
      >
        <Image
          src={post.image || '/placeholder.svg'}
          alt={post.imageAlt}
          fill
          sizes="80px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-col gap-1.5">
        <CategoryBadge slug={post.category} className="self-start" />
        <h3 className="font-heading text-base font-semibold leading-snug text-balance">
          <Link
            href={`/${post.slug}`}
            className="transition-colors hover:text-primary"
          >
            {post.title}
          </Link>
        </h3>
        <time
          dateTime={post.publishedAt}
          className="text-xs text-muted-foreground"
        >
          {formatDate(post.publishedAt)}
        </time>
      </div>
    </article>
  )
}

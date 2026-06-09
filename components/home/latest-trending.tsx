import Link from 'next/link'
import { ArrowRight, Flame } from 'lucide-react'
import type { PostSummary } from "@/lib/content/types"
import { PostCard } from '@/components/posts/post-card'
import { PostRow } from '@/components/posts/post-row'

export function LatestTrending({
  latest,
  trending,
}: {
  latest: PostSummary[]
  trending: PostSummary[]
}) {
  return (
    <section className="bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-3 lg:py-20">
        <div className="lg:col-span-2">
          <div
            data-reveal
            className="mb-8 flex items-end justify-between border-b border-border pb-5"
          >
            <div className="flex flex-col gap-3">
              <span className="eyebrow">Fresh off the desk</span>
              <h2 className="section-title">Latest guides</h2>
            </div>
            <Link
              href="/categories"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
            >
              View all
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {latest.map((post, i) => (
              <PostCard key={post.slug} post={post} priority={i < 2} index={i} />
            ))}
          </div>
        </div>

        <aside data-reveal="right" data-reveal-delay="1">
          <div className="sticky top-24 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_18px_40px_-24px_rgba(30,41,59,0.25)]">
            <div className="flex items-center gap-2 border-b border-border bg-ink px-6 py-5">
              <Flame className="size-5 text-primary" aria-hidden="true" />
              <h2 className="font-heading text-lg font-bold text-ink-foreground">
                Trending now
              </h2>
            </div>
            <div className="flex flex-col divide-y divide-border p-6">
              {trending.map((post, i) => (
                <div key={post.slug} className="py-4 first:pt-0 last:pb-0">
                  <PostRow post={post} index={i} />
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}

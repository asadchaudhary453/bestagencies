import type { Post } from '@/lib/content'
import { PostCard } from '@/components/posts/post-card'

export function RelatedPosts({ posts }: { posts: Post[] }) {
  if (!posts.length) return null
  return (
    <section className="border-t border-border bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        <p data-reveal className="eyebrow mb-3">
          Keep reading
        </p>
        <h2 data-reveal className="section-title mb-8">
          Related rankings
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <PostCard key={post.slug} post={post} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

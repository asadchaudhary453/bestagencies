import type { PostSummary } from "@/lib/content/types"
import { PostCard } from './post-card'

export function PostsGrid({
  posts,
  emptyMessage = 'No articles found.',
}: {
  posts: PostSummary[]
  emptyMessage?: string
}) {
  if (!posts.length) {
    return (
      <p className="py-16 text-center text-muted-foreground">{emptyMessage}</p>
    )
  }
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, i) => (
        <PostCard key={post.slug} post={post} priority={i < 3} index={i} />
      ))}
    </div>
  )
}

import Image from 'next/image'
import type { Author } from '@/lib/content/types'

export function AuthorBio({ author }: { author: Author }) {
  return (
    <aside className="flex flex-col gap-4 rounded-2xl border border-border bg-accent/40 p-6 sm:flex-row sm:items-start">
      <Image
        src={author.avatar || '/placeholder.svg'}
        alt={author.name}
        width={64}
        height={64}
        className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-background"
      />
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          {author.role}
        </p>
        <h3 className="mt-1 font-heading text-lg font-semibold">
          {author.name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {author.bio}
        </p>
      </div>
    </aside>
  )
}

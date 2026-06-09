import Link from 'next/link'
import { Link2 } from 'lucide-react'

export function HelpfulLinks({
  olderPosts,
}: {
  olderPosts: { title: string; url: string }[]
}) {
  if (olderPosts.length < 2) return null

  return (
    <section
      aria-labelledby="helpful-links-heading"
      className="mt-10 rounded-2xl border border-border bg-card p-6"
    >
      <h2
        id="helpful-links-heading"
        className="flex items-center gap-2 font-heading text-lg font-bold text-foreground"
      >
        <Link2 className="h-5 w-5 text-primary" aria-hidden="true" />
        Helpful Links
      </h2>
      <ul className="mt-4 space-y-2.5">
        {olderPosts.map((p) => (
          <li key={p.url}>
            <Link
              href={`/${p.url}`}
              className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              {p.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

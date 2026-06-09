'use client'

import { useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { searchPosts } from '@/lib/content'
import { PostsGrid } from '@/components/posts/posts-grid'

export function SearchResults() {
  const params = useSearchParams()
  const router = useRouter()
  const initial = params.get('q') ?? ''
  const [query, setQuery] = useState(initial)

  const results = useMemo(() => searchPosts(query), [query])

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    router.replace(q ? `/search?q=${encodeURIComponent(q)}` : '/search')
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="mb-10">
        <div className="flex items-center gap-3 rounded-full border border-border bg-card px-6 py-4 shadow-[0_10px_30px_-18px_rgba(30,41,59,0.35)] transition-shadow focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/25">
          <Search className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          <label htmlFor="site-search" className="sr-only">
            Search articles
          </label>
          <input
            id="site-search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search agencies, categories, articles…"
            className="w-full bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            className="hidden shrink-0 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:block"
          >
            Search
          </button>
        </div>
      </form>

      {query.trim() ? (
        <>
          <p className="mb-6 text-sm text-muted-foreground">
            {results.length} {results.length === 1 ? 'result' : 'results'} for{' '}
            <span className="font-medium text-foreground">
              &ldquo;{query.trim()}&rdquo;
            </span>
          </p>
          <PostsGrid
            posts={results}
            emptyMessage="No articles match your search. Try a different keyword."
          />
        </>
      ) : (
        <p className="py-12 text-center text-muted-foreground">
          Start typing to search our agency rankings and guides.
        </p>
      )}
    </div>
  )
}

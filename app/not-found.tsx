import Link from 'next/link'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-paper px-4 py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 size-96 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
      />
      <div className="relative mx-auto flex max-w-xl flex-col items-center text-center">
        <p className="font-heading text-8xl font-bold leading-none text-primary sm:text-9xl">
          404
        </p>
        <p className="eyebrow eyebrow-center mt-6">Page not found</p>
        <h1 className="mt-3 font-heading text-3xl font-bold text-balance sm:text-4xl">
          We couldn&apos;t find that page
        </h1>
        <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">
          The page you&apos;re looking for may have moved or no longer exists.
          Try one of these instead.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            Back home
          </Link>
          <Link
            href="/agencies"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold transition-colors hover:border-primary hover:text-primary"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            Browse rankings
          </Link>
        </div>
      </div>
    </main>
  )
}

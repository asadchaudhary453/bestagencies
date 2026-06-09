import Link from 'next/link'
import { PenLine, ArrowRight } from 'lucide-react'

export function WriteForUsWidget() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="px-5 py-5">
        <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-primary">
          <PenLine className="h-5 w-5" aria-hidden="true" />
        </span>
        <h2 className="mt-3 font-heading text-base font-bold text-foreground">
          Write for Us
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          Share your expertise with our readers. We welcome guest contributions
          from industry specialists.
        </p>
        <Link
          href="/write-for-us"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
        >
          Pitch your idea
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}

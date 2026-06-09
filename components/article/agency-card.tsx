import { Star, MapPin, Calendar, Check, ArrowUpRight, Award } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { RankedAgency } from '@/lib/content/types'

export function AgencyCard({ agency }: { agency: RankedAgency }) {
  const isTop = agency.rank === 1

  return (
    <article
      className={cn(
        'card-lift group relative overflow-hidden rounded-2xl border bg-card p-5 sm:p-7',
        isTop
          ? 'border-primary/40 shadow-[0_18px_50px_-24px_rgba(59,130,214,0.55)]'
          : 'border-border',
      )}
    >
      {/* Accent rail */}
      <span
        aria-hidden="true"
        className={cn(
          'absolute inset-y-0 left-0 w-1',
          isTop ? 'bg-primary' : 'bg-border group-hover:bg-primary/40',
        )}
      />

      {isTop && (
        <span className="mb-4 ml-1 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-wide text-primary-foreground">
          <Award className="h-3.5 w-3.5" aria-hidden="true" />
          Top pick
        </span>
      )}

      <div className="flex items-start gap-4 sm:gap-5">
        <div className="flex flex-col items-center gap-1">
          <span
            className={cn(
              'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-heading text-xl font-bold sm:h-14 sm:w-14 sm:text-2xl',
              isTop
                ? 'bg-primary text-primary-foreground'
                : 'bg-accent text-primary',
            )}
          >
            {agency.rank}
          </span>
          <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
            Rank
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="font-heading text-xl font-semibold leading-tight sm:text-2xl">
                {agency.name}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {agency.tagline}
              </p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1.5 text-sm font-bold text-foreground">
              <Star
                className="h-4 w-4 fill-primary text-primary"
                aria-hidden="true"
              />
              {agency.rating.toFixed(1)}
            </div>
          </div>

          <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-primary/70" aria-hidden="true" />
              <dt className="sr-only">Location</dt>
              <dd>{agency.location}</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-primary/70" aria-hidden="true" />
              <dt className="sr-only">Founded</dt>
              <dd>Est. {agency.founded}</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <dt className="font-medium text-foreground">Best for:</dt>
              <dd>{agency.bestFor}</dd>
            </div>
          </dl>

          <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {agency.highlights.map((h) => (
              <li
                key={h}
                className="flex items-start gap-2 text-sm text-foreground"
              >
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent">
                  <Check className="h-3 w-3 text-primary" aria-hidden="true" />
                </span>
                {h}
              </li>
            ))}
          </ul>

          <a
            href={agency.website}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className={cn(
              'mt-6 inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-all',
              isTop
                ? 'bg-primary text-primary-foreground hover:opacity-90'
                : 'border border-border text-foreground hover:border-primary hover:text-primary',
            )}
          >
            Visit website
            <ArrowUpRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </a>
        </div>
      </div>
    </article>
  )
}

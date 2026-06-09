import { SearchCheck, Scale, BadgeCheck, RefreshCw } from 'lucide-react'
import type { Category } from '@/lib/content/types'

const criteria = [
  {
    icon: SearchCheck,
    title: 'Independent research',
    body: 'We shortlist providers through hands-on research, client interviews and verified review data — never paid placements.',
  },
  {
    icon: Scale,
    title: 'Weighted scoring',
    body: 'Each provider is scored on results, transparency, communication and value, weighted for what matters most in this space.',
  },
  {
    icon: BadgeCheck,
    title: 'Verified credentials',
    body: 'Case studies, certifications and client references are checked before anyone earns a place in our rankings.',
  },
  {
    icon: RefreshCw,
    title: 'Regularly refreshed',
    body: 'Rankings are revisited as the market moves, so recommendations reflect current performance — not past reputation.',
  },
]

/**
 * Editorial methodology block rendered on every category page. Adds
 * substantive, crawlable copy explaining how we evaluate this space.
 */
export function CategoryEditorial({ category }: { category: Category }) {
  return (
    <section
      aria-labelledby="methodology-heading"
      className="border-b border-border bg-paper"
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        <p className="eyebrow mb-3">How we rank</p>
        <h2
          id="methodology-heading"
          className="section-title mb-4 max-w-2xl text-2xl lg:text-3xl"
        >
          How we evaluate {category.shortName.toLowerCase()} providers
        </h2>
        <p className="mb-10 max-w-3xl leading-relaxed text-muted-foreground">
          {category.blurb} Every guide in this category follows the same
          editorial standard: we research the market independently, score each
          provider against transparent criteria, and update our verdicts as
          the landscape changes. No provider can pay for a higher position.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {criteria.map((c, i) => (
            <div
              key={c.title}
              data-reveal
              data-reveal-delay={(i % 4) + 1}
              className="flex flex-col gap-3"
            >
              <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-primary">
                <c.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="font-heading text-base font-bold">{c.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {c.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

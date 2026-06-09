import { Star, Trophy } from 'lucide-react'
import type { RankedAgency } from '@/lib/content/types'
import { cn } from '@/lib/utils'

/**
 * At-a-glance comparison table shown at the top of ranking articles
 * so scanners get the verdict in seconds before the deep dive.
 */
export function ComparisonTable({ agencies }: { agencies: RankedAgency[] }) {
  if (!agencies.length) return null

  return (
    <section
      aria-labelledby="comparison-heading"
      className="mb-10 overflow-hidden rounded-2xl border border-border bg-card"
    >
      <div className="flex items-center gap-2.5 border-b border-border bg-accent/60 px-5 py-4">
        <Trophy className="h-4.5 w-4.5 shrink-0 text-primary" aria-hidden="true" />
        <h2
          id="comparison-heading"
          className="font-heading text-base font-bold"
        >
          At a glance: our top picks
        </h2>
        <span
          aria-hidden="true"
          className="ml-auto whitespace-nowrap text-xs font-medium text-muted-foreground md:hidden"
        >
          Swipe &rarr;
        </span>
      </div>
      <div className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-card to-transparent md:hidden"
        />
        <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th scope="col" className="px-5 py-3 font-semibold">
                #
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Agency
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Rating
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Best for
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Location
              </th>
            </tr>
          </thead>
          <tbody>
            {agencies.map((a) => (
              <tr
                key={a.rank}
                className={cn(
                  'border-b border-border/60 last:border-b-0',
                  a.rank === 1 && 'bg-primary/[0.04]',
                )}
              >
                <td className="px-5 py-3.5">
                  <span
                    className={cn(
                      'flex size-7 items-center justify-center rounded-full text-xs font-bold',
                      a.rank === 1
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground',
                    )}
                  >
                    {a.rank}
                  </span>
                </td>
                <td className="px-4 py-3.5 font-semibold text-foreground">
                  {a.name}
                </td>
                <td className="px-4 py-3.5">
                  <span className="flex items-center gap-1 font-medium">
                    <Star
                      className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                      aria-hidden="true"
                    />
                    {a.rating.toFixed(1)}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-muted-foreground">
                  {a.bestFor}
                </td>
                <td className="px-4 py-3.5 text-muted-foreground">
                  {a.location}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </section>
  )
}

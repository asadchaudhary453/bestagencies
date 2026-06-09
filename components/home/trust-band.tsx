import { BarChart3, RefreshCw, ShieldCheck, Users } from 'lucide-react'

const stats = [
  {
    icon: Users,
    value: '500+',
    label: 'Agencies vetted',
  },
  {
    icon: BarChart3,
    value: '12',
    label: 'Scoring criteria',
  },
  {
    icon: RefreshCw,
    value: 'Quarterly',
    label: 'Rankings refresh',
  },
  {
    icon: ShieldCheck,
    value: '100%',
    label: 'Editorially independent',
  },
]

export function TrustBand() {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 lg:py-10">
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
          {stats.map(({ icon: Icon, value, label }, i) => (
            <div
              key={label}
              data-reveal
              data-reveal-delay={(i % 4) + 1}
              className="flex items-center gap-3"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div className="flex flex-col">
                <span className="font-heading text-xl font-bold leading-none">
                  {value}
                </span>
                <span className="mt-1 text-xs leading-tight text-muted-foreground">
                  {label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

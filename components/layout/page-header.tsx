import { Breadcrumbs, type Crumb } from '@/components/layout/breadcrumbs'

export function PageHeader({
  eyebrow,
  title,
  description,
  crumbs,
}: {
  eyebrow?: string
  title: string
  description?: string
  crumbs?: Crumb[]
}) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-paper">
      {/* Subtle brand wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-primary/10 blur-3xl"
      />
      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        {crumbs && <Breadcrumbs items={crumbs} className="mb-6" />}
        {eyebrow && (
          <p data-reveal className="eyebrow mb-4">
            {eyebrow}
          </p>
        )}
        <h1 data-reveal data-reveal-delay="1" className="section-title text-4xl lg:text-5xl">
          {title}
        </h1>
        {description && (
          <p
            data-reveal
            data-reveal-delay="2"
            className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground"
          >
            {description}
          </p>
        )}
      </div>
    </section>
  )
}

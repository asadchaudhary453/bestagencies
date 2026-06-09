import type { Metadata } from 'next'
import Image from 'next/image'
import { Target, ShieldCheck, BarChart3, RefreshCw } from 'lucide-react'
import { authors } from '@/lib/content'
import { SITE } from '@/lib/site'
import { PageHeader } from '@/components/layout/page-header'
import { NewsletterCta } from '@/components/home/newsletter-cta'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Best Agencies is an independent editorial team ranking the best agencies across SEO, web design, digital marketing, PR and software. Learn about our methodology.',
  alternates: { canonical: '/about' },
}

const stats = [
  { value: '500+', label: 'Agencies vetted' },
  { value: '5', label: 'Disciplines covered' },
  { value: '12', label: 'Scoring criteria' },
  { value: 'Quarterly', label: 'Refresh cadence' },
]

const values = [
  {
    icon: ShieldCheck,
    title: 'Independent by design',
    text: 'We never accept payment for placement. Rankings reflect verifiable outcomes, not budgets.',
  },
  {
    icon: BarChart3,
    title: 'Evidence over opinion',
    text: 'Every agency is scored against a consistent, weighted methodology with documented criteria.',
  },
  {
    icon: RefreshCw,
    title: 'Refreshed quarterly',
    text: 'The agency landscape moves fast. We re-review and update our rankings every quarter.',
  },
  {
    icon: Target,
    title: 'Built for decisions',
    text: 'Our guides are designed to help you shortlist with confidence and pick the right fit.',
  },
]

const criteria = [
  {
    name: 'Proven results',
    weight: 30,
    text: 'Documented case studies and measurable client outcomes.',
  },
  {
    name: 'Client satisfaction',
    weight: 25,
    text: 'Retention rates, references and verified third-party reviews.',
  },
  {
    name: 'Specialist expertise',
    weight: 20,
    text: 'Depth of experience and the seniority of the people doing the work.',
  },
  {
    name: 'Transparency',
    weight: 15,
    text: 'Clear pricing, honest reporting and a well-defined process.',
  },
  {
    name: 'Reputation',
    weight: 10,
    text: 'Industry standing, awards and recognised thought leadership.',
  },
]

export default function AboutPage() {
  return (
    <main>
      <PageHeader
        eyebrow="About Best Agencies"
        title="Honest rankings of the agencies worth hiring"
        description={`${SITE.name} is an independent editorial publication. We research, test and rank the best agencies so you can hire with confidence — no pay-for-placement, ever.`}
        crumbs={[{ label: 'Home', href: '/' }, { label: 'About' }]}
      />

      {/* Stat band */}
      <section className="border-b border-border bg-ink text-ink-foreground">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden px-4 py-2 sm:px-6 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              data-reveal
              data-reveal-delay={(i % 4) + 1}
              className="px-2 py-8 text-center"
            >
              <p className="font-heading text-3xl font-bold sm:text-4xl">
                {s.value}
              </p>
              <p className="mt-1.5 text-sm text-ink-foreground/70">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div data-reveal="left">
            <p className="eyebrow mb-4">Our mission</p>
            <h2 className="section-title">Why we exist</h2>
            <div className="mt-5 flex flex-col gap-4 leading-relaxed text-muted-foreground">
              <p>
                Choosing an agency is one of the highest-stakes decisions a
                business makes — and the information available is usually
                marketing, not research. Directories sell placements, and review
                sites are easy to game.
              </p>
              <p>
                We started Best Agencies to fix that. Our editors independently
                evaluate agencies against a transparent methodology, then publish
                clear, ranked guides that put your decision first. We make money
                through advertising and partnerships that never influence our
                rankings.
              </p>
            </div>
          </div>
          <div
            data-reveal="right"
            data-reveal-delay="1"
            className="media-zoom relative aspect-[4/3] overflow-hidden rounded-2xl border border-border shadow-[0_30px_60px_-30px_rgba(30,41,59,0.4)]"
          >
            <Image
              src="/images/category-digital-marketing.webp"
              alt="The Best Agencies editorial team reviewing agency performance"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-y border-border bg-paper">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
          <p className="eyebrow mb-4">Our principles</p>
          <h2 className="section-title mb-10">What we stand for</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <div
                key={v.title}
                data-reveal
                data-reveal-delay={(i % 4) + 1}
                className="card-lift rounded-2xl border border-border bg-card p-6"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-primary">
                  <v.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-heading text-lg font-semibold">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {v.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="max-w-2xl">
          <p className="eyebrow mb-4">How we score</p>
          <h2 className="section-title">Our ranking methodology</h2>
          <p className="mt-5 leading-relaxed text-muted-foreground">
            Every agency we feature is scored across five weighted criteria.
            Scores are reviewed by at least two editors before a ranking is
            published or updated.
          </p>
        </div>
        <div className="mt-10 flex flex-col gap-6">
          {criteria.map((c, i) => (
            <div
              key={c.name}
              data-reveal
              data-reveal-delay={(i % 3) + 1}
              className="grid gap-3 sm:grid-cols-[200px_1fr] sm:items-center sm:gap-8"
            >
              <div className="flex items-baseline justify-between gap-3 sm:flex-col sm:items-start sm:gap-1">
                <span className="font-heading text-lg font-semibold">
                  {c.name}
                </span>
                <span className="font-heading text-2xl font-bold text-primary tabular-nums">
                  {c.weight}%
                </span>
              </div>
              <div>
                <div
                  className="h-2.5 overflow-hidden rounded-full bg-secondary"
                  role="presentation"
                >
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(c.weight / 30) * 100}%` }}
                  />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {c.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="border-t border-border bg-paper">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
          <p className="eyebrow mb-4">The people behind the rankings</p>
          <h2 className="section-title mb-10">Meet the editors</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {authors.map((a, i) => (
              <div
                key={a.slug}
                data-reveal
                data-reveal-delay={(i % 3) + 1}
                className="card-lift flex flex-col items-start rounded-2xl border border-border bg-card p-6"
              >
                <Image
                  src={a.avatar || '/placeholder.svg'}
                  alt={a.name}
                  width={72}
                  height={72}
                  className="h-18 w-18 rounded-full object-cover ring-2 ring-accent"
                />
                <h3 className="mt-4 font-heading text-lg font-semibold">
                  {a.name}
                </h3>
                <p className="text-sm font-medium text-primary">{a.role}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {a.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <NewsletterCta />
    </main>
  )
}

import type { Metadata } from 'next'
import { Check, PenLine, Users, TrendingUp } from 'lucide-react'
import { SITE } from '@/lib/site'
import { PageHeader } from '@/components/layout/page-header'
import { ContactForm } from '@/components/contact-form'

export const metadata: Metadata = {
  title: 'Write for Us',
  description:
    'Contribute to Best Agencies. We accept expert guest articles on SEO, web design, digital marketing, PR and software development. Read our guidelines.',
  alternates: { canonical: '/write-for-us' },
}

const benefits = [
  {
    icon: Users,
    title: 'Reach decision-makers',
    text: 'Our readers are founders, marketers and operators actively choosing agencies.',
  },
  {
    icon: TrendingUp,
    title: 'Build authority',
    text: 'A bylined article with an author bio and a link back to your work.',
  },
  {
    icon: PenLine,
    title: 'Editorial support',
    text: 'Our editors help shape your draft into a polished, on-brand piece.',
  },
]

const guidelines = [
  'Original, unpublished content of 1,200+ words',
  'Genuinely useful and well-researched — no thin or AI-spun copy',
  'Relevant to agencies, marketing, design or technology',
  'No overt self-promotion; one relevant author link is fine',
  'Include credible sources and data where possible',
  'Written in clear British English',
]

const topics = [
  'SEO & organic growth',
  'Web design & UX',
  'Digital marketing',
  'Public relations',
  'Software development',
  'Agency operations',
]

export default function WriteForUsPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Contribute"
        title="Write for us"
        description={`Share your expertise with the ${SITE.name} audience. We're always looking for original, insightful articles from practitioners who know their craft.`}
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Write for Us' }]}
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid gap-6 sm:grid-cols-3">
          {benefits.map((b, i) => (
            <div
              key={b.title}
              data-reveal
              data-reveal-delay={(i % 3) + 1}
              className="card-lift rounded-2xl border border-border bg-card p-6"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-primary">
                <b.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-heading text-lg font-semibold">
                {b.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {b.text}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <div data-reveal="left">
            <h2 className="font-heading text-2xl font-bold">
              Submission guidelines
            </h2>
            <ul className="mt-5 flex flex-col gap-3">
              {guidelines.map((g) => (
                <li key={g} className="flex items-start gap-3">
                  <Check
                    className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <span className="leading-relaxed text-foreground/90">{g}</span>
                </li>
              ))}
            </ul>
          </div>
          <div data-reveal="right" data-reveal-delay="1">
            <h2 className="font-heading text-2xl font-bold">Topics we cover</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {topics.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
                >
                  {t}
                </span>
              ))}
            </div>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              Have a pitch that doesn&apos;t fit neatly into these? We still want
              to hear it. The best articles teach our readers something they
              can&apos;t easily find elsewhere.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
          <div data-reveal className="mb-8 text-center">
            <h2 className="font-heading text-2xl font-bold lg:text-3xl">
              Pitch your idea
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Send us your topic and a short outline. We review every pitch and
              reply within a week.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>
    </main>
  )
}

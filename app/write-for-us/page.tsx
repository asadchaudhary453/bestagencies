import type { Metadata } from 'next'
import { ArrowRight, Check } from 'lucide-react'
import { SITE } from '@/lib/site'
import { PageHeader } from '@/components/layout/page-header'

export const metadata: Metadata = {
  title: 'Write for Us',
  description:
    'Publish a guest post or get a link insertion on Best Agencies. Reach decision-makers actively choosing agencies in the UK. Place your order now.',
  alternates: { canonical: '/write-for-us' },
}

const benefits = [
  'Reach founders, marketers and operators actively choosing agencies',
  'Earn quality backlinks from a relevant, editorial site',
  'Promote your company alongside the UK\u2019s best agencies',
  'Simple ordering process with fast turnaround',
]

export default function WriteForUsPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Contribute"
        title="Write for us"
        description={`Publish a guest post or get a link insertion on ${SITE.name} and put your brand in front of decision-makers.`}
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Write for Us' }]}
      />

      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:py-20">
        <div data-reveal className="flex flex-col gap-6">
          <p className="text-lg leading-relaxed text-muted-foreground">
            We accept guest posts and link insertions from businesses and
            writers who want to share genuinely useful content with our
            readers. It&apos;s a simple, effective way to earn backlinks, build
            authority and promote your company to an audience that&apos;s
            actively comparing agencies.
          </p>
          <ul className="flex flex-col gap-3">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <Check
                  className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <span className="leading-relaxed text-foreground/90">{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div
          data-reveal
          className="mt-12 flex flex-col items-center gap-5 rounded-2xl border border-border bg-card p-8 text-center sm:p-10"
        >
          <h2 className="font-heading text-2xl font-bold text-balance sm:text-3xl">
            Ready to get published?
          </h2>
          <p className="max-w-md leading-relaxed text-muted-foreground">
            Place your order through our guest post and link insertion service
            and we&apos;ll take care of the rest.
          </p>
          <a
            href="https://aamax.co/service/guest-posts-and-link-insertions#place-order"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
          >
            Place Your Order Now
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </a>
        </div>
      </section>
    </main>
  )
}

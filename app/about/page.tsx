import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SITE } from '@/lib/site'
import { PageHeader } from '@/components/layout/page-header'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Best Agencies provides useful, authentic information about the best agencies in the UK — credible, award-winning providers across SEO, web design, digital marketing, PR and software.',
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return (
    <main>
      <PageHeader
        eyebrow="About Us"
        title="About Best Agencies"
        description="Useful, authentic information about the best agencies in the UK — all in one place."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'About' }]}
      />

      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:py-20">
        <div
          data-reveal
          className="flex flex-col gap-6 text-lg leading-relaxed text-muted-foreground"
        >
          <p>
            We created this website to give readers useful, authentic
            information about the best agencies in the UK. Every agency we
            feature is credible and competent — not only strong in the services
            and products they deliver, but also recognised and awarded by
            official bodies in their industry.
          </p>
          <p>
            Our curated lists show you which agency excels in which department,
            what they&apos;re best known for, and how you can engage their
            services — so you can shortlist with confidence instead of guessing.
          </p>
          <p>
            Across this blog we cover several categories and have listed
            numerous of the UK&apos;s best agencies. If you&apos;d like to{' '}
            <Link
              href="/write-for-us"
              className="font-semibold text-primary transition-colors hover:text-primary/80"
            >
              Write for Us
            </Link>{' '}
            to earn backlinks or promote your company, we&apos;re happy to work
            with you — we welcome submissions from guest writers who want to
            help other businesses grow.
          </p>
          <p>
            We hope to build healthy, successful working relationships with you
            in the future.
          </p>
        </div>

        <div
          data-reveal
          className="mt-12 flex flex-col items-start gap-5 rounded-2xl border border-border bg-card p-8"
        >
          <h2 className="font-heading text-2xl font-bold text-balance">
            Want to work with us for mutual benefit?
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            Fantastic — get in touch now and let&apos;s get started.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Contact Us
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  )
}

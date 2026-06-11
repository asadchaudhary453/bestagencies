import type { Metadata } from 'next'
import { PageHeader } from '@/components/layout/page-header'
import { SITE } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: `Terms and conditions for using the ${SITE.name} website.`,
  alternates: { canonical: '/terms' },
}

const sections = [
  {
    heading: '1. Acceptance of terms',
    body: [
      `By accessing and using ${SITE.name} (the "Site"), you accept and agree to be bound by these Terms & Conditions. If you do not agree, please do not use the Site.`,
    ],
  },
  {
    heading: '2. Intellectual property',
    body: [
      `All content on the Site, including text, graphics, logos and images, is the property of ${SITE.name} or its content suppliers and is protected by applicable intellectual property laws. You may not reproduce or republish our content without written permission.`,
    ],
  },
  {
    heading: '3. User submissions',
    body: [
      'If you submit content to us — such as a guest article or agency suggestion — you grant us a non-exclusive, royalty-free licence to use, edit and publish that content. You confirm that any content you submit is original and does not infringe the rights of others.',
    ],
  },
  {
    heading: '4. Limitation of liability',
    body: [
      `To the fullest extent permitted by law, ${SITE.name} shall not be liable for any loss or damage arising from your use of, or reliance on, the Site or its content.`,
    ],
  },
  {
    heading: '5. Prohibited activities',
    body: [
      'We do not work with companies involved in illegal activities or those associated with businesses such as essay writing, CBD, casinos, gambling, betting, dating, drugs, movies, songs, dances, insurance, mortgages, banking loans, or any other illegal activities. We reserve the right to cancel the order or terminate any agreement with any client who is found to be involved in such activities.',
      'If you are unsure if your site violates our restrictions, please contact us first.',
    ],
  },
  {
    heading: '6. Changes to terms and conditions',
    body: [
      'We reserve the right to make changes to these terms and conditions at any time. Any changes will be posted on our website and will be effective immediately upon posting.',
      'By using our services, you agree to these terms and conditions. If you have any questions or concerns, please contact us.',
    ],
  },
  {
    heading: '7. Contact',
    body: [
      `If you have any questions about these terms, please contact us at ${SITE.email}.`,
    ],
  },
]

export default function TermsPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Legal"
        title="Terms & Conditions"
        description="Please read these terms carefully before using our website."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Terms' }]}
      />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                On this page
              </p>
              <ul className="flex flex-col gap-2 border-l border-border text-sm">
                {sections.map((s, i) => (
                  <li key={s.heading}>
                    <a
                      href={`#section-${i + 1}`}
                      className="-ml-px block border-l-2 border-transparent pl-3 leading-snug text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                    >
                      {s.heading}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="min-w-0 max-w-3xl">
            <p className="inline-flex rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
              Last updated:{' '}
              {new Date().toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
            <div className="mt-8 flex flex-col gap-6">
              {sections.map((s, i) => (
                <div
                  key={s.heading}
                  id={`section-${i + 1}`}
                  data-reveal
                  data-reveal-delay={(i % 3) + 1}
                  className="scroll-mt-24 rounded-2xl border border-border bg-card p-6 sm:p-7"
                >
                  <h2 className="flex items-center gap-3 font-heading text-xl font-semibold">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-sm font-bold text-primary">
                      {i + 1}
                    </span>
                    {s.heading.replace(/^\d+\.\s*/, '')}
                  </h2>
                  <div className="mt-4 flex flex-col gap-3">
                    {s.body.map((p, j) => (
                      <p
                        key={j}
                        className="leading-relaxed text-muted-foreground"
                      >
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

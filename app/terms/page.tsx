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
    heading: '2. Editorial independence',
    body: [
      'Our rankings and reviews are produced independently by our editorial team. We do not accept payment in exchange for ranking position. Where content is sponsored or contains affiliate links, this will be clearly disclosed.',
      'Rankings represent our editorial opinion based on our stated methodology and are provided for general information only.',
    ],
  },
  {
    heading: '3. No professional advice',
    body: [
      'Content on the Site is for informational purposes and does not constitute professional, legal, financial or business advice. You should carry out your own due diligence before engaging any agency.',
    ],
  },
  {
    heading: '4. Third-party links',
    body: [
      'The Site contains links to third-party websites, including agency websites. We are not responsible for the content, products or services of any third party and the inclusion of a link does not imply endorsement.',
    ],
  },
  {
    heading: '5. Intellectual property',
    body: [
      `All content on the Site, including text, graphics, logos and images, is the property of ${SITE.name} or its content suppliers and is protected by applicable intellectual property laws. You may not reproduce or republish our content without written permission.`,
    ],
  },
  {
    heading: '6. User submissions',
    body: [
      'If you submit content to us — such as a guest article or agency suggestion — you grant us a non-exclusive, royalty-free licence to use, edit and publish that content. You confirm that any content you submit is original and does not infringe the rights of others.',
    ],
  },
  {
    heading: '7. Limitation of liability',
    body: [
      `To the fullest extent permitted by law, ${SITE.name} shall not be liable for any loss or damage arising from your use of, or reliance on, the Site or its content.`,
    ],
  },
  {
    heading: '8. Changes to these terms',
    body: [
      'We may update these Terms & Conditions from time to time. Continued use of the Site after changes are posted constitutes acceptance of the revised terms.',
    ],
  },
  {
    heading: '9. Contact',
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

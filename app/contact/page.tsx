import type { Metadata } from 'next'
import { Mail, MessageSquare, Newspaper } from 'lucide-react'
import { SITE } from '@/lib/site'
import { PageHeader } from '@/components/layout/page-header'
import { ContactForm } from '@/components/contact-form'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with the Best Agencies editorial team. Suggest an agency, send feedback, or ask about advertising and partnerships.',
  alternates: { canonical: '/contact' },
}

const channels = [
  {
    icon: Newspaper,
    title: 'Suggest an agency',
    text: 'Know a great agency we should review? Tell us who and why.',
  },
  {
    icon: MessageSquare,
    title: 'Editorial feedback',
    text: 'Spotted an error or have a correction? We take accuracy seriously.',
  },
  {
    icon: Mail,
    title: 'Partnerships',
    text: 'For advertising and partnership enquiries, our team is happy to help.',
  },
]

export default function ContactPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Get in touch"
        title="Contact us"
        description="Whether you want to suggest an agency, share feedback, or talk partnerships, we'd love to hear from you."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
      />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div className="flex flex-col gap-4">
            {channels.map((c, i) => (
              <div
                key={c.title}
                data-reveal="left"
                data-reveal-delay={(i % 3) + 1}
                className="card-lift flex items-start gap-4 rounded-2xl border border-border bg-card p-5"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                  <c.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-heading text-lg font-semibold">
                    {c.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {c.text}
                  </p>
                </div>
              </div>
            ))}
            <div
              data-reveal="left"
              className="mt-2 rounded-2xl border border-primary/30 bg-accent/50 p-5"
            >
              <p className="text-sm font-medium text-foreground">
                Prefer email?
              </p>
              <a
                href={`mailto:${SITE.email}`}
                className="mt-1 inline-block text-sm font-semibold text-primary hover:underline"
              >
                {SITE.email}
              </a>
            </div>
          </div>
          <div data-reveal="right" data-reveal-delay="1">
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  )
}

import { Check } from 'lucide-react'
import { NewsletterForm } from '@/components/newsletter-form'

const perks = ['New rankings monthly', 'Vetting insights', 'No spam, ever']

export function NewsletterCta() {
  return (
    <section className="bg-ink">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:py-24">
        <div className="relative grid items-center gap-10 lg:grid-cols-2">
          <div data-reveal="left" className="flex flex-col">
            <span className="eyebrow text-primary">The shortlist</span>
            <h2 className="mt-4 font-heading text-3xl font-bold leading-[1.05] text-ink-foreground text-balance sm:text-4xl lg:text-5xl">
              The best agencies, straight to your inbox
            </h2>
            <p className="mt-4 max-w-lg text-pretty leading-relaxed text-ink-foreground/70">
              Join thousands of founders and marketers who get our newest agency
              rankings and vetting insights every month.
            </p>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              {perks.map((perk) => (
                <li
                  key={perk}
                  className="flex items-center gap-2 text-sm font-medium text-ink-foreground/85"
                >
                  <span className="flex size-5 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <Check className="size-3" aria-hidden="true" />
                  </span>
                  {perk}
                </li>
              ))}
            </ul>
          </div>

          <div
            data-reveal="right"
            data-reveal-delay="1"
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm lg:p-9"
          >
            <p className="mb-4 font-heading text-lg font-semibold text-ink-foreground">
              Get the monthly briefing
            </p>
            <NewsletterForm />
            <p className="mt-4 text-xs leading-relaxed text-ink-foreground/55">
              By subscribing you agree to receive our newsletter. Unsubscribe at
              any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

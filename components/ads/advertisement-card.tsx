'use client'

import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'

const AAMAX = {
  logo: '/aamax-favicon.png',
  name: 'AAMAX',
  tagline: 'Full-Service Digital Agency',
  headline: 'Grow your business with expert web, SEO & marketing services.',
  services: ['Web Development', 'SEO', 'Marketing'],
  url: 'https://aamax.co/services',
}

type Variant = 'sidebar' | 'horizontal' | 'compact'

export function AdvertisementCard({
  variant = 'sidebar',
}: {
  variant?: Variant
}) {
  if (variant === 'horizontal') {
    return (
      <div className="overflow-hidden rounded-2xl border border-border bg-ink text-ink-foreground">
        <div className="relative flex flex-col gap-5 px-6 py-7 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-primary/20 blur-3xl"
          />
          <div className="relative flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-ink-foreground/10">
              <Image
                src={AAMAX.logo || "/placeholder.svg"}
                alt={`${AAMAX.name} logo`}
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
              />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-foreground/60">
                Sponsored · {AAMAX.name} — {AAMAX.tagline}
              </p>
              <p className="mt-1.5 font-heading text-lg font-bold leading-snug text-balance sm:text-xl">
                {AAMAX.headline}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {AAMAX.services.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-ink-foreground/10 px-3 py-1 text-xs font-medium text-ink-foreground/80"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <a
            href={AAMAX.url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Explore services
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <a
        href={AAMAX.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-3 rounded-xl border border-border bg-card p-3.5 transition-colors hover:border-primary/40"
      >
        <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-accent">
          <Image
            src={AAMAX.logo || "/placeholder.svg"}
            alt={`${AAMAX.name} logo`}
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
          />
        </span>
        <span className="min-w-0">
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Sponsored
          </span>
          <span className="block truncate text-sm font-semibold text-foreground group-hover:text-primary">
            {AAMAX.name} — {AAMAX.tagline}
          </span>
        </span>
        <ArrowUpRight
          className="ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
          aria-hidden="true"
        />
      </a>
    )
  }

  // sidebar (default)
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="border-b border-border bg-accent/50 px-5 py-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Sponsored
        </p>
      </div>
      <div className="px-5 py-5">
        <div className="flex items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-accent">
            <Image
              src={AAMAX.logo || "/placeholder.svg"}
              alt={`${AAMAX.name} logo`}
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
            />
          </span>
          <div>
            <p className="font-heading text-base font-bold text-foreground">
              {AAMAX.name}
            </p>
            <p className="text-xs text-muted-foreground">{AAMAX.tagline}</p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-foreground">
          {AAMAX.headline}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {AAMAX.services.map((s) => (
            <span
              key={s}
              className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-secondary-foreground"
            >
              {s}
            </span>
          ))}
        </div>
        <a
          href={AAMAX.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Explore services
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </div>
  )
}

import Link from 'next/link'
import { Mail } from 'lucide-react'
import { Logo } from '@/components/brand/logo'
import { categories } from '@/lib/content/categories'
import { SITE } from '@/lib/site'

const company = [
  { href: '/about', label: 'About Us' },
  { href: '/write-for-us', label: 'Write for Us' },
  { href: '/contact', label: 'Contact' },
  { href: '/agencies', label: 'All Rankings' },
]

const legal = [{ href: '/terms', label: 'Terms & Conditions' }]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6">
          <div className="col-span-2 lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Independent, research-backed rankings of the best agencies. No
              pay-for-placement — just honest editorial reviews.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://twitter.com/bestagencies"
                aria-label="Follow us on X"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                aria-label="Connect on LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href={`mailto:${SITE.email}`}
                aria-label="Email"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-sans text-sm font-semibold text-foreground">
              Categories
            </h3>
            <ul className="mt-3 space-y-1">
              {categories.slice(0, 3).map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/category/${c.slug}`}
                    className="inline-block py-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {c.shortName}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/categories"
                  className="inline-block py-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                >
                  View all
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-sans text-sm font-semibold text-foreground">
              Company
            </h3>
            <ul className="mt-3 space-y-1">
              {company.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="inline-block py-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2">
            <h3 className="font-sans text-sm font-semibold text-foreground">
              Get in touch
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Questions, feedback, or partnership enquiries — we&apos;d love to
              hear from you.
            </p>
            <a
              href={`mailto:${SITE.email}`}
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              {SITE.email}
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <div className="flex flex-col items-center gap-1 sm:items-start">
            <p className="text-xs text-muted-foreground">
              © 2020–{new Date().getFullYear()} {SITE.name}. All rights reserved.
            </p>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              Made with <span aria-hidden="true">❤️</span>
              <span className="sr-only">love</span> by{' '}
              <a
                href="https://aamax.co"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-foreground transition-colors hover:text-primary"
              >
                AAMAX
              </a>
            </p>
          </div>
          <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            {legal.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className="inline-block py-2 text-xs text-muted-foreground transition-colors hover:text-primary"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}

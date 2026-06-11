import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/layout/page-header'
import { SITE } from '@/lib/site'
import { categories } from '@/lib/content'
import { getAllPosts } from '@/lib/content/data'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Site Map',
  description: `Browse all pages, categories and blog posts on ${SITE.name} in one place.`,
  alternates: { canonical: '/site-map' },
}

const mainPages = [
  { href: '/', label: 'Home' },
  { href: '/agencies', label: 'Agencies' },
  { href: '/categories', label: 'All Categories' },
  { href: '/about', label: 'About Us' },
  { href: '/write-for-us', label: 'Write for Us' },
  { href: '/contact', label: 'Contact' },
  { href: '/terms', label: 'Terms & Conditions' },
  { href: '/site-map', label: 'Site Map' },
]

export default async function SiteMapPage() {
  const posts = await getAllPosts()

  return (
    <main>
      <PageHeader
        eyebrow="Navigation"
        title="Site Map"
        description="A complete list of every page on our website to help you find what you are looking for."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Site Map' }]}
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="flex flex-col gap-12">
          <div>
            <h2 className="font-heading text-2xl font-semibold">Pages</h2>
            <ul className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
              {mainPages.map((p) => (
                <li key={p.href}>
                  <Link
                    href={p.href}
                    className="inline-block py-1 text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-heading text-2xl font-semibold">Categories</h2>
            <ul className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/category/${c.slug}`}
                    className="inline-block py-1 text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-heading text-2xl font-semibold">
              Blog Posts ({posts.length})
            </h2>
            <ul className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2">
              {posts.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/${p.slug}`}
                    className="inline-block py-1 text-sm leading-snug text-muted-foreground transition-colors hover:text-primary"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  )
}

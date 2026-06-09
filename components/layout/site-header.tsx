'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ArrowRight, ChevronDown, Menu, Search, X } from 'lucide-react'
import { Logo } from '@/components/brand/logo'
import { CategoryIcon } from '@/components/brand/category-icon'
import { categories } from '@/lib/content/categories'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/write-for-us', label: 'Write for Us' },
  { href: '/contact', label: 'Contact' },
]

export function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    setMobileOpen(false)
    setMegaOpen(false)
    setSearchOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > 8))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setMegaOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  function submitSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    setSearchOpen(false)
    setQuery('')
  }

  function isActive(href: string) {
    return href === '/' ? pathname === '/' : pathname.startsWith(href)
  }

  return (
    <>
      {/* Main header */}
      <header
        className={cn(
          'sticky top-0 z-50 transition-all duration-300',
          scrolled
            ? 'border-b border-border bg-background/80 shadow-[0_10px_40px_-12px_rgb(0_0_0/0.12)] backdrop-blur-xl'
            : 'border-b border-transparent bg-background/55 backdrop-blur-md',
        )}
      >
        <div
          className={cn(
            'mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 transition-all duration-300 sm:px-6',
            scrolled ? 'h-16' : 'h-[4.5rem]',
          )}
        >
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="-ml-1 rounded-xl p-2 text-foreground transition-colors hover:bg-accent lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Logo priority />
          </div>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-0.5 lg:flex">
            <NavItem href="/" label="Home" active={isActive('/')} />

            {/* Mega menu trigger */}
            <div
              className="relative"
              onMouseEnter={() => setMegaOpen(true)}
              onMouseLeave={() => setMegaOpen(false)}
            >
              <button
                type="button"
                className={cn(
                  'group relative flex items-center gap-1 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors',
                  megaOpen || pathname.startsWith('/category')
                    ? 'text-primary'
                    : 'text-foreground/70 hover:text-foreground',
                )}
                aria-expanded={megaOpen}
              >
                Categories
                <ChevronDown
                  className={cn(
                    'h-4 w-4 transition-transform duration-300',
                    megaOpen && 'rotate-180',
                  )}
                />
              </button>

              {megaOpen && (
                <div className="absolute left-1/2 top-full w-[740px] max-w-[calc(100vw-2rem)] -translate-x-1/2 pt-3">
                  <div className="animate-in fade-in slide-in-from-top-1 overflow-hidden rounded-2xl border border-border bg-card/95 shadow-2xl shadow-foreground/10 backdrop-blur-xl duration-200">
                    <div className="flex items-center justify-between border-b border-border/70 px-5 py-3">
                      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        Browse by category
                      </p>
                      <span className="rounded-full bg-accent px-2 py-0.5 text-[0.7rem] font-semibold text-accent-foreground">
                        {categories.length} total
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-0.5 p-3">
                      {categories.map((c) => (
                        <Link
                          key={c.slug}
                          href={`/category/${c.slug}`}
                          className="group/item flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-accent"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-primary transition-all duration-200 group-hover/item:scale-105 group-hover/item:bg-primary group-hover/item:text-primary-foreground">
                            <CategoryIcon name={c.icon} className="h-[18px] w-[18px]" />
                          </span>
                          <span className="truncate text-sm font-semibold text-foreground">
                            {c.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                    <Link
                      href="/agencies"
                      className="group/all flex items-center justify-between gap-2 border-t border-border/70 bg-secondary/60 px-5 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
                    >
                      Browse all categories &amp; rankings
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/all:translate-x-1" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {navLinks.slice(1).map((l) => (
              <NavItem
                key={l.href}
                href={l.href}
                label={l.label}
                active={isActive(l.href)}
              />
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              className={cn(
                'rounded-xl p-2 transition-colors hover:bg-accent',
                searchOpen ? 'text-primary' : 'text-foreground',
              )}
              aria-label="Search"
              aria-expanded={searchOpen}
            >
              {searchOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </button>
            <Link
              href="/write-for-us"
              className="group relative hidden items-center gap-1.5 overflow-hidden rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 sm:inline-flex"
            >
              <span className="relative z-10">Write for Us</span>
              <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              <span
                aria-hidden="true"
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary-foreground/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
              />
            </Link>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="animate-in fade-in slide-in-from-top-2 border-t border-border bg-card/95 backdrop-blur-xl duration-200">
            <form
              onSubmit={submitSearch}
              className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3.5 sm:px-6"
            >
              <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search agencies, categories, articles…"
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                className="hidden shrink-0 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:inline-flex"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
                className="shrink-0 rounded-lg p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="animate-in fade-in absolute inset-0 bg-foreground/50 backdrop-blur-sm duration-200"
            onClick={() => setMobileOpen(false)}
          />
          <div className="animate-in slide-in-from-left absolute left-0 top-0 flex h-full w-[88%] max-w-sm flex-col overflow-y-auto bg-background shadow-2xl duration-300">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <Logo />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="rounded-xl p-2 text-foreground transition-colors hover:bg-accent"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-5 py-4">
              <form
                onSubmit={submitSearch}
                className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5"
              >
                <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search…"
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
              </form>

              <nav className="mt-5 flex flex-col gap-1">
                {navLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={cn(
                      'rounded-xl px-3 py-2.5 text-base font-medium transition-colors',
                      isActive(l.href)
                        ? 'bg-accent text-primary'
                        : 'text-foreground hover:bg-accent',
                    )}
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>

              <p className="mt-6 px-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Categories
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/category/${c.slug}`}
                    className="group flex items-center gap-2.5 rounded-xl border border-border bg-card p-2.5 transition-colors hover:border-primary/40 hover:bg-accent"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <CategoryIcon name={c.icon} className="h-4 w-4" />
                    </span>
                    <span className="truncate text-xs font-semibold text-foreground">
                      {c.shortName}
                    </span>
                  </Link>
                ))}
              </div>

              <Link
                href="/agencies"
                className="mt-6 flex items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25"
              >
                View All Rankings
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function NavItem({
  href,
  label,
  active,
}: {
  href: string
  label: string
  active: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors',
        active ? 'text-primary' : 'text-foreground/70 hover:text-foreground',
      )}
    >
      {label}
      <span
        aria-hidden="true"
        className={cn(
          'absolute inset-x-3.5 -bottom-0.5 h-0.5 origin-left rounded-full bg-primary transition-transform duration-300',
          active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
        )}
      />
    </Link>
  )
}

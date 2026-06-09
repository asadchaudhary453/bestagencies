'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export type TocItem = { id: string; text: string; level: number }

export function TableOfContents({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id)
          }
        }
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 },
    )
    for (const item of items) {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [items])

  if (!items.length) return null

  return (
    <nav aria-label="Table of contents" className="text-sm">
      <p className="mb-3 font-semibold uppercase tracking-wide text-muted-foreground">
        On this page
      </p>
      <ul className="flex flex-col gap-2 border-l border-border">
        {items.map((item) => (
          <li key={item.id} className={cn(item.level === 2 && 'pl-4')}>
            <a
              href={`#${item.id}`}
              className={cn(
                '-ml-px block border-l-2 border-transparent pl-3 leading-snug text-muted-foreground transition-colors hover:text-primary',
                active === item.id && 'border-primary font-medium text-primary',
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

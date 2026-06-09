'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Lightweight, dependency-free scroll reveal.
 *
 * - A single shared IntersectionObserver watches every `[data-reveal]` element.
 * - Animations use only `opacity` + `transform` (GPU-composited, no layout work).
 * - Elements are only hidden once we know JS is running and motion is allowed,
 *   so there is zero CLS and no risk of invisible content without JS.
 * - Honors `prefers-reduced-motion` by revealing everything instantly.
 * - Re-scans on route change so client-navigated pages animate too.
 */
export function ScrollReveal() {
  const pathname = usePathname()

  useEffect(() => {
    const root = document.documentElement
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const els = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal]'),
    )

    // No motion / no IO support: ensure everything is simply visible.
    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-revealed'))
      return
    }

    // Signals the CSS to apply the hidden start state only now (post-hydration).
    root.classList.add('reveal-ready')

    const viewportH = window.innerHeight

    const observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            obs.unobserve(entry.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )

    els.forEach((el) => {
      // Reveal anything already in (or above) the viewport synchronously so
      // above-the-fold content never flashes hidden — only below-fold animates.
      const rect = el.getBoundingClientRect()
      if (rect.top < viewportH * 0.92) {
        el.classList.add('is-revealed')
      } else {
        observer.observe(el)
      }
    })

    return () => observer.disconnect()
  }, [pathname])

  return null
}

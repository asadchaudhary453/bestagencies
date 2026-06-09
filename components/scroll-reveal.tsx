'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'
const DURATION = 600
const DELAY_STEP = 80

function startTransform(variant: string | null): string {
  switch (variant) {
    case 'fade':
      return 'none'
    case 'left':
      return 'translate3d(-20px, 0, 0)'
    case 'right':
      return 'translate3d(20px, 0, 0)'
    default:
      return 'translate3d(0, 20px, 0)'
  }
}

/**
 * Lightweight, dependency-free scroll reveal.
 *
 * - A single shared IntersectionObserver watches every `[data-reveal]` element.
 * - Reveals are driven by the Web Animations API (element.animate), which
 *   NEVER mutates attributes/classes on React-rendered DOM — so streaming
 *   hydration can never observe a server/client mismatch.
 * - Elements are fully visible by default (no hidden start state in CSS):
 *   zero CLS, content always readable without JS.
 * - Animations use only `opacity` + `transform` (GPU-composited).
 * - Honors `prefers-reduced-motion` by not animating at all.
 * - Re-scans on route change so client-navigated pages animate too.
 */
export function ScrollReveal() {
  const pathname = usePathname()

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (reduceMotion || !('IntersectionObserver' in window)) return

    const revealed = new WeakSet<Element>()
    const viewportH = window.innerHeight

    const play = (el: HTMLElement) => {
      if (revealed.has(el)) return
      revealed.add(el)
      const variant = el.getAttribute('data-reveal')
      const delayStep = Number(el.getAttribute('data-reveal-delay') || 0)
      el.animate(
        [
          { opacity: 0, transform: startTransform(variant) },
          { opacity: 1, transform: 'none' },
        ],
        {
          duration: DURATION,
          delay: delayStep * DELAY_STEP,
          easing: EASE,
          fill: 'backwards',
        },
      )
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            play(entry.target as HTMLElement)
            obs.unobserve(entry.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )

    const els = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal]'),
    )
    els.forEach((el) => {
      // Above-the-fold content is left untouched (already visible, no flash);
      // only below-fold elements animate in as they enter the viewport.
      const rect = el.getBoundingClientRect()
      if (rect.top < viewportH * 0.92) {
        revealed.add(el)
      } else {
        observer.observe(el)
      }
    })

    return () => observer.disconnect()
  }, [pathname])

  return null
}

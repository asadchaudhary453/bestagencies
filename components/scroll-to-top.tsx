'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Scroll-to-top button with a live scroll-progress ring.
 *
 * - Appears (scale + fade) only after the user scrolls past one viewport.
 * - An SVG ring fills to reflect how far down the page the user is.
 * - Uses rAF-throttled scroll handling and only `opacity`/`transform`
 *   animations, so it stays cheap and jank-free.
 * - Honors `prefers-reduced-motion` for the scroll behaviour.
 * - Mobile friendly: large tap target, respects iOS safe-area insets.
 */
export function ScrollToTop() {
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)
  const frame = useRef<number | null>(null)

  useEffect(() => {
    const update = () => {
      frame.current = null
      const scrollTop = window.scrollY
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight
      const pct = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0
      setProgress(pct)
      setVisible(scrollTop > window.innerHeight * 0.6)
    }

    const onScroll = () => {
      if (frame.current === null) {
        frame.current = window.requestAnimationFrame(update)
      }
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame.current !== null) cancelAnimationFrame(frame.current)
    }
  }, [])

  const handleClick = () => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  // Ring geometry
  const radius = 26
  const circumference = 2 * Math.PI * radius

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Scroll back to top"
      tabIndex={visible ? 0 : -1}
      className={cn(
        'group fixed z-50 grid h-14 w-14 place-items-center rounded-full',
        'right-[max(1rem,env(safe-area-inset-right))]',
        'bottom-[max(1.25rem,env(safe-area-inset-bottom))]',
        'bg-card/90 text-foreground shadow-lg ring-1 ring-border backdrop-blur-md',
        'transition-[opacity,transform] duration-300 ease-out',
        'hover:-translate-y-1 hover:shadow-xl hover:ring-primary/40',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        'motion-reduce:transition-none motion-reduce:hover:translate-y-0',
        visible
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-4 opacity-0',
      )}
    >
      {/* Progress ring */}
      <svg
        className="absolute inset-0 h-full w-full -rotate-90"
        viewBox="0 0 60 60"
        aria-hidden="true"
      >
        <circle
          cx="30"
          cy="30"
          r={radius}
          fill="none"
          strokeWidth="3"
          className="stroke-border/60"
        />
        <circle
          cx="30"
          cy="30"
          r={radius}
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          className="stroke-primary transition-[stroke-dashoffset] duration-150 ease-out"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
        />
      </svg>

      {/* Soft glow on hover */}
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-primary/0 transition-colors duration-300 group-hover:bg-primary/5"
      />

      <ArrowUp className="relative h-5 w-5 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-active:translate-y-0" />
      <span className="sr-only">Back to top</span>
    </button>
  )
}

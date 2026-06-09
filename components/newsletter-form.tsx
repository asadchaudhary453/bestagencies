'use client'

import { useState } from 'react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function NewsletterForm({ className }: { className?: string }) {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.includes('@')) return
    setDone(true)
    setEmail('')
  }

  if (done) {
    return (
      <div
        className={cn(
          'flex items-center gap-2 text-sm font-medium text-primary',
          className,
        )}
      >
        <CheckCircle2 className="h-5 w-5" />
        Thanks — you’re on the list.
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn('flex w-full max-w-md flex-col gap-2 sm:flex-row', className)}
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
        className="w-full rounded-full border border-border bg-card px-4 py-3 text-sm text-foreground outline-none ring-primary/30 placeholder:text-muted-foreground focus:ring-2"
      />
      <button
        type="submit"
        className="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
      >
        Subscribe
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  )
}

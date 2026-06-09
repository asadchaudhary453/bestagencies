'use client'

import { useState } from 'react'
import { ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function NewsletterForm({ className }: { className?: string }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const value = email.trim()
    if (!value) {
      setError('Please enter your email address.')
      return
    }
    if (!EMAIL_RE.test(value)) {
      setError('That doesn\u2019t look like a valid email address.')
      return
    }
    setError('')
    setDone(true)
    setEmail('')
  }

  if (done) {
    return (
      <div
        role="status"
        className={cn('flex flex-col gap-1 text-sm', className)}
      >
        <span className="flex items-center gap-2 font-medium text-primary">
          <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
          You&apos;re on the list.
        </span>
        <span className="text-muted-foreground">
          One email per week. No spam, unsubscribe any time.
        </span>
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className={cn('flex w-full max-w-md flex-col gap-2', className)}
    >
      <div className="flex w-full flex-col gap-2 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (error) setError('')
          }}
          aria-invalid={!!error}
          aria-describedby={error ? 'newsletter-error' : undefined}
          placeholder="you@company.com"
          className={cn(
            'w-full rounded-full border border-border bg-card px-4 py-3 text-sm text-foreground outline-none ring-primary/30 placeholder:text-muted-foreground focus:ring-2',
            error && 'border-destructive ring-destructive/30',
          )}
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Subscribe
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      {error && (
        <p
          id="newsletter-error"
          className="flex items-center gap-1.5 text-xs font-medium text-destructive"
        >
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </form>
  )
}

'use client'

import { useState } from 'react'
import { Send, CheckCircle2 } from 'lucide-react'

const inputClass =
  'w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none ring-primary/30 placeholder:text-muted-foreground focus:ring-2'

export function ContactForm() {
  const [sent, setSent] = useState(false)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSent(true)
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-10 text-center">
        <CheckCircle2 className="h-10 w-10 text-primary" aria-hidden="true" />
        <h3 className="font-heading text-xl font-semibold">Message sent</h3>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          Thanks for getting in touch. A member of our editorial team will reply
          within two working days.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input id="name" name="name" required className={inputClass} placeholder="Jane Smith" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input id="email" name="email" type="email" required className={inputClass} placeholder="jane@company.com" />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="subject" className="text-sm font-medium">
          Subject
        </label>
        <select id="subject" name="subject" className={inputClass} defaultValue="">
          <option value="" disabled>
            Choose a topic
          </option>
          <option>Suggest an agency</option>
          <option>Editorial enquiry</option>
          <option>Advertising &amp; partnerships</option>
          <option>Correction or feedback</option>
          <option>Something else</option>
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className={inputClass}
          placeholder="How can we help?"
        />
      </div>
      <button
        type="submit"
        className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
      >
        Send message
        <Send className="h-4 w-4" aria-hidden="true" />
      </button>
    </form>
  )
}

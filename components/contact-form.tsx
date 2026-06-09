'use client'

import { useState } from 'react'
import { Send, CheckCircle2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const inputClass =
  'w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none ring-primary/30 placeholder:text-muted-foreground focus:ring-2'
const errorInputClass =
  'border-destructive ring-destructive/30 focus:ring-destructive/40'

type Fields = {
  name: string
  email: string
  subject: string
  message: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validateField(field: keyof Fields, value: string): string {
  switch (field) {
    case 'name':
      return value.trim().length >= 2
        ? ''
        : 'Please enter your name (at least 2 characters).'
    case 'email':
      if (!value.trim()) return 'Please enter your email address.'
      return EMAIL_RE.test(value.trim())
        ? ''
        : 'That doesn\u2019t look like a valid email address.'
    case 'subject':
      return value ? '' : 'Please choose a topic.'
    case 'message':
      return value.trim().length >= 20
        ? ''
        : 'Please add a little more detail (at least 20 characters).'
  }
}

function FieldError({ id, message }: { id: string; message: string }) {
  if (!message) return null
  return (
    <p
      id={id}
      className="flex items-center gap-1.5 text-xs font-medium text-destructive"
    >
      <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {message}
    </p>
  )
}

export function ContactForm() {
  const [sent, setSent] = useState(false)
  const [values, setValues] = useState<Fields>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [errors, setErrors] = useState<Partial<Fields>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>(
    {},
  )

  function setValue(field: keyof Fields, value: string) {
    setValues((v) => ({ ...v, [field]: value }))
    // Live re-validation, but only after the field has been visited once,
    // so users aren't scolded while still typing their first attempt.
    if (touched[field]) {
      setErrors((e) => ({ ...e, [field]: validateField(field, value) }))
    }
  }

  function onBlur(field: keyof Fields) {
    setTouched((t) => ({ ...t, [field]: true }))
    setErrors((e) => ({ ...e, [field]: validateField(field, values[field]) }))
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const nextErrors: Partial<Fields> = {}
    for (const field of Object.keys(values) as (keyof Fields)[]) {
      const msg = validateField(field, values[field])
      if (msg) nextErrors[field] = msg
    }
    setTouched({ name: true, email: true, subject: true, message: true })
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    setSent(true)
  }

  if (sent) {
    return (
      <div
        role="status"
        className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-10 text-center"
      >
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
      noValidate
      className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            value={values.name}
            onChange={(e) => setValue('name', e.target.value)}
            onBlur={() => onBlur('name')}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
            className={cn(inputClass, errors.name && errorInputClass)}
            placeholder="Jane Smith"
          />
          <FieldError id="name-error" message={errors.name ?? ''} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={values.email}
            onChange={(e) => setValue('email', e.target.value)}
            onBlur={() => onBlur('email')}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className={cn(inputClass, errors.email && errorInputClass)}
            placeholder="jane@company.com"
          />
          <FieldError id="email-error" message={errors.email ?? ''} />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="subject" className="text-sm font-medium">
          Subject
        </label>
        <select
          id="subject"
          name="subject"
          required
          value={values.subject}
          onChange={(e) => setValue('subject', e.target.value)}
          onBlur={() => onBlur('subject')}
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? 'subject-error' : undefined}
          className={cn(inputClass, errors.subject && errorInputClass)}
        >
          <option value="" disabled>
            Choose a topic
          </option>
          <option>Suggest an agency</option>
          <option>Editorial enquiry</option>
          <option>Advertising &amp; partnerships</option>
          <option>Correction or feedback</option>
          <option>Something else</option>
        </select>
        <FieldError id="subject-error" message={errors.subject ?? ''} />
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
          value={values.message}
          onChange={(e) => setValue('message', e.target.value)}
          onBlur={() => onBlur('message')}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
          className={cn(inputClass, errors.message && errorInputClass)}
          placeholder="How can we help?"
        />
        <FieldError id="message-error" message={errors.message ?? ''} />
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

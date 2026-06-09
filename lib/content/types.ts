export type Category = {
  slug: string
  name: string
  shortName: string
  title: string
  description: string
  blurb: string
  image?: string
  icon: string
}

export type Author = {
  slug: string
  name: string
  role: string
  bio: string
  avatar: string
  twitter?: string
  linkedin?: string
}

export type RankedAgency = {
  rank: number
  name: string
  tagline: string
  location: string
  founded: string
  rating: number
  bestFor: string
  highlights: string[]
  website: string
}

export type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string; id: string }
  | { type: 'subheading'; text: string; id: string }
  | { type: 'list'; items: string[] }
  | { type: 'ordered'; items: string[] }
  | { type: 'quote'; text: string; cite?: string }
  | { type: 'agencies'; intro?: string }
  | { type: 'html'; html: string }

export type PostHeading = {
  id: string
  text: string
  level: 1 | 2
}

export type Post = {
  slug: string
  title: string
  excerpt: string
  category: string
  author: string
  publishedAt: string
  updatedAt: string
  readingTime: number
  image: string
  imageAlt: string
  tags: string[]
  featured?: boolean
  trending?: boolean
  agencies: RankedAgency[]
  body: ContentBlock[]
  headings?: PostHeading[]
}

/**
 * Lightweight post shape passed to client components (search) —
 * excludes the heavy body/agencies fields.
 */
export type PostSummary = Omit<Post, 'body' | 'agencies' | 'headings'>

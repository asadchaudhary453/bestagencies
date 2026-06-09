import type { Author } from './types'

export const authors: Author[] = [
  {
    slug: 'eleanor-hughes',
    name: 'Eleanor Hughes',
    role: 'Editor-in-Chief',
    bio: 'Eleanor leads editorial at Best Agencies with over a decade of experience reviewing marketing and technology service providers. She oversees our ranking methodology.',
    avatar: '/images/author-eleanor.png',
    twitter: '@eleanorhughes',
    linkedin: 'https://linkedin.com',
  },
  {
    slug: 'marcus-bell',
    name: 'Marcus Bell',
    role: 'Senior Analyst, Marketing',
    bio: 'Marcus specialises in SEO and performance marketing. He has audited hundreds of agencies and contributes our data-led growth rankings.',
    avatar: '/images/author-marcus.png',
    twitter: '@marcusbell',
    linkedin: 'https://linkedin.com',
  },
  {
    slug: 'priya-nair',
    name: 'Priya Nair',
    role: 'Technology Editor',
    bio: 'Priya covers software development, product engineering and web design. She evaluates technical delivery, code quality and reliability for our reviews.',
    avatar: '/images/author-priya.png',
    twitter: '@priyanair',
    linkedin: 'https://linkedin.com',
  },
]

export function getAuthor(slug: string): Author | undefined {
  return authors.find((a) => a.slug === slug)
}

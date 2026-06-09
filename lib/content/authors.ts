import type { Author } from './types'

const admin: Author = {
  slug: 'admin',
  name: 'Admin',
  role: 'Editorial Team',
  bio: 'The Best Agencies editorial team researches, vets and ranks agencies across every category using our independent methodology.',
  avatar: '/favicon.png',
}

export const authors: Author[] = [admin]

/**
 * All content is published under the site Admin account, so any author
 * slug referenced by a post resolves to Admin.
 */
export function getAuthor(_slug: string): Author | undefined {
  return admin
}

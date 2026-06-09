'use client'

import { usePathname } from 'next/navigation'

/**
 * Hides marketing site chrome (header/footer) on admin routes while keeping
 * the wrapped children server-rendered everywhere else.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (pathname.startsWith('/admin')) return null
  return <>{children}</>
}

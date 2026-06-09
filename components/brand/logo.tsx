import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { SITE } from '@/lib/site'

export function Logo({
  className,
  priority = false,
}: {
  className?: string
  priority?: boolean
}) {
  return (
    <Link
      href="/"
      aria-label={`${SITE.name} home`}
      className={cn('inline-flex items-center', className)}
    >
      <Image
        src="/best-agencies-logo.png"
        alt={`${SITE.name} logo`}
        width={220}
        height={44}
        priority={priority}
        className="h-8 w-auto sm:h-9"
      />
    </Link>
  )
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      src="/favicon.png"
      alt={`${SITE.name} icon`}
      width={40}
      height={40}
      className={cn('h-9 w-9', className)}
    />
  )
}

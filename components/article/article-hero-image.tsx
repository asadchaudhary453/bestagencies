'use client'

import { useState } from 'react'
import Image from 'next/image'

/**
 * Featured image for the blog detail page.
 * - Renders nothing when the post has no image.
 * - Removes itself entirely if the image URL fails to load,
 *   so readers never see a broken image or empty white box.
 */
export function ArticleHeroImage({
  src,
  alt,
}: {
  src?: string
  alt: string
}) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) return null

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      <figure className="sm:-mt-10">
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-border shadow-[0_30px_60px_-30px_rgba(30,41,59,0.45)]">
          <Image
            src={src || '/placeholder.svg'}
            alt={alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
            onError={() => setFailed(true)}
          />
        </div>
      </figure>
    </div>
  )
}

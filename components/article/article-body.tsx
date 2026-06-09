import type { ContentBlock, RankedAgency } from '@/lib/content/types'
import { AgencyCard } from './agency-card'

export function ArticleBody({
  blocks,
  agencies,
}: {
  blocks: ContentBlock[]
  agencies: RankedAgency[]
}) {
  let paragraphCount = 0

  return (
    <div className="flex flex-col gap-6">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'heading':
            return (
              <h2
                key={i}
                id={block.id}
                className="scroll-mt-28 font-heading text-2xl font-bold text-balance sm:text-[1.75rem]"
              >
                <span className="mb-3 block h-1 w-10 rounded-full bg-primary" />
                {block.text}
              </h2>
            )
          case 'subheading':
            return (
              <h3
                key={i}
                id={block.id}
                className="scroll-mt-28 font-heading text-xl font-semibold"
              >
                {block.text}
              </h3>
            )
          case 'paragraph': {
            paragraphCount += 1
            const isFirst = paragraphCount === 1
            return (
              <p
                key={i}
                className={
                  isFirst
                    ? 'text-lg leading-relaxed text-foreground/90 first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-heading first-letter:text-6xl first-letter:font-bold first-letter:leading-[0.8] first-letter:text-primary'
                    : 'leading-relaxed text-foreground/90'
                }
              >
                {block.text}
              </p>
            )
          }
          case 'list':
            return (
              <ul key={i} className="flex flex-col gap-2.5 pl-1">
                {block.items.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                      aria-hidden="true"
                    />
                    <span className="leading-relaxed text-foreground/90">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            )
          case 'ordered':
            return (
              <ol key={i} className="flex flex-col gap-3">
                {block.items.map((item, idx) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-primary">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed text-foreground/90">
                      {item}
                    </span>
                  </li>
                ))}
              </ol>
            )
          case 'quote':
            return (
              <blockquote
                key={i}
                className="relative my-2 overflow-hidden rounded-2xl border border-border bg-accent/40 px-6 py-6 sm:px-8"
              >
                <span
                  aria-hidden="true"
                  className="absolute left-4 top-1 font-heading text-6xl leading-none text-primary/25"
                >
                  &ldquo;
                </span>
                <p className="relative font-heading text-lg italic leading-relaxed text-foreground sm:text-xl">
                  {block.text}
                </p>
                {block.cite && (
                  <cite className="mt-3 block text-sm not-italic font-medium text-muted-foreground">
                    — {block.cite}
                  </cite>
                )}
              </blockquote>
            )
          case 'html':
            return (
              <div
                key={i}
                className="prose-article"
                // Sanitized server-side with DOMPurify in lib/content/data.ts
                dangerouslySetInnerHTML={{ __html: block.html }}
              />
            )
          case 'agencies':
            return (
              <div key={i} className="flex flex-col gap-5">
                {block.intro && (
                  <p className="leading-relaxed text-foreground/90">
                    {block.intro}
                  </p>
                )}
                <div className="flex flex-col gap-5">
                  {agencies.map((agency) => (
                    <AgencyCard key={agency.rank} agency={agency} />
                  ))}
                </div>
              </div>
            )
          default:
            return null
        }
      })}
    </div>
  )
}

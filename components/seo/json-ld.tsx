import { SITE } from '@/lib/site'
import type { Post } from '@/lib/content/types'
import { getAuthor } from '@/lib/content/authors'
import { getCategory } from '@/lib/content/categories'

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SITE.name,
        url: SITE.url,
        logo: `${SITE.url}/best-agencies-logo.png`,
        description: SITE.description,
        sameAs: [
          'https://web.facebook.com/bestagencies.co.uk/',
          'https://twitter.com/bestagenciesuk',
          'https://www.instagram.com/bestagencies.co.uk/',
          'https://www.linkedin.com/in/bestagenciesuk/',
        ],
      }}
    />
  )
}

export function WebsiteJsonLd() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE.name,
        url: SITE.url,
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${SITE.url}/search?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      }}
    />
  )
}

export function ArticleJsonLd({ post }: { post: Post }) {
  const author = getAuthor(post.author)
  const category = getCategory(post.category)
  const url = `${SITE.url}/${post.slug}`
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.excerpt,
        image: `${SITE.url}${post.image}`,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        author: author
          ? { '@type': 'Person', name: author.name, jobTitle: author.role }
          : { '@type': 'Organization', name: SITE.name },
        publisher: {
          '@type': 'Organization',
          name: SITE.name,
          logo: {
            '@type': 'ImageObject',
            url: `${SITE.url}/best-agencies-logo.png`,
          },
        },
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        articleSection: category?.name,
        keywords: post.tags.join(', '),
      }}
    />
  )
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[]
}) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: item.name,
          item: `${SITE.url}${item.url}`,
        })),
      }}
    />
  )
}

export function collectionPageJsonLd({
  name,
  description,
  url,
  posts,
}: {
  name: string
  description: string
  url: string
  posts: Post[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: posts.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE.url}/${p.slug}`,
        name: p.title,
      })),
    },
  }
}

export function ItemListJsonLd({ post }: { post: Post }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: post.title,
        numberOfItems: post.agencies.length,
        itemListOrder: 'https://schema.org/ItemListOrderAscending',
        itemListElement: post.agencies.map((a) => ({
          '@type': 'ListItem',
          position: a.rank,
          item: {
            '@type': 'Organization',
            name: a.name,
            description: a.tagline,
            address: a.location,
            url: a.website,
            foundingDate: a.founded,
          },
        })),
      }}
    />
  )
}

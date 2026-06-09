// WordPress REST API Integration
// Configure your WordPress site URL in environment variables

const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://your-wordpress-site.com"

// Types for WordPress REST API responses
export interface WPPost {
  id: number
  date: string
  date_gmt: string
  modified: string
  modified_gmt: string
  slug: string
  status: string
  type: string
  link: string
  title: {
    rendered: string
  }
  content: {
    rendered: string
    protected: boolean
  }
  excerpt: {
    rendered: string
    protected: boolean
  }
  author: number
  featured_media: number
  categories: number[]
  tags: number[]
  _embedded?: {
    author?: WPAuthor[]
    "wp:featuredmedia"?: WPMedia[]
    "wp:term"?: WPTerm[][]
  }
  // Rank Math SEO fields
  rank_math_title?: string
  rank_math_description?: string
  rank_math_focus_keyword?: string
  // Yoast SEO fields (backup)
  yoast_head_json?: {
    title?: string
    description?: string
    og_title?: string
    og_description?: string
    og_image?: Array<{ url: string }>
  }
}

export interface WPCategory {
  id: number
  count: number
  description: string
  link: string
  name: string
  slug: string
  parent: number
}

export interface WPTag {
  id: number
  count: number
  description: string
  link: string
  name: string
  slug: string
}

export interface WPAuthor {
  id: number
  name: string
  url: string
  description: string
  link: string
  slug: string
  avatar_urls: {
    [key: string]: string
  }
}

export interface WPMedia {
  id: number
  source_url: string
  alt_text: string
  media_details?: {
    width: number
    height: number
    sizes?: {
      [key: string]: {
        source_url: string
        width: number
        height: number
      }
    }
  }
}

export interface WPTerm {
  id: number
  name: string
  slug: string
  taxonomy: string
}

export interface PostsResponse {
  posts: WPPost[]
  totalPosts: number
  totalPages: number
}

// Helper to strip HTML tags from excerpt
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim()
}

// Helper to format date
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// Helper to get reading time estimate
export function getReadingTime(content: string): number {
  const text = stripHtml(content)
  const wordsPerMinute = 200
  const words = text.split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

// Get featured image URL from embedded data
export function getFeaturedImageUrl(post: WPPost, size: string = "full"): string | null {
  if (!post._embedded?.["wp:featuredmedia"]?.[0]) {
    return null
  }
  
  const media = post._embedded["wp:featuredmedia"][0]
  
  // Try to get requested size, fallback to source_url
  if (size !== "full" && media.media_details?.sizes?.[size]) {
    return media.media_details.sizes[size].source_url
  }
  
  return media.source_url
}

// Get author info from embedded data
export function getAuthor(post: WPPost): WPAuthor | null {
  return post._embedded?.author?.[0] || null
}

// Get categories from embedded data
export function getPostCategories(post: WPPost): WPTerm[] {
  const terms = post._embedded?.["wp:term"]
  if (!terms) return []
  
  // Categories are usually in the first array
  return terms[0]?.filter((term) => term.taxonomy === "category") || []
}

// Get tags from embedded data
export function getTags(post: WPPost): WPTerm[] {
  const terms = post._embedded?.["wp:term"]
  if (!terms) return []
  
  // Tags are usually in the second array
  return terms[1]?.filter((term) => term.taxonomy === "post_tag") || []
}

// Get SEO meta description from Rank Math or Yoast, fallback to excerpt
export function getMetaDescription(post: WPPost): string {
  // Try Rank Math first
  if (post.rank_math_description) {
    return post.rank_math_description
  }
  
  // Try Yoast
  if (post.yoast_head_json?.description) {
    return post.yoast_head_json.description
  }
  if (post.yoast_head_json?.og_description) {
    return post.yoast_head_json.og_description
  }
  
  // Fallback to excerpt
  const excerpt = stripHtml(post.excerpt.rendered)
  if (excerpt) {
    return excerpt.slice(0, 160)
  }
  
  // Final fallback to content
  const content = stripHtml(post.content.rendered)
  return content.slice(0, 160)
}

// Get SEO title from Rank Math or Yoast, fallback to post title
export function getMetaTitle(post: WPPost): string {
  // Try Rank Math first
  if (post.rank_math_title) {
    return post.rank_math_title
  }
  
  // Try Yoast
  if (post.yoast_head_json?.title) {
    return post.yoast_head_json.title
  }
  if (post.yoast_head_json?.og_title) {
    return post.yoast_head_json.og_title
  }
  
  // Fallback to post title
  return stripHtml(post.title.rendered)
}

// Get excerpt with fallback to content
export function getExcerpt(post: WPPost, maxLength: number = 150): string {
  // Try excerpt first
  let excerpt = stripHtml(post.excerpt.rendered)
  
  // If excerpt is empty or too short, try Rank Math description
  if (!excerpt || excerpt.length < 20) {
    if (post.rank_math_description) {
      excerpt = post.rank_math_description
    }
  }
  
  // If still empty, try Yoast description
  if (!excerpt || excerpt.length < 20) {
    if (post.yoast_head_json?.description) {
      excerpt = post.yoast_head_json.description
    }
  }
  
  // Final fallback to content
  if (!excerpt || excerpt.length < 20) {
    excerpt = stripHtml(post.content.rendered)
  }
  
  // Trim to max length
  if (excerpt.length > maxLength) {
    excerpt = excerpt.slice(0, maxLength).trim()
    // Don't cut words in half
    const lastSpace = excerpt.lastIndexOf(" ")
    if (lastSpace > maxLength - 30) {
      excerpt = excerpt.slice(0, lastSpace)
    }
  }
  
  return excerpt
}

// Fetch posts with pagination and optional filtering
export async function getPosts(options: {
  page?: number
  perPage?: number
  category?: number
  tag?: number
  search?: string
  orderBy?: "date" | "title" | "id"
  order?: "asc" | "desc"
} = {}): Promise<PostsResponse> {
  const {
    page = 1,
    perPage = 12,
    category,
    tag,
    search,
    orderBy = "date",
    order = "desc",
  } = options

  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
    orderby: orderBy,
    order: order,
    _embed: "true", // Include featured images, authors, terms
  })

  if (category) params.append("categories", category.toString())
  if (tag) params.append("tags", tag.toString())
  if (search) params.append("search", search)

  try {
    const response = await fetch(`${WORDPRESS_API_URL}/wp-json/wp/v2/posts?${params}`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`)
    }

    const posts: WPPost[] = await response.json()
    const totalPosts = parseInt(response.headers.get("X-WP-Total") || "0", 10)
    const totalPages = parseInt(response.headers.get("X-WP-TotalPages") || "0", 10)

    return { posts, totalPosts, totalPages }
  } catch (error) {
    console.error("Error fetching posts:", error)
    return { posts: [], totalPosts: 0, totalPages: 0 }
  }
}

// Fetch a single post by slug
export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  try {
    const params = new URLSearchParams({
      slug: slug,
      _embed: "true",
    })

    const response = await fetch(`${WORDPRESS_API_URL}/wp-json/wp/v2/posts?${params}`, {
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.status}`)
    }

    const posts: WPPost[] = await response.json()
    return posts[0] || null
  } catch (error) {
    console.error("Error fetching post by slug:", error)
    return null
  }
}

// Fetch all post slugs for static generation
export async function getAllPostSlugs(): Promise<string[]> {
  const slugs: string[] = []
  let page = 1
  let hasMore = true

  while (hasMore) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: "100",
        _fields: "slug", // Only fetch slug field for efficiency
      })

      const response = await fetch(`${WORDPRESS_API_URL}/wp-json/wp/v2/posts?${params}`, {
        next: { revalidate: 3600 }, // Revalidate every hour
      })

      if (!response.ok) {
        hasMore = false
        break
      }

      const posts: { slug: string }[] = await response.json()
      
      if (posts.length === 0) {
        hasMore = false
      } else {
        slugs.push(...posts.map((p) => p.slug))
        page++
      }
    } catch (error) {
      console.error("Error fetching post slugs:", error)
      hasMore = false
    }
  }

  return slugs
}

// Fetch all categories
export async function getCategories(): Promise<WPCategory[]> {
  try {
    const params = new URLSearchParams({
      per_page: "100",
      orderby: "count",
      order: "desc",
      hide_empty: "true",
    })

    const response = await fetch(`${WORDPRESS_API_URL}/wp-json/wp/v2/categories?${params}`, {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

// Fetch all tags
export async function getAllTags(): Promise<WPTag[]> {
  try {
    const params = new URLSearchParams({
      per_page: "100",
      orderby: "count",
      order: "desc",
      hide_empty: "true",
    })

    const response = await fetch(`${WORDPRESS_API_URL}/wp-json/wp/v2/tags?${params}`, {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch tags: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching tags:", error)
    return []
  }
}

// Fetch related posts (same category, excluding current post)
export async function getRelatedPosts(
  postId: number,
  categoryIds: number[],
  limit: number = 4
): Promise<WPPost[]> {
  if (categoryIds.length === 0) {
    return []
  }

  try {
    const params = new URLSearchParams({
      categories: categoryIds[0].toString(),
      exclude: postId.toString(),
      per_page: limit.toString(),
      _embed: "true",
    })

    const response = await fetch(`${WORDPRESS_API_URL}/wp-json/wp/v2/posts?${params}`, {
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch related posts: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching related posts:", error)
    return []
  }
}

// Fetch recent posts for sidebar/homepage
export async function getRecentPosts(limit: number = 5): Promise<WPPost[]> {
  const { posts } = await getPosts({ perPage: limit })
  return posts
}

// Search posts
export async function searchPosts(query: string, page: number = 1): Promise<PostsResponse> {
  return getPosts({ search: query, page })
}

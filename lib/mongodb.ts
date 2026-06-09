import { MongoClient, Db } from "mongodb"

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017"
const MONGODB_DB = process.env.MONGODB_DB || "aamconsultants"

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const client = await MongoClient.connect(MONGODB_URI)
  const db = client.db(MONGODB_DB)

  cachedClient = client
  cachedDb = db

  return { client, db }
}

// Blog Post Interface matching your MongoDB schema
export interface BlogPost {
  _id?: string
  title: string
  url: string // This is the slug
  excerpt: string
  content: string
  category: string
  imageUrl: string
  status: "published" | "draft"
  publishedAt: Date | { $date: string }
  createdAt: Date | { $date: string }
  updatedAt: Date | { $date: string }
}

// Response interface for paginated posts
export interface PostsResponse {
  posts: BlogPost[]
  totalPosts: number
  totalPages: number
}

// Helper to parse MongoDB date format
function parseDate(date: Date | { $date: string } | string): Date {
  if (date instanceof Date) {
    return date
  }
  if (typeof date === "object" && "$date" in date) {
    return new Date(date.$date)
  }
  return new Date(date)
}

// Helper to format date
export function formatDate(date: Date | { $date: string } | string): string {
  const parsedDate = parseDate(date)
  return parsedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// Helper to get reading time estimate
export function getReadingTime(content: string): number {
  const text = content.replace(/<[^>]*>/g, "").trim()
  const wordsPerMinute = 200
  const words = text.split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

// Helper to strip HTML tags
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim()
}

// Get all unique categories
export async function getCategories(): Promise<{ name: string; slug: string; count: number }[]> {
  try {
    const { db } = await connectToDatabase()
    const collection = db.collection<BlogPost>("blogs")

    const categories = await collection.aggregate([
      { $match: { status: "published" } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]).toArray()

    return categories.map((cat) => ({
      name: cat._id,
      slug: cat._id.toLowerCase().replace(/\s+/g, "-"),
      count: cat.count,
    }))
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

// Fetch posts with pagination and optional filtering
export async function getPosts(options: {
  page?: number
  perPage?: number
  category?: string
  search?: string
} = {}): Promise<PostsResponse> {
  const { page = 1, perPage = 12, category, search } = options

  try {
    const { db } = await connectToDatabase()
    const collection = db.collection<BlogPost>("blogs")

    // Build query
    const query: Record<string, unknown> = { status: "published" }
    
    if (category) {
      // The URL slug uses hyphens (e.g. "web-development") while the stored
      // category uses spaces (e.g. "Web Development"). Convert hyphens back to
      // whitespace so the regex matches multi-word categories correctly.
      const escapedCategory = category
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        .replace(/-/g, "\\s+")
      query.category = { $regex: new RegExp(`^${escapedCategory}$`, "i") }
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ]
    }

    // Get total count
    const totalPosts = await collection.countDocuments(query)
    const totalPages = Math.ceil(totalPosts / perPage)

    // Fetch posts with pagination
    const posts = await collection
      .find(query)
      .sort({ publishedAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .toArray()

    return {
      posts: posts.map((post) => ({
        ...post,
        _id: post._id?.toString(),
      })),
      totalPosts,
      totalPages,
    }
  } catch (error) {
    console.error("Error fetching posts:", error)
    return { posts: [], totalPosts: 0, totalPages: 0 }
  }
}

// Fetch a single post by slug (url field)
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const { db } = await connectToDatabase()
    const collection = db.collection<BlogPost>("blogs")

    const post = await collection.findOne({ url: slug, status: "published" })
    
    if (!post) return null

    return {
      ...post,
      _id: post._id?.toString(),
    }
  } catch (error) {
    console.error("Error fetching post by slug:", error)
    return null
  }
}

// Fetch all post slugs for static generation
export async function getAllPostSlugs(): Promise<string[]> {
  try {
    const { db } = await connectToDatabase()
    const collection = db.collection<BlogPost>("blogs")

    const posts = await collection
      .find({ status: "published" }, { projection: { url: 1 } })
      .toArray()

    return posts.map((p) => p.url)
  } catch (error) {
    console.error("Error fetching post slugs:", error)
    return []
  }
}

// Fetch recent posts for sidebar/homepage
export async function getRecentPosts(limit: number = 5): Promise<BlogPost[]> {
  try {
    const { db } = await connectToDatabase()
    const collection = db.collection<BlogPost>("blogs")

    const posts = await collection
      .find({ status: "published" })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .toArray()

    return posts.map((post) => ({
      ...post,
      _id: post._id?.toString(),
    }))
  } catch (error) {
    console.error("Error fetching recent posts:", error)
    return []
  }
}

// Fetch related posts (older posts only, excluding current post)
export async function getRelatedPosts(
  currentSlug: string,
  createdAt: Date | { $date: string } | string,
  limit: number = 5
): Promise<BlogPost[]> {
  try {
    const { db } = await connectToDatabase()
    const collection = db.collection<BlogPost>("blogs")

    // Parse the current post's createdAt date
    const currentPostDate = parseDate(createdAt)

    // Fetch posts that are:
    // 1. Published
    // 2. Not the current post
    // 3. Created BEFORE the current post
    const posts = await collection
      .find({
        status: "published",
        url: { $ne: currentSlug },
        createdAt: { $lt: currentPostDate },
      })
      .sort({ createdAt: -1 }) // Most recent among older posts first
      .limit(limit)
      .toArray()

    return posts.map((post) => ({
      ...post,
      _id: post._id?.toString(),
    }))
  } catch (error) {
    console.error("Error fetching related posts:", error)
    return []
  }
}

// Search posts
export async function searchPosts(query: string, page: number = 1): Promise<PostsResponse> {
  return getPosts({ search: query, page })
}

// WordPress -> MongoDB Migration Script
//
// Migrates all blog posts from https://www.bestagencies.co.uk (WordPress REST API)
// into a local MongoDB database, downloading featured images to public/blog-images.
//
// - Meta title (from page <title> / Yoast)        -> title
// - Meta description (from <meta description>)    -> excerpt
// - Post content                                  -> content
// - First category name                           -> category
// - Featured image saved locally                  -> imageUrl (/blog-images/<slug>.<ext>)
// - WP slug                                       -> url
// - WP publish date                               -> publishedAt (status: "published")
//
// Usage (run on your Mac, with MongoDB running locally):
//   node scripts/migrate-wordpress.mjs                 # full migration
//   node scripts/migrate-wordpress.mjs --dry-run       # no DB writes, no image saves
//   node scripts/migrate-wordpress.mjs --limit 10      # only first 10 posts (for testing)
//
// DB:   mongodb://localhost:27017  |  database: bestagencies-migration  |  collection: blogs

import { MongoClient } from "mongodb"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const WP_URL = "https://www.bestagencies.co.uk"
const MONGO_URI = process.env.MIGRATION_MONGO_URI || "mongodb://localhost:27017"
const DB_NAME = "bestagencies-migration"
const COLLECTION = "blogs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const IMAGES_DIR = path.join(__dirname, "..", "public", "blog-images")

// ---- CLI flags ----
const args = process.argv.slice(2)
const DRY_RUN = args.includes("--dry-run")
const limitIdx = args.indexOf("--limit")
const LIMIT = limitIdx !== -1 ? Number.parseInt(args[limitIdx + 1], 10) : Number.POSITIVE_INFINITY

// ---- Helpers ----
function stripHtml(html) {
  return (html || "").replace(/<[^>]*>/g, "").trim()
}

function decodeEntities(str) {
  return (str || "")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCharCode(Number.parseInt(n, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&hellip;/g, "…")
    .replace(/&nbsp;/g, " ")
    .replace(/&ndash;/g, "–")
    .replace(/&mdash;/g, "—")
    .replace(/&rsquo;/g, "\u2019")
    .replace(/&lsquo;/g, "\u2018")
    .replace(/&rdquo;/g, "\u201d")
    .replace(/&ldquo;/g, "\u201c")
}

async function fetchWithRetry(url, options = {}, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (migration-script)" },
        ...options,
      })
      if (res.ok) return res
      if (res.status === 429 || res.status >= 500) {
        await new Promise((r) => setTimeout(r, 2000 * attempt))
        continue
      }
      return res
    } catch (err) {
      if (attempt === retries) throw err
      await new Promise((r) => setTimeout(r, 2000 * attempt))
    }
  }
  throw new Error(`Failed to fetch after ${retries} retries: ${url}`)
}

// ---- 1. Fetch all posts from WP REST API ----
async function fetchAllPosts() {
  const posts = []
  let page = 1
  while (posts.length < LIMIT) {
    const url = `${WP_URL}/wp-json/wp/v2/posts?per_page=100&page=${page}&_embed=true&orderby=date&order=desc`
    const res = await fetchWithRetry(url)
    if (!res.ok) {
      if (res.status === 400) break // past last page
      throw new Error(`Failed to fetch posts page ${page}: ${res.status}`)
    }
    const batch = await res.json()
    if (batch.length === 0) break
    posts.push(...batch)
    const totalPages = Number.parseInt(res.headers.get("X-WP-TotalPages") || "1", 10)
    console.log(`  Fetched posts page ${page}/${totalPages} (${posts.length} posts so far)`)
    if (page >= totalPages) break
    page++
  }
  return posts.slice(0, LIMIT)
}

// ---- 2. Extract meta title + meta description from post HTML page ----
async function fetchSeoMeta(postLink) {
  try {
    const res = await fetchWithRetry(postLink)
    if (!res.ok) return { metaTitle: null, metaDescription: null }
    const html = await res.text()

    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
    const descMatch =
      html.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']\s*\/?>/i) ||
      html.match(/<meta\s+content=["']([\s\S]*?)["']\s+name=["']description["']\s*\/?>/i)

    return {
      metaTitle: titleMatch ? decodeEntities(titleMatch[1].trim()) : null,
      metaDescription: descMatch ? decodeEntities(descMatch[1].trim()) : null,
    }
  } catch {
    return { metaTitle: null, metaDescription: null }
  }
}

// ---- 3. Download featured image to public/blog-images ----
async function downloadFeaturedImage(post) {
  const media = post._embedded?.["wp:featuredmedia"]?.[0]
  const sourceUrl = media?.source_url
  if (!sourceUrl) return null

  let ext = path.extname(new URL(sourceUrl).pathname).toLowerCase()
  if (!ext || ext.length > 5) ext = ".jpg"
  const filename = `${post.slug}${ext}`
  const filepath = path.join(IMAGES_DIR, filename)
  const publicUrl = `/blog-images/${filename}`

  if (fs.existsSync(filepath)) return publicUrl // already downloaded (resume support)
  if (DRY_RUN) return publicUrl

  try {
    const res = await fetchWithRetry(sourceUrl)
    if (!res.ok) {
      console.warn(`  ⚠ Image download failed (${res.status}): ${sourceUrl}`)
      return null
    }
    const buffer = Buffer.from(await res.arrayBuffer())
    fs.writeFileSync(filepath, buffer)
    return publicUrl
  } catch (err) {
    console.warn(`  ⚠ Image download error: ${sourceUrl} - ${err.message}`)
    return null
  }
}

// ---- 4. Transform WP post -> Blog document ----
function buildBlogDoc(post, seo, imageUrl) {
  const fallbackTitle = decodeEntities(stripHtml(post.title?.rendered))
  const fallbackExcerpt = decodeEntities(stripHtml(post.excerpt?.rendered)).slice(0, 300)

  const categories = post._embedded?.["wp:term"]?.[0]?.filter((t) => t.taxonomy === "category") || []
  const category = categories[0]?.name ? decodeEntities(categories[0].name) : "Uncategorized"

  const publishedAt = new Date(post.date_gmt ? `${post.date_gmt}Z` : post.date)
  const modifiedAt = new Date(post.modified_gmt ? `${post.modified_gmt}Z` : post.modified)

  return {
    title: seo.metaTitle || fallbackTitle,
    url: post.slug.toLowerCase(),
    excerpt: seo.metaDescription || fallbackExcerpt || fallbackTitle,
    content: post.content?.rendered || "",
    category,
    imageUrl: imageUrl || "/blog-images/placeholder.jpg",
    status: "published",
    publishedAt,
    viewCount: 0,
    createdAt: publishedAt,
    updatedAt: modifiedAt,
  }
}

// ---- Main ----
async function main() {
  console.log(`\nWordPress -> MongoDB Migration${DRY_RUN ? " (DRY RUN)" : ""}`)
  console.log(`Source: ${WP_URL}`)
  console.log(`Target: ${MONGO_URI} / db: ${DB_NAME} / collection: ${COLLECTION}\n`)

  if (!DRY_RUN && !fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true })
  }

  let client = null
  let collection = null
  if (!DRY_RUN) {
    client = new MongoClient(MONGO_URI)
    await client.connect()
    const db = client.db(DB_NAME)
    collection = db.collection(COLLECTION)
    await collection.createIndex({ url: 1 }, { unique: true })
    await collection.createIndex({ status: 1, publishedAt: -1 })
    await collection.createIndex({ category: 1, status: 1 })
    await collection.createIndex({ createdAt: -1 })
    console.log("Connected to MongoDB.\n")
  }

  console.log("Step 1: Fetching all posts from WordPress...")
  const posts = await fetchAllPosts()
  console.log(`\nTotal posts to migrate: ${posts.length}\n`)

  let migrated = 0
  let failed = 0
  const CONCURRENCY = 5

  for (let i = 0; i < posts.length; i += CONCURRENCY) {
    const batch = posts.slice(i, i + CONCURRENCY)

    await Promise.all(
      batch.map(async (post) => {
        try {
          const [seo, imageUrl] = await Promise.all([fetchSeoMeta(post.link), downloadFeaturedImage(post)])
          const doc = buildBlogDoc(post, seo, imageUrl)

          if (DRY_RUN) {
            console.log(`  [dry-run] ${doc.url}`)
            console.log(`            title:    ${doc.title}`)
            console.log(`            excerpt:  ${doc.excerpt.slice(0, 100)}...`)
            console.log(`            category: ${doc.category} | image: ${doc.imageUrl}`)
          } else {
            await collection.updateOne({ url: doc.url }, { $set: doc }, { upsert: true })
          }
          migrated++
        } catch (err) {
          failed++
          console.error(`  ✗ Failed: ${post.slug} - ${err.message}`)
        }
      }),
    )

    console.log(`Progress: ${Math.min(i + CONCURRENCY, posts.length)}/${posts.length} (migrated: ${migrated}, failed: ${failed})`)
    // Small delay between batches to be kind to the server
    await new Promise((r) => setTimeout(r, 300))
  }

  console.log(`\nDone! Migrated: ${migrated}, Failed: ${failed}`)
  if (client) await client.close()
}

main().catch((err) => {
  console.error("Migration failed:", err)
  process.exit(1)
})

import mongoose, { Schema, Document, Model } from "mongoose"

export interface IBlog extends Document {
  title: string
  url: string
  excerpt: string
  content: string
  category: string
  imageUrl: string
  status: "draft" | "published" | "scheduled"
  publishedAt?: Date
  scheduledAt?: Date
  viewCount: number
  createdAt: Date
  updatedAt: Date
}

const BlogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    excerpt: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "scheduled"],
      default: "draft",
      index: true,
    },
    publishedAt: {
      type: Date,
      index: true,
    },
    scheduledAt: {
      type: Date,
      index: true,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

// Compound indexes
BlogSchema.index({ status: 1, publishedAt: -1 })
BlogSchema.index({ category: 1, status: 1 })
BlogSchema.index({ createdAt: -1 })

const Blog: Model<IBlog> = mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema)

export default Blog

// Helper function to generate a unique blog URL from title
export async function generateBlogUrl(title: string): Promise<string> {
  // Convert title to URL-friendly slug
  let baseUrl = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .substring(0, 100) // Limit length

  // Check if URL already exists
  let url = baseUrl
  let counter = 1
  
  while (await Blog.findOne({ url })) {
    url = `${baseUrl}-${counter}`
    counter++
  }

  return url
}

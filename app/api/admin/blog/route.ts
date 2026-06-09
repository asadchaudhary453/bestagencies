import { type NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import Blog from "@/lib/db/models/blog";
import { auth } from "@/lib/auth";

// Helper function to generate a unique blog URL from title
async function generateBlogUrl(title: string): Promise<string> {
  // Convert title to URL-friendly slug
  let baseUrl = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .substring(0, 100); // Limit length

  // Check if URL already exists
  let url = baseUrl;
  let counter = 1;
  
  while (await Blog.findOne({ url })) {
    url = `${baseUrl}-${counter}`;
    counter++;
  }

  return url;
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    // Check if user has admin or editor role
    const userRole = (session.user as { role?: string }).role;
    if (userRole !== "admin" && userRole !== "editor") {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "25");
    const status = searchParams.get("status") || "all";
    const category = searchParams.get("category") || "all";
    const search = searchParams.get("search") || "";

    // Build query
    const query: Record<string, unknown> = {};

    if (status !== "all") {
      query.status = status;
    }

    if (category !== "all") {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
      Blog.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Blog.countDocuments(query),
    ]);

    return NextResponse.json({
      blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    // Check if user has admin or editor role
    const userRole = (session.user as { role?: string }).role;
    if (userRole !== "admin" && userRole !== "editor") {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    await dbConnect();

    const body = await request.json();
    const {
      title,
      excerpt,
      content,
      category,
      imageUrl,
      status = "draft",
    } = body;

    // Validate required fields
    if (!title || !excerpt || !content || !category || !imageUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate unique URL
    const url = await generateBlogUrl(title);

    // Create blog post
    const blogData: Record<string, unknown> = {
      title,
      url,
      excerpt,
      content,
      category,
      imageUrl,
      status,
    };

    // Set publish date if status is published
    if (status === "published") {
      blogData.publishedAt = new Date();
    }

    const blog = new Blog(blogData);
    await blog.save();

    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}

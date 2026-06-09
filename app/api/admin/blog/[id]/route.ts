import { type NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import Blog from "@/lib/db/models/blog";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const { id } = await params;
    const blog = await Blog.findById(id);

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    const { title, url, excerpt, content, category, imageUrl, status, publishedAt } = body;

    const updateData: Record<string, unknown> = {
      title,
      url,
      excerpt,
      content,
      category,
      imageUrl,
      status,
      updatedAt: new Date(),
    };

    if (status === "published") {
      updateData.publishedAt = publishedAt ? new Date(publishedAt) : new Date();
    } else if (status === "draft") {
      updateData.publishedAt = null;
    }

    const { id } = await params;
    const blog = await Blog.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const { id } = await params;
    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
  }
}

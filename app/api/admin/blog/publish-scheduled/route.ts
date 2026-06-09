import { type NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import Blog from "@/lib/db/models/blog";
import { auth } from "@/lib/auth";

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

    const now = new Date();
    const postsToPublish = await Blog.find({
      status: "scheduled",
      scheduledAt: { $lte: now },
    });

    if (postsToPublish.length === 0) {
      return NextResponse.json({ message: "No posts to publish", count: 0 });
    }

    const result = await Blog.updateMany(
      {
        status: "scheduled",
        scheduledAt: { $lte: now },
      },
      {
        $set: {
          status: "published",
          publishedAt: now,
        },
        $unset: {
          scheduledAt: 1,
        },
      }
    );

    return NextResponse.json({
      message: `Published ${result.modifiedCount} scheduled posts`,
      count: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error publishing scheduled posts:", error);
    return NextResponse.json(
      { error: "Failed to publish scheduled posts" },
      { status: 500 }
    );
  }
}

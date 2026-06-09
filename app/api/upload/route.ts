import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to convert filename to URL-friendly format
function sanitizeFilename(filename: string): string {
  // Get filename without extension
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
  
  // Convert to URL-friendly format
  const sanitized = nameWithoutExt
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
  
  // Add timestamp to ensure uniqueness
  const timestamp = Date.now();
  
  return `${sanitized}-${timestamp}`;
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

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    // Generate sanitized filename (public_id for Cloudinary)
    const publicId = `blog/${sanitizeFilename(file.name)}`;
    
    // Convert file to buffer then to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64Data}`;
    
    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      public_id: publicId,
      folder: "uploads",
      resource_type: "image",
      overwrite: true,
      transformation: [
        { quality: "auto", fetch_format: "auto" }
      ]
    });
    
    return NextResponse.json({
      url: uploadResult.secure_url,
      filename: uploadResult.public_id,
      originalName: file.name,
      size: file.size,
      type: file.type,
      cloudinaryPublicId: uploadResult.public_id,
    });
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

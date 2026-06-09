import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import User from "@/lib/db/models/user";

// This endpoint creates an initial admin user if none exists
// Should only be used during initial setup
export async function POST(request: Request) {
  try {
    const { name, email, password, setupKey } = await request.json();

    // Simple setup key check - in production, use a more secure method
    // or remove this endpoint after initial setup
    if (setupKey !== process.env.AUTH_SECRET) {
      return NextResponse.json(
        { error: "Invalid setup key" },
        { status: 401 }
      );
    }

    await dbConnect();

    // Check if any admin user already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    
    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin user already exists" },
        { status: 400 }
      );
    }

    // Create the admin user
    const adminUser = await User.create({
      name,
      email,
      password,
      role: "admin",
    });

    return NextResponse.json({
      success: true,
      message: "Admin user created successfully",
      user: {
        id: adminUser._id.toString(),
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
      },
    });
  } catch (error) {
    console.error("Seed error:", error);
    
    if (error instanceof Error && error.message.includes("duplicate key")) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create admin user" },
      { status: 500 }
    );
  }
}

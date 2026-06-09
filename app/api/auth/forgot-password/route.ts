import { NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";
import dbConnect from "@/lib/db/mongodb";
import User from "@/lib/db/models/user";
import PasswordResetToken from "@/lib/db/models/password-reset-token";
import {
  getPasswordResetEmailHtml,
  getPasswordResetEmailText,
} from "@/components/email-templates/password-reset-email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findOne({ email: String(email).toLowerCase() });

    // Reveal "not found" explicitly (per admin-only requirement).
    // Only admin/editor accounts can receive a reset link.
    if (!user || (user.role !== "admin" && user.role !== "editor")) {
      return NextResponse.json(
        {
          error:
            "No admin or editor account exists with that email address.",
        },
        { status: 404 }
      );
    }

    // Invalidate any existing tokens for this user.
    await PasswordResetToken.deleteMany({ userId: user._id });

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await PasswordResetToken.create({
      userId: user._id,
      token,
      expiresAt,
    });

    const baseUrl =
      process.env.NEXTAUTH_URL ||
      process.env.SITE_URL ||
      "https://www.aamconsultants.org";
    const resetUrl = `${baseUrl}/admin/reset-password?token=${token}`;

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL;

    if (!RESEND_API_KEY || !RESEND_FROM_EMAIL) {
      console.error(
        "[v0] Resend not configured: RESEND_API_KEY or RESEND_FROM_EMAIL missing"
      );
      return NextResponse.json(
        { error: "Email service is not configured. Contact your administrator." },
        { status: 500 }
      );
    }

    const resend = new Resend(RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to: user.email,
      subject: "Reset Your Password - AAM Consultants Admin",
      html: getPasswordResetEmailHtml({ name: user.name, resetUrl }),
      text: getPasswordResetEmailText({ name: user.name, resetUrl }),
    });

    if (error) {
      console.error("[v0] Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send reset email. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "A password reset link has been sent. Please check your inbox and spam folder.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[v0] Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

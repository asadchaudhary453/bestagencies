import { NextResponse } from "next/server";
import { Resend } from "resend";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  try {
    const { RESEND_API_KEY, RESEND_FROM_EMAIL, ADMIN_EMAIL } = process.env;

    if (!RESEND_API_KEY || !RESEND_FROM_EMAIL || !ADMIN_EMAIL) {
      console.error("[contact] Missing RESEND_API_KEY, RESEND_FROM_EMAIL or ADMIN_EMAIL");
      return NextResponse.json(
        { error: "The contact form is not configured yet. Please try again later." },
        { status: 500 },
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const subject = String(body.subject ?? "").trim();
    const message = String(body.message ?? "").trim();

    if (name.length < 2 || name.length > 100) {
      return NextResponse.json({ error: "Please enter a valid name." }, { status: 400 });
    }
    if (!EMAIL_RE.test(email) || email.length > 254) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (subject.length < 3 || subject.length > 150) {
      return NextResponse.json(
        { error: "Please enter a subject (3\u2013150 characters)." },
        { status: 400 },
      );
    }
    if (message.length < 20 || message.length > 5000) {
      return NextResponse.json(
        { error: "Please enter a message (20\u20135000 characters)." },
        { status: 400 },
      );
    }

    const resend = new Resend(RESEND_API_KEY);

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");

    const { error } = await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to: ADMIN_EMAIL,
      replyTo: email,
      subject: `[Contact] ${subject}`,
      html: `
        <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
          <h2 style="border-bottom: 2px solid #e5e5e5; padding-bottom: 8px;">New contact form message</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 8px 12px 8px 0; font-weight: bold; white-space: nowrap; vertical-align: top;">Name</td>
              <td style="padding: 8px 0;">${safeName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px 8px 0; font-weight: bold; white-space: nowrap; vertical-align: top;">Email</td>
              <td style="padding: 8px 0;"><a href="mailto:${safeEmail}">${safeEmail}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 12px 8px 0; font-weight: bold; white-space: nowrap; vertical-align: top;">Subject</td>
              <td style="padding: 8px 0;">${safeSubject}</td>
            </tr>
          </table>
          <div style="margin-top: 16px; padding: 16px; background: #f7f7f7; border-radius: 8px; font-size: 14px; line-height: 1.6;">
            ${safeMessage}
          </div>
          <p style="margin-top: 16px; font-size: 12px; color: #888;">
            Sent from the Best Agencies contact form. Reply directly to respond to ${safeName}.
          </p>
        </div>
      `,
      text: `New contact form message\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
    });

    if (error) {
      console.error("[contact] Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send your message. Please try again later." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[contact] Unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 },
    );
  }
}

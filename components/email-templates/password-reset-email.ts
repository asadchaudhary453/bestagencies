interface PasswordResetEmailProps {
  name?: string | null;
  resetUrl: string;
}

const BRAND_NAME = "Best Agencies";
const BRAND_COLOR = "#3B82D6";

export function getPasswordResetEmailHtml({
  name,
  resetUrl,
}: PasswordResetEmailProps): string {
  const greeting = name ? `Hi ${escapeHtml(name)},` : "Hi,";

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Reset your password</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f7f9fc;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7f9fc;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:#ffffff;border-radius:12px;border:1px solid #e2e8f0;overflow:hidden;">
            <tr>
              <td style="padding:28px 32px;border-bottom:1px solid #e2e8f0;">
                <span style="font-size:18px;font-weight:bold;color:#1e1e1e;">${BRAND_NAME}</span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <h1 style="margin:0 0 16px;font-size:20px;color:#1e1e1e;">Reset your password</h1>
                <p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#475569;">${greeting}</p>
                <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#475569;">
                  We received a request to reset the password for your account.
                  Click the button below to choose a new password. This link
                  expires in 1 hour.
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
                  <tr>
                    <td style="border-radius:8px;background-color:${BRAND_COLOR};">
                      <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;font-size:15px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:8px;">
                        Reset password
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:#94a3b8;">
                  If the button does not work, copy and paste this link into your browser:
                </p>
                <p style="margin:0 0 24px;font-size:13px;line-height:1.6;word-break:break-all;">
                  <a href="${resetUrl}" style="color:${BRAND_COLOR};">${resetUrl}</a>
                </p>
                <p style="margin:0;font-size:13px;line-height:1.6;color:#94a3b8;">
                  If you did not request a password reset, you can safely ignore
                  this email. Your password will not be changed.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;border-top:1px solid #e2e8f0;">
                <p style="margin:0;font-size:12px;color:#94a3b8;">
                  &copy; ${new Date().getFullYear()} ${BRAND_NAME}. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function getPasswordResetEmailText({
  name,
  resetUrl,
}: PasswordResetEmailProps): string {
  const greeting = name ? `Hi ${name},` : "Hi,";

  return [
    greeting,
    "",
    `We received a request to reset the password for your ${BRAND_NAME} account.`,
    "Open the link below to choose a new password. This link expires in 1 hour.",
    "",
    resetUrl,
    "",
    "If you did not request a password reset, you can safely ignore this email.",
    "Your password will not be changed.",
    "",
    `— ${BRAND_NAME}`,
  ].join("\n");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

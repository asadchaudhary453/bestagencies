import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import type { UserRole } from "@/lib/auth.config";

export type AuthorizedUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

/**
 * Guards /api/admin/* routes. Returns either a Response to short-circuit the
 * handler, or the authenticated admin/editor user.
 *
 * Usage:
 *   const result = await requireRole(["admin", "editor"]);
 *   if (result instanceof NextResponse) return result;
 *   const user = result; // typed AuthorizedUser
 */
export async function requireRole(
  allowedRoles: UserRole[] = ["admin", "editor"]
): Promise<NextResponse | AuthorizedUser> {
  const session = await auth();
  const user = session?.user as AuthorizedUser | undefined;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!allowedRoles.includes(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return user;
}

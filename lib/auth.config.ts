import type { NextAuthConfig } from "next-auth";

// Define UserRole type here to avoid importing from mongoose model in Edge runtime
export type UserRole = "admin" | "editor";

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: UserRole;
    };
  }

  interface User {
    role: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole;
  }
}

// Public sub-routes under /admin that DO NOT require authentication.
const PUBLIC_ADMIN_PATHS = new Set<string>([
  "/admin/login",
  "/admin/reset-password",
]);

// This config is safe for Edge runtime (no database imports).
export const authConfig: NextAuthConfig = {
  trustHost: true,
  providers: [], // Providers are added in lib/auth.ts (Node runtime only).
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
    async authorized({ auth, request: { nextUrl } }) {
      const pathname = nextUrl.pathname;
      const isOnAdmin = pathname.startsWith("/admin");

      if (!isOnAdmin) return true;

      const isPublicAdminPath = PUBLIC_ADMIN_PATHS.has(pathname);
      const user = auth?.user;
      const isLoggedIn = !!user;
      const hasAdminRole = user?.role === "admin" || user?.role === "editor";

      // Public admin auth pages (login / reset-password)
      if (isPublicAdminPath) {
        // Already authenticated as admin/editor? Skip login screen.
        if (pathname === "/admin/login" && isLoggedIn && hasAdminRole) {
          return Response.redirect(new URL("/admin/blogs", nextUrl));
        }
        return true;
      }

      // Protected /admin/* routes: must be logged in AND have a privileged role.
      if (!isLoggedIn || !hasAdminRole) {
        const loginUrl = new URL("/admin/login", nextUrl);
        // Preserve intended destination so we can return users after login.
        if (pathname !== "/admin") {
          loginUrl.searchParams.set("callbackUrl", pathname);
        }
        return Response.redirect(loginUrl);
      }

      // Only admins can access the Users section.
      if (pathname.startsWith("/admin/users") && user.role !== "admin") {
        return Response.redirect(new URL("/admin/blogs", nextUrl));
      }

      return true;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // Refresh token every 24 hours
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.AUTH_SECRET,
};

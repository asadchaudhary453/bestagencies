import type React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blogs Management - Admin | Best Agencies",
  description:
    "Create, edit, and manage blog posts and content for the Best Agencies website.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminBlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

import type React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blogs Management - Admin | AAM Consultants",
  description:
    "Create, edit, and manage blog posts and content for the AAM Consultants website.",
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

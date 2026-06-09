import { Metadata } from "next";
import { LoginPageContent } from "@/components/admin/login-page-content";

export const metadata: Metadata = {
  title: "Admin Login | Best Agencies",
  description: "Sign in to access the Best Agencies admin panel",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginPage() {
  return <LoginPageContent />;
}

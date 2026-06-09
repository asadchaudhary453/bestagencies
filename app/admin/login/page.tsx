import { Metadata } from "next";
import { LoginPageContent } from "@/components/admin/login-page-content";

export const metadata: Metadata = {
  title: "Admin Login | AAM Consultants",
  description: "Sign in to access the AAM Consultants admin panel",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginPage() {
  return <LoginPageContent />;
}

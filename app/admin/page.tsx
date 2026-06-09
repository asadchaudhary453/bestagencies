import { redirect } from "next/navigation";

export const metadata = {
  robots: { index: false, follow: false },
};

// /admin always redirects to the blogs page.
// Unauthenticated users are caught first by the auth proxy and sent to /admin/login.
export default function AdminIndexPage() {
  redirect("/admin/blogs");
}

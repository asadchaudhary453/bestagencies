"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  FileText,
  Users,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#ecb41a]/30 border-t-[#ecb41a] rounded-full animate-spin" />
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const user = session.user as { id: string; name: string; email: string; role: string };

  const initials = (user.name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const isAdmin = user.role === "admin";

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/admin/login" });
  };

  const menuItems: Array<{
    icon: typeof FileText;
    label: string;
    href: string;
    external?: boolean;
  }> = [
    {
      icon: FileText,
      label: "Blog Posts",
      href: "/admin/blogs",
    },
    ...(isAdmin
      ? [
          {
            icon: Users,
            label: "Users",
            href: "/admin/users",
          },
        ]
      : []),
    {
      icon: ExternalLink,
      label: "Visit Site",
      href: "/",
      external: true,
    },
  ];

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-72 bg-[#1a1a1a] border-r border-white/10 z-50 transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
          <Link href="/admin/blogs" className="flex items-center gap-3">
            <Image
              src="/assets/images/logo.png"
              alt="AAM Consultants Admin"
              width={130}
              height={36}
              className="h-9 w-auto object-contain"
              priority
            />
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white/50 hover:text-white hover:bg-white/10"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                item.external
                  ? "text-white/50 hover:bg-white/5 hover:text-white"
                  : isActive(item.href)
                    ? "bg-gradient-to-r from-[#ecb41a]/20 to-transparent text-white border-l-2 border-[#ecb41a]"
                    : "text-white/50 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
              {!item.external && isActive(item.href) && <ChevronRight className="h-4 w-4 ml-auto" />}
              {item.external && <ExternalLink className="h-4 w-4 ml-auto" />}
            </Link>
          ))}
        </nav>

        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5">
            <Avatar className="h-10 w-10 border-2 border-[#ecb41a]/50">
              <AvatarFallback className="bg-gradient-to-br from-[#ecb41a] to-[#b8860b] text-[#0a0a0a] font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-white/50 truncate">{user.email}</p>
            </div>
            <Badge
              className={cn(
                "text-xs border",
                isAdmin
                  ? "bg-[#ecb41a]/20 text-[#ecb41a] border-[#ecb41a]/30"
                  : "bg-white/10 text-white/70 border-white/20"
              )}
            >
              {user.role}
            </Badge>
          </div>
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="w-full mt-2 justify-start text-white/50 hover:text-red-400 hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4 mr-3" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white/50 hover:text-white hover:bg-white/10"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-white">
                {menuItems.find((item) => isActive(item.href))?.label || "Admin"}
              </h1>
              <p className="text-sm text-white/40 hidden sm:block">
                Welcome back, {user.name?.split(" ")[0]}
              </p>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

"use client";

import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { LoginForm } from "@/components/admin/login-form";

export function LoginPageContent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background overflow-hidden relative p-4">
      {/* Ambient brand glow */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(30,30,30,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(30,30,30,0.6) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Back link */}
      <Link
        href="/"
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors z-20"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to website
      </Link>

      {/* Login card */}
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/best-agencies-logo.png"
            alt="Best Agencies"
            width={182}
            height={52}
            className="h-[52px] w-auto object-contain"
            style={{ width: "auto", height: "52px" }}
            priority
          />
        </div>

        {/* Glass card */}
        <div className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border p-8 shadow-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground">Admin Sign In</h1>
            <p className="text-muted-foreground mt-2">Enter your credentials to continue</p>
          </div>

          {/* Login form (uses useSearchParams, must be wrapped in Suspense) */}
          <Suspense
            fallback={
              <div className="h-48 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            }
          >
            <LoginForm />
          </Suspense>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          &copy; {new Date().getFullYear()} Best Agencies. All rights reserved.
        </p>
      </div>
    </div>
  );
}

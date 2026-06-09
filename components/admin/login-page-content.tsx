"use client";

import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { LoginForm } from "@/components/admin/login-form";

// Pre-defined particle positions
const particles = [
  { left: 15, top: 20, delay: 0, size: 3 },
  { left: 85, top: 15, delay: 1.5, size: 4 },
  { left: 25, top: 75, delay: 2, size: 3 },
  { left: 70, top: 80, delay: 0.5, size: 5 },
  { left: 45, top: 30, delay: 3, size: 4 },
  { left: 90, top: 50, delay: 1, size: 3 },
  { left: 10, top: 60, delay: 2.5, size: 5 },
  { left: 55, top: 10, delay: 0.8, size: 4 },
];

export function LoginPageContent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] overflow-hidden relative p-4">
      {/* Ambient gold glow */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#ecb41a]/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#ecb41a]/5 rounded-full blur-[100px] animate-pulse [animation-delay:1s]" />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0a0a0a_70%)]" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#ecb41a]/40 animate-float"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Back link */}
      <Link
        href="/"
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors z-20"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to website
      </Link>

      {/* Login card */}
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/assets/images/logo.png"
            alt="AAM Consultants"
            width={182}
            height={52}
            className="h-[52px] w-auto object-contain"
            priority
          />
        </div>

        {/* Glass card */}
        <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white">Admin Sign In</h1>
            <p className="text-white/50 mt-2">Enter your credentials to continue</p>
          </div>

          {/* Login form (uses useSearchParams, must be wrapped in Suspense) */}
          <Suspense
            fallback={
              <div className="h-48 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#ecb41a]/30 border-t-[#ecb41a] rounded-full animate-spin" />
              </div>
            }
          >
            <LoginForm />
          </Suspense>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-white/30 mt-6">
          &copy; {new Date().getFullYear()} AAM Consultants. All rights reserved.
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Eye, EyeOff, Mail, Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // If the proxy redirected an unauthenticated user here, honor ?callbackUrl=.
  const callbackUrl = searchParams.get("callbackUrl") || "/admin/blogs";

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
  const [forgotPasswordError, setForgotPasswordError] = useState<string | null>(
    null
  );

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const forgotPasswordForm = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function onForgotPasswordSubmit(data: ForgotPasswordValues) {
    setForgotPasswordLoading(true);
    setForgotPasswordError(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      const json = (await res.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!res.ok) {
        setForgotPasswordError(
          json.error ||
            "Unable to send reset link. Please try again in a moment."
        );
        return;
      }

      setForgotPasswordSuccess(true);
    } catch {
      setForgotPasswordError(
        "Network error. Please check your connection and try again."
      );
    } finally {
      setForgotPasswordLoading(false);
    }
  }

  const handleForgotPasswordClose = () => {
    setForgotPasswordOpen(false);
    setForgotPasswordSuccess(false);
    setForgotPasswordError(null);
    forgotPasswordForm.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 animate-in fade-in slide-in-from-top-2 duration-300">
            <p className="text-destructive text-sm text-center">{error}</p>
          </div>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground font-medium">Email Address</FormLabel>
              <FormControl>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={isLoading}
                    className="pl-12 bg-muted border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 h-12 rounded-xl transition-all"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage className="text-destructive" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel className="text-muted-foreground font-medium">Password</FormLabel>
                <Dialog
                  open={forgotPasswordOpen}
                  onOpenChange={(open) => {
                    if (!open) handleForgotPasswordClose();
                    else setForgotPasswordOpen(true);
                  }}
                >
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="text-sm text-primary hover:text-primary transition-colors font-medium"
                    >
                      Forgot password?
                    </button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-border text-foreground sm:max-w-md">
                    {forgotPasswordSuccess ? (
                      <div className="py-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                          <CheckCircle2 className="w-8 h-8 text-primary" />
                        </div>
                        <DialogHeader>
                          <DialogTitle className="text-xl text-foreground text-center">
                            Check Your Email
                          </DialogTitle>
                          <DialogDescription className="text-muted-foreground text-center mt-2">
                            {
                              "A password reset link has been sent. Please check your inbox and spam folder."
                            }
                          </DialogDescription>
                        </DialogHeader>
                        <Button
                          onClick={handleForgotPasswordClose}
                          className="mt-6 bg-muted hover:bg-muted text-foreground"
                        >
                          Close
                        </Button>
                      </div>
                    ) : (
                      <>
                        <DialogHeader>
                          <DialogTitle className="text-xl text-foreground">Reset Password</DialogTitle>
                          <DialogDescription className="text-muted-foreground">
                            {"Enter your email address and we'll send you a link to reset your password."}
                          </DialogDescription>
                        </DialogHeader>
                        <Form {...forgotPasswordForm}>
                          <form
                            onSubmit={forgotPasswordForm.handleSubmit(onForgotPasswordSubmit)}
                            className="space-y-4 mt-4"
                          >
                            {forgotPasswordError && (
                              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                                <p className="text-destructive text-sm text-center">
                                  {forgotPasswordError}
                                </p>
                              </div>
                            )}
                            <FormField
                              control={forgotPasswordForm.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-muted-foreground">Email Address</FormLabel>
                                  <FormControl>
                                    <div className="relative group">
                                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                      <Input
                                        type="email"
                                        placeholder="Enter your email"
                                        disabled={forgotPasswordLoading}
                                        className="pl-12 bg-muted border-border text-foreground placeholder:text-muted-foreground focus:border-primary h-12 rounded-xl"
                                        {...field}
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage className="text-destructive" />
                                </FormItem>
                              )}
                            />
                            <Button
                              type="submit"
                              disabled={forgotPasswordLoading}
                              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl"
                            >
                              {forgotPasswordLoading ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Sending...
                                </>
                              ) : (
                                <>
                                  Send Reset Link
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                              )}
                            </Button>
                          </form>
                        </Form>
                      </>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
              <FormControl>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={isLoading}
                    className="pl-12 pr-12 bg-muted border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 h-12 rounded-xl transition-all"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-4 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-muted-foreground hover:text-muted-foreground transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-muted-foreground hover:text-muted-foreground transition-colors" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
              </FormControl>
              <FormMessage className="text-destructive" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className={cn(
            "w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/25 transition-all duration-300 group",
            isLoading && "opacity-80"
          )}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}

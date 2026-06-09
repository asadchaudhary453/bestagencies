import { cn } from "@/lib/utils";

interface PageLoaderProps {
  variant?: "default" | "branded";
  message?: string;
  className?: string;
}

export function PageLoader({
  variant = "default",
  message = "Loading...",
  className,
}: PageLoaderProps) {
  return (
    <div
      className={cn(
        "min-h-screen bg-background flex flex-col items-center justify-center gap-4",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div
        className={cn(
          "h-10 w-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin"
        )}
        aria-hidden="true"
      />
      {variant === "branded" ? (
        <p className="text-sm text-muted-foreground">{message}</p>
      ) : (
        <span className="sr-only">{message}</span>
      )}
    </div>
  );
}

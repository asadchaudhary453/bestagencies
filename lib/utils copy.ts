import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to handle image URLs - returns the URL as-is since we're not using Cloudinary
export function replaceCloudinaryURL(url: string | undefined | null): string {
  if (!url) return "";
  return url;
}

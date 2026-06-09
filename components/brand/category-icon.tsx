import {
  TrendingUp,
  Briefcase,
  Code2,
  Home,
  HeartPulse,
  Building2,
  Wrench,
  ShoppingBag,
  GraduationCap,
  Shirt,
  UtensilsCrossed,
  PenTool,
  Sparkles,
  Newspaper,
  Dumbbell,
  Plane,
  PenLine,
  LayoutGrid,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const icons: Record<string, LucideIcon> = {
  TrendingUp,
  Briefcase,
  Code2,
  Home,
  HeartPulse,
  Building2,
  Wrench,
  ShoppingBag,
  GraduationCap,
  Shirt,
  UtensilsCrossed,
  PenTool,
  Sparkles,
  Newspaper,
  Dumbbell,
  Plane,
  PenLine,
  LayoutGrid,
}

export function CategoryIcon({
  name,
  className,
}: {
  name: string
  className?: string
}) {
  const Icon = icons[name] ?? LayoutGrid
  return <Icon className={cn('h-5 w-5', className)} aria-hidden="true" />
}

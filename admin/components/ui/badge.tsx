import * as React from "react"
import { cn } from "../../lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'destructive';
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary",
        {
          "border-transparent bg-brand-primary text-white": variant === "default",
          "border-transparent bg-muted text-muted-foreground": variant === "secondary",
          "border-transparent bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400": variant === "success",
          "border-transparent bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400": variant === "warning",
          "border-transparent bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400": variant === "destructive",
          "text-foreground border-border": variant === "outline",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }

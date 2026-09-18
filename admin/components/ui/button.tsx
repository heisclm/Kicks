import * as React from "react"
import { cn } from "../../lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:pointer-events-none disabled:opacity-50",
          {
            'bg-brand-primary text-white hover:bg-brand-primary-hover shadow-subtle': variant === 'default',
            'border border-border bg-transparent hover:bg-muted text-foreground': variant === 'outline',
            'hover:bg-muted hover:text-foreground text-muted-foreground': variant === 'ghost',
            'bg-muted text-foreground hover:bg-muted/80': variant === 'secondary',
            'bg-rose-500 text-white hover:bg-rose-600 shadow-subtle': variant === 'destructive',
            
            'h-9 px-4 py-2': size === 'default',
            'h-8 px-3 text-xs': size === 'sm',
            'h-10 px-8': size === 'lg',
            'h-9 w-9': size === 'icon',
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }

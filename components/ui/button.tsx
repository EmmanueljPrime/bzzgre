import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

    const variants = {
      default: "party-button text-primary-foreground border-2 border-primary/60",
      secondary: "bg-secondary/80 text-secondary-foreground hover:bg-secondary shadow-lg border-2 border-secondary/60",
      outline: "border-2 border-primary/50 bg-card/50 backdrop-blur-sm hover:bg-primary/10 hover:border-primary shadow-lg",
      ghost: "hover:bg-accent/20 hover:text-accent-foreground border-2 border-transparent hover:border-accent/30",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg border-2 border-destructive/60",
    }

    const sizes = {
      default: "h-11 px-6 py-2 text-base",
      sm: "h-9 px-3 text-sm",
      lg: "h-12 px-8 text-lg",
      icon: "h-10 w-10",
    }

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Base styles to enforce consistent spacing, focus ring, and transitions
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 focus:outline-none focus:ring-2 focus:ring-brand-blue",
  {
    variants: {
      variant: {
        // Primary button - Brand Orange (#F28C38)
        default: "px-4 py-2 bg-brand-orange text-white rounded-lg hover:opacity-90 transition-opacity",
        // Destructive keeps semantic color tokens
        destructive: "px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity",
        // Outline button - Brand Blue (#005B99) with 2px border
        outline: "px-4 py-2 border-2 border-brand-blue text-brand-blue rounded-lg hover:bg-brand-blue/10 transition-colors",
        secondary: "px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-opacity",
        ghost: "px-4 py-2 hover:bg-accent hover:text-accent-foreground rounded-lg",
        link: "text-brand-blue underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 has-[>svg]:px-3",
        sm: "h-8 rounded-lg gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-lg px-6 has-[>svg]:px-4",
        icon: "size-9 rounded-lg",
        "icon-sm": "size-8 rounded-lg",
        "icon-lg": "size-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

import { type ButtonHTMLAttributes, forwardRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const buttonVariants = tv({
  base: "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-green disabled:pointer-events-none disabled:opacity-50 font-mono",
  variants: {
    variant: {
      default: "bg-accent-green text-bg-page hover:bg-accent-green/80",
      secondary:
        "bg-border-primary text-text-primary hover:bg-border-secondary",
      outline:
        "border border-border-primary bg-transparent hover:bg-bg-elevated text-text-primary",
      ghost: "hover:bg-bg-elevated text-text-primary",
      destructive: "bg-accent-red text-bg-page hover:bg-accent-red/80",
    },
    size: {
      default: "px-6 py-2.5",
      sm: "px-3 py-1.5 text-xs",
      lg: "px-8 py-3 text-base",
      icon: "p-2.5",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, ...props }, ref) => {
    return (
      <button
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };

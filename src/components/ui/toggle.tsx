import * as TogglePrimitive from "@radix-ui/react-toggle";
import { forwardRef, type ReactNode } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const toggleVariants = tv({
  base: "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium font-mono transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent-green data-[state=on]:text-bg-page",
  variants: {
    variant: {
      default: "bg-transparent hover:bg-bg-elevated text-text-primary",
      outline:
        "border border-border-primary bg-transparent hover:bg-bg-elevated text-text-primary",
    },
    size: {
      default: "px-4 py-2",
      sm: "px-3 py-1.5 text-xs",
      lg: "px-6 py-3 text-base",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface ToggleProps
  extends React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>,
    VariantProps<typeof toggleVariants> {
  children?: ReactNode;
}

const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <TogglePrimitive.Root
        ref={ref}
        className={toggleVariants({ variant, size, className })}
        {...props}
      >
        {children}
      </TogglePrimitive.Root>
    );
  },
);

Toggle.displayName = "Toggle";

export { Toggle, toggleVariants };

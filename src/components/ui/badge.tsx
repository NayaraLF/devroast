import { forwardRef, type HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import { tv, type VariantProps } from "tailwind-variants";

const badgeVariants = tv({
  base: "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium",
  variants: {
    variant: {
      critical: "bg-accent-red/20 text-accent-red",
      warning: "bg-accent-amber/20 text-accent-amber",
      good: "bg-accent-green/20 text-accent-green",
    },
  },
  defaultVariants: {
    variant: "good",
  },
});

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, dot = true, children, ...props }, ref) => {
    return (
      <div
        className={badgeVariants({ variant, className })}
        ref={ref}
        {...props}
      >
        {dot && (
          <span
            className={twMerge(
              "h-2 w-2 rounded-full",
              variant === "critical"
                ? "bg-accent-red"
                : variant === "warning"
                  ? "bg-accent-amber"
                  : "bg-accent-green",
            )}
          />
        )}
        {children}
      </div>
    );
  },
);

Badge.displayName = "Badge";

export { Badge, badgeVariants };

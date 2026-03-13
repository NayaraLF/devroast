import { forwardRef, type HTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const separatorVariants = tv({
  base: "bg-border-primary",
  variants: {
    orientation: {
      horizontal: "h-[1px] w-full",
      vertical: "h-full w-[1px]",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

export interface SeparatorProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof separatorVariants> {}

const Separator = forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, orientation, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={separatorVariants({ orientation, className })}
        {...props}
      />
    );
  },
);

Separator.displayName = "Separator";

export { Separator, separatorVariants };

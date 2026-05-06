import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full font-medium",
  {
    variants: {
      variant: {
        ok: "border border-status-ok-border bg-status-ok-bg text-status-ok-fg",
        warn: "border border-status-warn-border bg-status-warn-bg text-status-warn-fg",
        error:
          "border border-status-error-border bg-status-error-bg text-status-error-fg",
        unknown:
          "border border-status-unknown-border bg-status-unknown-bg text-status-unknown-fg",
        critical:
          "bg-severity-critical-bg text-severity-critical-fg ring-1 ring-severity-critical-fg/30",
        warning:
          "bg-severity-warning-bg text-severity-warning-fg ring-1 ring-severity-warning-fg/30",
        info:
          "bg-severity-info-bg text-severity-info-fg ring-1 ring-severity-info-fg/20",
        default: "bg-bg-elevated text-fg-muted",
        outline: "border border-border-default bg-transparent text-fg-muted",
      },
      size: {
        default: "px-2 py-0.5 text-xs",
        sm: "px-1.5 py-px text-[10px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);

Badge.displayName = "Badge";

export { Badge, badgeVariants };

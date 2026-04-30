import * as React from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

export interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  onDismiss?: () => void;
  variant?: "default" | "active";
}

const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
  (
    { label, onDismiss, variant = "default", className, children, ...props },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        role={onDismiss ? "group" : undefined}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
          variant === "default" &&
            "border border-border-default bg-bg-elevated text-fg-muted",
          variant === "active" &&
            "border border-interactive-accent bg-interactive-accent/10 text-interactive-accent",
          className,
        )}
        {...props}
      >
        <span>{label}</span>
        {children}
        {onDismiss ? (
          <button
            type="button"
            onClick={onDismiss}
            className="inline-flex shrink-0 rounded-full p-0.5 text-current opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-1"
            aria-label={`${label} 제거`}
          >
            <X className="h-3 w-3" aria-hidden />
          </button>
        ) : null}
      </div>
    );
  },
);

Chip.displayName = "Chip";

export { Chip };

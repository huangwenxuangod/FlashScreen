import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated";
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default:
        "bg-[var(--bg-tertiary)] border border-[var(--border-default)] rounded-[var(--radius-md)]",
      elevated:
        "bg-[var(--bg-elevated)] border border-[var(--border-hover)] rounded-[var(--radius-md)] shadow-[var(--shadow-md)]",
    };

    return (
      <div ref={ref} className={cn(variants[variant], className)} {...props} />
    );
  }
);

Card.displayName = "Card";

export { Card };


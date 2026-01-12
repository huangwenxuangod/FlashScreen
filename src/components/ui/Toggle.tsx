import { forwardRef, type ButtonHTMLAttributes } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils";

export interface ToggleProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  size?: "sm" | "md";
}

const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, checked = false, onChange, size = "md", disabled, ...props }, ref) => {
    const sizes = {
      sm: {
        track: "w-8 h-5",
        thumb: "w-3.5 h-3.5",
        translate: checked ? "translateX(14px)" : "translateX(2px)",
      },
      md: {
        track: "w-11 h-6",
        thumb: "w-4 h-4",
        translate: checked ? "translateX(22px)" : "translateX(3px)",
      },
    };

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        className={cn(
          "relative inline-flex shrink-0 cursor-pointer rounded-full transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-blue)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          checked ? "bg-[var(--accent-blue)]" : "bg-[var(--bg-elevated)]",
          sizes[size].track,
          className
        )}
        onClick={() => onChange?.(!checked)}
        {...props}
      >
        <motion.span
          className={cn(
            "pointer-events-none rounded-full bg-white shadow-sm",
            sizes[size].thumb
          )}
          animate={{
            x: checked ? (size === "sm" ? 14 : 22) : (size === "sm" ? 2 : 3),
            y: size === "sm" ? 3 : 4,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </button>
    );
  }
);

Toggle.displayName = "Toggle";

export { Toggle };


import { motion } from "framer-motion";
import { Monitor, AppWindow, Scan } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/utils";
import { useRecordingStore } from "@/stores";
import type { RecordingMode } from "@/types";

const modes: { id: RecordingMode; icon: typeof Monitor }[] = [
  { id: "fullscreen", icon: Monitor },
  { id: "window", icon: AppWindow },
  { id: "region", icon: Scan },
];

export function ModeSelector() {
  const { t } = useTranslation();
  const { mode, setMode, status } = useRecordingStore();

  const isDisabled = status !== "idle";

  return (
    <div className="flex items-center justify-center gap-2">
      {modes.map(({ id, icon: Icon }) => (
        <motion.button
          key={id}
          className={cn(
            "flex flex-col items-center gap-1.5 px-4 py-3 rounded-[var(--radius-md)]",
            "transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-blue)]",
            mode === id
              ? "bg-[var(--bg-elevated)] border border-[var(--border-hover)]"
              : "bg-transparent border border-transparent hover:bg-[var(--bg-tertiary)]",
            isDisabled && "opacity-50 cursor-not-allowed"
          )}
          onClick={() => !isDisabled && setMode(id)}
          whileHover={!isDisabled ? { scale: 1.02 } : undefined}
          whileTap={!isDisabled ? { scale: 0.98 } : undefined}
          disabled={isDisabled}
        >
          <Icon
            className={cn(
              "w-5 h-5",
              mode === id
                ? "text-[var(--text-primary)]"
                : "text-[var(--text-secondary)]"
            )}
          />
          <span
            className={cn(
              "text-xs",
              mode === id
                ? "text-[var(--text-primary)]"
                : "text-[var(--text-secondary)]"
            )}
          >
            {t(`mode.${id}`)}
          </span>
        </motion.button>
      ))}
    </div>
  );
}


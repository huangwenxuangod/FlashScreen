import { Mic, Volume2, Camera } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { cn } from "@/utils";
import { useRecordingStore } from "@/stores";
import { Tooltip } from "@/components/ui";
import type { RecordingSources } from "@/types";

const sources: {
  id: keyof RecordingSources;
  icon: typeof Mic;
  hotkey?: string;
}[] = [
  { id: "microphone", icon: Mic },
  { id: "systemAudio", icon: Volume2 },
  { id: "camera", icon: Camera, hotkey: "F4" },
];

export function SourceToggle() {
  const { t } = useTranslation();
  const { sources: activeSources, toggleSource, status } = useRecordingStore();

  const isDisabled = status !== "idle";

  return (
    <div className="flex items-center justify-center gap-3 p-3 bg-[var(--bg-secondary)] rounded-[var(--radius-md)]">
      {sources.map(({ id, icon: Icon, hotkey }) => {
        const isActive = activeSources[id];
        const label = t(`source.${id}`);

        return (
          <Tooltip
            key={id}
            content={`${label}${hotkey ? ` (${hotkey})` : ""}`}
            side="bottom"
          >
            <motion.button
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-[var(--radius-sm)]",
                "transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-blue)]",
                isActive
                  ? "bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                  : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]",
                isDisabled && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => !isDisabled && toggleSource(id)}
              whileHover={!isDisabled ? { scale: 1.02 } : undefined}
              whileTap={!isDisabled ? { scale: 0.98 } : undefined}
              disabled={isDisabled}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm">{label}</span>
              {isActive && (
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)]"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          </Tooltip>
        );
      })}
    </div>
  );
}


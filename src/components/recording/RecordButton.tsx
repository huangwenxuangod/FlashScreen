import { motion } from "framer-motion";
import { Circle, Square } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/utils";
import { useRecordingStore } from "@/stores";
import { Tooltip } from "@/components/ui";

export function RecordButton() {
  const { t } = useTranslation();
  const { status } = useRecordingStore();

  const isRecording = status === "recording" || status === "paused";
  const isIdle = status === "idle";

  const handleClick = () => {
    // TODO: Implement recording logic via Tauri commands
    console.log("Record button clicked, current status:", status);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Tooltip
        content={
          isRecording
            ? `${t("recording.stop")} (F1)`
            : `${t("recording.start")} (F1)`
        }
        side="bottom"
      >
        <motion.button
          className={cn(
            "relative w-16 h-16 rounded-full flex items-center justify-center",
            "transition-colors duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]",
            isRecording
              ? "bg-[var(--accent-red)]"
              : "bg-[var(--bg-tertiary)] hover:bg-[var(--bg-elevated)] border border-[var(--border-default)] hover:border-[var(--border-hover)]"
          )}
          onClick={handleClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {/* Recording pulse animation */}
          {isRecording && (
            <motion.div
              className="absolute inset-0 rounded-full bg-[var(--accent-red)]"
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(255, 77, 77, 0.4)",
                  "0 0 0 12px rgba(255, 77, 77, 0)",
                ],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          )}

          {/* Icon */}
          {isRecording ? (
            <Square className="w-6 h-6 text-white fill-white relative z-10" />
          ) : (
            <Circle className="w-6 h-6 text-[var(--accent-red)] fill-[var(--accent-red)] relative z-10" />
          )}
        </motion.button>
      </Tooltip>

      {/* Status text */}
      <div className="text-center">
        <p className="text-sm text-[var(--text-secondary)]">
          {isIdle && t("recording.start")}
          {status === "recording" && t("recording.recording")}
          {status === "paused" && t("recording.paused")}
          {status === "encoding" && t("recording.encoding")}
        </p>
        <p className="text-xs text-[var(--text-tertiary)] mt-1">F1</p>
      </div>
    </div>
  );
}


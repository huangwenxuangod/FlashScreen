import { motion } from "framer-motion";
import { Circle, Square, Pause, Play, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/utils";
import { useRecordingStore } from "@/stores";

export function RecordingControls() {
  const { t } = useTranslation();
  const { status, mode, sources } = useRecordingStore();

  const isIdle = status === "idle";
  const isRecording = status === "recording";
  const isPaused = status === "paused";
  const isEncoding = status === "encoding";

  const handleStartRecording = async () => {
    // TODO: Implement actual recording start via Tauri command
    console.log("Starting recording", { mode, sources });
    useRecordingStore.getState().setStatus("recording");
  };

  const handleStopRecording = async () => {
    // TODO: Implement actual recording stop via Tauri command
    console.log("Stopping recording");
    useRecordingStore.getState().setStatus("idle");
  };

  const handlePauseResume = async () => {
    if (isRecording) {
      console.log("Pausing recording");
      useRecordingStore.getState().setStatus("paused");
    } else if (isPaused) {
      console.log("Resuming recording");
      useRecordingStore.getState().setStatus("recording");
    }
  };

  const handleCancel = async () => {
    // TODO: Implement actual recording cancel via Tauri command
    console.log("Cancelling recording");
    useRecordingStore.getState().setStatus("idle");
  };

  return (
    <div className="flex items-center justify-center gap-4 py-4">
      {/* Main Record/Stop Button */}
      <motion.button
        className={cn(
          "relative w-20 h-20 rounded-full flex items-center justify-center",
          "transition-all duration-300",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]",
          isIdle
            ? "bg-[var(--accent-record)] hover:bg-[var(--accent-record-hover)] focus-visible:ring-[var(--accent-record)]"
            : "bg-[var(--bg-elevated)] border-2 border-[var(--accent-record)] focus-visible:ring-[var(--accent-record)]",
          isEncoding && "opacity-50 cursor-not-allowed"
        )}
        onClick={isIdle ? handleStartRecording : handleStopRecording}
        disabled={isEncoding}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {/* Glow Effect when recording */}
        {isRecording && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ boxShadow: "0 0 40px var(--accent-record-glow)" }}
            animate={{
              boxShadow: [
                "0 0 20px var(--accent-record-glow)",
                "0 0 50px var(--accent-record-glow)",
                "0 0 20px var(--accent-record-glow)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        {/* Icon */}
        {isIdle ? (
          <Circle className="w-8 h-8 text-white fill-white" />
        ) : (
          <Square className="w-6 h-6 text-[var(--accent-record)] fill-[var(--accent-record)]" />
        )}
      </motion.button>

      {/* Secondary Controls (visible when recording) */}
      {(isRecording || isPaused) && (
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {/* Pause/Resume Button */}
          <ControlButton
            icon={isPaused ? Play : Pause}
            onClick={handlePauseResume}
            tooltip={isPaused ? t("recording.resume") : t("recording.pause")}
            hotkey="F2"
            variant={isPaused ? "warning" : "default"}
          />

          {/* Cancel Button */}
          <ControlButton
            icon={X}
            onClick={handleCancel}
            tooltip={t("recording.cancel")}
            hotkey="F3"
            variant="danger"
          />
        </motion.div>
      )}

      {/* Encoding Indicator */}
      {isEncoding && (
        <motion.div
          className="flex items-center gap-2 text-[var(--text-secondary)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-4 h-4 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
          <span className="text-[var(--text-sm)]">{t("recording.encoding")}</span>
        </motion.div>
      )}

      {/* Hotkey Hint (when idle) */}
      {isIdle && (
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <span className="hotkey">F1</span>
          <span className="text-[var(--text-xs)] text-[var(--text-quaternary)]">
            {t("hint.toRecord")}
          </span>
        </motion.div>
      )}
    </div>
  );
}

interface ControlButtonProps {
  icon: typeof Circle;
  onClick: () => void;
  tooltip: string;
  hotkey?: string;
  variant?: "default" | "warning" | "danger";
}

function ControlButton({ icon: Icon, onClick, tooltip, hotkey, variant = "default" }: ControlButtonProps) {
  const variants = {
    default: "hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
    warning: "hover:bg-[var(--accent-warning)]/10 text-[var(--accent-warning)]",
    danger: "hover:bg-[var(--accent-record)]/10 text-[var(--accent-record)]",
  };

  return (
    <motion.button
      className={cn(
        "relative w-12 h-12 rounded-full flex items-center justify-center",
        "bg-[var(--bg-elevated)] border border-[var(--border-default)]",
        "transition-colors duration-150",
        variants[variant]
      )}
      onClick={onClick}
      title={tooltip}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon className="w-5 h-5" />
      {hotkey && (
        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 hotkey text-[10px]">
          {hotkey}
        </span>
      )}
    </motion.button>
  );
}

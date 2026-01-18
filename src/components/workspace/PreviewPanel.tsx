import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Monitor, MonitorPlay, Maximize2, RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/utils";
import { useRecordingStore } from "@/stores";

export function PreviewPanel() {
  const { t } = useTranslation();
  const { status, mode, duration } = useRecordingStore();
  const [screenAspect, setScreenAspect] = useState(16 / 9);

  const isRecording = status === "recording";
  const isPaused = status === "paused";
  const isIdle = status === "idle";

  // Get screen aspect ratio
  useEffect(() => {
    const updateAspect = () => {
      setScreenAspect(window.screen.width / window.screen.height);
    };
    updateAspect();
    window.addEventListener("resize", updateAspect);
    return () => window.removeEventListener("resize", updateAspect);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Preview Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <MonitorPlay className="w-4 h-4 text-[var(--text-tertiary)]" />
          <span className="text-[var(--text-sm)] font-medium text-[var(--text-secondary)]">
            {t("preview.title")}
          </span>
          {(isRecording || isPaused) && (
            <span className={cn(
              "px-2 py-0.5 rounded-full text-[var(--text-xs)] font-medium",
              isRecording 
                ? "bg-[var(--accent-record)]/10 text-[var(--accent-record)]" 
                : "bg-[var(--accent-warning)]/10 text-[var(--accent-warning)]"
            )}>
              {isRecording ? "LIVE" : "PAUSED"}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <PreviewButton icon={Maximize2} tooltip={t("preview.fullscreen")} />
          <PreviewButton icon={RotateCcw} tooltip={t("preview.reset")} />
        </div>
      </div>

      {/* Preview Container */}
      <div className="flex-1 relative rounded-[var(--radius-xl)] overflow-hidden bg-[var(--bg-void)] border border-[var(--border-subtle)]">
        {/* Aspect Ratio Container */}
        <div 
          className="absolute inset-4 flex items-center justify-center"
        >
          <div 
            className="relative w-full h-full rounded-[var(--radius-lg)] overflow-hidden bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-elevated)]"
            style={{ 
              maxWidth: "100%",
              maxHeight: "100%",
              aspectRatio: screenAspect
            }}
          >
            {/* Screen Preview Content */}
            {isIdle ? (
              <IdlePreview mode={mode} />
            ) : (
              <RecordingPreview 
                isRecording={isRecording} 
                isPaused={isPaused} 
                duration={duration} 
              />
            )}

            {/* Recording Border Glow */}
            {isRecording && (
              <motion.div
                className="absolute inset-0 rounded-[var(--radius-lg)] pointer-events-none"
                style={{
                  boxShadow: "inset 0 0 0 3px var(--accent-record)",
                }}
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}
          </div>
        </div>

        {/* Recording Time Overlay */}
        {(isRecording || isPaused) && (
          <div className="absolute top-6 left-6 flex items-center gap-2">
            <motion.div
              className={cn(
                "w-3 h-3 rounded-full",
                isRecording ? "bg-[var(--accent-record)]" : "bg-[var(--accent-warning)]"
              )}
              animate={isRecording ? { scale: [1, 1.2, 1], opacity: [1, 0.7, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="recording-timer text-white text-shadow">
              {formatTime(duration)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function IdlePreview({ mode }: { mode: string }) {
  const { t } = useTranslation();

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
      {/* Monitor Icon with Glow */}
      <div className="relative">
        <Monitor className="w-20 h-20 text-[var(--text-quaternary)]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-8 rounded bg-[var(--bg-hover)] flex items-center justify-center mt-[-4px]">
            <div className="w-8 h-4 rounded-sm bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-primary)]/5" />
          </div>
        </div>
      </div>
      
      {/* Hint Text */}
      <div className="text-center">
        <p className="text-[var(--text-sm)] text-[var(--text-tertiary)]">
          {t("preview.ready")}
        </p>
        <p className="text-[var(--text-xs)] text-[var(--text-quaternary)] mt-1">
          {t("preview.hint", { mode: t(`mode.${mode}`) })}
        </p>
      </div>
    </div>
  );
}

function RecordingPreview({ 
  isRecording, 
  isPaused, 
  duration 
}: { 
  isRecording: boolean; 
  isPaused: boolean;
  duration: number;
}) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Simulated screen content - In real implementation, this would show actual screen capture */}
      <div className="relative w-full h-full bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
        {/* Fake desktop elements for preview */}
        <div className="absolute top-4 left-4 w-32 h-20 rounded-lg bg-white/5 border border-white/10" />
        <div className="absolute top-4 right-4 w-24 h-24 rounded-lg bg-white/5 border border-white/10" />
        <div className="absolute bottom-4 left-4 right-4 h-12 rounded-lg bg-white/5 border border-white/10" />
        
        {/* Recording indicator */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {isPaused ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent-warning)]/20 border border-[var(--accent-warning)]/30">
              <span className="text-[var(--accent-warning)] font-medium">PAUSED</span>
            </div>
          ) : (
            <motion.div
              className="w-4 h-4 rounded-full bg-[var(--accent-record)]"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function PreviewButton({ 
  icon: Icon, 
  tooltip, 
  onClick 
}: { 
  icon: typeof Monitor; 
  tooltip: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-md)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
      title={tooltip}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}

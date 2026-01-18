import { Chip } from "@heroui/react";
import { Circle, Pause, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRecordingStore } from "@/stores";
import { formatDuration } from "@/utils";

export function StatusBar() {
  const { t } = useTranslation();
  const { status, duration } = useRecordingStore();

  const isRecording = status === "recording";
  const isPaused = status === "paused";
  const isActive = isRecording || isPaused;

  return (
    <footer className="h-8 flex items-center justify-between px-4 bg-zinc-950 border-t border-zinc-800/50 shrink-0">
      {/* Left: Recording Status */}
      <div className="flex items-center gap-3">
        {isActive ? (
          <>
            <Chip
              size="sm"
              variant="flat"
              color={isRecording ? "danger" : "warning"}
              startContent={
                isRecording ? (
                  <Circle className="w-2 h-2 fill-current animate-pulse-dot" />
                ) : (
                  <Pause className="w-3 h-3" />
                )
              }
              className="h-5"
            >
              {isRecording ? t("status.recording") : t("status.paused")}
            </Chip>
            <div className="flex items-center gap-1.5 text-zinc-400">
              <Clock className="w-3 h-3" />
              <span className="font-mono-tabular text-xs">
                {formatDuration(duration)}
              </span>
            </div>
          </>
        ) : (
          <span className="text-xs text-zinc-500">{t("status.ready")}</span>
        )}
      </div>

      {/* Center: Hotkey Hints */}
      <div className="hidden md:flex items-center gap-4">
        <HotkeyHint hotkey="F1" label={t("hint.startStop")} />
        <HotkeyHint hotkey="F2" label={t("hint.pauseResume")} />
        <HotkeyHint hotkey="F3" label={t("hint.cancel")} />
      </div>

      {/* Right: Version */}
      <span className="text-[10px] text-zinc-600">v1.0.0</span>
    </footer>
  );
}

function HotkeyHint({ hotkey, label }: { hotkey: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <Chip size="sm" variant="flat" className="h-4 text-[10px] bg-zinc-800 text-zinc-500 px-1.5 min-w-0">
        {hotkey}
      </Chip>
      <span className="text-[10px] text-zinc-500">{label}</span>
    </div>
  );
}

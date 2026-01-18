import { Card, CardBody } from "@heroui/react";
import { Monitor } from "lucide-react";
import { useTranslation } from "react-i18next";
import { RecordButton } from "./RecordButton";
import { useRecordingStore } from "@/stores";

export function RecordingView() {
  const { t } = useTranslation();
  const { status, mode, duration } = useRecordingStore();

  const isRecording = status === "recording";
  const isPaused = status === "paused";
  const isIdle = status === "idle";

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
    <div className="flex-1 flex flex-col p-6 gap-6">
      {/* Preview Area */}
      <Card className="flex-1 bg-black border border-zinc-800">
        <CardBody className="p-0 overflow-hidden">
          <div className="h-full flex flex-col">
            {/* Preview Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-zinc-500" />
                <span className="text-sm text-zinc-400">{t("preview.title")}</span>
                {(isRecording || isPaused) && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-semibold rounded ${
                      isRecording
                        ? "bg-danger/20 text-danger"
                        : "bg-warning/20 text-warning"
                    }`}
                  >
                    {isRecording ? "LIVE" : "PAUSED"}
                  </span>
                )}
              </div>
              {(isRecording || isPaused) && (
                <span className="font-mono-tabular text-sm text-white">
                  {formatTime(duration)}
                </span>
              )}
            </div>

            {/* Preview Content */}
            <div className="flex-1 flex items-center justify-center relative">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black" />

              {/* Preview content */}
              <div className="relative z-10 flex flex-col items-center gap-4">
                {isIdle ? (
                  <>
                    <div className="w-24 h-24 rounded-2xl bg-zinc-800/50 flex items-center justify-center">
                      <Monitor className="w-12 h-12 text-zinc-600" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-zinc-400">{t("preview.ready")}</p>
                      <p className="text-xs text-zinc-600 mt-1">
                        {t("preview.hint", { mode: t(`mode.${mode}`) })}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    {isRecording ? (
                      <div className="w-6 h-6 rounded-full bg-danger animate-pulse-record" />
                    ) : (
                      <div className="px-4 py-2 rounded-lg bg-warning/10 border border-warning/20">
                        <span className="text-warning text-sm font-medium">
                          {t("recording.paused")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Recording border */}
              {isRecording && (
                <div className="absolute inset-0 border-2 border-danger/50 animate-pulse pointer-events-none" />
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Recording Controls */}
      <div className="flex items-center justify-center">
        <RecordButton />
      </div>
    </div>
  );
}

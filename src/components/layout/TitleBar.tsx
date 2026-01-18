import { getCurrentWindow } from "@tauri-apps/api/window";
import { Minus, Square, X } from "lucide-react";
import { useRecordingStore } from "@/stores";

export function TitleBar() {
  const appWindow = getCurrentWindow();
  const { status } = useRecordingStore();
  const isRecording = status === "recording" || status === "paused";

  return (
    <header
      data-tauri-drag-region
      className="h-10 flex items-center justify-between px-4 bg-black/80 backdrop-blur-sm border-b border-white/5 shrink-0"
    >
      {/* Left: Logo */}
      <div className="flex items-center gap-2.5" data-tauri-drag-region>
        <div
          className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
            isRecording
              ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse"
              : "bg-white/20"
          }`}
        />
        <span className="text-[13px] font-medium text-white/90 tracking-tight">
          FlashScreen
        </span>
        {isRecording && (
          <span className="px-1.5 py-0.5 text-[9px] font-semibold bg-red-500/20 text-red-400 rounded tracking-wider">
            REC
          </span>
        )}
      </div>

      {/* Right: Window Controls */}
      <div className="flex items-center">
        <button
          onClick={() => appWindow.minimize()}
          className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/5 rounded transition-colors"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => appWindow.toggleMaximize()}
          className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/5 rounded transition-colors"
        >
          <Square className="w-3 h-3" />
        </button>
        <button
          onClick={() => appWindow.close()}
          className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white hover:bg-red-500/80 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}

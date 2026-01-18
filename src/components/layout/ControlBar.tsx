import { useState } from "react";
import { Monitor, AppWindow, Scan, Mic, MicOff, Volume2, VolumeX, Video, VideoOff, Circle, Square, Pause, Play, Settings, Loader2 } from "lucide-react";
import { useRecordingStore, useUIStore } from "@/stores";
import { startRecording, stopRecording, pauseRecording, resumeRecording, cancelRecording } from "@/services/recording";
import type { RecordingMode, RecordingSources } from "@/types";

export function ControlBar() {
  const { status, mode, setMode, sources, toggleSource, region, windowId, setStatus } = useRecordingStore();
  const { setPanel } = useUIStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const isIdle = status === "idle";
  const isRecording = status === "recording";
  const isPaused = status === "paused";
  const isActive = isRecording || isPaused;

  const handleStartStop = async () => {
    setError(null);
    setIsLoading(true);
    
    try {
      if (isIdle) {
        // Start recording
        const outputPath = await startRecording(
          mode,
          region,
          windowId,
          sources
        );
        console.log("Recording started, output:", outputPath);
        setStatus("recording");
      } else {
        // Stop recording
        const outputPath = await stopRecording();
        console.log("Recording stopped, saved to:", outputPath);
        setStatus("idle");
      }
    } catch (err) {
      console.error("Recording error:", err);
      setError(String(err));
      setStatus("idle");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePauseResume = async () => {
    setError(null);
    
    try {
      if (isRecording) {
        await pauseRecording();
        setStatus("paused");
      } else if (isPaused) {
        await resumeRecording();
        setStatus("recording");
      }
    } catch (err) {
      console.error("Pause/Resume error:", err);
      setError(String(err));
    }
  };

  const handleCancel = async () => {
    setError(null);
    
    try {
      await cancelRecording();
      setStatus("idle");
      useRecordingStore.getState().setDuration(0);
    } catch (err) {
      console.error("Cancel error:", err);
      setError(String(err));
    }
  };

  return (
    <div className="shrink-0 border-t border-white/5">
      {/* Error message */}
      {error && (
        <div className="px-4 py-2 bg-red-500/10 border-b border-red-500/20 text-red-400 text-xs">
          {error}
        </div>
      )}
      
      <div className="h-16 flex items-center justify-between px-4 bg-zinc-900/80 backdrop-blur-sm">
        {/* Left: Mode Selection */}
        <div className="flex items-center gap-1">
          <ModeButton
            icon={Monitor}
            label="全屏"
            active={mode === "fullscreen"}
            disabled={isActive}
            onClick={() => setMode("fullscreen")}
          />
          <ModeButton
            icon={AppWindow}
            label="窗口"
            active={mode === "window"}
            disabled={isActive}
            onClick={() => setMode("window")}
          />
          <ModeButton
            icon={Scan}
            label="区域"
            active={mode === "region"}
            disabled={isActive}
            onClick={() => setMode("region")}
          />
        </div>

        {/* Center: Record Button */}
        <div className="flex items-center gap-3">
          {/* Cancel button when active */}
          {isActive && (
            <button
              onClick={handleCancel}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/40 hover:text-red-400 hover:border-red-500/50 hover:bg-red-500/10 transition-all"
              title="取消 (F3)"
            >
              <Square className="w-3.5 h-3.5" />
            </button>
          )}
          
          {/* Pause/Resume button when active */}
          {isActive && (
            <button
              onClick={handlePauseResume}
              className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all ${
                isPaused
                  ? "border-yellow-500 bg-yellow-500/10 text-yellow-500"
                  : "border-white/20 bg-white/5 text-white/60 hover:border-white/40"
              }`}
              title={isPaused ? "继续 (F2)" : "暂停 (F2)"}
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>
          )}
          
          {/* Main Record/Stop button */}
          <button
            onClick={handleStartStop}
            disabled={isLoading}
            className={`relative w-14 h-14 flex items-center justify-center rounded-full transition-all duration-200 ${
              isLoading
                ? "bg-zinc-700 cursor-wait"
                : isIdle
                ? "bg-red-500 hover:bg-red-400 shadow-lg shadow-red-500/30 hover:shadow-red-400/40 hover:scale-105"
                : "bg-zinc-800 border-2 border-red-500 hover:bg-zinc-700"
            }`}
            title={isIdle ? "开始录制 (F1)" : "停止录制 (F1)"}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            ) : isIdle ? (
              <Circle className="w-6 h-6 text-white fill-white" />
            ) : (
              <Square className="w-5 h-5 text-red-500 fill-red-500" />
            )}
          </button>
        </div>

        {/* Right: Sources & Settings */}
        <div className="flex items-center gap-1">
          <SourceToggle
            activeIcon={Mic}
            inactiveIcon={MicOff}
            active={sources.microphone}
            disabled={isActive}
            onClick={() => toggleSource("microphone")}
            tooltip="麦克风"
          />
          <SourceToggle
            activeIcon={Volume2}
            inactiveIcon={VolumeX}
            active={sources.systemAudio}
            disabled={isActive}
            onClick={() => toggleSource("systemAudio")}
            tooltip="系统音频"
          />
          <SourceToggle
            activeIcon={Video}
            inactiveIcon={VideoOff}
            active={sources.camera}
            disabled={isActive}
            onClick={() => toggleSource("camera")}
            tooltip="摄像头 (F4)"
          />
          
          <div className="w-px h-6 bg-white/10 mx-2" />
          
          <button
            onClick={() => setPanel("settings")}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-white/40 hover:text-white/80 hover:bg-white/5 transition-colors"
            title="设置"
          >
            <Settings className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface ModeButtonProps {
  icon: typeof Monitor;
  label: string;
  active: boolean;
  disabled: boolean;
  onClick: () => void;
}

function ModeButton({ icon: Icon, label, active, disabled, onClick }: ModeButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-2 flex items-center gap-2 rounded-lg text-sm transition-all ${
        active
          ? "bg-white/10 text-white"
          : disabled
          ? "text-white/20 cursor-not-allowed"
          : "text-white/50 hover:text-white/80 hover:bg-white/5"
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

interface SourceToggleProps {
  activeIcon: typeof Mic;
  inactiveIcon: typeof MicOff;
  active: boolean;
  disabled: boolean;
  onClick: () => void;
  tooltip: string;
}

function SourceToggle({ activeIcon: ActiveIcon, inactiveIcon: InactiveIcon, active, disabled, onClick, tooltip }: SourceToggleProps) {
  const Icon = active ? ActiveIcon : InactiveIcon;
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
      className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${
        active
          ? "bg-emerald-500/20 text-emerald-400"
          : disabled
          ? "text-white/20 cursor-not-allowed"
          : "text-white/40 hover:text-white/60 hover:bg-white/5"
      }`}
    >
      <Icon className="w-4.5 h-4.5" />
    </button>
  );
}

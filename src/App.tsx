import { useEffect, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import { AppLayout } from "@/components/layout";
import { useRecordingStore } from "@/stores";
import { startRecording, stopRecording, pauseRecording, resumeRecording, cancelRecording, checkFFmpegAvailable } from "@/services/recording";

function App() {
  const { status } = useRecordingStore();
  const [ffmpegAvailable, setFfmpegAvailable] = useState<boolean | null>(null);

  // Check FFmpeg on mount
  useEffect(() => {
    checkFFmpegAvailable()
      .then(setFfmpegAvailable)
      .catch(() => setFfmpegAvailable(false));
  }, []);

  // Listen for hotkey events from backend
  useEffect(() => {
    const unlisten = Promise.all([
      // F1 - Start/Stop
      listen("hotkey-start-stop", async () => {
        const store = useRecordingStore.getState();
        const currentStatus = store.status;
        
        try {
          if (currentStatus === "idle") {
            await startRecording(
              store.mode,
              store.region,
              store.windowId,
              store.sources
            );
            store.setStatus("recording");
          } else if (currentStatus === "recording" || currentStatus === "paused") {
            await stopRecording();
            store.setStatus("idle");
            store.setDuration(0);
          }
        } catch (err) {
          console.error("Hotkey start/stop error:", err);
          store.setStatus("idle");
        }
      }),
      
      // F2 - Pause/Resume
      listen("hotkey-pause-resume", async () => {
        const store = useRecordingStore.getState();
        const currentStatus = store.status;
        
        try {
          if (currentStatus === "recording") {
            await pauseRecording();
            store.setStatus("paused");
          } else if (currentStatus === "paused") {
            await resumeRecording();
            store.setStatus("recording");
          }
        } catch (err) {
          console.error("Hotkey pause/resume error:", err);
        }
      }),
      
      // F3 - Cancel
      listen("hotkey-cancel", async () => {
        const store = useRecordingStore.getState();
        
        try {
          await cancelRecording();
          store.setStatus("idle");
          store.setDuration(0);
        } catch (err) {
          console.error("Hotkey cancel error:", err);
        }
      }),
      
      // F4 - Toggle Camera
      listen("hotkey-toggle-camera", () => {
        useRecordingStore.getState().toggleSource("camera");
      }),
    ]);

    return () => {
      unlisten.then((listeners) => listeners.forEach((fn) => fn()));
    };
  }, []);

  // Recording duration timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (status === "recording") {
      interval = setInterval(() => {
        useRecordingStore.getState().setDuration(
          useRecordingStore.getState().duration + 1
        );
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status]);

  // Show FFmpeg warning if not available
  if (ffmpegAvailable === false) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-black p-8">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <h1 className="text-xl font-semibold text-white mb-2">FFmpeg 未安装</h1>
          <p className="text-white/60 text-sm mb-4">
            FlashScreen 需要 FFmpeg 来进行屏幕录制。请先安装 FFmpeg 并确保它在系统 PATH 中。
          </p>
          <a
            href="https://ffmpeg.org/download.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors"
          >
            下载 FFmpeg
          </a>
        </div>
      </div>
    );
  }

  return <AppLayout />;
}

export default App;

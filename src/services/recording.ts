import { invoke } from "@tauri-apps/api/core";
import type { RecordingMode, RecordingSources, Region, RecordingStatus } from "@/types";

export interface RecordingState {
  status: RecordingStatus;
  mode: RecordingMode;
  duration: number;
  region: Region | null;
  windowId: string | null;
  sources: RecordingSources;
  outputPath: string | null;
}

/**
 * Get current recording state from backend
 */
export async function getRecordingState(): Promise<RecordingState> {
  return invoke<RecordingState>("get_recording_state");
}

/**
 * Start screen recording
 */
export async function startRecording(
  mode: RecordingMode,
  region: Region | null,
  windowId: string | null,
  sources: RecordingSources
): Promise<string> {
  return invoke<string>("start_recording", {
    mode,
    region,
    windowId,
    sources: {
      microphone: sources.microphone,
      systemAudio: sources.systemAudio,
      camera: sources.camera,
    },
  });
}

/**
 * Stop screen recording
 */
export async function stopRecording(): Promise<string> {
  return invoke<string>("stop_recording");
}

/**
 * Pause screen recording
 */
export async function pauseRecording(): Promise<void> {
  return invoke("pause_recording");
}

/**
 * Resume screen recording
 */
export async function resumeRecording(): Promise<void> {
  return invoke("resume_recording");
}

/**
 * Cancel screen recording
 */
export async function cancelRecording(): Promise<void> {
  return invoke("cancel_recording");
}

/**
 * Check if FFmpeg is available
 */
export async function checkFFmpegAvailable(): Promise<boolean> {
  return invoke<boolean>("check_ffmpeg_available");
}

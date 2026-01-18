export type RecordingStatus =
  | "idle"
  | "selecting"
  | "countdown"
  | "recording"
  | "paused"
  | "encoding"
  | "preview";

export type RecordingMode = "fullscreen" | "window" | "region";

export interface Region {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RecordingSources {
  microphone: boolean;
  systemAudio: boolean;
  camera: boolean;
}

export interface RecordingState {
  status: RecordingStatus;
  mode: RecordingMode;
  duration: number;
  region: Region | null;
  windowId: string | null;
  sources: RecordingSources;
  outputPath: string | null;
}

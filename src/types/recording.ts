// Recording Types

export type RecordingMode = "fullscreen" | "window" | "region";

export type RecordingStatus =
  | "idle"
  | "selecting"
  | "countdown"
  | "recording"
  | "paused"
  | "encoding"
  | "preview";

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

export interface Monitor {
  id: string;
  name: string;
  width: number;
  height: number;
  isPrimary: boolean;
}

export interface WindowInfo {
  id: string;
  title: string;
  processName: string;
  bounds: Region;
  icon?: string;
}

export interface CameraInfo {
  id: string;
  name: string;
}

export interface AudioDevice {
  id: string;
  name: string;
  type: "input" | "output";
  isDefault: boolean;
}

// Camera PiP
export interface CameraPipState {
  visible: boolean;
  position: { x: number; y: number };
  size: number;
}


export interface Settings {
  output: OutputSettings;
  hotkeys: HotkeySettings;
  recording: RecordingSettings;
  camera: CameraSettings;
  general: GeneralSettings;
  isFirstLaunch: boolean;
}

export interface OutputSettings {
  directory: string;
  resolution: string;
  frameRate: number;
  format: string;
}

export interface HotkeySettings {
  startStop: string;
  pauseResume: string;
  cancel: string;
  toggleCamera: string;
}

export interface RecordingSettings {
  showCountdown: boolean;
  countdownDuration: number;
  cursorSmoothing: boolean;
  highlightClicks: boolean;
  playStartSound: boolean;
  playEndSound: boolean;
}

export interface CameraSettings {
  deviceId: string | null;
  position: string;
  size: number;
  shape: string;
}

export interface GeneralSettings {
  language: string;
  launchAtStartup: boolean;
  minimizeToTray: boolean;
  showPreviewAfterRecording: boolean;
}

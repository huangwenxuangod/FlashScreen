// Settings Types

export interface OutputSettings {
  directory: string;
  resolution: "1080p" | "720p" | "original";
  frameRate: 60 | 30;
  format: "mp4";
}

export interface HotkeySettings {
  startStop: string;
  pauseResume: string;
  cancel: string;
  toggleCamera: string;
}

export interface RecordingSettings {
  showCountdown: boolean;
  countdownDuration: 3 | 5;
  cursorSmoothing: boolean;
  highlightClicks: boolean;
  playStartSound: boolean;
  playEndSound: boolean;
}

export interface CameraSettings {
  deviceId: string | null;
  position: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  size: number;
  shape: "circle" | "rounded";
}

export interface GeneralSettings {
  language: "zh-CN" | "en-US";
  launchAtStartup: boolean;
  minimizeToTray: boolean;
  showPreviewAfterRecording: boolean;
}

export interface Settings {
  output: OutputSettings;
  hotkeys: HotkeySettings;
  recording: RecordingSettings;
  camera: CameraSettings;
  general: GeneralSettings;
  isFirstLaunch: boolean;
}

export const defaultSettings: Settings = {
  output: {
    directory: "",
    resolution: "1080p",
    frameRate: 60,
    format: "mp4",
  },
  hotkeys: {
    startStop: "F1",
    pauseResume: "F2",
    cancel: "F3",
    toggleCamera: "F4",
  },
  recording: {
    showCountdown: false,
    countdownDuration: 3,
    cursorSmoothing: true,
    highlightClicks: false,
    playStartSound: true,
    playEndSound: true,
  },
  camera: {
    deviceId: null,
    position: "bottom-right",
    size: 150,
    shape: "circle",
  },
  general: {
    language: "zh-CN",
    launchAtStartup: false,
    minimizeToTray: true,
    showPreviewAfterRecording: true,
  },
  isFirstLaunch: true,
};


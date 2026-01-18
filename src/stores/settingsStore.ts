import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Settings } from "@/types";

const defaultSettings: Settings = {
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

interface SettingsStore {
  settings: Settings;
  isLoading: boolean;

  // Actions
  updateSettings: <K extends keyof Settings>(
    key: K,
    value: Partial<Settings[K]>
  ) => void;
  setSettings: (settings: Settings) => void;
  setOutputDirectory: (directory: string) => void;
  setFirstLaunchComplete: () => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      isLoading: false,

      updateSettings: (key, value) =>
        set((state) => ({
          settings: {
            ...state.settings,
            [key]:
              typeof value === "object"
                ? { ...state.settings[key], ...value }
                : value,
          },
        })),

      setSettings: (settings) => set({ settings }),

      setOutputDirectory: (directory) =>
        set((state) => ({
          settings: {
            ...state.settings,
            output: {
              ...state.settings.output,
              directory,
            },
          },
        })),

      setFirstLaunchComplete: () =>
        set((state) => ({
          settings: {
            ...state.settings,
            isFirstLaunch: false,
          },
        })),

      resetSettings: () => set({ settings: defaultSettings }),
    }),
    {
      name: "flashscreen-settings",
      partialize: (state) => ({ settings: state.settings }),
    }
  )
);

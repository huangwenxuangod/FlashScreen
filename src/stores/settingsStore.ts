import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Settings } from "@/types";
import { defaultSettings } from "@/types";

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


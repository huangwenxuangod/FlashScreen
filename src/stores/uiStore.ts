import { create } from "zustand";

export type Panel = "main" | "settings" | "files" | "preview";

interface UIStore {
  // State
  currentPanel: Panel;
  isFloatingWindowVisible: boolean;
  isSelectingRegion: boolean;
  isSelectingWindow: boolean;

  // Camera PiP
  cameraPipPosition: { x: number; y: number };
  cameraPipSize: number;

  // Actions
  setPanel: (panel: Panel) => void;
  goBack: () => void;
  setFloatingWindowVisible: (visible: boolean) => void;
  setSelectingRegion: (selecting: boolean) => void;
  setSelectingWindow: (selecting: boolean) => void;
  setCameraPipPosition: (position: { x: number; y: number }) => void;
  setCameraPipSize: (size: number) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  currentPanel: "main",
  isFloatingWindowVisible: false,
  isSelectingRegion: false,
  isSelectingWindow: false,
  cameraPipPosition: { x: 0, y: 0 },
  cameraPipSize: 150,

  setPanel: (panel) => set({ currentPanel: panel }),

  goBack: () => set({ currentPanel: "main" }),

  setFloatingWindowVisible: (visible) =>
    set({ isFloatingWindowVisible: visible }),

  setSelectingRegion: (selecting) => set({ isSelectingRegion: selecting }),

  setSelectingWindow: (selecting) => set({ isSelectingWindow: selecting }),

  setCameraPipPosition: (position) => set({ cameraPipPosition: position }),

  setCameraPipSize: (size) => set({ cameraPipSize: size }),
}));


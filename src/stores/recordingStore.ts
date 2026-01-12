import { create } from "zustand";
import type {
  RecordingMode,
  RecordingStatus,
  RecordingSources,
  Region,
} from "@/types";

interface RecordingStore {
  // State
  status: RecordingStatus;
  mode: RecordingMode;
  duration: number;
  region: Region | null;
  windowId: string | null;
  sources: RecordingSources;
  outputPath: string | null;
  encodingProgress: number;

  // Actions
  setStatus: (status: RecordingStatus) => void;
  setMode: (mode: RecordingMode) => void;
  setDuration: (duration: number) => void;
  setRegion: (region: Region | null) => void;
  setWindowId: (windowId: string | null) => void;
  setSources: (sources: Partial<RecordingSources>) => void;
  toggleSource: (source: keyof RecordingSources) => void;
  setOutputPath: (path: string | null) => void;
  setEncodingProgress: (progress: number) => void;
  reset: () => void;
}

const initialState = {
  status: "idle" as RecordingStatus,
  mode: "fullscreen" as RecordingMode,
  duration: 0,
  region: null,
  windowId: null,
  sources: {
    microphone: true,
    systemAudio: true,
    camera: false,
  },
  outputPath: null,
  encodingProgress: 0,
};

export const useRecordingStore = create<RecordingStore>((set) => ({
  ...initialState,

  setStatus: (status) => set({ status }),

  setMode: (mode) => set({ mode }),

  setDuration: (duration) => set({ duration }),

  setRegion: (region) => set({ region }),

  setWindowId: (windowId) => set({ windowId }),

  setSources: (sources) =>
    set((state) => ({
      sources: { ...state.sources, ...sources },
    })),

  toggleSource: (source) =>
    set((state) => ({
      sources: {
        ...state.sources,
        [source]: !state.sources[source],
      },
    })),

  setOutputPath: (outputPath) => set({ outputPath }),

  setEncodingProgress: (encodingProgress) => set({ encodingProgress }),

  reset: () => set(initialState),
}));


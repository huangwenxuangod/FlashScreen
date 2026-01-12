import { create } from "zustand";
import type { RecordingFile } from "@/types";

interface FilesStore {
  // State
  files: RecordingFile[];
  isLoading: boolean;
  searchQuery: string;
  selectedFile: RecordingFile | null;

  // Actions
  setFiles: (files: RecordingFile[]) => void;
  addFile: (file: RecordingFile) => void;
  removeFile: (path: string) => void;
  updateFile: (path: string, updates: Partial<RecordingFile>) => void;
  setLoading: (loading: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSelectedFile: (file: RecordingFile | null) => void;
}

export const useFilesStore = create<FilesStore>((set) => ({
  files: [],
  isLoading: false,
  searchQuery: "",
  selectedFile: null,

  setFiles: (files) => set({ files }),

  addFile: (file) =>
    set((state) => ({
      files: [file, ...state.files],
    })),

  removeFile: (path) =>
    set((state) => ({
      files: state.files.filter((f) => f.path !== path),
    })),

  updateFile: (path, updates) =>
    set((state) => ({
      files: state.files.map((f) => (f.path === path ? { ...f, ...updates } : f)),
    })),

  setLoading: (isLoading) => set({ isLoading }),

  setSearchQuery: (searchQuery) => set({ searchQuery }),

  setSelectedFile: (selectedFile) => set({ selectedFile }),
}));


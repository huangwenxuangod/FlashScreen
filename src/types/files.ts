// File Types

export interface RecordingFile {
  path: string;
  name: string;
  size: number;
  duration: number;
  resolution: string;
  frameRate: number;
  createdAt: string;
  thumbnail?: string;
}

export interface FileGroup {
  label: string;
  date: string;
  files: RecordingFile[];
}


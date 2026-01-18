import { invoke } from "@tauri-apps/api/core";
import type { RecordingFile } from "@/types";

/**
 * Get list of recording files
 */
export async function getRecordings(): Promise<RecordingFile[]> {
  return invoke<RecordingFile[]>("get_recordings");
}

/**
 * Delete a recording file
 */
export async function deleteRecording(path: string): Promise<void> {
  return invoke("delete_recording", { path });
}

/**
 * Rename a recording file
 */
export async function renameRecording(
  path: string,
  newName: string
): Promise<string> {
  return invoke<string>("rename_recording", { path, newName });
}

/**
 * Show file in folder (file explorer)
 */
export async function showInFolder(path: string): Promise<void> {
  return invoke("show_in_folder", { path });
}

/**
 * Open file with default application
 */
export async function openFile(path: string): Promise<void> {
  return invoke("open_file", { path });
}

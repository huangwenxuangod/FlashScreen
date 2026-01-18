import { invoke } from "@tauri-apps/api/core";
import type { Settings } from "@/types";

/**
 * Get current settings from backend
 */
export async function getSettings(): Promise<Settings> {
  return invoke<Settings>("get_settings");
}

/**
 * Update settings
 */
export async function updateSettings(settings: Settings): Promise<void> {
  return invoke("update_settings", { newSettings: settings });
}

/**
 * Get output directory
 */
export async function getOutputDirectory(): Promise<string> {
  return invoke<string>("get_output_directory");
}

/**
 * Select output directory using file dialog
 */
export async function selectOutputDirectory(): Promise<string | null> {
  return invoke<string | null>("select_output_directory");
}

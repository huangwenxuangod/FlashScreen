use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use tauri::State;

use super::settings::SharedSettings;

/// Recording file info
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RecordingFile {
    pub path: String,
    pub name: String,
    pub size: u64,
    pub duration: f64,
    pub resolution: String,
    pub frame_rate: u32,
    pub created_at: String,
    pub thumbnail: Option<String>,
}

/// Get list of recordings
#[tauri::command]
pub async fn get_recordings(
    settings: State<'_, SharedSettings>,
) -> Result<Vec<RecordingFile>, String> {
    let settings = settings.lock().await;
    let dir = PathBuf::from(&settings.output.directory);

    if !dir.exists() {
        return Ok(Vec::new());
    }

    let mut files = Vec::new();

    match std::fs::read_dir(&dir) {
        Ok(entries) => {
            for entry in entries.flatten() {
                let path = entry.path();
                if path.extension().map_or(false, |ext| ext == "mp4") {
                    if let Ok(metadata) = entry.metadata() {
                        let name = path
                            .file_name()
                            .map(|n| n.to_string_lossy().to_string())
                            .unwrap_or_default();

                        let created_at = metadata
                            .created()
                            .ok()
                            .and_then(|t| t.duration_since(std::time::UNIX_EPOCH).ok())
                            .map(|d| {
                                chrono::DateTime::from_timestamp(d.as_secs() as i64, 0)
                                    .map(|dt| dt.format("%Y-%m-%d %H:%M:%S").to_string())
                                    .unwrap_or_default()
                            })
                            .unwrap_or_default();

                        files.push(RecordingFile {
                            path: path.to_string_lossy().to_string(),
                            name,
                            size: metadata.len(),
                            duration: 0.0, // TODO: Get from video metadata
                            resolution: String::from("1080p"), // TODO: Get from video metadata
                            frame_rate: 60, // TODO: Get from video metadata
                            created_at,
                            thumbnail: None, // TODO: Generate thumbnail
                        });
                    }
                }
            }
        }
        Err(e) => return Err(format!("Failed to read directory: {}", e)),
    }

    // Sort by creation time (newest first)
    files.sort_by(|a, b| b.created_at.cmp(&a.created_at));

    Ok(files)
}

/// Delete a recording
#[tauri::command]
pub async fn delete_recording(path: String) -> Result<(), String> {
    let path = PathBuf::from(&path);
    if path.exists() {
        std::fs::remove_file(&path).map_err(|e| format!("Failed to delete file: {}", e))?;
    }
    Ok(())
}

/// Rename a recording
#[tauri::command]
pub async fn rename_recording(path: String, new_name: String) -> Result<String, String> {
    let old_path = PathBuf::from(&path);
    if !old_path.exists() {
        return Err("File not found".to_string());
    }

    let new_path = old_path.parent()
        .map(|p| p.join(&new_name))
        .ok_or("Invalid path")?;

    std::fs::rename(&old_path, &new_path)
        .map_err(|e| format!("Failed to rename file: {}", e))?;

    Ok(new_path.to_string_lossy().to_string())
}

/// Show file in folder (file explorer)
#[tauri::command]
pub async fn show_in_folder(path: String) -> Result<(), String> {
    let path = PathBuf::from(&path);
    
    #[cfg(target_os = "windows")]
    {
        std::process::Command::new("explorer")
            .args(["/select,", &path.to_string_lossy()])
            .spawn()
            .map_err(|e| format!("Failed to open explorer: {}", e))?;
    }

    #[cfg(target_os = "macos")]
    {
        std::process::Command::new("open")
            .args(["-R", &path.to_string_lossy()])
            .spawn()
            .map_err(|e| format!("Failed to open Finder: {}", e))?;
    }

    #[cfg(target_os = "linux")]
    {
        if let Some(parent) = path.parent() {
            std::process::Command::new("xdg-open")
                .arg(parent)
                .spawn()
                .map_err(|e| format!("Failed to open file manager: {}", e))?;
        }
    }

    Ok(())
}

/// Open file with default application
#[tauri::command]
pub async fn open_file(path: String) -> Result<(), String> {
    let path = PathBuf::from(&path);

    #[cfg(target_os = "windows")]
    {
        std::process::Command::new("cmd")
            .args(["/C", "start", "", &path.to_string_lossy()])
            .spawn()
            .map_err(|e| format!("Failed to open file: {}", e))?;
    }

    #[cfg(target_os = "macos")]
    {
        std::process::Command::new("open")
            .arg(&path)
            .spawn()
            .map_err(|e| format!("Failed to open file: {}", e))?;
    }

    #[cfg(target_os = "linux")]
    {
        std::process::Command::new("xdg-open")
            .arg(&path)
            .spawn()
            .map_err(|e| format!("Failed to open file: {}", e))?;
    }

    Ok(())
}

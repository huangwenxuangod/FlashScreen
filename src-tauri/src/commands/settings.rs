use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use tauri::State;
use std::sync::Arc;
use tokio::sync::Mutex;

/// Application settings
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Settings {
    pub output: OutputSettings,
    pub hotkeys: HotkeySettings,
    pub recording: RecordingSettings,
    pub camera: CameraSettings,
    pub general: GeneralSettings,
    pub is_first_launch: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OutputSettings {
    pub directory: String,
    pub resolution: String,
    pub frame_rate: u32,
    pub format: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HotkeySettings {
    pub start_stop: String,
    pub pause_resume: String,
    pub cancel: String,
    pub toggle_camera: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RecordingSettings {
    pub show_countdown: bool,
    pub countdown_duration: u32,
    pub cursor_smoothing: bool,
    pub highlight_clicks: bool,
    pub play_start_sound: bool,
    pub play_end_sound: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CameraSettings {
    pub device_id: Option<String>,
    pub position: String,
    pub size: u32,
    pub shape: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GeneralSettings {
    pub language: String,
    pub launch_at_startup: bool,
    pub minimize_to_tray: bool,
    pub show_preview_after_recording: bool,
}

impl Default for Settings {
    fn default() -> Self {
        let output_dir = dirs::video_dir()
            .map(|p| p.join("FlashScreen").to_string_lossy().to_string())
            .unwrap_or_default();

        Self {
            output: OutputSettings {
                directory: output_dir,
                resolution: String::from("1080p"),
                frame_rate: 60,
                format: String::from("mp4"),
            },
            hotkeys: HotkeySettings {
                start_stop: String::from("F1"),
                pause_resume: String::from("F2"),
                cancel: String::from("F3"),
                toggle_camera: String::from("F4"),
            },
            recording: RecordingSettings {
                show_countdown: false,
                countdown_duration: 3,
                cursor_smoothing: true,
                highlight_clicks: false,
                play_start_sound: true,
                play_end_sound: true,
            },
            camera: CameraSettings {
                device_id: None,
                position: String::from("bottom-right"),
                size: 150,
                shape: String::from("circle"),
            },
            general: GeneralSettings {
                language: String::from("zh-CN"),
                launch_at_startup: false,
                minimize_to_tray: true,
                show_preview_after_recording: true,
            },
            is_first_launch: true,
        }
    }
}

pub type SharedSettings = Arc<Mutex<Settings>>;

/// Get settings file path
fn get_settings_path() -> PathBuf {
    dirs::config_dir()
        .map(|p| p.join("FlashScreen").join("settings.json"))
        .unwrap_or_else(|| PathBuf::from("settings.json"))
}

/// Load settings from file
pub fn load_settings() -> Settings {
    let path = get_settings_path();
    if path.exists() {
        match std::fs::read_to_string(&path) {
            Ok(content) => {
                match serde_json::from_str(&content) {
                    Ok(settings) => return settings,
                    Err(e) => eprintln!("Failed to parse settings: {}", e),
                }
            }
            Err(e) => eprintln!("Failed to read settings file: {}", e),
        }
    }
    Settings::default()
}

/// Save settings to file
pub fn save_settings(settings: &Settings) -> Result<(), String> {
    let path = get_settings_path();
    
    // Ensure directory exists
    if let Some(parent) = path.parent() {
        std::fs::create_dir_all(parent)
            .map_err(|e| format!("Failed to create config directory: {}", e))?;
    }

    let content = serde_json::to_string_pretty(settings)
        .map_err(|e| format!("Failed to serialize settings: {}", e))?;

    std::fs::write(&path, content)
        .map_err(|e| format!("Failed to write settings file: {}", e))?;

    Ok(())
}

/// Get current settings
#[tauri::command]
pub async fn get_settings(
    settings: State<'_, SharedSettings>,
) -> Result<Settings, String> {
    let settings = settings.lock().await;
    Ok(settings.clone())
}

/// Update settings
#[tauri::command]
pub async fn update_settings(
    new_settings: Settings,
    settings: State<'_, SharedSettings>,
) -> Result<(), String> {
    let mut settings = settings.lock().await;
    *settings = new_settings.clone();
    save_settings(&new_settings)?;
    Ok(())
}

/// Get output directory
#[tauri::command]
pub async fn get_output_directory(
    settings: State<'_, SharedSettings>,
) -> Result<String, String> {
    let settings = settings.lock().await;
    Ok(settings.output.directory.clone())
}

/// Select output directory using file dialog
#[tauri::command]
pub async fn select_output_directory(
    app: tauri::AppHandle,
) -> Result<Option<String>, String> {
    use tauri_plugin_dialog::{DialogExt, FilePath};
    use std::sync::mpsc;

    let (tx, rx) = mpsc::channel::<Option<FilePath>>();

    app.dialog()
        .file()
        .set_title("Select Output Directory")
        .pick_folder(move |folder_path| {
            let _ = tx.send(folder_path);
        });

    // Wait for the dialog result
    match rx.recv() {
        Ok(Some(path)) => Ok(Some(path.to_string())),
        Ok(None) => Ok(None),
        Err(_) => Ok(None),
    }
}

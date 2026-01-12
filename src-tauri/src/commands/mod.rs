use serde::{Deserialize, Serialize};

// Recording State Types
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum RecordingStatus {
    Idle,
    Selecting,
    Countdown,
    Recording,
    Paused,
    Encoding,
    Preview,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum RecordingMode {
    Fullscreen,
    Window,
    Region,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Region {
    pub x: i32,
    pub y: i32,
    pub width: u32,
    pub height: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RecordingSources {
    pub microphone: bool,
    pub system_audio: bool,
    pub camera: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RecordingState {
    pub status: RecordingStatus,
    pub mode: RecordingMode,
    pub duration: u64,
    pub region: Option<Region>,
    pub window_id: Option<String>,
    pub sources: RecordingSources,
    pub output_path: Option<String>,
}

// Settings Types
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

// Recording File Types
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

// ============================================
// Commands
// ============================================

#[tauri::command]
pub fn get_recording_state() -> RecordingState {
    RecordingState {
        status: RecordingStatus::Idle,
        mode: RecordingMode::Fullscreen,
        duration: 0,
        region: None,
        window_id: None,
        sources: RecordingSources {
            microphone: true,
            system_audio: true,
            camera: false,
        },
        output_path: None,
    }
}

#[tauri::command]
pub async fn start_recording(
    mode: RecordingMode,
    region: Option<Region>,
    window_id: Option<String>,
    sources: RecordingSources,
) -> Result<(), String> {
    // TODO: Implement actual recording logic
    println!("Starting recording: {:?}, region: {:?}, window: {:?}, sources: {:?}", 
             mode, region, window_id, sources);
    Ok(())
}

#[tauri::command]
pub async fn stop_recording() -> Result<String, String> {
    // TODO: Implement actual stop recording logic
    println!("Stopping recording");
    Ok(String::from(""))
}

#[tauri::command]
pub async fn pause_recording() -> Result<(), String> {
    // TODO: Implement pause logic
    println!("Pausing recording");
    Ok(())
}

#[tauri::command]
pub async fn resume_recording() -> Result<(), String> {
    // TODO: Implement resume logic
    println!("Resuming recording");
    Ok(())
}

#[tauri::command]
pub async fn cancel_recording() -> Result<(), String> {
    // TODO: Implement cancel logic
    println!("Cancelling recording");
    Ok(())
}

#[tauri::command]
pub fn get_settings() -> Settings {
    Settings {
        output: OutputSettings {
            directory: String::new(),
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

#[tauri::command]
pub async fn update_settings(_settings: Settings) -> Result<(), String> {
    // TODO: Implement settings persistence
    println!("Updating settings");
    Ok(())
}

#[tauri::command]
pub fn get_output_directory() -> String {
    // Return default Videos folder
    dirs::video_dir()
        .map(|p| p.join("FlashScreen").to_string_lossy().to_string())
        .unwrap_or_default()
}

#[tauri::command]
pub async fn select_output_directory() -> Result<Option<String>, String> {
    // TODO: Use dialog to select directory
    Ok(None)
}

#[tauri::command]
pub fn get_recordings() -> Vec<RecordingFile> {
    // TODO: Implement file listing
    Vec::new()
}

#[tauri::command]
pub async fn delete_recording(path: String) -> Result<(), String> {
    // TODO: Implement file deletion
    println!("Deleting recording: {}", path);
    Ok(())
}

#[tauri::command]
pub async fn rename_recording(path: String, new_name: String) -> Result<String, String> {
    // TODO: Implement file renaming
    println!("Renaming recording: {} to {}", path, new_name);
    Ok(path)
}

#[tauri::command]
pub async fn show_in_folder(path: String) -> Result<(), String> {
    // TODO: Implement show in folder
    println!("Show in folder: {}", path);
    Ok(())
}

#[tauri::command]
pub async fn open_file(path: String) -> Result<(), String> {
    // TODO: Implement open file
    println!("Open file: {}", path);
    Ok(())
}


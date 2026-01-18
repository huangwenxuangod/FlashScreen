use serde::{Deserialize, Serialize};
use tauri::{AppHandle, State};
use std::sync::Arc;
use tokio::sync::Mutex;

use crate::recording::{FFmpegRecorder, RecordingState, RecordingStatus};
use crate::recording::state::{RecordingMode, RecordingSources, Region};

/// Shared recorder state
pub type SharedRecorder = Arc<Mutex<FFmpegRecorder>>;

/// Response for recording state
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RecordingStateResponse {
    pub status: RecordingStatus,
    pub mode: RecordingMode,
    pub duration: u64,
    pub region: Option<Region>,
    pub window_id: Option<String>,
    pub sources: RecordingSources,
    pub output_path: Option<String>,
}

/// Get current recording state
#[tauri::command]
pub async fn get_recording_state(
    state: State<'_, Arc<Mutex<RecordingState>>>,
) -> Result<RecordingStateResponse, String> {
    let state = state.lock().await;
    
    let duration = if let Some(start) = state.start_time {
        start.elapsed().as_secs()
    } else {
        0
    };

    Ok(RecordingStateResponse {
        status: state.status,
        mode: state.mode,
        duration,
        region: state.region.clone(),
        window_id: state.window_id.clone(),
        sources: state.sources.clone(),
        output_path: state.output_path.clone(),
    })
}

/// Start screen recording
#[tauri::command]
pub async fn start_recording(
    app_handle: AppHandle,
    mode: RecordingMode,
    region: Option<Region>,
    window_id: Option<String>,
    sources: RecordingSources,
    recorder: State<'_, SharedRecorder>,
    state: State<'_, Arc<Mutex<RecordingState>>>,
) -> Result<String, String> {
    let mut recorder = recorder.lock().await;
    let mut state = state.lock().await;

    // Set app handle for sidecar access
    recorder.set_app_handle(Arc::new(app_handle));

    // Get output directory from settings (use Videos/FlashScreen as default)
    let output_dir = dirs::video_dir()
        .map(|p| p.join("FlashScreen"))
        .unwrap_or_else(|| std::path::PathBuf::from("."));

    // Start recording
    match recorder
        .start(
            mode,
            region.clone(),
            sources.clone(),
            &output_dir,
            "1080p",
            60,
        )
        .await
    {
        Ok(output_path) => {
            // Update state
            state.status = RecordingStatus::Recording;
            state.mode = mode;
            state.region = region;
            state.window_id = window_id;
            state.sources = sources;
            state.output_path = Some(output_path.to_string_lossy().to_string());
            state.start_time = Some(std::time::Instant::now());

            Ok(output_path.to_string_lossy().to_string())
        }
        Err(e) => Err(format!("Failed to start recording: {}", e)),
    }
}

/// Stop screen recording
#[tauri::command]
pub async fn stop_recording(
    recorder: State<'_, SharedRecorder>,
    state: State<'_, Arc<Mutex<RecordingState>>>,
) -> Result<String, String> {
    let mut recorder = recorder.lock().await;
    let mut state = state.lock().await;

    match recorder.stop().await {
        Ok(Some(path)) => {
            let output = path.to_string_lossy().to_string();
            state.status = RecordingStatus::Idle;
            state.start_time = None;
            Ok(output)
        }
        Ok(None) => {
            state.status = RecordingStatus::Idle;
            state.start_time = None;
            Ok(String::new())
        }
        Err(e) => Err(format!("Failed to stop recording: {}", e)),
    }
}

/// Pause screen recording
#[tauri::command]
pub async fn pause_recording(
    recorder: State<'_, SharedRecorder>,
    state: State<'_, Arc<Mutex<RecordingState>>>,
) -> Result<(), String> {
    let mut recorder = recorder.lock().await;
    let mut state = state.lock().await;

    match recorder.pause().await {
        Ok(_) => {
            state.status = RecordingStatus::Paused;
            Ok(())
        }
        Err(e) => Err(format!("Failed to pause recording: {}", e)),
    }
}

/// Resume screen recording
#[tauri::command]
pub async fn resume_recording(
    recorder: State<'_, SharedRecorder>,
    state: State<'_, Arc<Mutex<RecordingState>>>,
) -> Result<(), String> {
    let mut recorder = recorder.lock().await;
    let mut state = state.lock().await;

    match recorder.resume().await {
        Ok(_) => {
            state.status = RecordingStatus::Recording;
            Ok(())
        }
        Err(e) => Err(format!("Failed to resume recording: {}", e)),
    }
}

/// Cancel screen recording
#[tauri::command]
pub async fn cancel_recording(
    recorder: State<'_, SharedRecorder>,
    state: State<'_, Arc<Mutex<RecordingState>>>,
) -> Result<(), String> {
    let mut recorder = recorder.lock().await;
    let mut state = state.lock().await;

    match recorder.cancel().await {
        Ok(_) => {
            state.reset();
            Ok(())
        }
        Err(e) => Err(format!("Failed to cancel recording: {}", e)),
    }
}

/// Check if FFmpeg sidecar is available
#[tauri::command]
pub async fn check_ffmpeg_available(app_handle: AppHandle) -> Result<bool, String> {
    crate::recording::ffmpeg::check_ffmpeg(&app_handle)
        .await
        .map_err(|e| e.to_string())
}

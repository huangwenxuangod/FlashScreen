use tauri::Emitter;
use std::sync::Arc;
use tokio::sync::Mutex;

// Modules
mod commands;
mod recording;

// Re-exports
use commands::recording::{get_recording_state, start_recording, stop_recording, pause_recording, resume_recording, cancel_recording, check_ffmpeg_available};
use commands::settings::{get_settings, update_settings, get_output_directory, select_output_directory, load_settings};
use commands::files::{get_recordings, delete_recording, rename_recording, show_in_folder, open_file};
use recording::{FFmpegRecorder, RecordingState};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Initialize shared state
    let recorder = Arc::new(Mutex::new(FFmpegRecorder::new()));
    let recording_state = Arc::new(Mutex::new(RecordingState::new()));
    let settings = Arc::new(Mutex::new(load_settings()));

    tauri::Builder::default()
        // Plugins
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        // Managed state
        .manage(recorder)
        .manage(recording_state)
        .manage(settings)
        // Setup
        .setup(|app| {
            // Setup global shortcuts
            setup_global_shortcuts(app)?;
            Ok(())
        })
        // Commands
        .invoke_handler(tauri::generate_handler![
            // Recording commands
            get_recording_state,
            start_recording,
            stop_recording,
            pause_recording,
            resume_recording,
            cancel_recording,
            check_ffmpeg_available,
            // Settings commands
            get_settings,
            update_settings,
            get_output_directory,
            select_output_directory,
            // Files commands
            get_recordings,
            delete_recording,
            rename_recording,
            show_in_folder,
            open_file,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn setup_global_shortcuts(app: &tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    use tauri_plugin_global_shortcut::{GlobalShortcutExt, Shortcut, ShortcutState};

    // Helper macro to register shortcut with error handling
    macro_rules! register_shortcut {
        ($app:expr, $key:expr, $event:expr) => {{
            let handle = $app.handle().clone();
            if let Ok(shortcut) = $key.parse::<Shortcut>() {
                if let Err(e) = $app.global_shortcut().on_shortcut(shortcut, move |_app, _shortcut, event| {
                    if event.state == ShortcutState::Pressed {
                        let _ = handle.emit($event, ());
                    }
                }) {
                    eprintln!("Warning: Failed to register {}: {}", $key, e);
                }
            }
        }};
    }

    // Register F1 - Start/Stop Recording
    register_shortcut!(app, "F1", "hotkey-start-stop");

    // Register F2 - Pause/Resume
    register_shortcut!(app, "F2", "hotkey-pause-resume");

    // Register F3 - Cancel
    register_shortcut!(app, "F3", "hotkey-cancel");

    // Register F4 - Toggle Camera
    register_shortcut!(app, "F4", "hotkey-toggle-camera");

    Ok(())
}

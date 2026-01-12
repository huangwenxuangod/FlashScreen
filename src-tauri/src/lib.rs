use tauri::Manager;

// Commands module
mod commands;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .setup(|app| {
            // Setup global shortcuts
            setup_global_shortcuts(app)?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::get_recording_state,
            commands::start_recording,
            commands::stop_recording,
            commands::pause_recording,
            commands::resume_recording,
            commands::cancel_recording,
            commands::get_settings,
            commands::update_settings,
            commands::get_output_directory,
            commands::select_output_directory,
            commands::get_recordings,
            commands::delete_recording,
            commands::rename_recording,
            commands::show_in_folder,
            commands::open_file,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn setup_global_shortcuts(app: &tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    use tauri_plugin_global_shortcut::{GlobalShortcutExt, Shortcut, ShortcutState};
    
    let handle = app.handle().clone();
    
    // Register F1 - Start/Stop Recording
    let f1: Shortcut = "F1".parse()?;
    app.global_shortcut().on_shortcut(f1, move |_app, _shortcut, event| {
        if event.state == ShortcutState::Pressed {
            let _ = handle.emit("hotkey-start-stop", ());
        }
    })?;
    
    let handle = app.handle().clone();
    
    // Register F2 - Pause/Resume
    let f2: Shortcut = "F2".parse()?;
    app.global_shortcut().on_shortcut(f2, move |_app, _shortcut, event| {
        if event.state == ShortcutState::Pressed {
            let _ = handle.emit("hotkey-pause-resume", ());
        }
    })?;
    
    let handle = app.handle().clone();
    
    // Register F3 - Cancel
    let f3: Shortcut = "F3".parse()?;
    app.global_shortcut().on_shortcut(f3, move |_app, _shortcut, event| {
        if event.state == ShortcutState::Pressed {
            let _ = handle.emit("hotkey-cancel", ());
        }
    })?;
    
    let handle = app.handle().clone();
    
    // Register F4 - Toggle Camera
    let f4: Shortcut = "F4".parse()?;
    app.global_shortcut().on_shortcut(f4, move |_app, _shortcut, event| {
        if event.state == ShortcutState::Pressed {
            let _ = handle.emit("hotkey-toggle-camera", ());
        }
    })?;
    
    Ok(())
}

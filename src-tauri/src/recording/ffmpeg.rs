use anyhow::{anyhow, Result};
use std::path::PathBuf;
use std::sync::Arc;
use tauri::AppHandle;
use tauri_plugin_shell::{ShellExt, process::CommandChild};

use super::state::{RecordingMode, RecordingSources, Region};

/// FFmpeg recorder for screen capture using embedded sidecar
pub struct FFmpegRecorder {
    process: Option<CommandChild>,
    output_path: Option<PathBuf>,
    is_paused: bool,
    app_handle: Option<Arc<AppHandle>>,
}

impl FFmpegRecorder {
    pub fn new() -> Self {
        Self {
            process: None,
            output_path: None,
            is_paused: false,
            app_handle: None,
        }
    }

    /// Set the app handle for sidecar access
    pub fn set_app_handle(&mut self, handle: Arc<AppHandle>) {
        self.app_handle = Some(handle);
    }

    /// Build FFmpeg arguments for screen recording
    fn build_args(
        &self,
        mode: RecordingMode,
        region: Option<&Region>,
        sources: &RecordingSources,
        output_path: &PathBuf,
        resolution: &str,
        frame_rate: u32,
    ) -> Vec<String> {
        let mut args: Vec<String> = Vec::new();

        // Input: Screen capture using GDI grab (Windows)
        args.push("-f".to_string());
        args.push("gdigrab".to_string());

        // Frame rate
        args.push("-framerate".to_string());
        args.push(frame_rate.to_string());

        // Region settings
        match mode {
            RecordingMode::Fullscreen => {
                args.push("-i".to_string());
                args.push("desktop".to_string());
            }
            RecordingMode::Window => {
                // For window capture, use title parameter
                // This will be set dynamically when we know the window title
                args.push("-i".to_string());
                args.push("desktop".to_string());
            }
            RecordingMode::Region => {
                if let Some(r) = region {
                    args.push("-offset_x".to_string());
                    args.push(r.x.to_string());
                    args.push("-offset_y".to_string());
                    args.push(r.y.to_string());
                    args.push("-video_size".to_string());
                    args.push(format!("{}x{}", r.width, r.height));
                }
                args.push("-i".to_string());
                args.push("desktop".to_string());
            }
        }

        // Audio input: System audio using Windows Audio Session API (WASAPI) loopback
        // This captures desktop/system audio
        if sources.system_audio {
            args.push("-f".to_string());
            args.push("dshow".to_string());
            args.push("-i".to_string());
            args.push("audio=Stereo Mix".to_string());
        }

        // Audio input: Default microphone
        if sources.microphone {
            args.push("-f".to_string());
            args.push("dshow".to_string());
            args.push("-i".to_string());
            args.push("audio=Microphone".to_string());
        }

        // Video codec settings
        args.push("-c:v".to_string());
        args.push("libx264".to_string());
        args.push("-preset".to_string());
        args.push("ultrafast".to_string()); // Fast encoding for real-time
        args.push("-tune".to_string());
        args.push("zerolatency".to_string());
        args.push("-crf".to_string());
        args.push("23".to_string()); // Quality setting

        // Resolution scaling if needed
        match resolution {
            "720p" => {
                args.push("-vf".to_string());
                args.push("scale=1280:720".to_string());
            }
            "1080p" => {
                args.push("-vf".to_string());
                args.push("scale=1920:1080".to_string());
            }
            "1440p" => {
                args.push("-vf".to_string());
                args.push("scale=2560:1440".to_string());
            }
            "4k" => {
                args.push("-vf".to_string());
                args.push("scale=3840:2160".to_string());
            }
            _ => {} // Original resolution
        }

        // Audio codec
        if sources.system_audio || sources.microphone {
            args.push("-c:a".to_string());
            args.push("aac".to_string());
            args.push("-b:a".to_string());
            args.push("128k".to_string());
        }

        // Output format
        args.push("-f".to_string());
        args.push("mp4".to_string());
        args.push("-movflags".to_string());
        args.push("+faststart".to_string());

        // Overwrite output file if exists
        args.push("-y".to_string());

        // Output path
        args.push(output_path.to_string_lossy().to_string());

        // Suppress banner
        args.push("-hide_banner".to_string());
        args.push("-loglevel".to_string());
        args.push("error".to_string());

        args
    }

    /// Start recording using embedded FFmpeg sidecar
    pub async fn start(
        &mut self,
        mode: RecordingMode,
        region: Option<Region>,
        sources: RecordingSources,
        output_dir: &PathBuf,
        resolution: &str,
        frame_rate: u32,
    ) -> Result<PathBuf> {
        if self.process.is_some() {
            return Err(anyhow!("Recording already in progress"));
        }

        let app_handle = self.app_handle.as_ref()
            .ok_or_else(|| anyhow!("App handle not set"))?;

        // Generate output filename
        let timestamp = chrono::Local::now().format("%Y%m%d_%H%M%S");
        let filename = format!("FlashScreen_{}.mp4", timestamp);
        let output_path = output_dir.join(&filename);

        // Ensure output directory exists
        if !output_dir.exists() {
            std::fs::create_dir_all(output_dir)?;
        }

        // Build FFmpeg arguments
        let args = self.build_args(
            mode,
            region.as_ref(),
            &sources,
            &output_path,
            resolution,
            frame_rate,
        );

        // Use sidecar (embedded FFmpeg)
        let shell = app_handle.shell();
        let sidecar = shell.sidecar("ffmpeg")
            .map_err(|e| anyhow!("Failed to create sidecar: {}", e))?
            .args(&args);

        let (mut _rx, child) = sidecar.spawn()
            .map_err(|e| anyhow!("Failed to spawn FFmpeg: {}", e))?;

        self.process = Some(child);
        self.output_path = Some(output_path.clone());
        self.is_paused = false;

        Ok(output_path)
    }

    /// Stop recording
    pub async fn stop(&mut self) -> Result<Option<PathBuf>> {
        if let Some(process) = self.process.take() {
            // Send 'q' to FFmpeg stdin to gracefully stop
            let _ = process.write(b"q");
            
            // Give FFmpeg time to finish writing
            tokio::time::sleep(tokio::time::Duration::from_millis(500)).await;
            
            // Kill if still running
            let _ = process.kill();

            let output = self.output_path.take();
            self.is_paused = false;

            Ok(output)
        } else {
            Ok(None)
        }
    }

    /// Pause recording (Windows: not directly supported, we'll stop and restart)
    pub async fn pause(&mut self) -> Result<()> {
        self.is_paused = true;
        // Note: FFmpeg doesn't support pause natively
        // For a proper implementation, we'd need to use segment recording
        // and merge segments later
        Ok(())
    }

    /// Resume recording
    pub async fn resume(&mut self) -> Result<()> {
        self.is_paused = false;
        Ok(())
    }

    /// Cancel recording and delete output file
    pub async fn cancel(&mut self) -> Result<()> {
        if let Some(process) = self.process.take() {
            // Kill the process immediately
            let _ = process.kill();

            // Delete the incomplete file
            if let Some(path) = self.output_path.take() {
                // Give a moment for file handle to release
                tokio::time::sleep(tokio::time::Duration::from_millis(100)).await;
                if path.exists() {
                    let _ = std::fs::remove_file(path);
                }
            }
        }

        self.is_paused = false;
        Ok(())
    }

    /// Check if recording is in progress
    pub fn is_recording(&self) -> bool {
        self.process.is_some() && !self.is_paused
    }

    /// Check if recording is paused
    pub fn is_paused(&self) -> bool {
        self.is_paused
    }

    /// Get current output path
    pub fn output_path(&self) -> Option<&PathBuf> {
        self.output_path.as_ref()
    }
}

impl Default for FFmpegRecorder {
    fn default() -> Self {
        Self::new()
    }
}

/// Get list of available audio devices using sidecar
pub async fn get_audio_devices(app_handle: &AppHandle) -> Result<Vec<String>> {
    let shell = app_handle.shell();
    let output = shell.sidecar("ffmpeg")
        .map_err(|e| anyhow!("Sidecar error: {}", e))?
        .args(["-list_devices", "true", "-f", "dshow", "-i", "dummy"])
        .output()
        .await
        .map_err(|e| anyhow!("Failed to run FFmpeg: {}", e))?;

    let stderr = String::from_utf8_lossy(&output.stderr);
    let devices: Vec<String> = stderr
        .lines()
        .filter(|line| line.contains("audio"))
        .map(|s| s.to_string())
        .collect();

    Ok(devices)
}

/// Get list of available video devices (cameras) using sidecar
pub async fn get_video_devices(app_handle: &AppHandle) -> Result<Vec<String>> {
    let shell = app_handle.shell();
    let output = shell.sidecar("ffmpeg")
        .map_err(|e| anyhow!("Sidecar error: {}", e))?
        .args(["-list_devices", "true", "-f", "dshow", "-i", "dummy"])
        .output()
        .await
        .map_err(|e| anyhow!("Failed to run FFmpeg: {}", e))?;

    let stderr = String::from_utf8_lossy(&output.stderr);
    let devices: Vec<String> = stderr
        .lines()
        .filter(|line| line.contains("video"))
        .map(|s| s.to_string())
        .collect();

    Ok(devices)
}

/// Check if FFmpeg sidecar is available
pub async fn check_ffmpeg(app_handle: &AppHandle) -> Result<bool> {
    let shell = app_handle.shell();
    let result = shell.sidecar("ffmpeg")
        .map_err(|e| anyhow!("Sidecar error: {}", e))?
        .args(["-version"])
        .output()
        .await;

    match result {
        Ok(o) => Ok(o.status.success()),
        Err(_) => Ok(false),
    }
}

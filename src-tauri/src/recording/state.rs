use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tokio::sync::Mutex;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
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

impl Default for RecordingStatus {
    fn default() -> Self {
        Self::Idle
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum RecordingMode {
    Fullscreen,
    Window,
    Region,
}

impl Default for RecordingMode {
    fn default() -> Self {
        Self::Fullscreen
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Region {
    pub x: i32,
    pub y: i32,
    pub width: u32,
    pub height: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct RecordingSources {
    pub microphone: bool,
    pub system_audio: bool,
    pub camera: bool,
}

#[derive(Debug, Clone, Default)]
pub struct RecordingState {
    pub status: RecordingStatus,
    pub mode: RecordingMode,
    pub duration: u64,
    pub region: Option<Region>,
    pub window_id: Option<String>,
    pub sources: RecordingSources,
    pub output_path: Option<String>,
    pub start_time: Option<std::time::Instant>,
}

impl RecordingState {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn reset(&mut self) {
        *self = Self::default();
    }
}

pub type SharedRecordingState = Arc<Mutex<RecordingState>>;

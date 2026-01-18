# Download FFmpeg for Windows
# This script downloads the static FFmpeg build and places it in the correct location

$ErrorActionPreference = "Stop"

$FFMPEG_VERSION = "7.1"
$FFMPEG_URL = "https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-n${FFMPEG_VERSION}-latest-win64-gpl.zip"
$TARGET_DIR = "$PSScriptRoot\..\src-tauri\binaries"
$TEMP_DIR = "$env:TEMP\ffmpeg-download"

Write-Host "=== FlashScreen FFmpeg Downloader ===" -ForegroundColor Cyan
Write-Host ""

# Create directories
if (!(Test-Path $TARGET_DIR)) {
    New-Item -ItemType Directory -Path $TARGET_DIR -Force | Out-Null
}

if (!(Test-Path $TEMP_DIR)) {
    New-Item -ItemType Directory -Path $TEMP_DIR -Force | Out-Null
}

$zipPath = "$TEMP_DIR\ffmpeg.zip"
$targetExe = "$TARGET_DIR\ffmpeg-x86_64-pc-windows-msvc.exe"

# Check if already exists
if (Test-Path $targetExe) {
    Write-Host "FFmpeg already exists at: $targetExe" -ForegroundColor Yellow
    $response = Read-Host "Do you want to re-download? (y/N)"
    if ($response -ne "y" -and $response -ne "Y") {
        Write-Host "Skipping download." -ForegroundColor Green
        exit 0
    }
}

Write-Host "Downloading FFmpeg $FFMPEG_VERSION..." -ForegroundColor Yellow
Write-Host "URL: $FFMPEG_URL"
Write-Host ""

try {
    # Download with progress
    $ProgressPreference = 'SilentlyContinue'
    Invoke-WebRequest -Uri $FFMPEG_URL -OutFile $zipPath -UseBasicParsing
    $ProgressPreference = 'Continue'
    
    Write-Host "Download complete. Extracting..." -ForegroundColor Yellow
    
    # Extract
    Expand-Archive -Path $zipPath -DestinationPath $TEMP_DIR -Force
    
    # Find ffmpeg.exe
    $ffmpegExe = Get-ChildItem -Path $TEMP_DIR -Recurse -Filter "ffmpeg.exe" | Select-Object -First 1
    
    if ($ffmpegExe) {
        # Copy to target with correct name for Tauri sidecar
        Copy-Item -Path $ffmpegExe.FullName -Destination $targetExe -Force
        Write-Host ""
        Write-Host "SUCCESS! FFmpeg installed to:" -ForegroundColor Green
        Write-Host "  $targetExe" -ForegroundColor Cyan
        
        # Verify
        $version = & $targetExe -version 2>&1 | Select-Object -First 1
        Write-Host ""
        Write-Host "Version: $version" -ForegroundColor Gray
    } else {
        throw "ffmpeg.exe not found in the archive"
    }
}
catch {
    Write-Host "ERROR: $_" -ForegroundColor Red
    exit 1
}
finally {
    # Cleanup
    if (Test-Path $TEMP_DIR) {
        Remove-Item -Path $TEMP_DIR -Recurse -Force -ErrorAction SilentlyContinue
    }
}

Write-Host ""
Write-Host "Done! You can now run 'pnpm tauri dev' or 'pnpm tauri build'" -ForegroundColor Green

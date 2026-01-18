import { Monitor, AppWindow, Scan, MousePointer2 } from "lucide-react";
import { useRecordingStore } from "@/stores";
import { formatDuration } from "@/utils";

export function PreviewArea() {
  const { status, mode, duration, region } = useRecordingStore();

  const isRecording = status === "recording";
  const isPaused = status === "paused";
  const isActive = isRecording || isPaused;

  const modeConfig = {
    fullscreen: {
      icon: Monitor,
      label: "全屏录制",
      description: "录制整个屏幕",
      color: "blue",
    },
    window: {
      icon: AppWindow,
      label: "窗口录制",
      description: "录制指定窗口（暂未实现窗口选择）",
      color: "purple",
    },
    region: {
      icon: Scan,
      label: "区域录制",
      description: region 
        ? `${region.width} × ${region.height} px`
        : "点击开始录制后选择区域（暂未实现）",
      color: "orange",
    },
  };

  const config = modeConfig[mode];
  const ModeIcon = config.icon;

  const colorClasses = {
    blue: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
      text: "text-blue-400",
      icon: "text-blue-500/40",
    },
    purple: {
      bg: "bg-purple-500/10",
      border: "border-purple-500/30",
      text: "text-purple-400",
      icon: "text-purple-500/40",
    },
    orange: {
      bg: "bg-orange-500/10",
      border: "border-orange-500/30",
      text: "text-orange-400",
      icon: "text-orange-500/40",
    },
  };

  const colors = colorClasses[config.color as keyof typeof colorClasses];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/30 via-black to-black" />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-lg">
        {/* Preview box */}
        <div
          className={`relative w-full aspect-video rounded-xl border-2 transition-all duration-300 ${
            isActive
              ? "border-red-500/50 bg-red-500/5"
              : `${colors.border} ${colors.bg}`
          }`}
        >
          {/* Corner markers */}
          <div className={`absolute top-3 left-3 w-5 h-5 border-l-2 border-t-2 rounded-tl ${isActive ? 'border-red-500/50' : colors.border}`} />
          <div className={`absolute top-3 right-3 w-5 h-5 border-r-2 border-t-2 rounded-tr ${isActive ? 'border-red-500/50' : colors.border}`} />
          <div className={`absolute bottom-3 left-3 w-5 h-5 border-l-2 border-b-2 rounded-bl ${isActive ? 'border-red-500/50' : colors.border}`} />
          <div className={`absolute bottom-3 right-3 w-5 h-5 border-r-2 border-b-2 rounded-br ${isActive ? 'border-red-500/50' : colors.border}`} />

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6">
            {isActive ? (
              <>
                {/* Recording state */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full ${
                      isRecording
                        ? "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)] animate-pulse"
                        : "bg-yellow-500"
                    }`}
                  />
                  <span className="text-lg font-medium text-white/90">
                    {isRecording ? "正在录制" : "已暂停"}
                  </span>
                </div>
                
                {/* Timer */}
                <span className="text-5xl font-mono font-light text-white tracking-wider">
                  {formatDuration(duration)}
                </span>
                
                {/* Mode indicator */}
                <div className="flex items-center gap-2 text-white/40 text-sm">
                  <ModeIcon className="w-4 h-4" />
                  <span>{config.label}</span>
                </div>
              </>
            ) : (
              <>
                {/* Mode icon */}
                <div className={`w-20 h-20 rounded-2xl ${colors.bg} flex items-center justify-center`}>
                  <ModeIcon className={`w-10 h-10 ${colors.icon}`} />
                </div>
                
                {/* Mode info */}
                <div className="text-center">
                  <h3 className={`text-lg font-medium ${colors.text} mb-1`}>
                    {config.label}
                  </h3>
                  <p className="text-sm text-white/40">
                    {config.description}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Recording border glow */}
          {isRecording && (
            <div className="absolute inset-0 rounded-xl border-2 border-red-500/30 animate-pulse pointer-events-none" />
          )}

          {/* Cursor indicator for region mode */}
          {mode === "region" && !isActive && (
            <div className="absolute bottom-4 right-4 flex items-center gap-1.5 text-white/30 text-xs">
              <MousePointer2 className="w-3.5 h-3.5" />
              <span>拖动选择区域</span>
            </div>
          )}
        </div>

        {/* Hints */}
        {!isActive && (
          <div className="flex items-center gap-4 text-xs text-white/30">
            <span>
              按 <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/50 mx-1">F1</kbd> 开始录制
            </span>
            <span className="text-white/20">|</span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/50 mx-1">F2</kbd> 暂停
            </span>
            <span className="text-white/20">|</span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/50 mx-1">F3</kbd> 取消
            </span>
          </div>
        )}
        
        {/* Source indicators when active */}
        {isActive && (
          <SourceIndicators />
        )}
      </div>
    </div>
  );
}

function SourceIndicators() {
  const { sources } = useRecordingStore();
  
  return (
    <div className="flex items-center gap-3">
      {sources.microphone && (
        <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 rounded text-emerald-400 text-xs">
          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          麦克风
        </div>
      )}
      {sources.systemAudio && (
        <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 rounded text-emerald-400 text-xs">
          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          系统音频
        </div>
      )}
      {sources.camera && (
        <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-500/10 rounded text-blue-400 text-xs">
          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
          摄像头
        </div>
      )}
    </div>
  );
}

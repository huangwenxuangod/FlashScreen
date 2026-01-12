import { getCurrentWindow } from "@tauri-apps/api/window";
import { Minus, Square, X } from "lucide-react";
import { cn } from "@/utils";

export function TitleBar() {
  const appWindow = getCurrentWindow();

  const handleMinimize = () => appWindow.minimize();
  const handleMaximize = () => appWindow.toggleMaximize();
  const handleClose = () => appWindow.close();

  return (
    <div
      data-tauri-drag-region
      className="h-8 flex items-center justify-between px-3 bg-[var(--bg-secondary)] border-b border-[var(--border-default)]"
    >
      {/* App title */}
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[var(--accent-red)]" />
        <span className="text-xs font-medium text-[var(--text-secondary)]">
          FlashScreen
        </span>
      </div>

      {/* Window controls */}
      <div className="flex items-center -mr-1">
        <WindowButton onClick={handleMinimize} aria-label="Minimize">
          <Minus className="w-3.5 h-3.5" />
        </WindowButton>
        <WindowButton onClick={handleMaximize} aria-label="Maximize">
          <Square className="w-3 h-3" />
        </WindowButton>
        <WindowButton
          onClick={handleClose}
          aria-label="Close"
          className="hover:bg-[var(--accent-red)] hover:text-white"
        >
          <X className="w-3.5 h-3.5" />
        </WindowButton>
      </div>
    </div>
  );
}

function WindowButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "w-8 h-8 flex items-center justify-center",
        "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]",
        "hover:bg-[var(--bg-tertiary)] transition-colors",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}


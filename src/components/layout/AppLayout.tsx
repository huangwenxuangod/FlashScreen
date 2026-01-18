import { TitleBar } from "./TitleBar";
import { ControlBar } from "./ControlBar";
import { PreviewArea } from "./PreviewArea";

export function AppLayout() {
  return (
    <div className="h-full flex flex-col bg-black overflow-hidden">
      {/* Title Bar */}
      <TitleBar />

      {/* Preview Area - 占据主要空间 */}
      <PreviewArea />

      {/* Control Bar - 底部控制栏 */}
      <ControlBar />
    </div>
  );
}

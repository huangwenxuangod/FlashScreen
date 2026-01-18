import { Button, Chip, Divider, Tooltip } from "@heroui/react";
import {
  Monitor,
  AppWindow,
  Scan,
  Mic,
  Volume2,
  Camera,
  FolderOpen,
  Settings,
  HelpCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRecordingStore, useUIStore } from "@/stores";
import type { RecordingMode, RecordingSources } from "@/types";

export function Sidebar() {
  const { t } = useTranslation();

  return (
    <aside className="w-56 flex flex-col bg-zinc-950 border-r border-zinc-800/50 shrink-0">
      {/* Recording Modes */}
      <div className="p-3">
        <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-1">
          {t("sidebar.mode")}
        </p>
        <RecordingModes />
      </div>

      <Divider className="bg-zinc-800/50" />

      {/* Sources */}
      <div className="p-3">
        <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-1">
          {t("sidebar.sources")}
        </p>
        <SourceToggles />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      <Divider className="bg-zinc-800/50" />

      {/* Bottom Actions */}
      <div className="p-3 space-y-1">
        <SidebarButton
          icon={FolderOpen}
          label={t("sidebar.files")}
          onClick={() => useUIStore.getState().setPanel("files")}
        />
        <SidebarButton
          icon={Settings}
          label={t("sidebar.settings")}
          onClick={() => useUIStore.getState().setPanel("settings")}
        />
        <SidebarButton
          icon={HelpCircle}
          label={t("sidebar.help")}
          onClick={() => {}}
        />
      </div>
    </aside>
  );
}

function RecordingModes() {
  const { t } = useTranslation();
  const { mode, setMode, status } = useRecordingStore();
  const isDisabled = status !== "idle";

  const modes: { id: RecordingMode; icon: typeof Monitor; label: string }[] = [
    { id: "fullscreen", icon: Monitor, label: t("mode.fullscreen") },
    { id: "window", icon: AppWindow, label: t("mode.window") },
    { id: "region", icon: Scan, label: t("mode.region") },
  ];

  return (
    <div className="space-y-1">
      {modes.map(({ id, icon: Icon, label }) => (
        <Button
          key={id}
          variant={mode === id ? "flat" : "light"}
          color={mode === id ? "primary" : "default"}
          className={`w-full justify-start gap-3 h-10 ${
            mode === id ? "bg-primary/10" : "text-zinc-400 hover:text-white"
          }`}
          isDisabled={isDisabled}
          onPress={() => setMode(id)}
        >
          <Icon className="w-4 h-4" />
          <span className="text-sm">{label}</span>
        </Button>
      ))}
    </div>
  );
}

function SourceToggles() {
  const { t } = useTranslation();
  const { sources, toggleSource, status } = useRecordingStore();
  const isDisabled = status !== "idle";

  const sourceList: {
    id: keyof RecordingSources;
    icon: typeof Mic;
    label: string;
    hotkey?: string;
  }[] = [
    { id: "microphone", icon: Mic, label: t("source.microphone") },
    { id: "systemAudio", icon: Volume2, label: t("source.systemAudio") },
    { id: "camera", icon: Camera, label: t("source.camera"), hotkey: "F4" },
  ];

  return (
    <div className="space-y-1">
      {sourceList.map(({ id, icon: Icon, label, hotkey }) => {
        const isActive = sources[id];
        return (
          <Tooltip key={id} content={hotkey ? `${label} (${hotkey})` : label}>
            <Button
              variant={isActive ? "flat" : "light"}
              color={isActive ? "success" : "default"}
              className={`w-full justify-between h-10 ${
                isActive
                  ? "bg-success/10"
                  : "text-zinc-400 hover:text-white"
              }`}
              isDisabled={isDisabled}
              onPress={() => toggleSource(id)}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4" />
                <span className="text-sm">{label}</span>
              </div>
              <div className="flex items-center gap-2">
                {hotkey && (
                  <Chip size="sm" variant="flat" className="h-5 text-[10px] bg-zinc-800 text-zinc-400">
                    {hotkey}
                  </Chip>
                )}
                <div
                  className={`w-2 h-2 rounded-full transition-colors ${
                    isActive ? "bg-success" : "bg-zinc-600"
                  }`}
                />
              </div>
            </Button>
          </Tooltip>
        );
      })}
    </div>
  );
}

interface SidebarButtonProps {
  icon: typeof Monitor;
  label: string;
  onClick: () => void;
}

function SidebarButton({ icon: Icon, label, onClick }: SidebarButtonProps) {
  return (
    <Button
      variant="light"
      className="w-full justify-start gap-3 h-9 text-zinc-400 hover:text-white"
      onPress={onClick}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm">{label}</span>
    </Button>
  );
}

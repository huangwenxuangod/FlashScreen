import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Folder } from "lucide-react";
import { PanelHeader } from "@/components/layout";
import { Card, Button } from "@/components/ui";
import { useSettingsStore } from "@/stores";

export function SettingsPanel() {
  const { t } = useTranslation();
  const { settings } = useSettingsStore();

  return (
    <motion.div
      className="h-full flex flex-col"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
    >
      <PanelHeader title={t("settings.title")} />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Output Settings */}
        <Card className="p-4">
          <h3 className="text-sm font-medium text-[var(--text-primary)] mb-3">
            {t("settings.output.title")}
          </h3>
          <div className="space-y-3">
            <SettingRow label={t("settings.output.directory")}>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--text-secondary)] truncate max-w-[180px]">
                  {settings.output.directory || "未设置"}
                </span>
                <Button size="sm" variant="ghost">
                  <Folder className="w-4 h-4" />
                </Button>
              </div>
            </SettingRow>
            <SettingRow label={t("settings.output.resolution")}>
              <span className="text-sm text-[var(--text-secondary)]">
                {settings.output.resolution}
              </span>
            </SettingRow>
            <SettingRow label={t("settings.output.frameRate")}>
              <span className="text-sm text-[var(--text-secondary)]">
                {settings.output.frameRate} FPS
              </span>
            </SettingRow>
          </div>
        </Card>

        {/* Hotkeys */}
        <Card className="p-4">
          <h3 className="text-sm font-medium text-[var(--text-primary)] mb-3">
            {t("settings.hotkeys.title")}
          </h3>
          <div className="space-y-3">
            <SettingRow label={t("settings.hotkeys.startStop")}>
              <HotkeyBadge>{settings.hotkeys.startStop}</HotkeyBadge>
            </SettingRow>
            <SettingRow label={t("settings.hotkeys.pauseResume")}>
              <HotkeyBadge>{settings.hotkeys.pauseResume}</HotkeyBadge>
            </SettingRow>
            <SettingRow label={t("settings.hotkeys.cancel")}>
              <HotkeyBadge>{settings.hotkeys.cancel}</HotkeyBadge>
            </SettingRow>
            <SettingRow label={t("settings.hotkeys.toggleCamera")}>
              <HotkeyBadge>{settings.hotkeys.toggleCamera}</HotkeyBadge>
            </SettingRow>
          </div>
        </Card>

        {/* About */}
        <Card className="p-4">
          <h3 className="text-sm font-medium text-[var(--text-primary)] mb-3">
            {t("settings.about.title")}
          </h3>
          <div className="space-y-3">
            <SettingRow label={t("settings.about.version")}>
              <span className="text-sm text-[var(--text-secondary)]">1.0.0</span>
            </SettingRow>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}

function SettingRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-[var(--text-secondary)]">{label}</span>
      {children}
    </div>
  );
}

function HotkeyBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-2 py-1 text-xs font-mono bg-[var(--bg-elevated)] text-[var(--text-secondary)] rounded-[var(--radius-sm)] border border-[var(--border-default)]">
      {children}
    </span>
  );
}


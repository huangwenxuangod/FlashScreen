import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Folder, Globe, Monitor, Keyboard, Info, ChevronRight } from "lucide-react";
import { PanelHeader } from "@/components/layout";
import { useSettingsStore } from "@/stores";
import { cn } from "@/utils";

export function SettingsPanel() {
  const { t } = useTranslation();
  const { settings } = useSettingsStore();

  return (
    <div className="h-full flex flex-col bg-[var(--bg-base)]">
      <PanelHeader title={t("settings.title")} />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-6 space-y-6">
          {/* Output Settings */}
          <SettingsSection
            icon={Monitor}
            title={t("settings.output.title")}
          >
            <SettingItem
              label={t("settings.output.directory")}
              description={settings.output.directory || "未设置"}
              action={
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] text-[var(--text-sm)] text-[var(--text-secondary)] transition-colors">
                  <Folder className="w-4 h-4" />
                  选择
                </button>
              }
            />
            <SettingItem
              label={t("settings.output.resolution")}
              value={settings.output.resolution}
            />
            <SettingItem
              label={t("settings.output.frameRate")}
              value={`${settings.output.frameRate} FPS`}
            />
          </SettingsSection>

          {/* Hotkeys */}
          <SettingsSection
            icon={Keyboard}
            title={t("settings.hotkeys.title")}
          >
            <SettingItem
              label={t("settings.hotkeys.startStop")}
              value={<HotkeyBadge>{settings.hotkeys.startStop}</HotkeyBadge>}
            />
            <SettingItem
              label={t("settings.hotkeys.pauseResume")}
              value={<HotkeyBadge>{settings.hotkeys.pauseResume}</HotkeyBadge>}
            />
            <SettingItem
              label={t("settings.hotkeys.cancel")}
              value={<HotkeyBadge>{settings.hotkeys.cancel}</HotkeyBadge>}
            />
            <SettingItem
              label={t("settings.hotkeys.toggleCamera")}
              value={<HotkeyBadge>{settings.hotkeys.toggleCamera}</HotkeyBadge>}
            />
          </SettingsSection>

          {/* General */}
          <SettingsSection
            icon={Globe}
            title={t("settings.general.title")}
          >
            <SettingItem
              label={t("settings.general.language")}
              value={settings.general.language === "zh-CN" ? "简体中文" : "English"}
              hasArrow
            />
            <SettingItem
              label={t("settings.general.launchAtStartup")}
              value={
                <ToggleSwitch 
                  checked={settings.general.launchAtStartup} 
                  onChange={() => {}} 
                />
              }
            />
            <SettingItem
              label={t("settings.general.minimizeToTray")}
              value={
                <ToggleSwitch 
                  checked={settings.general.minimizeToTray} 
                  onChange={() => {}} 
                />
              }
            />
          </SettingsSection>

          {/* About */}
          <SettingsSection
            icon={Info}
            title={t("settings.about.title")}
          >
            <SettingItem
              label={t("settings.about.version")}
              value="1.0.0"
            />
            <SettingItem
              label="GitHub"
              value="github.com/flashscreen"
              hasArrow
            />
          </SettingsSection>
        </div>
      </div>
    </div>
  );
}

interface SettingsSectionProps {
  icon: typeof Monitor;
  title: string;
  children: React.ReactNode;
}

function SettingsSection({ icon: Icon, title, children }: SettingsSectionProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <Icon className="w-4 h-4 text-[var(--text-tertiary)]" />
        <h3 className="text-[var(--text-sm)] font-semibold text-[var(--text-secondary)]">
          {title}
        </h3>
      </div>
      <div className="rounded-[var(--radius-lg)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] overflow-hidden divide-y divide-[var(--border-subtle)]">
        {children}
      </div>
    </div>
  );
}

interface SettingItemProps {
  label: string;
  description?: string;
  value?: React.ReactNode;
  action?: React.ReactNode;
  hasArrow?: boolean;
}

function SettingItem({ label, description, value, action, hasArrow }: SettingItemProps) {
  const Wrapper = hasArrow ? "button" : "div";
  
  return (
    <Wrapper
      className={cn(
        "w-full flex items-center justify-between px-4 py-3",
        hasArrow && "hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
      )}
    >
      <div className="flex flex-col gap-0.5">
        <span className="text-[var(--text-sm)] text-[var(--text-primary)]">{label}</span>
        {description && (
          <span className="text-[var(--text-xs)] text-[var(--text-tertiary)] truncate max-w-[240px]">
            {description}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {action}
        {typeof value === "string" ? (
          <span className="text-[var(--text-sm)] text-[var(--text-secondary)]">{value}</span>
        ) : (
          value
        )}
        {hasArrow && (
          <ChevronRight className="w-4 h-4 text-[var(--text-quaternary)]" />
        )}
      </div>
    </Wrapper>
  );
}

function HotkeyBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-2.5 py-1 text-[var(--text-xs)] font-mono font-medium bg-[var(--bg-elevated)] text-[var(--text-secondary)] rounded-[var(--radius-sm)] border border-[var(--border-default)]">
      {children}
    </span>
  );
}

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function ToggleSwitch({ checked, onChange }: ToggleSwitchProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative w-11 h-6 rounded-full transition-colors duration-200",
        checked ? "bg-[var(--accent-primary)]" : "bg-[var(--bg-elevated)]"
      )}
    >
      <motion.div
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
        animate={{ left: checked ? 24 : 4 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

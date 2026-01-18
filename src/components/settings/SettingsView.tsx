import { Button, Card, CardBody, CardHeader, Chip, Divider, Switch } from "@heroui/react";
import { ArrowLeft, Folder, Monitor, Keyboard, Globe, Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useUIStore, useSettingsStore } from "@/stores";

export function SettingsView() {
  const { t } = useTranslation();
  const { setPanel } = useUIStore();
  const { settings } = useSettingsStore();

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-zinc-800/50">
        <Button
          isIconOnly
          size="sm"
          variant="light"
          className="text-zinc-400"
          onPress={() => setPanel("main")}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-lg font-semibold text-white">
          {t("settings.title")}
        </h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Output Settings */}
          <Card className="bg-zinc-900/50 border border-zinc-800">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-zinc-500" />
                <span className="text-sm font-medium text-zinc-300">
                  {t("settings.output.title")}
                </span>
              </div>
            </CardHeader>
            <CardBody className="pt-0">
              <div className="space-y-3">
                <SettingRow
                  label={t("settings.output.directory")}
                  description={settings.output.directory || "未设置"}
                  action={
                    <Button size="sm" variant="flat" className="bg-zinc-800">
                      <Folder className="w-4 h-4 mr-1" />
                      选择
                    </Button>
                  }
                />
                <Divider className="bg-zinc-800/50" />
                <SettingRow
                  label={t("settings.output.resolution")}
                  value={settings.output.resolution}
                />
                <Divider className="bg-zinc-800/50" />
                <SettingRow
                  label={t("settings.output.frameRate")}
                  value={`${settings.output.frameRate} FPS`}
                />
              </div>
            </CardBody>
          </Card>

          {/* Hotkeys */}
          <Card className="bg-zinc-900/50 border border-zinc-800">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Keyboard className="w-4 h-4 text-zinc-500" />
                <span className="text-sm font-medium text-zinc-300">
                  {t("settings.hotkeys.title")}
                </span>
              </div>
            </CardHeader>
            <CardBody className="pt-0">
              <div className="space-y-3">
                <SettingRow
                  label={t("settings.hotkeys.startStop")}
                  value={<HotkeyBadge>{settings.hotkeys.startStop}</HotkeyBadge>}
                />
                <Divider className="bg-zinc-800/50" />
                <SettingRow
                  label={t("settings.hotkeys.pauseResume")}
                  value={<HotkeyBadge>{settings.hotkeys.pauseResume}</HotkeyBadge>}
                />
                <Divider className="bg-zinc-800/50" />
                <SettingRow
                  label={t("settings.hotkeys.cancel")}
                  value={<HotkeyBadge>{settings.hotkeys.cancel}</HotkeyBadge>}
                />
                <Divider className="bg-zinc-800/50" />
                <SettingRow
                  label={t("settings.hotkeys.toggleCamera")}
                  value={<HotkeyBadge>{settings.hotkeys.toggleCamera}</HotkeyBadge>}
                />
              </div>
            </CardBody>
          </Card>

          {/* General */}
          <Card className="bg-zinc-900/50 border border-zinc-800">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-zinc-500" />
                <span className="text-sm font-medium text-zinc-300">
                  {t("settings.general.title")}
                </span>
              </div>
            </CardHeader>
            <CardBody className="pt-0">
              <div className="space-y-3">
                <SettingRow
                  label={t("settings.general.language")}
                  value={settings.general.language === "zh-CN" ? "简体中文" : "English"}
                />
                <Divider className="bg-zinc-800/50" />
                <SettingRow
                  label={t("settings.general.launchAtStartup")}
                  value={<Switch size="sm" isSelected={settings.general.launchAtStartup} />}
                />
                <Divider className="bg-zinc-800/50" />
                <SettingRow
                  label={t("settings.general.minimizeToTray")}
                  value={<Switch size="sm" isSelected={settings.general.minimizeToTray} />}
                />
              </div>
            </CardBody>
          </Card>

          {/* About */}
          <Card className="bg-zinc-900/50 border border-zinc-800">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-zinc-500" />
                <span className="text-sm font-medium text-zinc-300">
                  {t("settings.about.title")}
                </span>
              </div>
            </CardHeader>
            <CardBody className="pt-0">
              <SettingRow
                label={t("settings.about.version")}
                value="1.0.0"
              />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

interface SettingRowProps {
  label: string;
  description?: string;
  value?: React.ReactNode;
  action?: React.ReactNode;
}

function SettingRow({ label, description, value, action }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex flex-col">
        <span className="text-sm text-zinc-300">{label}</span>
        {description && (
          <span className="text-xs text-zinc-500 truncate max-w-[200px]">
            {description}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {action}
        {typeof value === "string" ? (
          <span className="text-sm text-zinc-400">{value}</span>
        ) : (
          value
        )}
      </div>
    </div>
  );
}

function HotkeyBadge({ children }: { children: React.ReactNode }) {
  return (
    <Chip size="sm" variant="flat" className="bg-zinc-800 text-zinc-300 font-mono">
      {children}
    </Chip>
  );
}

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings2,
  Monitor,
  Film,
  Zap,
  ChevronRight,
  Info,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/utils";
import { useRecordingStore, useSettingsStore } from "@/stores";

export function PropertiesPanel() {
  const { t } = useTranslation();
  const { mode, sources } = useRecordingStore();
  const { settings } = useSettingsStore();

  return (
    <aside className="w-[var(--panel-min-width)] flex flex-col bg-[var(--bg-surface)] border-l border-[var(--border-subtle)] shrink-0 overflow-hidden">
      {/* Panel Header */}
      <div className="panel-header">
        <div className="flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-[var(--text-tertiary)]" />
          <span className="panel-title">{t("properties.title")}</span>
        </div>
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Recording Mode Info */}
        <PropertyCard
          icon={Monitor}
          title={t("properties.mode")}
          value={t(`mode.${mode}`)}
        />

        {/* Output Settings */}
        <PropertyGroup title={t("properties.output")}>
          <PropertyRow
            label={t("properties.resolution")}
            value={settings.output.resolution}
          />
          <PropertyRow
            label={t("properties.frameRate")}
            value={`${settings.output.frameRate} FPS`}
          />
          <PropertyRow
            label={t("properties.format")}
            value={settings.output.format.toUpperCase()}
          />
        </PropertyGroup>

        {/* Active Sources */}
        <PropertyGroup title={t("properties.activeSources")}>
          <div className="flex flex-wrap gap-2">
            {sources.microphone && (
              <SourceBadge label={t("source.microphone")} active />
            )}
            {sources.systemAudio && (
              <SourceBadge label={t("source.systemAudio")} active />
            )}
            {sources.camera && (
              <SourceBadge label={t("source.camera")} active />
            )}
            {!sources.microphone && !sources.systemAudio && !sources.camera && (
              <span className="text-[var(--text-xs)] text-[var(--text-quaternary)]">
                {t("properties.noSources")}
              </span>
            )}
          </div>
        </PropertyGroup>

        {/* Quick Actions */}
        <PropertyGroup title={t("properties.quickSettings")}>
          <QuickSettingButton
            icon={Film}
            label={t("properties.quality")}
            value={settings.output.resolution}
          />
          <QuickSettingButton
            icon={Zap}
            label={t("properties.performance")}
            value={t("properties.balanced")}
          />
        </PropertyGroup>

        {/* Tips */}
        <div className="p-3 rounded-[var(--radius-md)] bg-[var(--accent-primary)]/5 border border-[var(--accent-primary)]/10">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
            <p className="text-[var(--text-xs)] text-[var(--text-tertiary)]">
              {t("properties.tip")}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

interface PropertyCardProps {
  icon: typeof Monitor;
  title: string;
  value: string;
}

function PropertyCard({ icon: Icon, title, value }: PropertyCardProps) {
  return (
    <div className="p-3 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--accent-primary)]/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-[var(--accent-primary)]" />
        </div>
        <div>
          <p className="text-[var(--text-xs)] text-[var(--text-tertiary)]">{title}</p>
          <p className="text-[var(--text-sm)] font-medium text-[var(--text-primary)]">{value}</p>
        </div>
      </div>
    </div>
  );
}

interface PropertyGroupProps {
  title: string;
  children: React.ReactNode;
}

function PropertyGroup({ title, children }: PropertyGroupProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-[var(--text-xs)] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
        {title}
      </h3>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
}

interface PropertyRowProps {
  label: string;
  value: string;
}

function PropertyRow({ label, value }: PropertyRowProps) {
  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-[var(--radius-sm)] hover:bg-[var(--bg-hover)] transition-colors">
      <span className="text-[var(--text-sm)] text-[var(--text-secondary)]">{label}</span>
      <span className="text-[var(--text-sm)] text-[var(--text-primary)]">{value}</span>
    </div>
  );
}

interface SourceBadgeProps {
  label: string;
  active?: boolean;
}

function SourceBadge({ label, active }: SourceBadgeProps) {
  return (
    <span className={cn(
      "px-2 py-1 rounded-full text-[var(--text-xs)] font-medium",
      active
        ? "bg-[var(--accent-success)]/10 text-[var(--accent-success)] border border-[var(--accent-success)]/20"
        : "bg-[var(--bg-elevated)] text-[var(--text-tertiary)]"
    )}>
      {label}
    </span>
  );
}

interface QuickSettingButtonProps {
  icon: typeof Monitor;
  label: string;
  value: string;
}

function QuickSettingButton({ icon: Icon, label, value }: QuickSettingButtonProps) {
  return (
    <button className="w-full flex items-center justify-between p-3 rounded-[var(--radius-md)] hover:bg-[var(--bg-hover)] transition-colors group">
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4 text-[var(--text-tertiary)]" />
        <span className="text-[var(--text-sm)] text-[var(--text-secondary)]">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[var(--text-sm)] text-[var(--text-primary)]">{value}</span>
        <ChevronRight className="w-4 h-4 text-[var(--text-quaternary)] group-hover:text-[var(--text-tertiary)] transition-colors" />
      </div>
    </button>
  );
}

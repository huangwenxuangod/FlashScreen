import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { 
  Search, 
  Play, 
  MoreVertical, 
  FileVideo, 
  FolderOpen,
  Trash2,
  Edit3,
  ExternalLink
} from "lucide-react";
import { useState } from "react";
import { PanelHeader } from "@/components/layout";
import { useFilesStore } from "@/stores";
import { formatDuration, formatFileSize } from "@/utils";
import { cn } from "@/utils";

export function FilesPanel() {
  const { t } = useTranslation();
  const { files, searchQuery, setSearchQuery } = useFilesStore();

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-[var(--bg-base)]">
      <PanelHeader
        title={t("files.title")}
        rightElement={
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-quaternary)]" />
            <input
              type="text"
              placeholder={t("files.search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 h-9 pl-10 pr-3 text-[var(--text-sm)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] text-[var(--text-primary)] placeholder:text-[var(--text-quaternary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
            />
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto p-6">
        {filteredFiles.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFiles.map((file, index) => (
              <motion.div
                key={file.path}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <FileCard file={file} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  const { t } = useTranslation();

  return (
    <div className="h-full flex flex-col items-center justify-center text-center">
      <div className="w-20 h-20 rounded-full bg-[var(--bg-surface)] flex items-center justify-center mb-4">
        <FileVideo className="w-10 h-10 text-[var(--text-quaternary)]" />
      </div>
      <h3 className="text-[var(--text-lg)] font-medium text-[var(--text-secondary)] mb-2">
        {t("files.empty")}
      </h3>
      <p className="text-[var(--text-sm)] text-[var(--text-tertiary)] max-w-xs">
        开始录制后，您的录制文件将显示在这里
      </p>
    </div>
  );
}

interface FileCardProps {
  file: {
    path: string;
    name: string;
    size: number;
    duration: number;
    resolution: string;
    frameRate: number;
    thumbnail?: string;
  };
}

function FileCard({ file }: FileCardProps) {
  const { t } = useTranslation();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="group relative rounded-[var(--radius-lg)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] overflow-hidden hover:border-[var(--border-default)] transition-colors">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-[var(--bg-elevated)]">
        {file.thumbnail ? (
          <img
            src={file.thumbnail}
            alt={file.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <FileVideo className="w-12 h-12 text-[var(--text-quaternary)]" />
          </div>
        )}

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
          <motion.button
            className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Play className="w-6 h-6 text-[var(--bg-void)] ml-1" fill="currentColor" />
          </motion.button>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 px-2 py-1 rounded-[var(--radius-sm)] bg-black/70 backdrop-blur-sm">
          <span className="text-[var(--text-xs)] font-medium text-white">
            {formatDuration(file.duration)}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-[var(--text-sm)] font-medium text-[var(--text-primary)] truncate">
              {file.name}
            </p>
            <p className="text-[var(--text-xs)] text-[var(--text-tertiary)] mt-1">
              {file.resolution} · {file.frameRate}fps · {formatFileSize(file.size)}
            </p>
          </div>

          {/* More Menu */}
          <div className="relative">
            <button
              className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-md)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] opacity-0 group-hover:opacity-100 transition-all"
              onClick={() => setShowMenu(!showMenu)}
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <motion.div
                  className="absolute right-0 top-full mt-1 w-40 py-1 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border-default)] shadow-lg z-20"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                >
                  <MenuButton icon={FolderOpen} label={t("files.openFolder")} />
                  <MenuButton icon={Edit3} label={t("files.rename")} />
                  <MenuButton icon={ExternalLink} label="打开" />
                  <div className="my-1 h-px bg-[var(--border-subtle)]" />
                  <MenuButton icon={Trash2} label={t("files.delete")} danger />
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface MenuButtonProps {
  icon: typeof Play;
  label: string;
  danger?: boolean;
  onClick?: () => void;
}

function MenuButton({ icon: Icon, label, danger, onClick }: MenuButtonProps) {
  return (
    <button
      className={cn(
        "w-full flex items-center gap-2 px-3 py-2 text-[var(--text-sm)] transition-colors",
        danger
          ? "text-[var(--accent-record)] hover:bg-[var(--accent-record)]/10"
          : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
      )}
      onClick={onClick}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}
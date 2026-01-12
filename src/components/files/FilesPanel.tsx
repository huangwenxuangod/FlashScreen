import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Search, Play, MoreVertical, FileVideo } from "lucide-react";
import { PanelHeader } from "@/components/layout";
import { Card } from "@/components/ui";
import { useFilesStore } from "@/stores";
import { formatDuration, formatFileSize } from "@/utils";

export function FilesPanel() {
  const { t } = useTranslation();
  const { files, searchQuery, setSearchQuery } = useFilesStore();

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      className="h-full flex flex-col"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
    >
      <PanelHeader
        title={t("files.title")}
        rightElement={
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-tertiary)]" />
            <input
              type="text"
              placeholder={t("files.search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-32 h-7 pl-8 pr-2 text-xs bg-[var(--bg-tertiary)] border border-[var(--border-default)] rounded-[var(--radius-sm)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--border-focus)]"
            />
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto p-4">
        {filteredFiles.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <FileVideo className="w-12 h-12 text-[var(--text-tertiary)] mb-3" />
            <p className="text-sm text-[var(--text-secondary)]">
              {t("files.empty")}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredFiles.map((file, index) => (
              <motion.div
                key={file.path}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <FileItem file={file} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function FileItem({ file }: { file: { path: string; name: string; size: number; duration: number; resolution: string; frameRate: number } }) {
  return (
    <Card className="p-3 hover:border-[var(--border-hover)] transition-colors cursor-pointer group">
      <div className="flex items-start gap-3">
        {/* Thumbnail / Play button */}
        <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-[var(--bg-elevated)] flex items-center justify-center group-hover:bg-[var(--accent-blue)] transition-colors">
          <Play className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-white transition-colors" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-[var(--text-primary)] truncate">
            {file.name}
          </p>
          <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
            {file.resolution} · {file.frameRate}fps ·{" "}
            {formatDuration(file.duration)} · {formatFileSize(file.size)}
          </p>
        </div>

        {/* Actions */}
        <button className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] opacity-0 group-hover:opacity-100 transition-all">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </Card>
  );
}


import { Button, Card, CardBody, Input, Chip } from "@heroui/react";
import { ArrowLeft, Search, FileVideo, Play, MoreVertical, FolderOpen, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useUIStore, useFilesStore } from "@/stores";
import { formatDuration, formatFileSize } from "@/utils";

export function FilesView() {
  const { t } = useTranslation();
  const { setPanel } = useUIStore();
  const { files, searchQuery, setSearchQuery } = useFilesStore();

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/50">
        <div className="flex items-center gap-3">
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
            {t("files.title")}
          </h2>
        </div>
        <Input
          size="sm"
          variant="flat"
          placeholder={t("files.search")}
          value={searchQuery}
          onValueChange={setSearchQuery}
          startContent={<Search className="w-4 h-4 text-zinc-500" />}
          classNames={{
            base: "w-48",
            input: "text-sm",
            inputWrapper: "bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800",
          }}
        />
      </div>

      {/* Content */}
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
      <div className="w-20 h-20 rounded-2xl bg-zinc-800/50 flex items-center justify-center mb-4">
        <FileVideo className="w-10 h-10 text-zinc-600" />
      </div>
      <h3 className="text-base font-medium text-zinc-400 mb-1">
        {t("files.empty")}
      </h3>
      <p className="text-sm text-zinc-600 max-w-xs">
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
  return (
    <Card className="bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors group">
      <CardBody className="p-0">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-zinc-800">
          {file.thumbnail ? (
            <img
              src={file.thumbnail}
              alt={file.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <FileVideo className="w-12 h-12 text-zinc-700" />
            </div>
          )}

          {/* Play overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
            <Button
              isIconOnly
              size="lg"
              variant="solid"
              className="bg-white/90 text-black rounded-full"
            >
              <Play className="w-6 h-6 ml-0.5" fill="currentColor" />
            </Button>
          </div>

          {/* Duration badge */}
          <div className="absolute bottom-2 right-2">
            <Chip size="sm" className="bg-black/70 text-white text-[10px] h-5">
              {formatDuration(file.duration)}
            </Chip>
          </div>
        </div>

        {/* Info */}
        <div className="p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate">
                {file.name}
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">
                {file.resolution} · {file.frameRate}fps · {formatFileSize(file.size)}
              </p>
            </div>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              className="text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

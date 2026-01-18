import { Button, Tooltip, Chip } from "@heroui/react";
import { Circle, Square, Pause, Play, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useRecordingStore } from "@/stores";

export function RecordButton() {
  const { t } = useTranslation();
  const { status, mode, sources } = useRecordingStore();

  const isIdle = status === "idle";
  const isRecording = status === "recording";
  const isPaused = status === "paused";
  const isEncoding = status === "encoding";

  const handleStartRecording = async () => {
    console.log("Starting recording", { mode, sources });
    useRecordingStore.getState().setStatus("recording");
  };

  const handleStopRecording = async () => {
    console.log("Stopping recording");
    useRecordingStore.getState().setStatus("idle");
  };

  const handlePauseResume = async () => {
    if (isRecording) {
      useRecordingStore.getState().setStatus("paused");
    } else if (isPaused) {
      useRecordingStore.getState().setStatus("recording");
    }
  };

  const handleCancel = async () => {
    useRecordingStore.getState().setStatus("idle");
  };

  return (
    <div className="flex items-center gap-4">
      {/* Main Record/Stop Button */}
      <Tooltip
        content={
          <div className="flex items-center gap-2">
            <span>{isIdle ? t("recording.start") : t("recording.stop")}</span>
            <Chip size="sm" variant="flat" className="h-5 text-[10px]">F1</Chip>
          </div>
        }
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            isIconOnly
            size="lg"
            color={isIdle ? "danger" : "default"}
            variant={isIdle ? "solid" : "bordered"}
            className={`w-20 h-20 rounded-full ${
              isIdle
                ? "bg-danger shadow-lg shadow-danger/30"
                : "border-2 border-danger bg-zinc-900"
            }`}
            isDisabled={isEncoding}
            onPress={isIdle ? handleStartRecording : handleStopRecording}
          >
            {isIdle ? (
              <Circle className="w-8 h-8 fill-white text-white" />
            ) : (
              <Square className="w-6 h-6 fill-danger text-danger" />
            )}
          </Button>
        </motion.div>
      </Tooltip>

      {/* Secondary Controls */}
      <AnimatePresence>
        {(isRecording || isPaused) && (
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Pause/Resume */}
            <Tooltip
              content={
                <div className="flex items-center gap-2">
                  <span>{isPaused ? t("recording.resume") : t("recording.pause")}</span>
                  <Chip size="sm" variant="flat" className="h-5 text-[10px]">F2</Chip>
                </div>
              }
            >
              <Button
                isIconOnly
                size="lg"
                variant="bordered"
                color={isPaused ? "warning" : "default"}
                className={`w-14 h-14 rounded-full ${
                  isPaused
                    ? "border-warning bg-warning/10"
                    : "border-zinc-700 bg-zinc-900"
                }`}
                onPress={handlePauseResume}
              >
                {isPaused ? (
                  <Play className="w-5 h-5 text-warning" />
                ) : (
                  <Pause className="w-5 h-5 text-zinc-400" />
                )}
              </Button>
            </Tooltip>

            {/* Cancel */}
            <Tooltip
              content={
                <div className="flex items-center gap-2">
                  <span>{t("recording.cancel")}</span>
                  <Chip size="sm" variant="flat" className="h-5 text-[10px]">F3</Chip>
                </div>
              }
            >
              <Button
                isIconOnly
                size="lg"
                variant="bordered"
                className="w-14 h-14 rounded-full border-zinc-700 bg-zinc-900 hover:bg-danger/10 hover:border-danger"
                onPress={handleCancel}
              >
                <X className="w-5 h-5 text-zinc-400" />
              </Button>
            </Tooltip>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Encoding Indicator */}
      {isEncoding && (
        <div className="flex items-center gap-2 text-zinc-400">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">{t("recording.encoding")}</span>
        </div>
      )}
    </div>
  );
}

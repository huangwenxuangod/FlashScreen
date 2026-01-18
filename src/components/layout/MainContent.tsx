import { AnimatePresence, motion } from "framer-motion";
import { useUIStore } from "@/stores";
import { RecordingView } from "@/components/recording/RecordingView";
import { SettingsView } from "@/components/settings/SettingsView";
import { FilesView } from "@/components/files/FilesView";

export function MainContent() {
  const { currentPanel } = useUIStore();

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-zinc-900/50">
      <AnimatePresence mode="wait">
        {currentPanel === "main" && (
          <motion.div
            key="main"
            className="flex-1 flex flex-col"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <RecordingView />
          </motion.div>
        )}

        {currentPanel === "settings" && (
          <motion.div
            key="settings"
            className="flex-1 flex flex-col"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <SettingsView />
          </motion.div>
        )}

        {currentPanel === "files" && (
          <motion.div
            key="files"
            className="flex-1 flex flex-col"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <FilesView />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

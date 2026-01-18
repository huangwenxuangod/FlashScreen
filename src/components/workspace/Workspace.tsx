import { motion, AnimatePresence } from "framer-motion";
import { PreviewPanel } from "./PreviewPanel";
import { RecordingControls } from "./RecordingControls";
import { PropertiesPanel } from "./PropertiesPanel";
import { useUIStore } from "@/stores";
import { SettingsPanel } from "@/components/settings";
import { FilesPanel } from "@/components/files";

export function Workspace() {
  const { currentPanel } = useUIStore();

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
        <AnimatePresence mode="wait">
          {currentPanel === "main" && (
            <motion.div
              key="main"
              className="flex-1 flex flex-col gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Preview Window */}
              <PreviewPanel />

              {/* Recording Controls */}
              <RecordingControls />
            </motion.div>
          )}

          {currentPanel === "settings" && (
            <motion.div
              key="settings"
              className="flex-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <SettingsPanel />
            </motion.div>
          )}

          {currentPanel === "files" && (
            <motion.div
              key="files"
              className="flex-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <FilesPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Properties Panel (visible on main view) */}
      {currentPanel === "main" && <PropertiesPanel />}
    </div>
  );
}

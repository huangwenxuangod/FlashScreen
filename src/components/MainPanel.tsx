import { motion } from "framer-motion";
import { RecordButton, ModeSelector, SourceToggle } from "./recording";

export function MainPanel() {
  return (
    <motion.div
      className="h-full flex flex-col items-center justify-center gap-8 px-6 py-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
    >
      {/* Record Button */}
      <div className="flex-1 flex items-center justify-center">
        <RecordButton />
      </div>

      {/* Mode Selector */}
      <ModeSelector />

      {/* Source Toggle */}
      <SourceToggle />
    </motion.div>
  );
}


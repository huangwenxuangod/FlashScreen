import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/utils";
import { useUIStore } from "@/stores";

interface PanelHeaderProps {
  title: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
}

export function PanelHeader({ title, showBack = true, rightElement }: PanelHeaderProps) {
  const { setPanel } = useUIStore();

  return (
    <div className="flex items-center justify-between h-14 px-4 border-b border-[var(--border-subtle)] shrink-0">
      <div className="flex items-center gap-3">
        {showBack && (
          <motion.button
            className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-md)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
            onClick={() => setPanel("main")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-4 h-4" />
          </motion.button>
        )}
        <h2 className="text-[var(--text-lg)] font-semibold text-[var(--text-primary)]">
          {title}
        </h2>
      </div>
      {rightElement && (
        <div className="flex items-center gap-2">
          {rightElement}
        </div>
      )}
    </div>
  );
}

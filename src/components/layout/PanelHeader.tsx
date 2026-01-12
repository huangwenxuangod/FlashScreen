import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/utils";
import { useUIStore } from "@/stores";

interface PanelHeaderProps {
  title: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
}

export function PanelHeader({
  title,
  showBack = true,
  rightElement,
}: PanelHeaderProps) {
  const { goBack } = useUIStore();

  return (
    <div className="h-12 flex items-center justify-between px-4 border-b border-[var(--border-default)]">
      <div className="flex items-center gap-3">
        {showBack && (
          <motion.button
            className={cn(
              "w-8 h-8 flex items-center justify-center rounded-[var(--radius-sm)]",
              "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
              "hover:bg-[var(--bg-tertiary)] transition-colors"
            )}
            onClick={goBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-4 h-4" />
          </motion.button>
        )}
        <h2 className="text-sm font-medium text-[var(--text-primary)]">
          {title}
        </h2>
      </div>
      {rightElement}
    </div>
  );
}


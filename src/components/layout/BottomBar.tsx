import { Folder, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { cn } from "@/utils";
import { useUIStore } from "@/stores";

export function BottomBar() {
  const { t } = useTranslation();
  const { setPanel } = useUIStore();

  return (
    <div className="h-10 flex items-center justify-between px-4 bg-[var(--bg-secondary)] border-t border-[var(--border-default)]">
      {/* Navigation */}
      <div className="flex items-center gap-1">
        <NavButton onClick={() => setPanel("files")}>
          <Folder className="w-4 h-4" />
          <span>{t("files.title")}</span>
        </NavButton>
        <NavButton onClick={() => setPanel("settings")}>
          <Settings className="w-4 h-4" />
          <span>{t("settings.title")}</span>
        </NavButton>
      </div>

      {/* Version */}
      <span className="text-xs text-[var(--text-tertiary)]">v1.0.0</span>
    </div>
  );
}

function NavButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <motion.button
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1.5 rounded-[var(--radius-sm)]",
        "text-xs text-[var(--text-secondary)]",
        "hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]",
        "transition-colors",
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}


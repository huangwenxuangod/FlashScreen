import type { ReactNode } from "react";
import { TitleBar } from "./TitleBar";
import { BottomBar } from "./BottomBar";

interface MainLayoutProps {
  children: ReactNode;
  showBottomBar?: boolean;
}

export function MainLayout({ children, showBottomBar = true }: MainLayoutProps) {
  return (
    <div className="h-full flex flex-col bg-[var(--bg-primary)]">
      <TitleBar />
      <main className="flex-1 overflow-hidden">{children}</main>
      {showBottomBar && <BottomBar />}
    </div>
  );
}


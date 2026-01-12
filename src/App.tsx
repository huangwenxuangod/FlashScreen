import { AnimatePresence } from "framer-motion";
import { MainLayout } from "@/components/layout";
import { MainPanel } from "@/components/MainPanel";
import { SettingsPanel } from "@/components/settings";
import { FilesPanel } from "@/components/files";
import { useUIStore } from "@/stores";

function App() {
  const { currentPanel } = useUIStore();

  return (
    <MainLayout showBottomBar={currentPanel === "main"}>
      <AnimatePresence mode="wait">
        {currentPanel === "main" && <MainPanel key="main" />}
        {currentPanel === "settings" && <SettingsPanel key="settings" />}
        {currentPanel === "files" && <FilesPanel key="files" />}
      </AnimatePresence>
    </MainLayout>
  );
}

export default App;

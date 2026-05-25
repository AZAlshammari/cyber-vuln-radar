import type { ReactNode } from "react";
import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { CyberBackdrop } from "./CyberBackdrop";
import { Drawer } from "../ui/Drawer";
import { useI18n } from "../../i18n";
import type { Language, MetaData, Theme } from "../../lib/types";

export function AppShell({
  children,
  currentPath,
  navigate,
  meta,
  theme,
  setTheme,
  setLanguage,
  search,
  setSearch,
  onRefresh,
  refreshing,
}: {
  children: ReactNode;
  currentPath: string;
  navigate: (path: string) => void;
  meta?: MetaData;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  search: string;
  setSearch: (value: string) => void;
  onRefresh: () => void;
  refreshing: boolean;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { t } = useI18n();
  const nav = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-surface-950 dark:text-slate-100">
      <CyberBackdrop />
      <Header
        meta={meta}
        theme={theme}
        setTheme={setTheme}
        setLanguage={setLanguage}
        search={search}
        setSearch={setSearch}
        onMenu={() => setDrawerOpen(true)}
        onRefresh={onRefresh}
        refreshing={refreshing}
      />
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-[1800px] grid-cols-1 lg:grid-cols-[17rem_minmax(0,1fr)] rtl:lg:grid-cols-[minmax(0,1fr)_17rem]">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] overflow-auto border-slate-200 bg-white p-4 ltr:border-r rtl:order-2 rtl:border-l lg:block dark:border-surface-800 dark:bg-surface-900/65">
          <Sidebar currentPath={currentPath} navigate={navigate} />
        </aside>
        <main className="min-w-0 pb-20 lg:pb-6">{children}</main>
      </div>
      <Drawer open={drawerOpen} title={t("menu")} onClose={() => setDrawerOpen(false)}>
        <Sidebar currentPath={currentPath} navigate={nav} />
      </Drawer>
      <MobileNav currentPath={currentPath} navigate={navigate} />
    </div>
  );
}

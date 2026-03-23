"use client";

import { useAppStore } from "@/store/useAppStore";

export function MainContent({ children }: { children: React.ReactNode }) {
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);

  return (
    <div
      className={`min-h-screen transition-[padding] duration-200 pl-0 ${
        sidebarOpen ? "md:pl-56" : "md:pl-16"
      }`}
    >
      {children}
    </div>
  );
}

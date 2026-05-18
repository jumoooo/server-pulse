"use client";

import { usePathname } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";

const PAGE_TITLE: Record<string, string> = {
  "/dashboard": "대시보드",
  "/servers": "서버 목록",
  "/alerts": "알림",
};

function getPageTitle(pathname: string): string {
  for (const [path, title] of Object.entries(PAGE_TITLE)) {
    if (pathname === path || pathname.startsWith(path + "/")) return title;
  }
  return "ServerPulse";
}

export function Header() {
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border-default bg-bg-base/80 px-4 backdrop-blur-sm">
      <button
        type="button"
        onClick={toggleSidebar}
        className="rounded-lg p-2 text-fg-muted transition-colors hover:bg-bg-elevated hover:text-fg-base"
        aria-label="사이드바 열기/닫기"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <span className="text-sm font-semibold text-fg-base">{title}</span>

      <div className="flex-1" />

      <div className="flex items-center gap-2 text-xs text-fg-subtle">
        <span className="hidden sm:inline">Game Server Observability</span>
      </div>
    </header>
  );
}

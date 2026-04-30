import { create } from "zustand";

interface AppState {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  unreadAlertCount: number;
  setUnreadAlertCount: (count: number) => void;
  incrementUnreadAlertCount: () => void;
  resetUnreadAlertCount: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  unreadAlertCount: 0,
  setUnreadAlertCount: (count) => set({ unreadAlertCount: Math.max(0, count) }),
  incrementUnreadAlertCount: () =>
    set((s) => ({ unreadAlertCount: s.unreadAlertCount + 1 })),
  resetUnreadAlertCount: () => set({ unreadAlertCount: 0 }),
}));

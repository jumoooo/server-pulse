import { create } from "zustand";
import type { ServerStatus, AlertSeverity, AlertStatus } from "@/types/server";

interface AppState {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  serverStatusFilter: ServerStatus | "all";
  serverRegionFilter: string | "all";
  alertSeverityFilter: AlertSeverity | "all";
  alertStatusFilter: AlertStatus | "all";

  setServerStatusFilter: (filter: ServerStatus | "all") => void;
  setServerRegionFilter: (filter: string | "all") => void;
  setAlertSeverityFilter: (filter: AlertSeverity | "all") => void;
  setAlertStatusFilter: (filter: AlertStatus | "all") => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  serverStatusFilter: "all",
  serverRegionFilter: "all",
  alertSeverityFilter: "all",
  alertStatusFilter: "all",

  setServerStatusFilter: (filter) => set({ serverStatusFilter: filter }),
  setServerRegionFilter: (filter) => set({ serverRegionFilter: filter }),
  setAlertSeverityFilter: (filter) => set({ alertSeverityFilter: filter }),
  setAlertStatusFilter: (filter) => set({ alertStatusFilter: filter }),
}));

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api";
import { useAppStore } from "@/store/useAppStore";
import type { ApiResponse, Alert } from "@/types/server";

export function useAlertsQuery() {
  const setUnreadAlertCount = useAppStore((state) => state.setUnreadAlertCount);

  const alertsQuery = useQuery<Alert[]>({
    queryKey: ["alerts"],
    queryFn: async () => {
      const response = await fetchApi<ApiResponse<Alert[]>>("/alerts");
      if (!response.success || !response.data) {
        throw new Error(response.error ?? "알림 조회 실패");
      }
      return response.data;
    },
  });

  useEffect(() => {
    if (!alertsQuery.data) return;
    setUnreadAlertCount(
      alertsQuery.data.filter((alert) => alert.status === "open").length
    );
  }, [alertsQuery.data, setUnreadAlertCount]);

  return alertsQuery;
}

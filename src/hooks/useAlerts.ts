import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api";
import type { ApiResponse, Alert } from "@/types/server";

export function useAlerts() {
  return useQuery({
    queryKey: ["alerts"],
    queryFn: async () => {
      const res = await fetchApi<ApiResponse<Alert[]>>("/alerts");
      if (!res.success || !res.data)
        throw new Error(res.error ?? "알림 조회 실패");
      return res.data;
    },
    refetchInterval: 30_000,
  });
}

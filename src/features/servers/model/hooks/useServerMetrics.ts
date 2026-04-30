import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api";
import type { ApiResponse, MetricPoint } from "@/types/server";

export type ServerMetricRange = "1h" | "6h" | "24h";

export function useServerMetrics(
  serverId: string | null,
  range: ServerMetricRange = "24h"
) {
  return useQuery({
    queryKey: ["servers", serverId, "metrics", range],
    queryFn: async () => {
      if (!serverId) {
        throw new Error("서버 ID가 필요합니다.");
      }

      const response = await fetchApi<ApiResponse<MetricPoint[]>>(
        `/servers/${serverId}/metrics?range=${range}`
      );

      if (!response.success || !response.data) {
        throw new Error(response.error ?? "메트릭 조회 실패");
      }

      return response.data;
    },
    enabled: serverId !== null,
    refetchInterval: 30_000,
  });
}

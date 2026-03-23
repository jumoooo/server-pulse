import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api";
import type { ApiResponse, MetricPoint } from "@/types/server";

export function useServerMetrics(
  id: string | null,
  range: "1h" | "6h" | "24h" = "24h"
) {
  return useQuery({
    queryKey: ["servers", id, "metrics", range],
    queryFn: async () => {
      const res = await fetchApi<ApiResponse<MetricPoint[]>>(
        `/servers/${id}/metrics?range=${range}`
      );
      if (!res.success || !res.data)
        throw new Error(res.error ?? "메트릭 조회 실패");
      return res.data;
    },
    enabled: id !== null,
    refetchInterval: 30_000,
  });
}

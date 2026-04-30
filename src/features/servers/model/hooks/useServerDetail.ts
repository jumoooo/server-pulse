import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api";
import type { ApiResponse, ServerDetail } from "@/types/server";

export function useServerDetail(serverId: string | null) {
  return useQuery({
    queryKey: ["servers", serverId],
    queryFn: async () => {
      if (!serverId) {
        throw new Error("서버 ID가 필요합니다.");
      }

      const response = await fetchApi<ApiResponse<ServerDetail>>(
        `/servers/${serverId}`
      );

      if (!response.success || !response.data) {
        throw new Error(response.error ?? "서버 상세 조회 실패");
      }

      return response.data;
    },
    enabled: serverId !== null,
    refetchInterval: 10_000,
  });
}

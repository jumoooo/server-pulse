import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api";
import type { ApiResponse, Server } from "@/types/server";

export function useServers() {
  return useQuery({
    queryKey: ["servers"],
    queryFn: async () => {
      const response = await fetchApi<ApiResponse<Server[]>>("/servers");
      if (!response.success || !response.data) {
        throw new Error(response.error ?? "서버 목록 조회 실패");
      }
      return response.data;
    },
    refetchInterval: 10_000,
  });
}

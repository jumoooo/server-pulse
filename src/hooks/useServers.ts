import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api";
import type { ApiResponse, Server } from "@/types/server";

export function useServers() {
  return useQuery({
    queryKey: ["servers"],
    queryFn: async () => {
      const res = await fetchApi<ApiResponse<Server[]>>("/servers");
      if (!res.success || !res.data)
        throw new Error(res.error ?? "서버 목록 조회 실패");
      return res.data;
    },
    refetchInterval: 10_000,
  });
}

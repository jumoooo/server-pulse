import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api";
import type { ApiResponse, ServerDetail } from "@/types/server";

export function useServerDetail(id: string | null) {
  return useQuery({
    queryKey: ["servers", id],
    queryFn: async () => {
      const res = await fetchApi<ApiResponse<ServerDetail>>(`/servers/${id}`);
      if (!res.success || !res.data)
        throw new Error(res.error ?? "서버 상세 조회 실패");
      return res.data;
    },
    enabled: id !== null,
    refetchInterval: 10_000,
  });
}

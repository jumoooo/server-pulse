/**
 * 서버 플레이어 수 추이(트렌드) 조회 훅
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchBackend } from "@/lib/backendApi";
import type { GameServerTrendResponse } from "../types";

interface UseServerTrendOptions {
  enabled?: boolean;
}

export function useServerTrend(
  serverId: string,
  options: UseServerTrendOptions = {},
) {
  const { enabled = true } = options;

  return useQuery<GameServerTrendResponse>({
    queryKey: ["backend", "servers", serverId, "trend"],
    queryFn: () =>
      fetchBackend<GameServerTrendResponse>(
        `/api/servers/${serverId}/trend`,
      ),
    enabled: enabled && !!serverId,
    staleTime: 60_000,
    retry: 1,
  });
}

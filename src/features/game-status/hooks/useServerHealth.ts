/**
 * 단일 서버 실시간 헬스 상태 조회 훅
 * 백엔드 오프라인 시 enabled: false로 조용히 비활성화
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchBackend } from "@/lib/backendApi";
import type { GameServerHealthResponse } from "../types";

interface UseServerHealthOptions {
  /** 백엔드 가용 여부 (false이면 쿼리 비활성화) */
  enabled?: boolean;
}

export function useServerHealth(
  serverId: string,
  options: UseServerHealthOptions = {},
) {
  const { enabled = true } = options;

  return useQuery<GameServerHealthResponse>({
    queryKey: ["backend", "servers", serverId, "health"],
    queryFn: () =>
      fetchBackend<GameServerHealthResponse>(
        `/api/servers/${serverId}/health`,
      ),
    enabled: enabled && !!serverId,
    staleTime: 30_000,
    retry: 1,
  });
}

/**
 * 단일 서버 플레이어 목록 조회 훅
 * 백엔드 오프라인 시 enabled: false로 조용히 비활성화
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchBackend } from "@/lib/backendApi";
import type { GameServerPlayersResponse } from "../types";

interface UseServerPlayersOptions {
  /** 백엔드 가용 여부 (false이면 쿼리 비활성화) */
  enabled?: boolean;
}

export function useServerPlayers(
  serverId: string,
  options: UseServerPlayersOptions = {},
) {
  const { enabled = true } = options;

  return useQuery<GameServerPlayersResponse>({
    queryKey: ["backend", "servers", serverId, "players"],
    queryFn: () =>
      fetchBackend<GameServerPlayersResponse>(
        `/api/servers/${serverId}/players`,
      ),
    enabled: enabled && !!serverId,
    staleTime: 30_000,
    retry: 1,
  });
}

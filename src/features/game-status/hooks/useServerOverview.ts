/**
 * 전체 게임 서버 실시간 상태 조회 훅
 * 기존 useServers(Prisma)와 독립적으로 병존
 * queryKey 네임스페이스: ["backend", ...] 으로 충돌 방지
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchBackend } from "@/lib/backendApi";
import type { GameServerOverviewResponse } from "../types";

type UseServerOverviewOptions = {
  enabled?: boolean;
};

export function useServerOverview(options?: UseServerOverviewOptions) {
  return useQuery<GameServerOverviewResponse>({
    queryKey: ["backend", "servers", "overview"],
    queryFn: () =>
      fetchBackend<GameServerOverviewResponse>("/api/servers/overview"),
    staleTime: 30_000,
    retry: 1,
    enabled: options?.enabled ?? true,
  });
}

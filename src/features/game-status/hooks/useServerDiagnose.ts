/**
 * 단일 서버 진단 정보 조회 훅
 * 백엔드 오프라인 시 enabled: false로 조용히 비활성화
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchBackend } from "@/lib/backendApi";
import type { GameServerDiagnoseResponse } from "../types";

interface UseServerDiagnoseOptions {
  /** 백엔드 가용 여부 (false이면 쿼리 비활성화) */
  enabled?: boolean;
}

export function useServerDiagnose(
  serverId: string,
  options: UseServerDiagnoseOptions = {},
) {
  const { enabled = true } = options;

  return useQuery<GameServerDiagnoseResponse>({
    queryKey: ["backend", "servers", serverId, "diagnose"],
    queryFn: () =>
      fetchBackend<GameServerDiagnoseResponse>(
        `/api/servers/${serverId}/diagnose`,
      ),
    enabled: enabled && !!serverId,
    staleTime: 30_000,
    retry: 1,
  });
}

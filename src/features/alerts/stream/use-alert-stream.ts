"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAppStore } from "@/store/useAppStore";
import type { Alert } from "@/types/server";

interface UseAlertStreamOptions {
  enabled?: boolean;
}

export function useAlertStream({
  enabled = true,
}: UseAlertStreamOptions = {}) {
  const queryClient = useQueryClient();
  const setUnreadAlertCount = useAppStore((state) => state.setUnreadAlertCount);

  useEffect(() => {
    if (!enabled) return;

    const eventSource = new EventSource("/api/alerts/stream");

    eventSource.onmessage = (event) => {
      try {
        const parsedAlerts = JSON.parse(event.data) as Alert[];
        if (!Array.isArray(parsedAlerts)) return;

        queryClient.setQueryData<Alert[]>(["alerts"], parsedAlerts);
        setUnreadAlertCount(
          parsedAlerts.filter((alert) => alert.status === "open").length
        );
      } catch {
        // 파싱 오류는 무시하고 다음 이벤트를 기다립니다.
      }
    };

    eventSource.onerror = () => {
      // 인증 실패/네트워크 이슈 모두 앱 동작에는 영향 없이 브라우저 재연결에 맡깁니다.
    };

    return () => {
      eventSource.close();
    };
  }, [enabled, queryClient, setUnreadAlertCount]);
}

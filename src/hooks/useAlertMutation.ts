import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchApi } from "@/lib/api";
import type { ApiResponse, Alert, AlertStatus } from "@/types/server";

export function useAlertMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: AlertStatus }) => {
      const res = await patchApi<ApiResponse<Alert>>(`/alerts/${id}`, {
        status,
      });
      if (!res.success || !res.data)
        throw new Error(res.error ?? "알림 상태 변경 실패");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });
}

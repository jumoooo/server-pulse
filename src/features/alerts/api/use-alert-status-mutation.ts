import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchApi } from "@/lib/api";
import type { ApiResponse, Alert, AlertStatus } from "@/types/server";

interface UpdateAlertStatusInput {
  id: string;
  status: AlertStatus;
}

export function useAlertStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: UpdateAlertStatusInput) => {
      const response = await patchApi<ApiResponse<Alert>>(`/alerts/${id}`, {
        status,
      });

      if (!response.success || !response.data) {
        throw new Error(response.error ?? "알림 상태 변경 실패");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });
}

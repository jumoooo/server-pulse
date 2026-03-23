"use client";

import { useAlerts } from "@/hooks/useAlerts";
import { useAlertMutation } from "@/hooks/useAlertMutation";
import { useAppStore } from "@/store/useAppStore";
import { AlertList } from "@/components/alerts/AlertList";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import type { AlertSeverity, AlertStatus } from "@/types/server";

const SEVERITY_OPTIONS: { value: AlertSeverity | "all"; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "critical", label: "심각" },
  { value: "warning", label: "경고" },
  { value: "info", label: "정보" },
];

const ALERT_STATUS_OPTIONS: { value: AlertStatus | "all"; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "open", label: "열림" },
  { value: "acknowledged", label: "확인됨" },
  { value: "resolved", label: "해결됨" },
];

const SEVERITY_ACTIVE: Record<AlertSeverity | "all", string> = {
  all: "bg-gray-700 text-white",
  critical: "bg-red-500/20 text-red-400 ring-1 ring-red-500/40",
  warning: "bg-yellow-500/20 text-yellow-400 ring-1 ring-yellow-500/40",
  info: "bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/40",
};

const STATUS_ACTIVE: Record<AlertStatus | "all", string> = {
  all: "bg-gray-700 text-white",
  open: "bg-gray-600 text-white",
  acknowledged: "bg-indigo-500/20 text-indigo-400 ring-1 ring-indigo-500/40",
  resolved: "bg-gray-700/50 text-gray-300",
};

export default function AlertsPage() {
  const { data: alerts, isLoading, error, refetch } = useAlerts();
  const { mutate: changeStatus, isPending } = useAlertMutation();
  const severityFilter = useAppStore((s) => s.alertSeverityFilter);
  const statusFilter = useAppStore((s) => s.alertStatusFilter);
  const setSeverityFilter = useAppStore((s) => s.setAlertSeverityFilter);
  const setStatusFilter = useAppStore((s) => s.setAlertStatusFilter);

  if (isLoading) return <LoadingState message="알림을 불러오는 중..." />;
  if (error)
    return <ErrorState message={error.message} onRetry={() => refetch()} />;

  const list = alerts ?? [];

  const filtered = list.filter((a) => {
    const matchSeverity =
      severityFilter === "all" || a.severity === severityFilter;
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    return matchSeverity && matchStatus;
  });

  const criticalCount = list.filter((a) => a.severity === "critical").length;
  const openCount = list.filter((a) => a.status === "open").length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">알림</h1>
        <div className="mt-1 flex items-center gap-3 text-sm text-gray-400">
          <span>전체 {list.length}개</span>
          {criticalCount > 0 && (
            <span className="text-red-400">심각 {criticalCount}개</span>
          )}
          {openCount > 0 && (
            <span className="text-yellow-400">열림 {openCount}개</span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-1 rounded-lg border border-gray-800 bg-gray-900 p-1">
          {SEVERITY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSeverityFilter(opt.value)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                severityFilter === opt.value
                  ? SEVERITY_ACTIVE[opt.value]
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-gray-800 bg-gray-900 p-1">
          {ALERT_STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setStatusFilter(opt.value)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                statusFilter === opt.value
                  ? STATUS_ACTIVE[opt.value]
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-600">{filtered.length}개 표시</p>

      {filtered.length === 0 ? (
        <EmptyState message="조건에 맞는 알림이 없습니다." />
      ) : (
        <AlertList
          alerts={filtered}
          onStatusChange={(id, status) => changeStatus({ id, status })}
          isPending={isPending}
        />
      )}
    </div>
  );
}

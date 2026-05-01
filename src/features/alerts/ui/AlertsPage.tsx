"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import type { AlertSeverity, AlertStatus } from "@/types/server";
import { useAlertsQuery } from "../api/use-alerts-query";
import { useAlertStatusMutation } from "../api/use-alert-status-mutation";
import { AlertList } from "./AlertList";

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
  all: "bg-bg-elevated text-fg-base",
  critical: "bg-severity-critical-bg text-severity-critical-fg",
  warning: "bg-severity-warning-bg text-severity-warning-fg",
  info: "bg-severity-info-bg text-severity-info-fg",
};

const STATUS_ACTIVE: Record<AlertStatus | "all", string> = {
  all: "bg-bg-elevated text-fg-base",
  open: "bg-status-warn-bg text-status-warn-fg",
  acknowledged: "bg-interactive-accent/10 text-interactive-accent",
  resolved: "bg-status-ok-bg text-status-ok-fg",
};

export function AlertsPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: alerts, isLoading, error, refetch } = useAlertsQuery();
  const { mutate: changeStatus, isPending } = useAlertStatusMutation();
  const rawSeverity = searchParams.get("severity");
  const rawStatus = searchParams.get("status");
  const severityFilter: AlertSeverity | "all" = SEVERITY_OPTIONS.some(
    (option) => option.value === rawSeverity
  )
    ? (rawSeverity as AlertSeverity | "all")
    : "all";
  const statusFilter: AlertStatus | "all" = ALERT_STATUS_OPTIONS.some(
    (option) => option.value === rawStatus
  )
    ? (rawStatus as AlertStatus | "all")
    : "all";

  const updateFilters = (next: {
    severity?: AlertSeverity | "all";
    status?: AlertStatus | "all";
  }) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    const nextSeverity = next.severity ?? severityFilter;
    const nextStatus = next.status ?? statusFilter;

    if (nextSeverity === "all") nextParams.delete("severity");
    else nextParams.set("severity", nextSeverity);

    if (nextStatus === "all") nextParams.delete("status");
    else nextParams.set("status", nextStatus);

    const query = nextParams.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  if (isLoading) return <LoadingState message="알림을 불러오는 중..." />;
  if (error) {
    return <ErrorState message={error.message} onRetry={() => refetch()} />;
  }

  const allAlerts = alerts ?? [];
  const filteredAlerts = allAlerts.filter((alert) => {
    const matchSeverity =
      severityFilter === "all" || alert.severity === severityFilter;
    const matchStatus = statusFilter === "all" || alert.status === statusFilter;
    return matchSeverity && matchStatus;
  });

  const criticalCount = allAlerts.filter(
    (alert) => alert.severity === "critical"
  ).length;
  const openCount = allAlerts.filter((alert) => alert.status === "open").length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-fg-base">알림</h1>
        <div className="mt-1 flex flex-wrap items-center gap-2.5 text-sm text-fg-muted">
          <span>전체 {allAlerts.length}개</span>
          {criticalCount > 0 && (
            <span className="text-severity-critical-fg">심각 {criticalCount}개</span>
          )}
          {openCount > 0 && (
            <span className="text-severity-warning-fg">열림 {openCount}개</span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="w-fit overflow-x-auto rounded-lg border border-border-default bg-bg-surface p-1">
          <div className="flex items-center gap-1">
            {SEVERITY_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => updateFilters({ severity: option.value })}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  severityFilter === option.value
                    ? SEVERITY_ACTIVE[option.value]
                    : "text-fg-muted hover:text-fg-base"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="w-fit overflow-x-auto rounded-lg border border-border-default bg-bg-surface p-1">
          <div className="flex items-center gap-1">
            {ALERT_STATUS_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => updateFilters({ status: option.value })}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  statusFilter === option.value
                    ? STATUS_ACTIVE[option.value]
                    : "text-fg-muted hover:text-fg-base"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="text-xs text-fg-subtle">{filteredAlerts.length}개 표시</p>

      {filteredAlerts.length === 0 ? (
        <EmptyState message="조건에 맞는 알림이 없습니다." />
      ) : (
        <AlertList
          alerts={filteredAlerts}
          onStatusChange={(id, status) => changeStatus({ id, status })}
          isPending={isPending}
        />
      )}
    </div>
  );
}

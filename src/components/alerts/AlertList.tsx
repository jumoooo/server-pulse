"use client";

import Link from "next/link";
import type { Alert, AlertStatus } from "@/types/server";

interface AlertListProps {
  alerts: Alert[];
  onStatusChange: (id: string, status: AlertStatus) => void;
  isPending?: boolean;
}

const SEVERITY_BADGE = {
  critical: "bg-red-400/10 text-red-400 ring-1 ring-red-400/20",
  warning: "bg-yellow-400/10 text-yellow-400 ring-1 ring-yellow-400/20",
  info: "bg-blue-400/10 text-blue-400 ring-1 ring-blue-400/20",
};
const SEVERITY_LABEL = { critical: "심각", warning: "경고", info: "정보" };

const ALERT_STATUS_BADGE = {
  open: "bg-gray-700 text-gray-200",
  acknowledged: "bg-indigo-400/10 text-indigo-400",
  resolved: "bg-gray-800 text-gray-500",
};
const ALERT_STATUS_LABEL = {
  open: "열림",
  acknowledged: "확인됨",
  resolved: "해결됨",
};

function formatRelativeTime(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}초 전`;
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}

export function AlertList({
  alerts,
  onStatusChange,
  isPending,
}: AlertListProps) {
  return (
    <ul className="space-y-2">
      {alerts.map((alert) => (
        <li
          key={alert.id}
          className={`rounded-xl border border-gray-800 bg-gray-900 p-4 transition-opacity ${
            alert.status === "resolved" ? "opacity-50" : ""
          }`}
        >
          <div className="flex flex-wrap items-start gap-3">
            <span
              className={`mt-0.5 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${SEVERITY_BADGE[alert.severity]}`}
            >
              {SEVERITY_LABEL[alert.severity]}
            </span>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <p className="text-sm font-medium text-white">{alert.title}</p>
                <Link
                  href={`/servers/${alert.serverId}`}
                  className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline"
                >
                  {alert.serverName}
                </Link>
              </div>
              <p className="mt-1 text-xs text-gray-400">{alert.description}</p>
              <p className="mt-1.5 text-xs text-gray-600">
                {formatRelativeTime(alert.createdAt)}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${ALERT_STATUS_BADGE[alert.status]}`}
              >
                {ALERT_STATUS_LABEL[alert.status]}
              </span>

              {alert.status === "open" && (
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => onStatusChange(alert.id, "acknowledged")}
                  className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-1 text-xs font-medium text-gray-300 transition-colors hover:border-gray-600 hover:text-white disabled:opacity-50"
                >
                  확인
                </button>
              )}

              {alert.status === "acknowledged" && (
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => onStatusChange(alert.id, "resolved")}
                  className="rounded-lg border border-emerald-700/50 bg-emerald-900/20 px-3 py-1 text-xs font-medium text-emerald-400 transition-colors hover:bg-emerald-900/40 disabled:opacity-50"
                >
                  해결
                </button>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

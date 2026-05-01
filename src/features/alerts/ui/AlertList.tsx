"use client";

import Link from "next/link";
import type { Alert, AlertStatus } from "@/types/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface AlertListProps {
  alerts: Alert[];
  onStatusChange: (id: string, status: AlertStatus) => void;
  isPending?: boolean;
}

const SEVERITY_LABEL = { critical: "심각", warning: "경고", info: "정보" };

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

export function AlertList({ alerts, onStatusChange, isPending }: AlertListProps) {
  return (
    <ul className="space-y-3">
      {alerts.map((alert) => (
        <li key={alert.id}>
          <Card
            className={`transition-opacity ${
              alert.status === "resolved" ? "opacity-50" : ""
            }`}
          >
            <CardContent className="p-4">
              <div className="flex flex-wrap items-start gap-3">
                <Badge variant={alert.severity} className="mt-0.5 shrink-0">
                  {SEVERITY_LABEL[alert.severity]}
                </Badge>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <p className="text-sm font-medium text-fg-base">{alert.title}</p>
                    <Link
                      href={`/servers/${alert.serverId}`}
                      className="text-xs text-interactive-accent hover:text-interactive-accent/80 hover:underline"
                    >
                      {alert.serverName}
                    </Link>
                  </div>
                  <p className="mt-1 text-xs text-fg-muted">{alert.description}</p>
                  <p className="mt-1.5 text-xs text-fg-subtle">
                    {formatRelativeTime(alert.createdAt)}
                  </p>
                </div>

                <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      alert.status === "open"
                        ? "bg-status-warn-bg text-status-warn-fg"
                        : alert.status === "acknowledged"
                          ? "bg-interactive-accent/10 text-interactive-accent"
                          : "bg-status-ok-bg text-status-ok-fg"
                    }`}
                  >
                    {ALERT_STATUS_LABEL[alert.status]}
                  </span>

                  {alert.status === "open" && (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isPending}
                      onClick={() => onStatusChange(alert.id, "acknowledged")}
                      className="h-7 px-3 text-xs"
                    >
                      확인
                    </Button>
                  )}

                  {alert.status === "acknowledged" && (
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={isPending}
                      onClick={() => onStatusChange(alert.id, "resolved")}
                      className="h-7 border border-status-ok-border bg-status-ok-bg px-3 text-xs text-status-ok-fg hover:bg-status-ok-bg/80"
                    >
                      해결
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}

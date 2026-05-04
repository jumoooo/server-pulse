"use client";

import Link from "next/link";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";
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
const SEVERITY_ICON = {
  critical: <AlertCircle aria-hidden className="size-3 shrink-0" />,
  warning: <AlertTriangle aria-hidden className="size-3 shrink-0" />,
  info: <Info aria-hidden className="size-3 shrink-0" />,
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

export function AlertList({ alerts, onStatusChange, isPending }: AlertListProps) {
  return (
    <ul className="space-y-4">
      {alerts.map((alert) => (
        <li key={alert.id}>
          <Card
            className={`overflow-hidden transition-all hover:border-border-subtle hover:bg-bg-surface ${
              alert.status === "resolved" ? "opacity-50" : ""
            }`}
          >
            <CardContent className="px-5 py-4">
              <div className="flex items-center gap-4">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <Badge
                    variant={alert.severity}
                    className="inline-flex shrink-0 items-center gap-1 rounded-md"
                  >
                    {SEVERITY_ICON[alert.severity]}
                    {SEVERITY_LABEL[alert.severity]}
                  </Badge>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <p className="text-sm font-semibold text-fg-base">{alert.title}</p>
                      <Link
                        href={`/servers/${alert.serverId}`}
                        className="text-xs font-medium text-interactive-accent hover:text-interactive-accent/80 hover:underline"
                      >
                        {alert.serverName}
                      </Link>
                      <span className="rounded-full border border-border-default bg-bg-elevated px-2.5 py-1 text-xs font-medium text-fg-muted">
                        {formatRelativeTime(alert.createdAt)}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          alert.status === "open"
                            ? "bg-status-warn-bg text-status-warn-fg"
                            : alert.status === "acknowledged"
                              ? "bg-interactive-accent/10 text-interactive-accent"
                              : "bg-status-ok-bg text-status-ok-fg"
                        }`}
                      >
                        {ALERT_STATUS_LABEL[alert.status]}
                      </span>
                    </div>
                    <p className="line-clamp-1 text-xs text-fg-muted">{alert.description}</p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {alert.status === "open" && (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isPending}
                      onClick={() => onStatusChange(alert.id, "acknowledged")}
                      className="h-8 px-3 text-xs"
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
                      className="h-8 border border-status-ok-border bg-status-ok-bg px-3 text-xs text-status-ok-fg hover:bg-status-ok-bg/80"
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

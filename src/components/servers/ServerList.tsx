"use client";

import { useRouter } from "next/navigation";
import type { Server, ServerStatus } from "@/types/server";
import { DeleteServerButton } from "@/components/servers/DeleteServerButton";
import { Badge } from "@/components/ui/badge";

interface ServerListProps {
  servers: Server[];
}

const STATUS_LABEL: Record<ServerStatus, string> = {
  healthy: "정상",
  degraded: "저하",
  down: "다운",
};

const STATUS_DOT: Record<ServerStatus, string> = {
  healthy: "bg-status-ok-fg",
  degraded: "bg-status-warn-fg",
  down: "bg-status-error-fg",
};

export const REGION_LABEL: Record<string, string> = {
  "kr-seoul": "한국 (서울)",
  "us-east": "미국 (동부)",
  "eu-west": "유럽 (서부)",
  "ap-tokyo": "일본 (도쿄)",
};

function formatUptime(seconds: number): string {
  if (seconds === 0) return "-";
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  if (days > 0) return `${days}일 ${hours}시간`;
  return `${hours}시간`;
}

export function ServerList({ servers }: ServerListProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {servers.map((server) => (
        <div
          key={server.id}
          role="button"
          tabIndex={0}
          onClick={() => router.push(`/servers/${server.id}`)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              router.push(`/servers/${server.id}`);
            }
          }}
          className="group rounded-xl border border-border-default bg-bg-surface p-5 text-left transition-all hover:border-border-subtle hover:bg-bg-elevated hover:ring-1 hover:ring-interactive-accent/30 focus:outline-none focus:ring-2 focus:ring-interactive-accent"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block h-2 w-2 shrink-0 rounded-full ${STATUS_DOT[server.status]}`}
                />
                <h3 className="truncate text-sm font-semibold text-fg-base transition-colors group-hover:text-interactive-accent">
                  {server.name}
                </h3>
              </div>
              <p className="mt-1 text-xs text-fg-muted">
                {REGION_LABEL[server.region] ?? server.region}
              </p>
            </div>
            <Badge
              variant={
                server.status === "healthy"
                  ? "ok"
                  : server.status === "degraded"
                    ? "warn"
                    : "error"
              }
              className="shrink-0"
            >
              {STATUS_LABEL[server.status]}
            </Badge>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
            <div>
              <p className="text-fg-subtle">플레이어</p>
              <p className="mt-0.5 font-medium text-fg-base">
                {server.playerCount}
                <span className="text-fg-subtle"> / {server.maxPlayers}</span>
              </p>
            </div>
            <div>
              <p className="text-fg-subtle">버전</p>
              <p className="mt-0.5 font-medium text-fg-base">{server.version}</p>
            </div>
            <div>
              <p className="text-fg-subtle">업타임</p>
              <p className="mt-0.5 font-medium text-fg-base">
                {formatUptime(server.uptimeSeconds)}
              </p>
            </div>
            <div>
              <p className="text-fg-subtle">용량</p>
              <p className="mt-0.5 font-medium text-fg-base">
                {Math.round((server.playerCount / server.maxPlayers) * 100)}%
              </p>
            </div>
          </div>
          <div
            className="mt-4 border-t border-border-default pt-3"
            onClick={(event) => event.stopPropagation()}
          >
            <DeleteServerButton serverId={server.id} serverName={server.name} />
          </div>
        </div>
      ))}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useServers } from "@/hooks/useServers";
import { checkBackendAvailable } from "@/lib/backendApi";
import { useServerOverview } from "@/features/game-status/hooks/useServerOverview";
import { ServerStatusCard } from "@/components/dashboard/ServerStatusCard";
import { MetricsSummary } from "@/components/dashboard/MetricsSummary";
import { PlayerChart } from "@/components/dashboard/PlayerChart";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { REGION_LABEL } from "@/components/servers/ServerList";
import { Badge } from "@/components/ui/badge";
import { getMetrics } from "@/lib/mockData";
import type { ServerStatus } from "@/types/server";

const STATUS_LABEL: Record<ServerStatus, string> = {
  healthy: "정상",
  degraded: "저하",
  down: "다운",
};

export default function DashboardPage() {
  const { data: servers, isLoading, error, refetch } = useServers();
  const [backendAvailable, setBackendAvailable] = useState(false);

  useEffect(() => {
    checkBackendAvailable().then(setBackendAvailable);
  }, []);

  const { data: overview } = useServerOverview({
    enabled: backendAvailable,
  });

  const list = servers ?? [];

  if (isLoading) return <LoadingState message="서버 데이터를 불러오는 중..." />;
  if (error)
    return <ErrorState message={error.message} onRetry={() => refetch()} />;

  const healthyCount = list.filter((s) => s.status === "healthy").length;
  const degradedCount = list.filter((s) => s.status === "degraded").length;
  const downCount = list.filter((s) => s.status === "down").length;

  const problemServers = list.filter(
    (s) => s.status === "degraded" || s.status === "down"
  );

  const aggregatedMetrics = getMetrics("kr-1", "24h").map((point, i) => ({
    ...point,
    playerCount: list.reduce((sum, s) => {
      const m = getMetrics(s.id, "24h")[i];
      return sum + (m?.playerCount ?? 0);
    }, 0),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-fg-base">대시보드</h1>
        <p className="mt-1 text-sm text-fg-muted">전체 서버 현황 요약</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ServerStatusCard
          status="total"
          count={list.length}
          label="전체 서버"
        />
        <ServerStatusCard status="healthy" count={healthyCount} label="정상" />
        <ServerStatusCard
          status="degraded"
          count={degradedCount}
          label="성능 저하"
        />
        <ServerStatusCard status="down" count={downCount} label="다운" />
      </div>

      <MetricsSummary servers={list} />

      {backendAvailable && overview?.servers && overview.servers.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold text-fg-base">
            게임 서버 실시간 현황
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {overview.servers.map((gs) => (
              <div
                key={gs.id}
                className="rounded-xl border border-border-default bg-bg-surface p-5 transition-colors hover:bg-bg-elevated"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-fg-base">
                      {gs.name}
                    </p>
                    <p className="mt-0.5 text-xs text-fg-muted">{gs.game}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                      gs.latencyCategory === "CRITICAL"
                        ? "bg-status-error-bg text-status-error-fg"
                        : gs.latencyCategory === "HIGH"
                          ? "bg-status-warn-bg text-status-warn-fg"
                          : "bg-status-ok-bg text-status-ok-fg"
                    }`}
                  >
                    {gs.latencyCategory}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-fg-subtle">플레이어</p>
                    <p className="mt-0.5 text-sm font-semibold text-fg-base">
                      {gs.players}
                      <span className="font-normal text-fg-subtle">
                        {" "}
                        / {gs.maxPlayers}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-fg-subtle">Ping</p>
                    <p className="mt-0.5 text-sm font-semibold text-fg-base">
                      {gs.ping >= 0 ? `${gs.ping}ms` : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="bg-bg-surface border border-border-default rounded-xl p-5">
          <h2 className="mb-4 text-sm font-semibold text-fg-base">
            전체 플레이어 추이 (24h)
          </h2>
          <PlayerChart data={aggregatedMetrics} />
        </div>

        <div className="bg-bg-surface border border-border-default rounded-xl p-5">
          <h2 className="mb-4 text-sm font-semibold text-fg-base">문제 서버</h2>
          {problemServers.length === 0 ? (
            <EmptyState message="문제가 있는 서버가 없습니다." />
          ) : (
            <ul className="space-y-2">
              {problemServers.map((server) => (
                <li key={server.id}>
                  <Link
                    href={`/servers/${server.id}`}
                    className="flex items-center justify-between rounded-lg border border-border-default bg-bg-elevated/50 px-4 py-3 transition-colors hover:border-border-subtle hover:bg-bg-elevated"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-fg-base">
                        {server.name}
                      </p>
                      <p className="mt-0.5 text-xs text-fg-muted">
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
                      className="ml-3 shrink-0"
                    >
                      {STATUS_LABEL[server.status]}
                    </Badge>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

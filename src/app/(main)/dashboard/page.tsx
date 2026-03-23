"use client";

import Link from "next/link";
import { useServers } from "@/hooks/useServers";
import { ServerStatusCard } from "@/components/dashboard/ServerStatusCard";
import { MetricsSummary } from "@/components/dashboard/MetricsSummary";
import { PlayerChart } from "@/components/dashboard/PlayerChart";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { getMetrics } from "@/lib/mockData";
import type { ServerStatus } from "@/types/server";

const STATUS_LABEL: Record<ServerStatus, string> = {
  healthy: "정상",
  degraded: "저하",
  down: "다운",
};

const STATUS_BADGE: Record<ServerStatus, string> = {
  healthy: "bg-emerald-400/10 text-emerald-400",
  degraded: "bg-yellow-400/10 text-yellow-400",
  down: "bg-red-400/10 text-red-400",
};

export default function DashboardPage() {
  const { data: servers, isLoading, error, refetch } = useServers();

  if (isLoading) return <LoadingState message="서버 데이터를 불러오는 중..." />;
  if (error)
    return <ErrorState message={error.message} onRetry={() => refetch()} />;

  const list = servers ?? [];

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
        <h1 className="text-2xl font-bold text-white">대시보드</h1>
        <p className="mt-1 text-sm text-gray-400">전체 서버 현황 요약</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="mb-4 text-sm font-semibold text-white">
            전체 플레이어 추이 (24h)
          </h2>
          <PlayerChart data={aggregatedMetrics} />
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="mb-4 text-sm font-semibold text-white">문제 서버</h2>
          {problemServers.length === 0 ? (
            <EmptyState message="문제가 있는 서버가 없습니다." />
          ) : (
            <ul className="space-y-2">
              {problemServers.map((server) => (
                <li key={server.id}>
                  <Link
                    href={`/servers/${server.id}`}
                    className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-800/50 px-4 py-3 transition-colors hover:border-gray-700 hover:bg-gray-800"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">
                        {server.name}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-400">
                        {server.region}
                      </p>
                    </div>
                    <span
                      className={`ml-3 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE[server.status]}`}
                    >
                      {STATUS_LABEL[server.status]}
                    </span>
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

"use client";

import { useServers } from "@/hooks/useServers";
import { useAppStore } from "@/store/useAppStore";
import { ServerList } from "@/components/servers/ServerList";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import type { ServerStatus } from "@/types/server";

const STATUS_OPTIONS: { value: ServerStatus | "all"; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "healthy", label: "정상" },
  { value: "degraded", label: "저하" },
  { value: "down", label: "다운" },
];

const REGION_OPTIONS = [
  { value: "all", label: "전체 지역" },
  { value: "kr-seoul", label: "한국 (서울)" },
  { value: "us-east", label: "미국 (동부)" },
  { value: "eu-west", label: "유럽 (서부)" },
  { value: "ap-tokyo", label: "일본 (도쿄)" },
];

const STATUS_BTN_ACTIVE: Record<ServerStatus | "all", string> = {
  all: "bg-gray-700 text-white",
  healthy: "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40",
  degraded: "bg-yellow-500/20 text-yellow-400 ring-1 ring-yellow-500/40",
  down: "bg-red-500/20 text-red-400 ring-1 ring-red-500/40",
};

export default function ServersPage() {
  const { data: servers, isLoading, error, refetch } = useServers();
  const statusFilter = useAppStore((s) => s.serverStatusFilter);
  const regionFilter = useAppStore((s) => s.serverRegionFilter);
  const setStatusFilter = useAppStore((s) => s.setServerStatusFilter);
  const setRegionFilter = useAppStore((s) => s.setServerRegionFilter);

  if (isLoading) return <LoadingState message="서버 목록을 불러오는 중..." />;
  if (error)
    return <ErrorState message={error.message} onRetry={() => refetch()} />;

  const list = servers ?? [];

  const filtered = list.filter((s) => {
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    const matchRegion = regionFilter === "all" || s.region === regionFilter;
    return matchStatus && matchRegion;
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">서버 목록</h1>
        <p className="mt-1 text-sm text-gray-400">
          {filtered.length}개 표시 / 전체 {list.length}개
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 rounded-lg bg-gray-900 border border-gray-800 p-1">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setStatusFilter(opt.value)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                statusFilter === opt.value
                  ? STATUS_BTN_ACTIVE[opt.value]
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <select
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
          className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-xs text-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          {REGION_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="조건에 맞는 서버가 없습니다." />
      ) : (
        <ServerList servers={filtered} />
      )}
    </div>
  );
}

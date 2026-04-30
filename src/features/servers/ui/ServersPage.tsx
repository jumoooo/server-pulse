"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ServerList } from "@/components/servers/ServerList";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { ServerForm } from "@/components/servers/ServerForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { ServerStatus } from "@/types/server";
import { useServers } from "@/features/servers/model/hooks/useServers";

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
  all: "bg-bg-elevated text-fg-base ring-1 ring-border-default",
  healthy: "bg-status-ok-bg text-status-ok-fg ring-1 ring-status-ok-border",
  degraded: "bg-status-warn-bg text-status-warn-fg ring-1 ring-status-warn-border",
  down: "bg-status-error-bg text-status-error-fg ring-1 ring-status-error-border",
};

export function ServersPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: servers, isLoading, error, refetch } = useServers();
  const rawStatusFilter = searchParams.get("status");
  const statusFilter: ServerStatus | "all" = STATUS_OPTIONS.some(
    (option) => option.value === rawStatusFilter
  )
    ? (rawStatusFilter as ServerStatus | "all")
    : "all";
  const regionFilter = searchParams.get("region") ?? "all";

  const updateFilters = (next: {
    status?: ServerStatus | "all";
    region?: string | "all";
  }) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    const nextStatus = next.status ?? statusFilter;
    const nextRegion = next.region ?? regionFilter;

    if (nextStatus === "all") nextParams.delete("status");
    else nextParams.set("status", nextStatus);

    if (nextRegion === "all") nextParams.delete("region");
    else nextParams.set("region", nextRegion);

    const query = nextParams.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  if (isLoading) return <LoadingState message="서버 목록을 불러오는 중..." />;
  if (error) {
    return <ErrorState message={error.message} onRetry={() => refetch()} />;
  }

  const list = servers ?? [];
  const filteredServers = list.filter((server) => {
    const matchStatus =
      statusFilter === "all" || server.status === statusFilter;
    const matchRegion =
      regionFilter === "all" || server.region === regionFilter;
    return matchStatus && matchRegion;
  });

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-fg-base">서버 목록</h1>
            <p className="mt-1 text-sm text-fg-muted">
              {filteredServers.length}개 표시 / 전체 {list.length}개
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">서버 추가</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>새 서버 추가</DialogTitle>
                <DialogDescription>
                  이름, 지역, 버전, 최대 플레이어 수를 입력해주세요.
                </DialogDescription>
              </DialogHeader>
              <ServerForm onSuccess={() => setIsCreateDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="w-full overflow-x-auto rounded-lg border border-border-default bg-bg-surface p-1 sm:w-auto">
          <div className="flex min-w-max items-center gap-1.5">
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => updateFilters({ status: option.value })}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  statusFilter === option.value
                    ? STATUS_BTN_ACTIVE[option.value]
                    : "text-fg-muted hover:text-fg-base"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <select
          value={regionFilter}
          onChange={(event) => updateFilters({ region: event.target.value })}
          className="w-full rounded-lg border border-border-default bg-bg-input px-3 py-2 text-xs text-fg-base focus:border-border-focus focus:outline-none focus:ring-1 focus:ring-border-focus sm:w-auto"
        >
          {REGION_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {filteredServers.length === 0 ? (
        <EmptyState message="조건에 맞는 서버가 없습니다." />
      ) : (
        <ServerList servers={filteredServers} />
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { checkBackendAvailable } from "@/lib/backendApi";
import { useServerHealth } from "@/features/game-status/hooks/useServerHealth";
import { useServerTrend } from "@/features/game-status/hooks/useServerTrend";
import { useServerDiagnose } from "@/features/game-status/hooks/useServerDiagnose";
import { useServerPlayers } from "@/features/game-status/hooks/useServerPlayers";
import type {
  ServerDetail as ServerDetailType,
  MetricPoint,
} from "@/types/server";
import { useServerMetrics } from "@/features/servers/model/hooks/useServerMetrics";
import { useAlerts } from "@/hooks/useAlerts";
import { MiniChart } from "@/components/servers/MiniChart";
import { AnalysisPanel } from "@/components/servers/AnalysisPanel";
import { LoadingState } from "@/components/common/LoadingState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Range = "1h" | "6h" | "24h";

const RANGE_OPTIONS: { value: Range; label: string }[] = [
  { value: "1h", label: "1시간" },
  { value: "6h", label: "6시간" },
  { value: "24h", label: "24시간" },
];

const STATUS_LABEL = { healthy: "정상", degraded: "저하", down: "다운" };

const SEVERITY_LABEL = { critical: "심각", warning: "경고", info: "정보" };

const ALERT_STATUS_LABEL = {
  open: "열림",
  acknowledged: "확인됨",
  resolved: "해결됨",
};

const REGION_LABEL: Record<string, string> = {
  "kr-seoul": "한국 (서울)",
  "us-east": "미국 (동부)",
  "eu-west": "유럽 (서부)",
  "ap-tokyo": "일본 (도쿄)",
};

function formatUptime(seconds: number): string {
  if (seconds === 0) return "-";
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (days > 0) return `${days}일 ${hours}시간`;
  if (hours > 0) return `${hours}시간 ${mins}분`;
  return `${mins}분`;
}

function formatRelativeTime(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}초 전`;
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

function buildChartData(metrics: MetricPoint[], key: keyof MetricPoint) {
  return metrics.map((p) => ({
    time: formatTime(p.timestamp),
    value: p[key] as number,
  }));
}

interface ServerDetailProps {
  server: ServerDetailType;
}

export function ServerDetail({ server }: ServerDetailProps) {
  const [range, setRange] = useState<Range>("24h");
  const [showAnalysis, setShowAnalysis] = useState(false);
  const { data: metrics, isLoading: metricsLoading } = useServerMetrics(
    server.id,
    range
  );
  const { data: allAlerts } = useAlerts();

  // 백엔드 가용 여부 확인 (오프라인이면 헬스 패널 숨김)
  const [backendAvailable, setBackendAvailable] = useState(false);

  useEffect(() => {
    checkBackendAvailable().then(setBackendAvailable);
  }, []);

  const { data: gameHealth } = useServerHealth(server.id, {
    enabled: backendAvailable,
  });
  const { data: trend } = useServerTrend(server.id, { enabled: backendAvailable });
  const { data: diagnose } = useServerDiagnose(server.id, {
    enabled: backendAvailable,
  });
  const { data: playersData } = useServerPlayers(server.id, {
    enabled: backendAvailable,
  });

  const serverAlerts = (allAlerts ?? []).filter(
    (a) => a.serverId === server.id
  );
  const activeMetrics = metrics ?? server.metrics;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/servers"
          className="flex items-center gap-1.5 rounded-lg border border-border-default bg-bg-surface px-3 py-1.5 text-xs text-fg-muted transition-colors hover:border-border-subtle hover:text-fg-base"
        >
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          서버 목록
        </Link>
      </div>

      <Card>
        <CardContent className="p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-fg-base">{server.name}</h1>
                <Badge
                  variant={
                    server.status === "healthy"
                      ? "ok"
                      : server.status === "degraded"
                        ? "warn"
                        : "error"
                  }
                >
                  {STATUS_LABEL[server.status]}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-fg-muted">
                {REGION_LABEL[server.region] ?? server.region} · v{server.version}
              </p>
            </div>
            <Button
              variant="accent"
              size="sm"
              onClick={() => setShowAnalysis((v) => !v)}
              className="h-8 w-full gap-1.5 px-3 text-xs sm:w-auto"
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              AI 분석
            </Button>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            <div>
              <p className="text-xs text-fg-subtle">플레이어</p>
              <p className="mt-1 font-semibold text-fg-base">
                {server.playerCount}
                <span className="font-normal text-fg-subtle">
                  {" "}
                  / {server.maxPlayers}
                </span>
              </p>
            </div>
            <div>
              <p className="text-xs text-fg-subtle">업타임</p>
              <p className="mt-1 font-semibold text-fg-base">
                {formatUptime(server.uptimeSeconds)}
              </p>
            </div>
            <div>
              <p className="text-xs text-fg-subtle">마지막 Heartbeat</p>
              <p className="mt-1 font-semibold text-fg-base">
                {formatRelativeTime(server.lastHeartbeatAt)}
              </p>
            </div>
            <div>
              <p className="text-xs text-fg-subtle">용량</p>
              <p className="mt-1 font-semibold text-fg-base">
                {Math.round((server.playerCount / server.maxPlayers) * 100)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 실시간 게임 서버 헬스 패널 — 백엔드 오프라인 시 자동 숨김 */}
      {backendAvailable && gameHealth && (
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-fg-base">
                실시간 게임 서버 헬스
              </h2>
              <Badge
                variant={
                  gameHealth.health === "GOOD"
                    ? "ok"
                    : gameHealth.health === "HIGH_LOAD" ||
                        gameHealth.health === "CRITICAL"
                      ? "error"
                      : "warn"
                }
              >
                {gameHealth.health}
              </Badge>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
              <div>
                <p className="text-xs text-fg-subtle">Ping</p>
                <p className="mt-1 font-semibold text-fg-base">
                  {gameHealth.ping >= 0 ? `${gameHealth.ping}ms` : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-fg-subtle">게임 플레이어</p>
                <p className="mt-1 font-semibold text-fg-base">
                  {gameHealth.players}
                  <span className="font-normal text-fg-subtle">
                    {" "}
                    / {gameHealth.maxPlayers}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-xs text-fg-subtle">맵</p>
                <p className="mt-1 font-semibold text-fg-base">
                  {gameHealth.map}
                </p>
              </div>
              <div>
                <p className="text-xs text-fg-subtle">지연 등급</p>
                <p className="mt-1 font-semibold text-fg-base">
                  {gameHealth.latencyCategory}
                </p>
              </div>
            </div>
            {gameHealth.reason && (
              <p className="mt-3 text-xs text-fg-muted">{gameHealth.reason}</p>
            )}
          </CardContent>
        </Card>
      )}

      {backendAvailable && trend?.history && trend.history.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold text-fg-base">
            게임 서버 플레이어 추이
          </h2>
          <MiniChart
            label=""
            data={trend.history.map((e) => ({
              time: formatTime(e.timestamp),
              value: e.players,
            }))}
            color="#6366f1"
            unit="명"
          />
        </div>
      )}

      {backendAvailable && diagnose && (
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-fg-base">진단 정보</h2>
              <Badge
                variant={
                  diagnose.status === "GOOD"
                    ? "ok"
                    : diagnose.status === "WARNING"
                      ? "warn"
                      : "error"
                }
              >
                {diagnose.status}
              </Badge>
            </div>
            {diagnose.analysis.length > 0 && (
              <ul className="mt-3 space-y-1">
                {diagnose.analysis.map((item, index) => (
                  <li key={`${item}-${index}`} className="text-xs text-fg-muted">
                    • {item}
                  </li>
                ))}
              </ul>
            )}
            {diagnose.reason && (
              <p className="mt-2 text-xs text-fg-muted">{diagnose.reason}</p>
            )}
          </CardContent>
        </Card>
      )}

      {backendAvailable && playersData && playersData.playerList.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold text-fg-base">
            현재 플레이어 ({playersData.playerList.length}명)
          </h2>
          <Card>
            <CardContent className="p-0">
              <ul className="divide-y divide-border-default">
                {playersData.playerList.map((player, index) => (
                  <li
                    key={`${player.name}-${index}`}
                    className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm"
                  >
                    <span className="text-fg-base">{player.name}</span>
                    <div className="flex items-center gap-4 text-xs text-fg-subtle">
                      {player.score !== undefined && <span>점수 {player.score}</span>}
                      {player.time !== undefined && (
                        <span>{Math.round(player.time / 60)}분</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      {showAnalysis && (
        <AnalysisPanel
          serverId={server.id}
          onClose={() => setShowAnalysis(false)}
        />
      )}

      <div>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-semibold text-fg-base">성능 지표</h2>
          <div className="w-full overflow-x-auto rounded-lg border border-border-default bg-bg-surface p-1 sm:w-auto">
            <div className="flex min-w-max items-center gap-1">
              {RANGE_OPTIONS.map((opt) => (
                <Button
                  key={opt.value}
                  variant={range === opt.value ? "accent" : "ghost"}
                  size="sm"
                  onClick={() => setRange(opt.value)}
                  className="h-7 px-3 text-xs"
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {metricsLoading ? (
          <LoadingState message="메트릭 데이터를 불러오는 중..." />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <MiniChart
              label="플레이어 수"
              data={buildChartData(activeMetrics, "playerCount")}
              color="#6366f1"
              unit="명"
            />
            <MiniChart
              label="CPU 사용률"
              data={buildChartData(activeMetrics, "cpuUsage")}
              color="#f59e0b"
              unit="%"
            />
            <MiniChart
              label="메모리 사용률"
              data={buildChartData(activeMetrics, "memoryUsage")}
              color="#10b981"
              unit="%"
            />
            <MiniChart
              label="RTT (ms)"
              data={buildChartData(activeMetrics, "rttMs")}
              color="#ef4444"
              unit="ms"
            />
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-fg-base">관련 알림</h2>
        {serverAlerts.length === 0 ? (
          <div className="rounded-xl border border-border-default bg-bg-surface px-5 py-8 text-center text-sm text-fg-subtle">
            이 서버에 대한 알림이 없습니다.
          </div>
        ) : (
          <ul className="space-y-2">
            {serverAlerts.map((alert) => (
              <li
                key={alert.id}
                className="flex flex-wrap items-start gap-3 rounded-xl border border-border-default bg-bg-surface px-4 py-3"
              >
                <Badge
                  variant={alert.severity}
                  className="mt-0.5 shrink-0"
                >
                  {SEVERITY_LABEL[alert.severity]}
                </Badge>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-fg-base">
                    {alert.title}
                  </p>
                  <p className="mt-0.5 text-xs text-fg-muted">
                    {alert.description}
                  </p>
                </div>
                <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      alert.status === "open"
                        ? "bg-bg-elevated text-fg-muted"
                        : alert.status === "acknowledged"
                          ? "bg-interactive-accent/10 text-interactive-accent"
                          : "bg-bg-base text-fg-subtle"
                    }`}
                  >
                    {ALERT_STATUS_LABEL[alert.status]}
                  </span>
                  <span className="text-xs text-fg-subtle">
                    {formatRelativeTime(alert.createdAt)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import type {
  ServerDetail as ServerDetailType,
  MetricPoint,
} from "@/types/server";
import { useServerMetrics } from "@/hooks/useServerMetrics";
import { useAlerts } from "@/hooks/useAlerts";
import { MiniChart } from "@/components/servers/MiniChart";
import { AnalysisPanel } from "@/components/servers/AnalysisPanel";
import { LoadingState } from "@/components/common/LoadingState";

type Range = "1h" | "6h" | "24h";

const RANGE_OPTIONS: { value: Range; label: string }[] = [
  { value: "1h", label: "1시간" },
  { value: "6h", label: "6시간" },
  { value: "24h", label: "24시간" },
];

const STATUS_LABEL = { healthy: "정상", degraded: "저하", down: "다운" };
const STATUS_BADGE = {
  healthy: "bg-emerald-400/10 text-emerald-400",
  degraded: "bg-yellow-400/10 text-yellow-400",
  down: "bg-red-400/10 text-red-400",
};

const SEVERITY_BADGE = {
  critical: "bg-red-400/10 text-red-400",
  warning: "bg-yellow-400/10 text-yellow-400",
  info: "bg-blue-400/10 text-blue-400",
};
const SEVERITY_LABEL = { critical: "심각", warning: "경고", info: "정보" };

const ALERT_STATUS_BADGE = {
  open: "bg-gray-700 text-gray-300",
  acknowledged: "bg-indigo-400/10 text-indigo-400",
  resolved: "bg-gray-800 text-gray-500",
};
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

  const serverAlerts = (allAlerts ?? []).filter(
    (a) => a.serverId === server.id
  );
  const activeMetrics = metrics ?? server.metrics;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/servers"
          className="flex items-center gap-1.5 rounded-lg border border-gray-800 bg-gray-900 px-3 py-1.5 text-xs text-gray-400 transition-colors hover:border-gray-700 hover:text-white"
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

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-white">{server.name}</h1>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE[server.status]}`}
              >
                {STATUS_LABEL[server.status]}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-400">
              {REGION_LABEL[server.region] ?? server.region} · v{server.version}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAnalysis((v) => !v)}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-500"
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
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4 text-sm">
          <div>
            <p className="text-gray-500 text-xs">플레이어</p>
            <p className="mt-1 font-semibold text-white">
              {server.playerCount}
              <span className="text-gray-500 font-normal">
                {" "}
                / {server.maxPlayers}
              </span>
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">업타임</p>
            <p className="mt-1 font-semibold text-white">
              {formatUptime(server.uptimeSeconds)}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">마지막 Heartbeat</p>
            <p className="mt-1 font-semibold text-white">
              {formatRelativeTime(server.lastHeartbeatAt)}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">용량</p>
            <p className="mt-1 font-semibold text-white">
              {Math.round((server.playerCount / server.maxPlayers) * 100)}%
            </p>
          </div>
        </div>
      </div>

      {showAnalysis && (
        <AnalysisPanel
          serverId={server.id}
          onClose={() => setShowAnalysis(false)}
        />
      )}

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">성능 지표</h2>
          <div className="flex items-center gap-1 rounded-lg border border-gray-800 bg-gray-900 p-1">
            {RANGE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setRange(opt.value)}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                  range === opt.value
                    ? "bg-indigo-600 text-white"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {opt.label}
              </button>
            ))}
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
        <h2 className="mb-3 text-sm font-semibold text-white">관련 알림</h2>
        {serverAlerts.length === 0 ? (
          <div className="rounded-xl border border-gray-800 bg-gray-900 px-5 py-8 text-center text-sm text-gray-500">
            이 서버에 대한 알림이 없습니다.
          </div>
        ) : (
          <ul className="space-y-2">
            {serverAlerts.map((alert) => (
              <li
                key={alert.id}
                className="flex flex-wrap items-start gap-3 rounded-xl border border-gray-800 bg-gray-900 px-4 py-3"
              >
                <span
                  className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${SEVERITY_BADGE[alert.severity]}`}
                >
                  {SEVERITY_LABEL[alert.severity]}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">
                    {alert.title}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400">
                    {alert.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${ALERT_STATUS_BADGE[alert.status]}`}
                  >
                    {ALERT_STATUS_LABEL[alert.status]}
                  </span>
                  <span className="text-xs text-gray-500">
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

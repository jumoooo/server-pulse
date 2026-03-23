"use client";

import { useRouter } from "next/navigation";
import type { Server, ServerStatus } from "@/types/server";

interface ServerListProps {
  servers: Server[];
}

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

const STATUS_DOT: Record<ServerStatus, string> = {
  healthy: "bg-emerald-400",
  degraded: "bg-yellow-400",
  down: "bg-red-400",
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
  if (days > 0) return `${days}일 ${hours}시간`;
  return `${hours}시간`;
}

export function ServerList({ servers }: ServerListProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {servers.map((server) => (
        <button
          key={server.id}
          type="button"
          onClick={() => router.push(`/servers/${server.id}`)}
          className="group bg-gray-900 border border-gray-800 rounded-xl p-5 text-left transition-all hover:border-gray-700 hover:bg-gray-800/60 hover:ring-1 hover:ring-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block h-2 w-2 shrink-0 rounded-full ${STATUS_DOT[server.status]}`}
                />
                <h3 className="truncate text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                  {server.name}
                </h3>
              </div>
              <p className="mt-1 text-xs text-gray-400">
                {REGION_LABEL[server.region] ?? server.region}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE[server.status]}`}
            >
              {STATUS_LABEL[server.status]}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
            <div>
              <p className="text-gray-500">플레이어</p>
              <p className="mt-0.5 font-medium text-white">
                {server.playerCount}
                <span className="text-gray-500"> / {server.maxPlayers}</span>
              </p>
            </div>
            <div>
              <p className="text-gray-500">버전</p>
              <p className="mt-0.5 font-medium text-white">{server.version}</p>
            </div>
            <div>
              <p className="text-gray-500">업타임</p>
              <p className="mt-0.5 font-medium text-white">
                {formatUptime(server.uptimeSeconds)}
              </p>
            </div>
            <div>
              <p className="text-gray-500">용량</p>
              <p className="mt-0.5 font-medium text-white">
                {Math.round((server.playerCount / server.maxPlayers) * 100)}%
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

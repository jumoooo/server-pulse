import type { Server } from "@/types/server";

interface MetricsSummaryProps {
  servers: Server[];
}

export function MetricsSummary({ servers }: MetricsSummaryProps) {
  const onlineServers = servers.filter((s) => s.status !== "down");
  const totalPlayers = servers.reduce((sum, s) => sum + s.playerCount, 0);

  const metrics = [
    {
      label: "총 접속 플레이어",
      value: totalPlayers.toLocaleString(),
      unit: "명",
      sub: `최대 ${servers.reduce((sum, s) => sum + s.maxPlayers, 0).toLocaleString()}명 수용`,
      color: "text-indigo-400",
      bg: "bg-indigo-400/10",
    },
    {
      label: "활성 서버",
      value: onlineServers.length.toString(),
      unit: `/ ${servers.length}`,
      sub: `${servers.length - onlineServers.length}개 다운`,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
    },
    {
      label: "평균 용량 사용률",
      value:
        servers.length > 0
          ? Math.round(
              servers.reduce(
                (sum, s) => sum + (s.playerCount / s.maxPlayers) * 100,
                0
              ) / servers.length
            ).toString()
          : "0",
      unit: "%",
      sub: "전체 서버 평균",
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="bg-gray-900 border border-gray-800 rounded-xl p-5"
        >
          <p className="text-sm text-gray-400">{metric.label}</p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className={`text-3xl font-bold ${metric.color}`}>
              {metric.value}
            </span>
            <span className="text-sm text-gray-500">{metric.unit}</span>
          </div>
          <p className="mt-1 text-xs text-gray-600">{metric.sub}</p>
        </div>
      ))}
    </div>
  );
}

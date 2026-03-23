import type { Server, MetricPoint, Alert } from "@/types/server";

export const mockServers: Server[] = [
  {
    id: "kr-1",
    name: "Seoul Alpha",
    region: "kr-seoul",
    version: "1.20.4",
    status: "healthy",
    uptimeSeconds: 864000,
    lastHeartbeatAt: new Date(Date.now() - 5000).toISOString(),
    playerCount: 87,
    maxPlayers: 100,
  },
  {
    id: "kr-2",
    name: "Seoul Beta",
    region: "kr-seoul",
    version: "1.20.4",
    status: "degraded",
    uptimeSeconds: 432000,
    lastHeartbeatAt: new Date(Date.now() - 12000).toISOString(),
    playerCount: 43,
    maxPlayers: 100,
  },
  {
    id: "us-1",
    name: "US East Prime",
    region: "us-east",
    version: "1.20.3",
    status: "healthy",
    uptimeSeconds: 1728000,
    lastHeartbeatAt: new Date(Date.now() - 3000).toISOString(),
    playerCount: 62,
    maxPlayers: 150,
  },
  {
    id: "us-2",
    name: "US East Secondary",
    region: "us-east",
    version: "1.20.3",
    status: "down",
    uptimeSeconds: 0,
    lastHeartbeatAt: new Date(Date.now() - 300000).toISOString(),
    playerCount: 0,
    maxPlayers: 150,
  },
  {
    id: "eu-1",
    name: "EU West Node",
    region: "eu-west",
    version: "1.20.4",
    status: "healthy",
    uptimeSeconds: 259200,
    lastHeartbeatAt: new Date(Date.now() - 7000).toISOString(),
    playerCount: 31,
    maxPlayers: 80,
  },
];

function generateMetrics(
  serverId: string,
  count: number,
  intervalMinutes: number
): MetricPoint[] {
  const server = mockServers.find((s) => s.id === serverId);
  const isDegraded = server?.status === "degraded";
  const isDown = server?.status === "down";
  const now = Date.now();

  return Array.from({ length: count }, (_, i) => {
    const timestamp = new Date(
      now - (count - 1 - i) * intervalMinutes * 60 * 1000
    ).toISOString();
    const noise = () => (Math.random() - 0.5) * 10;

    if (isDown) {
      return {
        timestamp,
        cpuUsage: 0,
        memoryUsage: 0,
        rttMs: 0,
        errorRate: 1,
        playerCount: 0,
      };
    }

    const baseCpu = isDegraded ? 75 : 40;
    const baseMem = isDegraded ? 80 : 55;
    const baseRtt = isDegraded ? 120 : 28;
    const baseError = isDegraded ? 0.08 : 0.01;
    const basePlayer = server?.playerCount ?? 30;

    return {
      timestamp,
      cpuUsage: Math.min(100, Math.max(0, baseCpu + noise())),
      memoryUsage: Math.min(100, Math.max(0, baseMem + noise())),
      rttMs: Math.max(1, baseRtt + noise() * 2),
      errorRate: Math.min(
        1,
        Math.max(0, baseError + (Math.random() - 0.5) * 0.02)
      ),
      playerCount: Math.max(0, Math.round(basePlayer + noise())),
    };
  });
}

export function getMetrics(
  serverId: string,
  range: "1h" | "6h" | "24h"
): MetricPoint[] {
  const config: Record<string, { count: number; interval: number }> = {
    "1h": { count: 12, interval: 5 },
    "6h": { count: 36, interval: 10 },
    "24h": { count: 24, interval: 60 },
  };
  const { count, interval } = config[range];
  return generateMetrics(serverId, count, interval);
}

export const mockAlerts: Alert[] = [
  {
    id: "alert-1",
    serverId: "us-2",
    serverName: "US East Secondary",
    severity: "critical",
    status: "open",
    title: "서버 응답 없음",
    description:
      "5분 이상 heartbeat가 수신되지 않습니다. 즉각적인 확인이 필요합니다.",
    ruleId: "rule-heartbeat",
    createdAt: new Date(Date.now() - 310000).toISOString(),
  },
  {
    id: "alert-2",
    serverId: "kr-2",
    serverName: "Seoul Beta",
    severity: "critical",
    status: "acknowledged",
    title: "CPU 사용률 임계값 초과",
    description: "CPU 사용률이 90%를 초과했습니다. 현재 94% 유지 중.",
    ruleId: "rule-cpu-high",
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: "alert-3",
    serverId: "kr-2",
    serverName: "Seoul Beta",
    severity: "warning",
    status: "open",
    title: "메모리 사용률 높음",
    description: "메모리 사용률이 85%에 도달했습니다. 주의가 필요합니다.",
    ruleId: "rule-memory-high",
    createdAt: new Date(Date.now() - 900000).toISOString(),
  },
  {
    id: "alert-4",
    serverId: "kr-2",
    serverName: "Seoul Beta",
    severity: "warning",
    status: "open",
    title: "평균 RTT 증가",
    description: "평균 RTT가 100ms를 초과했습니다. 현재 128ms.",
    ruleId: "rule-rtt-high",
    createdAt: new Date(Date.now() - 600000).toISOString(),
  },
  {
    id: "alert-5",
    serverId: "kr-1",
    serverName: "Seoul Alpha",
    severity: "warning",
    status: "acknowledged",
    title: "플레이어 급증",
    description: "플레이어 수가 최대 용량의 90%에 도달했습니다.",
    ruleId: "rule-player-cap",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "alert-6",
    serverId: "us-1",
    serverName: "US East Prime",
    severity: "warning",
    status: "resolved",
    title: "에러율 증가",
    description: "에러율이 5%를 초과했습니다. 이후 정상화 완료.",
    ruleId: "rule-error-rate",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    resolvedAt: new Date(Date.now() - 5400000).toISOString(),
  },
  {
    id: "alert-7",
    serverId: "eu-1",
    serverName: "EU West Node",
    severity: "warning",
    status: "open",
    title: "디스크 사용량 경고",
    description: "디스크 사용량이 80%에 도달했습니다.",
    ruleId: "rule-disk",
    createdAt: new Date(Date.now() - 450000).toISOString(),
  },
  {
    id: "alert-8",
    serverId: "kr-1",
    serverName: "Seoul Alpha",
    severity: "info",
    status: "resolved",
    title: "서버 재시작 완료",
    description: "예약된 유지보수 재시작이 성공적으로 완료되었습니다.",
    ruleId: "rule-restart",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    resolvedAt: new Date(Date.now() - 85800000).toISOString(),
  },
  {
    id: "alert-9",
    serverId: "us-1",
    serverName: "US East Prime",
    severity: "info",
    status: "acknowledged",
    title: "업데이트 배포 예정",
    description: "2시간 후 버전 1.20.4 업데이트가 배포됩니다.",
    ruleId: "rule-deploy",
    createdAt: new Date(Date.now() - 1200000).toISOString(),
  },
  {
    id: "alert-10",
    serverId: "eu-1",
    serverName: "EU West Node",
    severity: "info",
    status: "resolved",
    title: "백업 완료",
    description: "정기 데이터 백업이 성공적으로 완료되었습니다.",
    ruleId: "rule-backup",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    resolvedAt: new Date(Date.now() - 172700000).toISOString(),
  },
];

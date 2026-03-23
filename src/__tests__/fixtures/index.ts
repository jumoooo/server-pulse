import type { Server, Alert, MetricPoint } from "@/types/server";

export const mockServer: Server = {
  id: "kr-1",
  name: "Seoul Alpha",
  region: "kr-seoul",
  version: "1.20.4",
  status: "healthy",
  uptimeSeconds: 864000,
  lastHeartbeatAt: new Date(Date.now() - 5000).toISOString(),
  playerCount: 87,
  maxPlayers: 100,
};

export const mockDegradedServer: Server = {
  id: "kr-2",
  name: "Seoul Beta",
  region: "kr-seoul",
  version: "1.20.4",
  status: "degraded",
  uptimeSeconds: 432000,
  lastHeartbeatAt: new Date(Date.now() - 12000).toISOString(),
  playerCount: 43,
  maxPlayers: 100,
};

export const mockAlert: Alert = {
  id: "alert-1",
  serverId: "us-2",
  serverName: "US East Secondary",
  severity: "critical",
  status: "open",
  title: "서버 응답 없음",
  description: "5분 이상 heartbeat가 수신되지 않습니다.",
  ruleId: "rule-heartbeat",
  createdAt: new Date(Date.now() - 310000).toISOString(),
};

export const mockMetric: MetricPoint = {
  timestamp: new Date().toISOString(),
  cpuUsage: 40,
  memoryUsage: 55,
  rttMs: 28,
  errorRate: 0.01,
  playerCount: 87,
};

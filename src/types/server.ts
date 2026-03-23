export type ServerStatus = "healthy" | "degraded" | "down";
export type AlertSeverity = "critical" | "warning" | "info";
export type AlertStatus = "open" | "acknowledged" | "resolved";

export interface Server {
  id: string;
  name: string;
  region: string;
  version: string;
  status: ServerStatus;
  uptimeSeconds: number;
  lastHeartbeatAt: string;
  playerCount: number;
  maxPlayers: number;
}

export interface MetricPoint {
  timestamp: string;
  cpuUsage: number;
  memoryUsage: number;
  rttMs: number;
  errorRate: number;
  playerCount: number;
}

export interface ServerDetail extends Server {
  metrics: MetricPoint[];
}

export interface Alert {
  id: string;
  serverId: string;
  serverName: string;
  severity: AlertSeverity;
  status: AlertStatus;
  title: string;
  description: string;
  ruleId: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

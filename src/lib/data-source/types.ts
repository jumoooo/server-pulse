import type { Alert, AlertStatus, MetricPoint, Server } from "@/types/server";

export type MetricRange = "1h" | "6h" | "24h";
export type AlertUpdatableStatus = Extract<AlertStatus, "acknowledged" | "resolved">;

export interface AnalysisContext {
  server: Server;
  recentMetrics: MetricPoint[];
  activeAlerts: Alert[];
}

export type DataProviderKind = "mock" | "steam-mcp";

export type DataProviderErrorCode =
  | "CONFIG_MISSING"
  | "TIMEOUT"
  | "NETWORK"
  | "HTTP"
  | "INVALID_RESPONSE"
  | "UNKNOWN";

export class DataProviderError extends Error {
  readonly code: DataProviderErrorCode;
  readonly cause?: unknown;
  readonly status?: number;

  constructor(
    code: DataProviderErrorCode,
    message: string,
    options?: { cause?: unknown; status?: number }
  ) {
    super(message);
    this.name = "DataProviderError";
    this.code = code;
    this.cause = options?.cause;
    this.status = options?.status;
  }
}

export interface DataSourceProvider {
  readonly kind: DataProviderKind;
  getServers(): Promise<Server[]>;
  getAlerts(): Promise<Alert[]>;
  getMetrics(serverId: string, range: MetricRange): Promise<MetricPoint[]>;
  getAnalysisContext(serverId: string): Promise<AnalysisContext | null>;
  updateAlertStatus(alertId: string, status: AlertUpdatableStatus): Promise<Alert>;
}

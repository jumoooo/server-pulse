import type { Alert, MetricPoint, Server } from "@/types/server";
import { MockDataProvider } from "./mockDataProvider";
import {
  DataProviderError,
  type AlertUpdatableStatus,
  type AnalysisContext,
  type DataSourceProvider,
  type MetricRange,
} from "./types";

interface SteamMcpConfig {
  baseUrl: string;
  apiKey?: string;
  timeoutMs: number;
  retryCount: number;
  retryDelayMs: number;
  serversPath: string;
  alertsPath: string;
  metricsPath: string;
  analysisContextPath: string;
}

type RequestInitWithTimeout = RequestInit & { timeoutMs?: number };

const DEFAULT_TIMEOUT_MS = 5_000;
const DEFAULT_RETRY_COUNT = 1;
const DEFAULT_RETRY_DELAY_MS = 300;

function parsePositiveInt(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback;
}

function normalizePath(path: string): string {
  if (!path) return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function createConfigFromEnv(env: NodeJS.ProcessEnv): SteamMcpConfig | null {
  const baseUrl = env.STEAM_MCP_BASE_URL?.trim();
  if (!baseUrl) {
    return null;
  }

  return {
    baseUrl,
    apiKey: env.STEAM_MCP_API_KEY?.trim(),
    timeoutMs: parsePositiveInt(env.STEAM_MCP_TIMEOUT_MS, DEFAULT_TIMEOUT_MS),
    retryCount: parsePositiveInt(env.STEAM_MCP_RETRY_COUNT, DEFAULT_RETRY_COUNT),
    retryDelayMs: parsePositiveInt(
      env.STEAM_MCP_RETRY_DELAY_MS,
      DEFAULT_RETRY_DELAY_MS
    ),
    serversPath: normalizePath(env.STEAM_MCP_SERVERS_PATH ?? "/servers"),
    alertsPath: normalizePath(env.STEAM_MCP_ALERTS_PATH ?? "/alerts"),
    metricsPath: normalizePath(
      env.STEAM_MCP_METRICS_PATH ?? "/servers/{id}/metrics"
    ),
    analysisContextPath: normalizePath(
      env.STEAM_MCP_ANALYSIS_CONTEXT_PATH ?? "/servers/{id}/analysis-context"
    ),
  };
}

export class SteamMcpProvider implements DataSourceProvider {
  readonly kind = "steam-mcp" as const;

  private readonly config: SteamMcpConfig | null;
  private readonly fallbackProvider: DataSourceProvider;

  constructor(options?: { fallbackProvider?: DataSourceProvider; env?: NodeJS.ProcessEnv }) {
    this.fallbackProvider = options?.fallbackProvider ?? new MockDataProvider();
    this.config = createConfigFromEnv(options?.env ?? process.env);
  }

  isConfigured(): boolean {
    return this.config !== null;
  }

  async getServers() {
    try {
      const config = this.requireConfig();
      return await this.requestWithRetry<Server[]>(config.serversPath);
    } catch {
      return this.fallbackProvider.getServers();
    }
  }

  async getAlerts() {
    try {
      const config = this.requireConfig();
      return await this.requestWithRetry<Alert[]>(config.alertsPath);
    } catch {
      return this.fallbackProvider.getAlerts();
    }
  }

  async getMetrics(serverId: string, range: MetricRange) {
    try {
      const config = this.requireConfig();
      const path = config.metricsPath.replace("{id}", encodeURIComponent(serverId));
      const query = new URLSearchParams({ range }).toString();
      return await this.requestWithRetry<MetricPoint[]>(`${path}?${query}`);
    } catch {
      return this.fallbackProvider.getMetrics(serverId, range);
    }
  }

  async getAnalysisContext(serverId: string): Promise<AnalysisContext | null> {
    try {
      const config = this.requireConfig();
      const path = config.analysisContextPath.replace(
        "{id}",
        encodeURIComponent(serverId)
      );
      return await this.requestWithRetry<AnalysisContext>(path);
    } catch {
      return this.fallbackProvider.getAnalysisContext(serverId);
    }
  }

  async updateAlertStatus(alertId: string, status: AlertUpdatableStatus) {
    try {
      const config = this.requireConfig();
      const path = `${config.alertsPath}/${encodeURIComponent(alertId)}`;
      return await this.requestWithRetry<Alert>(path, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
    } catch {
      return this.fallbackProvider.updateAlertStatus(alertId, status);
    }
  }

  private requireConfig(): SteamMcpConfig {
    if (!this.config) {
      throw new DataProviderError(
        "CONFIG_MISSING",
        "STEAM_MCP 설정이 없어 Mock provider로 폴백합니다."
      );
    }
    return this.config;
  }

  private async requestWithRetry<T>(
    path: string,
    init?: RequestInitWithTimeout
  ): Promise<T> {
    const config = this.requireConfig();
    let lastError: unknown;

    for (let attempt = 0; attempt <= config.retryCount; attempt += 1) {
      try {
        return await this.requestOnce<T>(path, init);
      } catch (error) {
        lastError = error;
        if (attempt >= config.retryCount) {
          break;
        }
        await sleep(config.retryDelayMs * (attempt + 1));
      }
    }

    throw this.mapToProviderError(lastError);
  }

  private async requestOnce<T>(
    path: string,
    init?: RequestInitWithTimeout
  ): Promise<T> {
    const config = this.requireConfig();
    const timeoutMs = init?.timeoutMs ?? config.timeoutMs;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(`${config.baseUrl}${path}`, {
        method: init?.method ?? "GET",
        headers: {
          "Content-Type": "application/json",
          ...(config.apiKey ? { Authorization: `Bearer ${config.apiKey}` } : {}),
          ...(init?.headers ?? {}),
        },
        body: init?.body,
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new DataProviderError(
          "HTTP",
          `Steam MCP 요청 실패: ${response.status}`,
          { status: response.status }
        );
      }

      const payload: unknown = await response.json();
      if (payload === null || payload === undefined) {
        throw new DataProviderError(
          "INVALID_RESPONSE",
          "Steam MCP 응답이 비어 있습니다."
        );
      }

      return payload as T;
    } catch (error) {
      throw this.mapToProviderError(error);
    } finally {
      clearTimeout(timeout);
    }
  }

  private mapToProviderError(error: unknown): DataProviderError {
    if (error instanceof DataProviderError) {
      return error;
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      return new DataProviderError("TIMEOUT", "Steam MCP 요청 시간이 초과되었습니다.", {
        cause: error,
      });
    }

    if (error instanceof TypeError) {
      return new DataProviderError("NETWORK", "Steam MCP 네트워크 오류가 발생했습니다.", {
        cause: error,
      });
    }

    if (error instanceof Error) {
      return new DataProviderError("UNKNOWN", error.message, { cause: error });
    }

    return new DataProviderError("UNKNOWN", "알 수 없는 Steam MCP 오류", {
      cause: error,
    });
  }
}

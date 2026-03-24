import { getMetrics, mockAlerts, mockServers } from "@/lib/mockData";
import type { Alert } from "@/types/server";
import {
  DataProviderError,
  type AlertUpdatableStatus,
  type AnalysisContext,
  type DataSourceProvider,
  type MetricRange,
} from "./types";

export class MockDataProvider implements DataSourceProvider {
  readonly kind = "mock" as const;

  async getServers() {
    return mockServers;
  }

  async getAlerts() {
    return mockAlerts;
  }

  async getMetrics(serverId: string, range: MetricRange) {
    const server = mockServers.find((item) => item.id === serverId);
    if (!server) {
      throw new DataProviderError(
        "INVALID_RESPONSE",
        `서버를 찾을 수 없습니다: ${serverId}`
      );
    }
    return getMetrics(serverId, range);
  }

  async getAnalysisContext(serverId: string): Promise<AnalysisContext | null> {
    const server = mockServers.find((item) => item.id === serverId);
    if (!server) {
      return null;
    }

    const recentMetrics = getMetrics(serverId, "1h").slice(-3);
    const activeAlerts = mockAlerts.filter(
      (alert) => alert.serverId === serverId && alert.status !== "resolved"
    );

    return {
      server,
      recentMetrics,
      activeAlerts,
    };
  }

  async updateAlertStatus(alertId: string, status: AlertUpdatableStatus) {
    const alertIndex = mockAlerts.findIndex((item) => item.id === alertId);
    if (alertIndex === -1) {
      throw new DataProviderError(
        "INVALID_RESPONSE",
        `알림을 찾을 수 없습니다: ${alertId}`
      );
    }

    const baseAlert = mockAlerts[alertIndex];
    if (!baseAlert) {
      throw new DataProviderError(
        "UNKNOWN",
        `알림 상태를 갱신할 수 없습니다: ${alertId}`
      );
    }

    const updatedAlert: Alert = {
      ...baseAlert,
      status,
      ...(status === "resolved" ? { resolvedAt: new Date().toISOString() } : {}),
    };

    mockAlerts[alertIndex] = updatedAlert;
    return updatedAlert;
  }
}

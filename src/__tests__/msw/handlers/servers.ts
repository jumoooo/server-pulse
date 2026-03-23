import { http, HttpResponse } from "msw";
import { mockServer, mockDegradedServer } from "../../fixtures";
import type { MetricPoint } from "@/types/server";

const mockMetrics: MetricPoint[] = Array.from({ length: 20 }, (_, i) => ({
  timestamp: new Date(Date.now() - (19 - i) * 60_000).toISOString(),
  cpuUsage: 30 + Math.round(Math.sin(i * 0.5) * 20 + 20),
  memoryUsage: 50 + Math.round(Math.cos(i * 0.3) * 15),
  rttMs: 20 + Math.round(Math.random() * 30),
  errorRate: parseFloat((Math.random() * 0.03).toFixed(3)),
  playerCount: 70 + Math.round(Math.sin(i * 0.8) * 20),
}));

export const serverHandlers = [
  http.get("/api/servers", () =>
    HttpResponse.json({
      success: true,
      data: [mockServer, mockDegradedServer],
    })
  ),

  http.get("/api/servers/:id", ({ params }) => {
    const { id } = params;
    const server = [mockServer, mockDegradedServer].find((s) => s.id === id);
    if (!server) {
      return HttpResponse.json(
        { success: false, error: "서버를 찾을 수 없습니다." },
        { status: 404 }
      );
    }
    return HttpResponse.json({ success: true, data: server });
  }),

  http.get("/api/servers/:id/metrics", () =>
    HttpResponse.json({ success: true, data: mockMetrics })
  ),
];

export const serverErrorHandlers = {
  listFailed: http.get(
    "/api/servers",
    () => new HttpResponse(null, { status: 500 })
  ),
  notFound: http.get("/api/servers/:id", () =>
    HttpResponse.json(
      { success: false, error: "서버를 찾을 수 없습니다." },
      { status: 404 }
    )
  ),
  metricsFailed: http.get(
    "/api/servers/:id/metrics",
    () => new HttpResponse(null, { status: 500 })
  ),
};

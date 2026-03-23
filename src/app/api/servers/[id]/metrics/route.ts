import { NextResponse } from "next/server";
import type { ApiResponse, MetricPoint } from "@/types/server";
import { mockServers, getMetrics } from "@/lib/mockData";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const server = mockServers.find((s) => s.id === id);

  if (!server) {
    const response: ApiResponse<null> = {
      success: false,
      error: `서버를 찾을 수 없습니다: ${id}`,
    };
    return NextResponse.json(response, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const rawRange = searchParams.get("range") ?? "24h";
  const range = ["1h", "6h", "24h"].includes(rawRange)
    ? (rawRange as "1h" | "6h" | "24h")
    : "24h";

  const metrics = getMetrics(id, range);

  const response: ApiResponse<MetricPoint[]> = {
    success: true,
    data: metrics,
  };
  return NextResponse.json(response);
}

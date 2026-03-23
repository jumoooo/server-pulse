import { NextResponse } from "next/server";
import type { ApiResponse, ServerDetail } from "@/types/server";
import { mockServers, getMetrics } from "@/lib/mockData";

export async function GET(
  _request: Request,
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

  const detail: ServerDetail = {
    ...server,
    metrics: getMetrics(id, "24h"),
  };

  const response: ApiResponse<ServerDetail> = {
    success: true,
    data: detail,
  };
  return NextResponse.json(response);
}

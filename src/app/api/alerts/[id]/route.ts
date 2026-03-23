import { NextResponse } from "next/server";
import type { ApiResponse, Alert, AlertStatus } from "@/types/server";
import { mockAlerts } from "@/lib/mockData";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const alertIndex = mockAlerts.findIndex((a) => a.id === id);

  if (alertIndex === -1) {
    const response: ApiResponse<null> = {
      success: false,
      error: `알림을 찾을 수 없습니다: ${id}`,
    };
    return NextResponse.json(response, { status: 404 });
  }

  const body = (await request.json()) as { status: AlertStatus };
  const { status } = body;

  if (!["acknowledged", "resolved"].includes(status)) {
    const response: ApiResponse<null> = {
      success: false,
      error: "유효하지 않은 상태값입니다.",
    };
    return NextResponse.json(response, { status: 400 });
  }

  const updatedAlert: Alert = {
    ...mockAlerts[alertIndex]!,
    status,
    ...(status === "resolved" ? { resolvedAt: new Date().toISOString() } : {}),
  };

  mockAlerts[alertIndex] = updatedAlert;

  const response: ApiResponse<Alert> = {
    success: true,
    data: updatedAlert,
  };
  return NextResponse.json(response);
}

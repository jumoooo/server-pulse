import { NextResponse } from "next/server";
import type { ApiResponse, Alert } from "@/types/server";
import { mockAlerts } from "@/lib/mockData";

export async function GET() {
  const response: ApiResponse<Alert[]> = {
    success: true,
    data: mockAlerts,
  };
  return NextResponse.json(response);
}

import { NextResponse } from "next/server";
import type { ApiResponse, Server } from "@/types/server";
import { mockServers } from "@/lib/mockData";

export async function GET() {
  const response: ApiResponse<Server[]> = {
    success: true,
    data: mockServers,
  };
  return NextResponse.json(response);
}

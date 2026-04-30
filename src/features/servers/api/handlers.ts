import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createServerSchema, updateServerSchema } from "@/lib/schemas";
import type {
  ApiResponse,
  CreateServerInput,
  Server,
  ServerDetail,
  UpdateServerInput,
} from "@/types/server";
import {
  createServer,
  deleteServerById,
  findServerDetailById,
  listServerMetricsByRange,
  listServers,
  updateServerById,
} from "@/features/servers/server/repository";

function unauthorizedResponse() {
  return NextResponse.json(
    { success: false, error: "Unauthorized" },
    { status: 401 }
  );
}

export async function getServersHandler() {
  const session = await auth();
  if (!session) return unauthorizedResponse();
  const servers = await listServers();

  const response: ApiResponse<Server[]> = {
    success: true,
    data: servers,
  };
  return NextResponse.json(response);
}

export async function postServersHandler(request: Request) {
  const session = await auth();
  if (!session) return unauthorizedResponse();

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    const response: ApiResponse<null> = {
      success: false,
      error: "요청 본문이 올바른 JSON 형식이 아닙니다.",
    };
    return NextResponse.json(response, { status: 400 });
  }

  const parsed = createServerSchema.safeParse(payload);
  if (!parsed.success) {
    const response: ApiResponse<null> = {
      success: false,
      error: parsed.error.issues[0]?.message ?? "입력값 검증에 실패했습니다.",
    };
    return NextResponse.json(response, { status: 400 });
  }

  const input: CreateServerInput = parsed.data;
  const created = await createServer(randomUUID(), input);

  const response: ApiResponse<Server> = {
    success: true,
    data: created,
  };
  return NextResponse.json(response, { status: 201 });
}

export async function getServerByIdHandler(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return unauthorizedResponse();

  const { id } = await context.params;
  const server = await findServerDetailById(id, 24);

  if (!server) {
    const response: ApiResponse<null> = {
      success: false,
      error: `서버를 찾을 수 없습니다: ${id}`,
    };
    return NextResponse.json(response, { status: 404 });
  }

  const response: ApiResponse<ServerDetail> = {
    success: true,
    data: server,
  };
  return NextResponse.json(response);
}

export async function patchServerByIdHandler(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return unauthorizedResponse();

  const { id } = await context.params;

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    const response: ApiResponse<null> = {
      success: false,
      error: "요청 본문이 올바른 JSON 형식이 아닙니다.",
    };
    return NextResponse.json(response, { status: 400 });
  }

  const parsed = updateServerSchema.safeParse(payload);
  if (!parsed.success) {
    const response: ApiResponse<null> = {
      success: false,
      error: parsed.error.issues[0]?.message ?? "입력값 검증에 실패했습니다.",
    };
    return NextResponse.json(response, { status: 400 });
  }

  const input: UpdateServerInput = parsed.data;
  const updated = await updateServerById(id, input);
  if (!updated) {
    const response: ApiResponse<null> = {
      success: false,
      error: `서버를 찾을 수 없습니다: ${id}`,
    };
    return NextResponse.json(response, { status: 404 });
  }

  const response: ApiResponse<Server> = {
    success: true,
    data: updated,
  };
  return NextResponse.json(response);
}

export async function deleteServerByIdHandler(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return unauthorizedResponse();

  const { id } = await context.params;
  const deleted = await deleteServerById(id);
  if (!deleted) {
    const response: ApiResponse<null> = {
      success: false,
      error: `서버를 찾을 수 없습니다: ${id}`,
    };
    return NextResponse.json(response, { status: 404 });
  }

  const response: ApiResponse<{ id: string }> = {
    success: true,
    data: { id },
  };
  return NextResponse.json(response);
}

export async function getServerMetricsHandler(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return unauthorizedResponse();

  const { id } = await context.params;
  const { searchParams } = new URL(request.url);
  const rawRange = searchParams.get("range") ?? "24h";
  const range = ["1h", "6h", "24h"].includes(rawRange)
    ? (rawRange as "1h" | "6h" | "24h")
    : "24h";
  const metrics = await listServerMetricsByRange(id, range);
  if (!metrics) {
    const response: ApiResponse<null> = {
      success: false,
      error: `서버를 찾을 수 없습니다: ${id}`,
    };
    return NextResponse.json(response, { status: 404 });
  }

  const response: ApiResponse<ServerDetail["metrics"]> = {
    success: true,
    data: metrics,
  };
  return NextResponse.json(response);
}

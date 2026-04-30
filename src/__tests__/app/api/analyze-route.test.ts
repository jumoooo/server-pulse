import { beforeEach, describe, expect, it, vi } from "vitest";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    server: {
      findUnique: vi.fn(),
    },
    metricPoint: {
      findMany: vi.fn(),
    },
    alert: {
      findMany: vi.fn(),
    },
  },
}));

import { POST } from "@/app/api/analyze/[id]/route";

describe("POST /api/analyze/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(auth).mockResolvedValue({
      user: { id: "user-1" },
      expires: "2099-01-01T00:00:00.000Z",
    });
  });

  it("서버 조회 중 prisma 예외가 발생하면 500 JSON을 반환한다", async () => {
    vi.mocked(prisma.server.findUnique).mockRejectedValue(new Error("db down"));

    const response = await POST(new Request("http://localhost/api/analyze/server-1"), {
      params: Promise.resolve({ id: "server-1" }),
    });

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: "DB 오류: 서버 조회 실패",
    });
  });
});

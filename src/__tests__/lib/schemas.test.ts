import { describe, expect, it } from "vitest";
import { createServerSchema } from "@/lib/schemas";

describe("createServerSchema", () => {
  it("허용된 status 값은 통과한다", () => {
    const result = createServerSchema.safeParse({
      name: "Alpha",
      region: "kr-seoul",
      version: "1.20.5",
      status: "healthy",
      maxPlayers: 120,
    });

    expect(result.success).toBe(true);
    expect(result.data?.status).toBe("healthy");
  });

  it("허용되지 않은 status 값은 실패한다", () => {
    const result = createServerSchema.safeParse({
      name: "Alpha",
      region: "kr-seoul",
      version: "1.20.5",
      status: "maintenance",
      maxPlayers: 120,
    });

    expect(result.success).toBe(false);
  });

  it("maxPlayers가 없으면 기본값 50을 사용한다", () => {
    const result = createServerSchema.parse({
      name: "Alpha",
      region: "kr-seoul",
      version: "1.20.5",
    });

    expect(result.maxPlayers).toBe(50);
    expect(result.status).toBe("healthy");
  });
});

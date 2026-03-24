import { describe, expect, it } from "vitest";

import { validateLaneEnv } from "../../../scripts/lane-env-validator";

describe("lane env validator", () => {
  it("prod 레인에서 STEAM_MCP_* 값이 없으면 실패한다", () => {
    const result = validateLaneEnv("prod", {
      DEMO_MODE: "false",
    });

    expect(result.ok).toBe(false);
    expect(result.errors).toContain(
      "prod 레인에서는 최소 1개 이상의 STEAM_MCP_* 환경 변수가 필요합니다."
    );
  });

  it("prod 레인에서 DEMO_MODE=true면 실패한다", () => {
    const result = validateLaneEnv("prod", {
      DEMO_MODE: "true",
      STEAM_MCP_URL: "https://example.com/mcp",
    });

    expect(result.ok).toBe(false);
    expect(result.errors).toContain(
      "prod 레인에서는 DEMO_MODE=true 계열 값을 사용할 수 없습니다."
    );
  });

  it("prod 레인에서 STEAM_MCP_* 설정이 있으면 통과한다", () => {
    const result = validateLaneEnv("prod", {
      DEMO_MODE: "false",
      STEAM_MCP_URL: "https://example.com/mcp",
      STEAM_MCP_TOKEN: "masked",
    });

    expect(result.ok).toBe(true);
    expect(result.summary.steamMcpKeysConfigured).toBe(2);
  });

  it("demo 레인은 STEAM_MCP_* 없이도 통과하고 권장 경고만 반환한다", () => {
    const result = validateLaneEnv("demo", {
      DEMO_MODE: "false",
    });

    expect(result.ok).toBe(true);
    expect(result.warnings).toContain("demo 레인 권장값: DEMO_MODE=true");
  });
});

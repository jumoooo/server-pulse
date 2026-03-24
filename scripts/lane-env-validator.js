const PROD_LIKE_LANES = new Set(["prod", "production", "main"]);
const DEMO_TRUE_VALUES = new Set(["1", "true", "yes", "on"]);

function normalizeValue(value) {
  if (typeof value !== "string") return "";
  return value.trim();
}

function toLower(value) {
  return normalizeValue(value).toLowerCase();
}

function isTruthyDemoMode(value) {
  return DEMO_TRUE_VALUES.has(toLower(value));
}

function getSteamMcpKeys(envObject) {
  return Object.keys(envObject).filter((key) => key.startsWith("STEAM_MCP_"));
}

function validateLaneEnv(lane, envObject = process.env) {
  const normalizedLane = toLower(lane);
  const isProdLikeLane = PROD_LIKE_LANES.has(normalizedLane);
  const demoMode = normalizeValue(envObject.DEMO_MODE);
  const steamMcpKeys = getSteamMcpKeys(envObject);
  const steamMcpConfiguredKeys = steamMcpKeys.filter(
    (key) => normalizeValue(envObject[key]).length > 0
  );

  const errors = [];
  const warnings = [];
  const infos = [];

  if (!normalizedLane) {
    errors.push("lane 인자가 비어 있습니다. demo 또는 prod/main을 지정하세요.");
  }

  if (isProdLikeLane) {
    if (isTruthyDemoMode(demoMode)) {
      errors.push("prod 레인에서는 DEMO_MODE=true 계열 값을 사용할 수 없습니다.");
    }

    if (steamMcpConfiguredKeys.length === 0) {
      errors.push("prod 레인에서는 최소 1개 이상의 STEAM_MCP_* 환경 변수가 필요합니다.");
    } else {
      infos.push(
        `prod 레인 확인: STEAM_MCP_* ${steamMcpConfiguredKeys.length}개가 설정되었습니다.`
      );
    }
  } else {
    if (!isTruthyDemoMode(demoMode)) {
      warnings.push("demo 레인 권장값: DEMO_MODE=true");
    }

    if (steamMcpConfiguredKeys.length > 0) {
      warnings.push("demo 레인에서 STEAM_MCP_* 값이 감지되었습니다. 의도한 설정인지 확인하세요.");
    } else {
      infos.push("demo 레인 확인: STEAM_MCP_* 미설정 상태입니다.");
    }
  }

  const ok = errors.length === 0;
  return {
    ok,
    lane: normalizedLane,
    isProdLikeLane,
    errors,
    warnings,
    infos,
    summary: {
      demoMode: demoMode || "(unset)",
      steamMcpKeysDetected: steamMcpKeys.length,
      steamMcpKeysConfigured: steamMcpConfiguredKeys.length,
    },
  };
}

module.exports = {
  validateLaneEnv,
  isTruthyDemoMode,
  getSteamMcpKeys,
};

#!/usr/bin/env node

const { validateLaneEnv } = require("./lane-env-validator");

const laneArg = process.argv[2] || process.env.LANE || "demo";
const result = validateLaneEnv(laneArg, process.env);

console.log(`🔎 Lane gate check: ${result.lane || "(unknown)"}`);
console.log(
  `ℹ️ DEMO_MODE=${result.summary.demoMode}, STEAM_MCP_* detected=${result.summary.steamMcpKeysDetected}, configured=${result.summary.steamMcpKeysConfigured}`
);

result.infos.forEach((message) => {
  console.log(`✅ ${message}`);
});

result.warnings.forEach((message) => {
  console.warn(`⚠️ ${message}`);
});

if (!result.ok) {
  result.errors.forEach((message) => {
    console.error(`❌ ${message}`);
  });
  process.exitCode = 1;
} else {
  console.log("✅ Lane gate passed.");
}

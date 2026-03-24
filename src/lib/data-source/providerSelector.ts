import { MockDataProvider } from "./mockDataProvider";
import { SteamMcpProvider } from "./steamMcpProvider";
import type { DataSourceProvider } from "./types";

function isTruthy(value: string): boolean {
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

function isFalsy(value: string): boolean {
  return ["0", "false", "no", "off"].includes(value.toLowerCase());
}

export function shouldUseDemoMode(rawDemoMode: string | undefined): boolean {
  if (!rawDemoMode) {
    return true;
  }

  const normalized = rawDemoMode.trim();
  if (!normalized) {
    return true;
  }

  if (isTruthy(normalized)) {
    return true;
  }

  if (isFalsy(normalized)) {
    return false;
  }

  return true;
}

export function createDataSourceProvider(
  env: NodeJS.ProcessEnv = process.env
): DataSourceProvider {
  const demoMode = shouldUseDemoMode(env.DEMO_MODE);
  if (demoMode) {
    return new MockDataProvider();
  }

  const steamProvider = new SteamMcpProvider({
    env,
    fallbackProvider: new MockDataProvider(),
  });

  if (!steamProvider.isConfigured()) {
    return new MockDataProvider();
  }

  return steamProvider;
}

/**
 * 백엔드 Hono API 클라이언트
 * 응답 형식: { ok: true, data: T } | { ok: false, error: string }
 */

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

/** 백엔드 API 호출 기본 함수 */
export async function fetchBackend<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  const json = (await res.json()) as {
    ok: boolean;
    data?: T;
    error?: string;
  };

  if (!res.ok || !json.ok) {
    throw new Error(json.error ?? `백엔드 오류: ${res.status}`);
  }

  return json.data as T;
}

/** 백엔드 온라인 여부 확인 (헬스 패널 표시 조건) */
export async function checkBackendAvailable(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`, {
      signal: AbortSignal.timeout(3000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

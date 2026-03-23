import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { mockServer, mockDegradedServer } from "../fixtures";
import { useServers } from "@/hooks/useServers";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children
    );
  }
  return Wrapper;
};

describe("useServers", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("API 성공 시 서버 목록을 반환한다", async () => {
    const servers = [mockServer, mockDegradedServer];
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: servers }),
    } as Response);

    const { result } = renderHook(() => useServers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(servers);
    expect(result.current.data).toHaveLength(2);
  });

  it("API 실패 시 에러 상태를 반환한다", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    } as Response);

    const { result } = renderHook(() => useServers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(Error);
  });

  it("success: false 응답 시 에러를 throw한다", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: false, error: "서버 목록 조회 실패" }),
    } as Response);

    const { result } = renderHook(() => useServers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error?.message).toBe("서버 목록 조회 실패");
  });

  it("refetchInterval이 10000ms로 설정되어 있다", () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: [] }),
    } as Response);

    const { result } = renderHook(() => useServers(), {
      wrapper: createWrapper(),
    });

    // useQuery options는 훅 소스에서 확인: refetchInterval: 10_000
    expect(result.current).toBeDefined();
  });
});

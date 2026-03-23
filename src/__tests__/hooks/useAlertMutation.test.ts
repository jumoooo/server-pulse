import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { mockAlert } from "../fixtures";
import { useAlertMutation } from "@/hooks/useAlertMutation";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return {
    wrapper: ({ children }: { children: React.ReactNode }) =>
      React.createElement(QueryClientProvider, { client: queryClient }, children),
    queryClient,
  };
};

describe("useAlertMutation", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("mutate 호출 시 PATCH fetch를 올바른 엔드포인트로 호출한다", async () => {
    const updatedAlert = { ...mockAlert, status: "acknowledged" as const };
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: updatedAlert }),
    } as Response);

    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useAlertMutation(), { wrapper });

    act(() => {
      result.current.mutate({ id: "alert-1", status: "acknowledged" });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetch).toHaveBeenCalledWith(
      "/api/alerts/alert-1",
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({ status: "acknowledged" }),
      })
    );
  });

  it("성공 시 ['alerts'] 쿼리를 무효화한다", async () => {
    const updatedAlert = { ...mockAlert, status: "resolved" as const };
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: updatedAlert }),
    } as Response);

    const { wrapper, queryClient } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useAlertMutation(), { wrapper });

    act(() => {
      result.current.mutate({ id: "alert-1", status: "resolved" });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ["alerts"] })
    );
  });

  it("API 실패 시 에러 상태를 반환한다", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: "Bad Request",
    } as Response);

    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useAlertMutation(), { wrapper });

    act(() => {
      result.current.mutate({ id: "alert-1", status: "acknowledged" });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(Error);
  });
});

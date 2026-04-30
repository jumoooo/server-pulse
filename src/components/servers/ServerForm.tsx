"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createServerAction } from "@/features/servers/server/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ServerFormProps {
  onSuccess?: () => void;
}

const initialState = { success: false, error: undefined as string | undefined };

export function ServerForm({ onSuccess }: ServerFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createServerAction, initialState);

  useEffect(() => {
    if (state.success) {
      onSuccess?.();
      router.refresh();
    }
  }, [onSuccess, router, state.success]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="server-name" className="text-sm font-medium text-fg-muted">
          서버 이름
        </label>
        <Input id="server-name" name="name" placeholder="예: Seoul Gamma" required />
      </div>

      <div className="space-y-2">
        <label htmlFor="server-region" className="text-sm font-medium text-fg-muted">
          지역
        </label>
        <Input id="server-region" name="region" placeholder="예: kr-seoul" required />
      </div>

      <div className="space-y-2">
        <label htmlFor="server-version" className="text-sm font-medium text-fg-muted">
          버전
        </label>
        <Input id="server-version" name="version" placeholder="예: 1.20.5" required />
      </div>

      <div className="space-y-2">
        <label htmlFor="server-status" className="text-sm font-medium text-fg-muted">
          상태
        </label>
        <select
          id="server-status"
          name="status"
          defaultValue="healthy"
          className="w-full rounded-md border border-border-default bg-bg-input px-3 py-2 text-sm text-fg-base focus:border-border-focus focus:outline-none focus:ring-1 focus:ring-border-focus"
        >
          <option value="healthy">정상 (healthy)</option>
          <option value="degraded">저하 (degraded)</option>
          <option value="down">다운 (down)</option>
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="server-max-players" className="text-sm font-medium text-fg-muted">
          최대 플레이어
        </label>
        <Input
          id="server-max-players"
          name="maxPlayers"
          type="number"
          min={1}
          defaultValue={50}
          required
        />
      </div>

      {state.error ? <p className="text-sm text-status-error-fg">{state.error}</p> : null}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "생성 중..." : "서버 생성"}
      </Button>
    </form>
  );
}

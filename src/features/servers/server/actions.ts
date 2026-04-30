"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { createServerSchema, updateServerSchema } from "@/lib/schemas";
import { createServer, deleteServerById, updateServerById } from "@/features/servers/server/repository";

export interface ServerActionState {
  success: boolean;
  error?: string;
}

const INITIAL_ACTION_STATE: ServerActionState = { success: false };

export async function createServerAction(
  _prevState: ServerActionState = INITIAL_ACTION_STATE,
  formData: FormData
): Promise<ServerActionState> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  const payload = {
    name: formData.get("name"),
    region: formData.get("region"),
    version: formData.get("version"),
    status: formData.get("status"),
    maxPlayers: formData.get("maxPlayers"),
  };

  const parsed = createServerSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "입력값 검증에 실패했습니다.",
    };
  }

  await createServer(randomUUID(), parsed.data);

  revalidatePath("/servers");
  return { success: true };
}

export async function updateServerAction(
  serverId: string,
  _prevState: ServerActionState = INITIAL_ACTION_STATE,
  formData: FormData
): Promise<ServerActionState> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  const payload = {
    name: formData.get("name"),
    region: formData.get("region"),
    version: formData.get("version"),
    status: formData.get("status"),
    maxPlayers: formData.get("maxPlayers"),
    playerCount: formData.get("playerCount"),
    uptimeSeconds: formData.get("uptimeSeconds"),
  };

  const parsed = updateServerSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "입력값 검증에 실패했습니다.",
    };
  }

  const updated = await updateServerById(serverId, parsed.data);
  if (!updated) {
    return { success: false, error: "서버를 찾을 수 없습니다." };
  }

  revalidatePath("/servers");
  revalidatePath(`/servers/${serverId}`);
  return { success: true };
}

export async function deleteServerAction(
  serverId: string
): Promise<ServerActionState> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const deleted = await deleteServerById(serverId);
    if (!deleted) {
      return { success: false, error: "서버를 찾을 수 없습니다." };
    }
  } catch {
    return { success: false, error: "서버 삭제에 실패했습니다." };
  }

  revalidatePath("/servers");
  return { success: true };
}

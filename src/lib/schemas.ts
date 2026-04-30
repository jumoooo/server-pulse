import { z } from "zod";

// ── Server Schemas ──

const statusSchema = z.enum(["healthy", "degraded", "down"]);

export const createServerSchema = z.object({
  name: z.string().trim().min(1, "서버 이름을 입력해주세요.").max(100),
  region: z.string().trim().min(1, "리전을 입력해주세요.").max(50),
  version: z.string().trim().min(1, "버전을 입력해주세요.").max(30),
  status: statusSchema.default("healthy"),
  maxPlayers: z.coerce.number().int().min(1).max(10000).default(50),
});

export const updateServerSchema = z
  .object({
    name: z.string().trim().min(1).max(100).optional(),
    region: z.string().trim().min(1).max(50).optional(),
    version: z.string().trim().min(1).max(30).optional(),
    status: statusSchema.optional(),
    maxPlayers: z.coerce.number().int().min(1).max(10000).optional(),
    playerCount: z.coerce.number().int().min(0).optional(),
    uptimeSeconds: z.coerce.number().int().min(0).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "수정할 필드를 하나 이상 입력해주세요.",
  });

// ── Auth Schemas ──

export const signupSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "이메일을 입력해주세요.")
    .email("올바른 이메일 형식이 아닙니다."),
  password: z
    .string()
    .min(8, "비밀번호는 8자 이상이어야 합니다.")
    .max(100, "비밀번호는 100자 이하여야 합니다."),
  displayName: z
    .string()
    .trim()
    .min(1, "이름을 입력해주세요.")
    .max(50, "이름은 50자 이하여야 합니다."),
});

export const changeRoleSchema = z.object({
  userId: z.string().min(1),
  roleName: z.enum(["user", "admin"]),
});

export const approveUserSchema = z.object({
  userId: z.string().min(1),
});

export const rejectUserSchema = z.object({
  userId: z.string().min(1),
});

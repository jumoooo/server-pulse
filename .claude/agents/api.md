---
name: api
description: Next.js Route Handler 및 Server Action 생성. REST API 엔드포인트, 폼 처리, 데이터 변이. Zod 검증, 인증 체크, 표준 응답 형식 포함.
model: sonnet
tools: Read,Grep,Glob,Write,Edit,Bash,WebFetch,mcp__context7__resolve-library-id,mcp__context7__get-library-docs
maxTurns: 30
---

# API - Route Handler & Server Action 에이전트

## 유형 선택 기준

| Route Handler             | Server Action          |
| ------------------------- | ---------------------- |
| 외부 클라이언트 호출 필요 | 폼 제출, 단순 CRUD     |
| 파일 업로드/다운로드      | 페이지 내 데이터 변이  |
| 커스텀 헤더/쿠키 제어     | revalidate 후 redirect |
| WebSocket/SSE             | 보안 상 URL 노출 불가  |

## 구현 전 확인

1. `src/lib/api.ts`에 `respond` 유틸 존재 여부
2. 인증 필요 여부 (`src/lib/auth.ts`)
3. DB 스키마/클라이언트 위치

## Route Handler 완전 예시

```ts
// src/app/api/items/route.ts
import { type NextRequest } from "next/server";
import { z } from "zod";
import { respond } from "@/lib/api";
import { getSession } from "@/lib/auth";

// GET /api/items?page=1&limit=10&q=검색어
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(
    100,
    Math.max(1, Number(searchParams.get("limit") ?? 10))
  );
  const q = searchParams.get("q") ?? "";

  try {
    const [items, total] = await Promise.all([
      db.item.findMany({
        where: { title: { contains: q } },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.item.count({ where: { title: { contains: q } } }),
    ]);

    return respond.ok({
      items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch {
    return respond.error("조회에 실패했습니다", 500);
  }
}

const CreateItemSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요").max(100),
  description: z.string().optional(),
});

// POST /api/items
export async function POST(request: NextRequest) {
  // 인증 체크
  const session = await getSession();
  if (!session) return respond.unauthorized();

  try {
    const body = await request.json();
    const result = CreateItemSchema.safeParse(body);
    if (!result.success)
      return respond.error(
        result.error.errors[0]!.message,
        400,
        "VALIDATION_ERROR"
      );

    const item = await db.item.create({
      data: { ...result.data, userId: session.userId },
    });
    return respond.ok(item, 201);
  } catch {
    return respond.error("생성에 실패했습니다", 500);
  }
}
```

```ts
// src/app/api/items/[id]/route.ts
interface Context {
  params: Promise<{ id: string }>;
}

export async function GET(_: NextRequest, { params }: Context) {
  const { id } = await params;
  const item = await db.item.findUnique({ where: { id } });
  if (!item) return respond.notFound("아이템");
  return respond.ok(item);
}

export async function PATCH(request: NextRequest, { params }: Context) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return respond.unauthorized();

  try {
    const body = await request.json();
    const updated = await db.item.update({ where: { id }, data: body });
    return respond.ok(updated);
  } catch {
    return respond.error("수정에 실패했습니다", 500);
  }
}

export async function DELETE(_: NextRequest, { params }: Context) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return respond.unauthorized();

  try {
    await db.item.delete({ where: { id } });
    return respond.ok({ deleted: true });
  } catch {
    return respond.error("삭제에 실패했습니다", 500);
  }
}
```

## Server Action 완전 예시

```ts
// src/app/actions/item.ts
"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getSession } from "@/lib/auth";

type ActionState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
} | null;

const ItemSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요").max(100),
  description: z.string().optional(),
});

export async function createItemAction(
  prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await getSession();
  if (!session) return { error: "로그인이 필요합니다" };

  const result = ItemSchema.safeParse(Object.fromEntries(formData));
  if (!result.success) {
    return { fieldErrors: result.error.flatten().fieldErrors };
  }

  try {
    await db.item.create({ data: { ...result.data, userId: session.userId } });
    revalidateTag("items");
  } catch {
    return { error: "저장에 실패했습니다" };
  }

  redirect("/items");
}
```

## 완료 보고 형식

```
**생성된 파일:**
- `src/app/api/.../route.ts`

**엔드포인트:**
| Method | URL | 인증 | 설명 |

**클라이언트 사용 예시:**
[fetch 코드]
```

---
paths:
  - "src/app/api/**"
  - "src/app/actions/**"
  - "**/*actions.ts"
  - "**/*actions.tsx"
  - "**/route.ts"
---

# API / Server Action 규칙

## 표준 응답 타입

```ts
// lib/api.ts - 반드시 이 패턴 사용
import { NextResponse } from 'next/server'

export type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string }

export const respond = {
  ok: <T>(data: T, status = 200) =>
    NextResponse.json({ success: true, data } satisfies ApiResult<T>, { status }),

  error: (message: string, status = 400, code?: string) =>
    NextResponse.json({ success: false, error: message, code } satisfies ApiResult<never>, { status }),

  notFound: (resource = '항목') =>
    NextResponse.json({ success: false, error: `${resource}을(를) 찾을 수 없습니다` } satisfies ApiResult<never>, { status: 404 }),

  unauthorized: () =>
    NextResponse.json({ success: false, error: '인증이 필요합니다' } satisfies ApiResult<never>, { status: 401 }),
}
```

## Route Handler 패턴

```ts
// app/api/items/route.ts
import { type NextRequest } from 'next/server'
import { z } from 'zod'
import { respond } from '@/lib/api'

// GET - 조회
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const page = Math.max(1, Number(searchParams.get('page') ?? 1))

  try {
    const items = await getItems({ page })
    return respond.ok(items)
  } catch {
    return respond.error('조회에 실패했습니다', 500)
  }
}

// POST - 생성 (Zod 필수)
const CreateSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요').max(100),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = CreateSchema.safeParse(body)

    if (!result.success) {
      return respond.error(result.error.errors[0]!.message, 400, 'VALIDATION_ERROR')
    }

    const item = await createItem(result.data)
    return respond.ok(item, 201)
  } catch {
    return respond.error('생성에 실패했습니다', 500)
  }
}
```

## Server Action 패턴 (React 19)

```ts
// app/actions/item.ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

type State = { success?: boolean; error?: string } | null

const Schema = z.object({
  title: z.string().min(1, '제목을 입력해주세요'),
})

export async function createItemAction(prevState: State, formData: FormData): Promise<State> {
  const result = Schema.safeParse(Object.fromEntries(formData))

  if (!result.success) {
    return { error: result.error.errors[0]!.message }
  }

  try {
    await createItem(result.data)
    revalidatePath('/items')
    // redirect는 try/catch 밖에서 호출 (throw 기반)
  } catch {
    return { error: '저장에 실패했습니다' }
  }

  redirect('/items')  // try/catch 밖
}
```

## Dynamic Route Handler

```ts
// app/api/items/[id]/route.ts
interface RouteContext {
  params: Promise<{ id: string }>   // Next.js 15: params는 Promise
}

export async function GET(_: NextRequest, { params }: RouteContext) {
  const { id } = await params
  const item = await getItemById(id)
  if (!item) return respond.notFound()
  return respond.ok(item)
}
```

## 필수 체크리스트
- [ ] 모든 입력값 Zod로 검증
- [ ] 모든 Route Handler try/catch 포함
- [ ] Server Action은 State 타입 반환 (throw 금지)
- [ ] `redirect()`는 try/catch 밖에서 호출
- [ ] 인증 필요 시 세션 확인 우선
- [ ] `revalidatePath()` 또는 `revalidateTag()` 호출

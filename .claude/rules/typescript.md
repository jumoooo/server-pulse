---
paths:
  - "**/*.ts"
  - "**/*.tsx"
---

# TypeScript 규칙

## 필수 금지
- `any` 타입 사용 금지 → `unknown` 또는 구체적 타입 사용
- 타입 단언 `as Type` 남용 금지 (타입 가드 사용)
- `@ts-ignore` 금지 (`@ts-expect-error` + 설명 허용)
- `enum` 금지 → `const` 객체 + `typeof` 사용

## 타입 정의 패턴

```ts
// ✅ const object (enum 대신)
const Role = { ADMIN: 'admin', USER: 'user', GUEST: 'guest' } as const
type Role = (typeof Role)[keyof typeof Role]

// ✅ interface (확장 가능한 객체)
interface User {
  id: string
  email: string
  role: Role
  createdAt: Date
}

// ✅ type (유니온, 유틸리티)
type CreateUserInput = Omit<User, 'id' | 'createdAt'>
type UpdateUserInput = Partial<CreateUserInput>
type ApiResponse<T> = { success: true; data: T } | { success: false; error: string; code?: string }

// ✅ Zod 스키마에서 타입 추론
import { z } from 'zod'
const UserSchema = z.object({ email: z.string().email(), name: z.string().min(1) })
type UserInput = z.infer<typeof UserSchema>
```

## 타입 가드

```ts
// 런타임 타입 검증
function isUser(value: unknown): value is User {
  return typeof value === 'object' && value !== null && 'id' in value && 'email' in value
}

// API 응답 타입 가드
function isApiSuccess<T>(res: ApiResponse<T>): res is { success: true; data: T } {
  return res.success === true
}
```

## tsconfig 기준 (strict mode 필수)
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true
  }
}
```

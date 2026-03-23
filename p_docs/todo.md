# ServerPulse — 잔여 작업 TODO

> 작성일: 2026-03-23
> 현황: MVP 완성 (95%). 아래 5개 트랙을 병렬 진행하여 프로덕션 수준으로 완성.
> 작업 전 반드시 이 파일을 읽고 의존성 순서와 파일 소유권을 확인할 것.

---

## 전체 진행 현황

```
Track A  DB 연동 (Prisma)         [ ] 미착수
Track B  shadcn/ui 도입           [ ] 미착수
Track C  인증/인가 (NextAuth v5)  [ ] 미착수
Track D  SSE 실시간 알림          [ ] 미착수
─────────────────────────────────────────────
Track E  서버 CRUD                [ ] 미착수 ← Track A 완료 후 시작
```

---

## 의존성 규칙

- **Track A, B, C, D** → 동시 시작 가능 (완전 독립)
- **Track E** → Track A(DB 연동) 완료 후에만 시작
- **공유 파일 충돌 방지**: `Providers.tsx`, `Header.tsx`는 C+D 모두 수정 — 두 트랙 완료 후 한 번에 병합

---

## Track A: DB 연동 (Prisma + SQLite)

**목적**: 현재 인메모리 `mockData.ts` → 실제 DB로 교체. 서버 재시작 후에도 데이터 유지.

### 설치

```bash
pnpm add @prisma/client
pnpm add -D prisma
```

### 체크리스트

- [ ] **A-1** `prisma/schema.prisma` 생성

  ```prisma
  datasource db { provider = "sqlite"; url = env("DATABASE_URL") }

  model Server {
    id              String        @id @default(cuid())
    name            String
    region          String
    version         String
    status          String        @default("healthy")
    uptimeSeconds   Int           @default(0)
    lastHeartbeatAt DateTime      @default(now())
    playerCount     Int           @default(0)
    maxPlayers      Int           @default(100)
    createdAt       DateTime      @default(now())
    updatedAt       DateTime      @updatedAt
    alerts          Alert[]
    metrics         MetricPoint[]
  }

  model Alert {
    id          String    @id @default(cuid())
    serverId    String
    severity    String
    status      String    @default("open")
    title       String
    description String
    ruleId      String
    createdAt   DateTime  @default(now())
    resolvedAt  DateTime?
    server      Server    @relation(fields: [serverId], references: [id], onDelete: Cascade)
  }

  model MetricPoint {
    id          String   @id @default(cuid())
    serverId    String
    timestamp   DateTime @default(now())
    cpuUsage    Float
    memoryUsage Float
    rttMs       Float
    errorRate   Float
    playerCount Int
    server      Server   @relation(fields: [serverId], references: [id], onDelete: Cascade)
  }
  ```

- [ ] **A-2** `.env.local`에 `DATABASE_URL="file:./dev.db"` 추가

- [ ] **A-3** `src/lib/prisma.ts` 신규 생성 (globalThis 캐싱으로 Hot Reload 중복 방지)

  ```ts
  import { PrismaClient } from "@prisma/client";
  const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
  export const prisma = globalForPrisma.prisma ?? new PrismaClient();
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
  ```

- [ ] **A-4** `prisma/seed.ts` 생성 — `src/lib/mockData.ts`의 데이터를 DB에 삽입

- [ ] **A-5** Route Handler 교체 (mockData import 제거 → prisma 쿼리)
  - `src/app/api/servers/route.ts` → `prisma.server.findMany()`
  - `src/app/api/servers/[id]/route.ts` → `prisma.server.findUnique({ include: { metrics: true } })`
  - `src/app/api/servers/[id]/metrics/route.ts` → `prisma.metricPoint.findMany({ where: { serverId, timestamp: { gte: cutoff } } })`
  - `src/app/api/alerts/route.ts` → `prisma.alert.findMany({ include: { server: { select: { name: true } } } })`
  - `src/app/api/alerts/[id]/route.ts` → `prisma.alert.update({ where: { id }, data: { status, resolvedAt } })`
  - `src/app/api/analyze/[id]/route.ts` → prisma 기반 서버 + 메트릭 조회

- [ ] **A-6** `package.json`에 seed 스크립트 추가
  ```json
  "prisma": { "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts" }
  ```

### 검증

```bash
pnpm prisma db push
pnpm prisma db seed
pnpm dev
curl http://localhost:3000/api/servers   # prisma 데이터 확인
pnpm prisma studio                       # GUI로 레코드 확인
pnpm type-check
```

---

## Track B: shadcn/ui 도입

**목적**: 커스텀 Tailwind 인라인 스타일 → shadcn 컴포넌트로 교체하여 일관성·유지보수성 향상.

### 설치

```bash
pnpm add class-variance-authority clsx tailwind-merge lucide-react
pnpm dlx shadcn@latest init
# 선택: Style=Default, Color=Slate, CSS variables=Yes, alias=@/components/ui
pnpm dlx shadcn@latest add button badge card select dialog skeleton
```

### 체크리스트

- [ ] **B-1** `src/lib/utils.ts` 신규 생성

  ```ts
  import { clsx, type ClassValue } from "clsx";
  import { twMerge } from "tailwind-merge";
  export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
  }
  ```

- [ ] **B-2** `src/styles/globals.css`에 CSS 변수 추가 (`:root`, `.dark` 블록)

- [ ] **B-3** `src/components/servers/ServerList.tsx` — `Card` + `Badge` 교체

- [ ] **B-4** `src/components/servers/ServerDetail.tsx` — `Button` + `Badge` + `Skeleton` 교체

- [ ] **B-5** `src/components/alerts/AlertList.tsx` — `Badge` + `Button` 교체

- [ ] **B-6** `src/components/common/LoadingState.tsx` — `Skeleton` 컴포넌트로 교체

> **원칙**: 한 번에 파일 전체를 교체하지 않고 컴포넌트 단위로 교체 후 렌더링 확인

### 검증

```bash
pnpm dev       # 시각적 회귀 없음 확인
pnpm test      # 기존 Vitest 테스트 통과
pnpm type-check
```

---

## Track C: 인증/인가 (NextAuth v5)

**목적**: 미인증 사용자가 대시보드에 접근 불가. middleware로 전체 라우트 보호.

### 설치

```bash
pnpm add next-auth@beta
```

### 체크리스트

- [ ] **C-1** `.env.local`에 추가

  ```
  NEXTAUTH_SECRET=<openssl rand -base64 32 으로 생성>
  ADMIN_EMAIL=admin@example.com
  ADMIN_PASSWORD=changeme123
  ```

- [ ] **C-2** `src/lib/auth.ts` 신규 생성

  ```ts
  import NextAuth from "next-auth";
  import Credentials from "next-auth/providers/credentials";
  import { z } from "zod";

  export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
      Credentials({
        credentials: { email: {}, password: {} },
        async authorize(credentials) {
          const parsed = z
            .object({
              email: z.string().email(),
              password: z.string().min(6),
            })
            .safeParse(credentials);
          if (!parsed.success) return null;
          // Track A 완료 후: prisma.user.findUnique + bcrypt.compare 로 교체
          if (
            parsed.data.email === process.env.ADMIN_EMAIL &&
            parsed.data.password === process.env.ADMIN_PASSWORD
          ) {
            return { id: "1", email: parsed.data.email, name: "Admin" };
          }
          return null;
        },
      }),
    ],
    pages: { signIn: "/login" },
    session: { strategy: "jwt" },
  });
  ```

- [ ] **C-3** `src/app/api/auth/[...nextauth]/route.ts` 신규

  ```ts
  import { handlers } from "@/lib/auth";
  export const { GET, POST } = handlers;
  ```

- [ ] **C-4** `src/middleware.ts` 신규 생성

  ```ts
  import { auth } from "@/lib/auth";
  import { NextResponse } from "next/server";

  export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const pathname = req.nextUrl.pathname;
    if (pathname.startsWith("/api/auth")) return NextResponse.next();
    if (!isLoggedIn && !pathname.startsWith("/login")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (isLoggedIn && pathname.startsWith("/login")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  });

  export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
  };
  ```

- [ ] **C-5** `src/app/login/page.tsx` 신규 — 로그인 폼 (Server Component + `useActionState`)

- [ ] **C-6** `src/app/actions/auth.ts` 신규

  ```ts
  "use server";
  import { signIn } from "@/lib/auth";
  import { AuthError } from "next-auth";

  export async function loginAction(
    prevState: string | null,
    formData: FormData
  ) {
    try {
      await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirectTo: "/dashboard",
      });
    } catch (error) {
      if (error instanceof AuthError)
        return "이메일 또는 비밀번호가 올바르지 않습니다.";
      throw error;
    }
    return null;
  }
  ```

- [ ] **C-7** 모든 API Route Handler에 세션 검증 추가

  ```ts
  const session = await auth();
  if (!session)
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  ```

- [ ] **C-8** `src/components/layout/Header.tsx` — `auth()` 호출로 세션 정보 + 로그아웃 버튼 표시
  > ⚠️ `Providers.tsx`, `Header.tsx`는 Track D와 공유 파일 — Track D 완료 후 함께 병합

### 검증

```bash
# 비로그인 /dashboard 접근 → /login 리다이렉트
# 로그인 성공 → /dashboard 진입
# curl http://localhost:3000/api/servers (쿠키 없이) → 401
pnpm type-check
```

---

## Track D: SSE 실시간 알림

**목적**: 현재 10초 폴링 → SSE(Server-Sent Events)로 서버 push 방식 전환. 알림 즉시 반영.

> 추가 패키지 없음 — Next.js ReadableStream 내장 활용

### 체크리스트

- [ ] **D-1** `src/app/api/alerts/stream/route.ts` 신규 생성

  ```ts
  import { mockAlerts } from "@/lib/mockData"; // Track A 완료 후 prisma로 교체
  // Content-Type: text/event-stream
  // 최초 연결 시 전체 알림 전송, 이후 5초 간격 push
  export async function GET() {
    const encoder = new TextEncoder();
    let interval: ReturnType<typeof setInterval>;
    const stream = new ReadableStream({
      start(controller) {
        const send = (data: unknown) =>
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
          );
        send({ type: "alerts", payload: mockAlerts });
        interval = setInterval(
          () => send({ type: "alerts", payload: mockAlerts }),
          5_000
        );
      },
      cancel() {
        clearInterval(interval);
      },
    });
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }
  ```

- [ ] **D-2** `src/hooks/useAlertStream.ts` 신규 생성 (`'use client'`)

  ```ts
  // EventSource 연결 → onmessage → queryClient.setQueryData(['alerts'], payload)
  // onerror 시 close (브라우저 자동 재연결)
  // useEffect cleanup: eventSource.close()
  ```

- [ ] **D-3** `src/hooks/useAlerts.ts` 수정 — `refetchInterval` 제거 (SSE가 대체)

- [ ] **D-4** `src/store/useAppStore.ts` — `unreadAlertCount: number`, `incrementUnread()`, `resetUnread()` 상태 추가

- [ ] **D-5** `src/components/providers/Providers.tsx` + `src/components/layout/Header.tsx` 수정
  > ⚠️ Track C와 공유 파일 — C+D 모두 완료 후 한 번에 병합
  - `Providers.tsx`: `useAlertStream()` 호출 추가 (앱 전체 단일 SSE 연결)
  - `Header.tsx`: 미읽은 알림 뱃지 표시 (`unreadAlertCount`)

### Track A 완료 후 추가 작업

- [ ] `src/app/api/alerts/stream/route.ts` — `mockAlerts` → `prisma.alert.findMany()` 교체
- [ ] 이전 결과와 diff 비교 → 변경 감지 시에만 push

### 검증

```bash
pnpm dev
# DevTools > Network > EventStream 탭에서 /api/alerts/stream 연결 확인
# PATCH /api/alerts/[id] 후 5초 내 UI 자동 갱신 확인
# Network 탭에서 기존 10초 폴링 요청 사라짐 확인
```

---

## Track E: 서버 CRUD ← Track A 완료 후 시작

**목적**: 서버 생성/수정/삭제 기능 추가. DB 연동 없이는 구현 불가.

### 설치

```bash
# zod가 없으면:
pnpm add zod
```

### 체크리스트

- [ ] **E-1** `src/lib/schemas.ts` 신규 생성

  ```ts
  import { z } from "zod";
  export const createServerSchema = z.object({
    name: z.string().min(2).max(50),
    region: z.enum(["kr-seoul", "us-east", "eu-west", "ap-tokyo"]),
    version: z.string().regex(/^\d+\.\d+\.\d+$/),
    maxPlayers: z.number().int().min(1).max(10000),
  });
  export const updateServerSchema = createServerSchema.partial();
  ```

- [ ] **E-2** `src/types/server.ts` — `CreateServerInput`, `UpdateServerInput` 타입 추가

- [ ] **E-3** `src/app/api/servers/route.ts` — POST 추가
  - Zod 검증 → `prisma.server.create()` → 201 응답

- [ ] **E-4** `src/app/api/servers/[id]/route.ts` — PATCH, DELETE 추가
  - PATCH: `prisma.server.update()`
  - DELETE: `prisma.server.delete()` (cascade로 Alert + MetricPoint 자동 삭제)

- [ ] **E-5** `src/app/actions/servers.ts` 신규 생성 (Server Actions)

  ```ts
  "use server";
  // createServer(prevState, formData) → prisma.server.create + revalidatePath('/servers')
  // updateServer(id, prevState, formData) → prisma.server.update + revalidatePath
  // deleteServer(id) → prisma.server.delete + revalidatePath
  // 각 Action에 auth() 세션 검증 포함
  ```

- [ ] **E-6** `src/components/servers/ServerForm.tsx` 신규 (`'use client'`)
  - `useActionState(createServer)` 패턴
  - Track B의 `Dialog`, `Input`, `Button` 컴포넌트 활용 (선택)
  - 필드: 이름, 지역(Select), 버전, 최대 플레이어 수

- [ ] **E-7** `src/components/servers/DeleteServerButton.tsx` 신규
  - 삭제 확인 `Dialog` + `deleteServer` Server Action

- [ ] **E-8** `src/app/(main)/servers/page.tsx` 수정
  - "서버 추가" 버튼 추가 → `ServerForm` Dialog 열기

### 검증

```bash
pnpm prisma studio   # 서버 생성/삭제 레코드 확인
pnpm test            # Vitest 단위 테스트
pnpm type-check
# Zod 유효성 실패 시 에러 메시지 UI 표시 확인
```

---

## 공유 파일 병합 가이드

Track C, D 작업이 모두 완료된 후 아래 두 파일을 한 번에 병합:

### `src/components/providers/Providers.tsx`

```tsx
"use client";
import { SessionProvider } from "next-auth/react"; // Track C
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useAlertStream } from "@/hooks/useAlertStream"; // Track D

function InnerProviders({ children }: { children: React.ReactNode }) {
  useAlertStream(); // Track D: 앱 전체 단일 SSE 연결
  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <InnerProviders>{children}</InnerProviders>
      </QueryClientProvider>
    </SessionProvider>
  );
}
```

### `src/components/layout/Header.tsx`

- `auth()` 호출로 세션 정보 표시 + 로그아웃 버튼 (Track C)
- `unreadAlertCount` Zustand 상태로 미읽은 알림 뱃지 표시 (Track D)

---

## 최종 통합 검증 체크리스트

모든 트랙 완료 후 순서대로 확인:

```
[ ] pnpm type-check — 에러 없음
[ ] pnpm test — 전체 Vitest 통과
[ ] pnpm test:e2e — Playwright E2E 통과
[ ] pnpm build — 빌드 성공

기능 검증:
[ ] 비로그인 /dashboard → /login 리다이렉트
[ ] 로그인 → /dashboard 진입
[ ] API 비인증 요청 → 401 응답
[ ] 서버 재시작 후 알림 상태 변경 유지 (DB 검증)
[ ] DevTools EventStream → SSE 연결 유지 확인
[ ] 알림 상태 변경 후 5초 내 UI 자동 갱신
[ ] 서버 생성 → 목록 즉시 반영
[ ] 서버 삭제 → 연관 알림 cascade 삭제
[ ] pnpm prisma studio → 레코드 정합성 확인
```

---

## 슬래시 커맨드 빠른 참조

| Track          | 커맨드                     |
| -------------- | -------------------------- |
| Track A (DB)   | `/feature prisma db 연동`  |
| Track B (UI)   | `/ui shadcn 컴포넌트 교체` |
| Track C (인증) | `/feature nextauth 인증`   |
| Track D (SSE)  | `/feature sse 실시간 알림` |
| Track E (CRUD) | `/feature 서버 crud`       |
| 전체 복잡 작업 | `/orchestrate [요청]`      |
| 커밋           | `/commit`                  |

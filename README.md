# ServerPulse Frontend

> Next.js 15 기반 제품 앱이에요.  
> 서버 목록/상세, 알림, 인증, 관리자 승인, AI 분석 UI를 담당해요.

## 먼저 이렇게 실행해요

```bash
pnpm install
cp .env.local.example .env.local
pnpm db:push
pnpm db:seed
pnpm dev
```

기본 접속은 `http://localhost:3000`이에요.

## 현재 앱 상태

| 영역 | 상태 | 설명 |
|---|---|---|
| 제품 데이터 | Prisma 기반 | SQLite + Prisma로 서버/알림/사용자 데이터를 관리해요. |
| 인증/인가 | 구현됨 | NextAuth v5 기반 로그인, 회원가입, 관리자 승인 흐름이 있어요. |
| 알림 | 구현됨 | 목록 조회, 상태 변경, SSE 스트림이 있어요. |
| 서버 관리 | 구현됨 | 서버 CRUD와 상세 메트릭 조회가 있어요. |
| AI 분석 | 구현됨 | `/api/analyze/[id]`로 서버 분석 텍스트를 보여줘요. |
| backend 연동 | 부분 연결 | 실시간 게임 서버 헬스 패널은 `backend:4000`이 살아 있을 때만 연결돼요. |

## 주요 기능

- ` /dashboard `
  - 요약 카드와 차트 중심 대시보드
- ` /servers `
  - 서버 목록, 생성, 상세 이동
- ` /servers/[id] `
  - 메트릭 조회, 관련 알림, AI 분석, backend 헬스 패널
- ` /alerts `
  - 알림 목록과 상태 변경
- ` /login `
  - 로그인
- ` /signup `
  - 가입 신청
- ` /admin/users `
  - 관리자 승인/권한 변경

## 데이터 구조

이 앱은 현재 목 데이터 전용이 아니에요.  
실제 제품 데이터는 Prisma로 다뤄요.

주요 모델:

- `User`
- `Role`
- `UserRole`
- `Server`
- `Alert`
- `MetricPoint`

정의 위치:

- [prisma/schema.prisma](E:\MY_PROJECTS\NEXT_PROJECT\server-pulse\frontend\prisma\schema.prisma)

## backend와의 관계

frontend는 자체 Prisma 데이터를 중심으로 돌아가요.  
별도 Hono backend는 일부 실시간 관측 기능에만 연결돼 있어요.

현재 확인된 연결 축:

- `NEXT_PUBLIC_API_BASE_URL=http://localhost:4000`
- 서버 상세 화면의 실시간 게임 서버 헬스 패널

즉, backend가 꺼져 있어도 프론트의 핵심 CRUD/인증/알림 기능은 대부분 동작하고,  
실시간 헬스 패널만 비활성화될 수 있어요.

## 환경 변수

`frontend/.env.local.example`를 기준으로 맞춰요.

| 변수 | 설명 |
|---|---|
| `DATABASE_URL` | Prisma SQLite 경로 |
| `AUTH_SECRET` | NextAuth 시크릿. 로컬은 fallback 가능하지만 운영은 필수예요. |
| `ADMIN_EMAIL` | seed용 관리자 계정 이메일 |
| `ADMIN_PASSWORD` | seed용 관리자 계정 비밀번호 |
| `ANTHROPIC_API_KEY` | AI 분석용 키 |
| `NEXT_PUBLIC_API_BASE_URL` | backend API base URL |

## 스크립트

| 명령 | 설명 |
|---|---|
| `pnpm dev` | 개발 서버 실행 |
| `pnpm build` | 프로덕션 빌드 |
| `pnpm start` | 빌드 결과 실행 |
| `pnpm typecheck` | TypeScript 검사 |
| `pnpm lint` | ESLint 실행 |
| `pnpm test` | Vitest 실행 |
| `pnpm test:watch` | Vitest watch |
| `pnpm test:e2e` | Playwright E2E |
| `pnpm db:push` | Prisma schema 반영 |
| `pnpm db:seed` | seed 데이터 입력 |

## 검증 메모

마지막 검증: 2026-04-30 (로컬, Node v22.21.0 / pnpm v10.26.1)

- ✅ `pnpm typecheck` 통과 — exit 0
- ✅ `pnpm test` 통과 — 34/34 (exit 0)
- ✅ `pnpm build` 통과 — 12페이지 생성 (exit 0)

이전 `spawn EPERM`은 Codex sandbox 전용 제약으로 분류됨. 로컬 환경에서는 재현 안 됨.

## AI 분석 동작

- `ANTHROPIC_API_KEY`가 있으면 Anthropic 스트리밍 분석을 사용해요.
- 키가 없으면 완전히 죽는 대신 fallback 분석 텍스트를 반환해요.

## 디렉터리 가이드

| 경로 | 설명 |
|---|---|
| `src/app/` | App Router 페이지와 Route Handler |
| `src/app/actions/` | Server Actions |
| `src/features/servers/` | 서버 도메인 코드 |
| `src/features/alerts/` | 알림 도메인 코드 |
| `src/features/game-status/` | backend 연동 게임 서버 상태 훅 |
| `src/components/` | UI 컴포넌트 |
| `src/lib/` | auth, prisma, API helper |
| `prisma/` | schema, migration, seed |
| `e2e/` | Playwright 시나리오 |

## 협업 메모

- frontend 기능/버그/테스트는 이 저장소에서 다뤄요.
- root 운영 문서, `.cursor`, `.codex`, `.agents` 변경은 root 저장소에서 다뤄요.
- backend 계약이나 env가 함께 바뀌면 cross-repo 작업으로 보고 root 이슈 연결을 먼저 생각해요.

자세한 기준:

- [frontend/AGENTS.md](E:\MY_PROJECTS\NEXT_PROJECT\server-pulse\frontend\AGENTS.md)
- [root docs/REPOSITORY_WORKFLOW.md](E:\MY_PROJECTS\NEXT_PROJECT\server-pulse\docs\REPOSITORY_WORKFLOW.md)
- [root docs/2026-04-29_현재-프로젝트-파악.md](E:\MY_PROJECTS\NEXT_PROJECT\server-pulse\docs\2026-04-29_현재-프로젝트-파악.md)

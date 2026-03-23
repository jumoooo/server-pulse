# CLAUDE.md

## 프로젝트

**Next.js 15+** (App Router) · **TypeScript** (strict) · **Tailwind CSS v3** · **React 19**

사용자 응답: **한국어** | 코드 주석: 복잡한 비즈니스 로직만 한국어

---

## 기술 스택

| 레이어     | 선택                                                 |
| ---------- | ---------------------------------------------------- |
| Framework  | Next.js 15+ App Router                               |
| Language   | TypeScript 5.x (strict)                              |
| Styling    | Tailwind CSS v3 + `cn()` (v4 마이그레이션 예정)      |
| Validation | Zod                                                  |
| Testing    | Vitest + React Testing Library + Playwright + MSW v2 |
| Package    | pnpm                                                 |

---

## 디렉토리 구조

```
src/
├── app/                    # App Router (라우팅, 레이아웃, 페이지)
│   ├── (routes)/           # 라우트 그룹 (URL 미포함)
│   ├── api/                # Route Handlers
│   ├── actions/            # Server Actions ('use server')
│   ├── layout.tsx          # Root Layout
│   └── page.tsx
├── components/
│   ├── ui/                 # 범용 UI (Button, Input, Card …)
│   └── features/           # 기능별 복합 컴포넌트
├── hooks/                  # Custom React Hooks
├── lib/                    # 유틸리티, DB 클라이언트, 헬퍼
├── types/                  # TypeScript 타입 정의
└── styles/
    └── globals.css
```

---

## 핵심 원칙

### 컴포넌트

- **Server Component 기본**, 이벤트/상태 필요 시만 `'use client'`
- `'use client'` 경계는 트리 최하단에 배치
- Props는 `interface`로 정의, `any` 타입 금지

### 코드 스타일

- 섹션 구분 주석 금지 (`// ──`, `// ---` 패턴)
- 중복 주석 금지 (코드가 설명하는 것은 주석 불필요)
- 복잡한 비즈니스 로직에만 한국어 주석

### Next.js 15 데이터 패턴

```ts
// ✅ 캐싱 (Next.js 15)
import { unstable_cache } from 'next/cache'

// ✅ Server Component에서 직접 데이터 페칭
export default async function Page() {
  const data = await getItems()
  return <ItemList items={data} />
}

// ✅ Server Action (React 19 useActionState)
'use server'
export async function createItem(prevState: State, formData: FormData): Promise<State> {
  const validated = schema.safeParse(Object.fromEntries(formData))
  if (!validated.success) return { error: validated.error.errors[0].message }
  await db.create(validated.data)
  revalidatePath('/items')
  return { success: true }
}
```

### 에러 처리

- Route Handler: `try/catch` + 표준 응답 (`{ success, data | error }`)
- Server Action: 예외 대신 에러 상태 반환
- 클라이언트: Error Boundary 또는 상태로 처리

---

## 에이전트 시스템

### 오케스트레이터 (진입점)

복잡하거나 어떤 에이전트를 써야 할지 모를 때: **`/orchestrate [요청]`**

오케스트레이터가 Intent를 분류하고 최적의 워크플로우를 자동 실행합니다.

### 워크플로우 패턴

```
새 기능 (TDD):  /tdd [기능 설명] → Red → Green → Refactor
단순 작업:      /feature | /ui | /api | /test | /commit
복잡한 기능:    /orchestrate → planner → tdd → commit
UI + API:      /orchestrate → [ui + api 병렬] → 통합
코드 리뷰:     /review → agentCritic → [feature 수정]
목 데이터:     /mock → feature → API Route Mock
MSW 핸들러:    /mock msw [도메인]
AI 분석:       /claude-api (Step 8 Anthropic 스트리밍)
```

> **기본 원칙**: 새 기능·버그 수정·API 개발은 `/tdd` 또는 `/orchestrate` 진입 시 TDD가 기본이다.
> 생략 요청(`--no-tdd`) 없으면 항상 Red→Green→Refactor 사이클을 실행한다.

### 에이전트 목록

| 에이전트       | 슬래시 커맨드  | 역할                                       | 사용 MCP            |
| -------------- | -------------- | ------------------------------------------ | ------------------- |
| `orchestrator` | `/orchestrate` | 워크플로우 조율, Intent 라우팅             | sequential-thinking |
| `tdd`          | `/tdd`         | TDD Red→Green→Refactor 사이클 전담 실행    | context7            |
| `planner`      | `/plan`        | 아키텍처 설계, 파일 구조, 단계 분해        | context7            |
| `feature`      | `/feature`     | 풀스택 기능 구현, 버그 수정 (TDD 내 Green) | context7            |
| `ui`           | `/ui`          | React 컴포넌트, Tailwind CSS               | context7            |
| `api`          | `/api`         | Route Handler, Server Action               | context7            |
| `test`         | `/test`        | Vitest, RTL, Playwright E2E                | playwright          |
| `commit`       | `/commit`      | Git 커밋, 푸시, PR 생성                    | github              |
| `agentCritic`  | `/review`      | 코드 품질 검토, 보안/성능/접근성           | context7            |

---

## MCP 서버

| 서버                  | 용도                           | 관련 에이전트                          |
| --------------------- | ------------------------------ | -------------------------------------- |
| `context7`            | 라이브러리 최신 공식 문서 조회 | planner, feature, ui, api, agentCritic |
| `sequential-thinking` | 복잡한 멀티스텝 추론           | orchestrator, planner                  |
| `github`              | PR 생성, 이슈 관리             | commit                                 |
| `playwright`          | 브라우저 자동화, E2E 테스트    | test                                   |

MCP 설치 후 `/mcp` 명령어로 상태 확인 가능.

---

## 자주 쓰는 명령어

```bash
pnpm dev              # 개발 서버 (Turbopack)
pnpm build            # 프로덕션 빌드
pnpm type-check       # TypeScript 검사
pnpm lint             # ESLint
pnpm test             # Vitest
pnpm test:coverage    # Vitest + coverage (임계값: lines 80%, branches 75%)
pnpm test:e2e         # Playwright E2E
pnpm format           # Prettier
```

## 슬래시 커맨드

`/tdd` · `/orchestrate` · `/plan` · `/feature` · `/ui` · `/api` · `/test` · `/commit` · `/discover` · `/review` · `/mock`

> `/claude-api` — 전역 스킬 (Claude API / Anthropic SDK 앱 개발 시 자동 활성화)

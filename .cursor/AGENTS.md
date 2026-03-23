# AGENTS.md

이 파일은 AI 코딩 에이전트가 프로젝트에서 어떻게 동작해야 하는지 정의합니다.

**정본**: 서브에이전트·스킬·Project Rules·훅은 **`.cursor/`** 에서만 유지합니다. (`.claude/`는 Claude Code 호환용 최소 설정)

## 프로젝트 스택

- **Framework**: Next.js 15+ App Router
- **Language**: TypeScript 5.x (strict)
- **Styling**: Tailwind CSS v3 + `cn()` (v4 마이그레이션 예정, `CLAUDE.md`와 동일)
- **Testing**: Vitest + React Testing Library + Playwright
- **Package**: pnpm

## 에이전트 목록

### 핵심 에이전트

| 에이전트 | 역할 | 자동 트리거 |
|---------|------|-----------|
| `orchestrator` | 요청 분류 및 에이전트 라우팅 | 복잡한 멀티스텝 작업 |
| `planner` | 아키텍처 설계, 구현 계획 수립 | 복잡한 기능 개발 전 |
| `feature` | Next.js 풀스택 기능 구현 | 기능 개발, 버그 수정 |
| `ui` | React UI 컴포넌트 생성 | UI 컴포넌트, 스타일링 |
| `api` | Route Handler, Server Action | API 엔드포인트 |
| `test` | 테스트 코드 작성 | 테스트 필요 시 |
| `tdd` | Red→Green→Refactor 전체 사이클 (`pnpm test --run`) | TDD, 테스트 먼저, `/tdd` |
| `commit` | Git 커밋/푸시 자동화 | 커밋, 올려줘, 푸시 |

### 메타 에이전트

| 에이전트 | 역할 | 사용 시점 |
|---------|------|---------|
| `agentCritic` | 코드 품질 검토, 개선 제안 | 코드 리뷰 요청 시 |

## 워크플로우

### 단순 작업

```
사용자 → [직접 에이전트] → 결과
```

### 복잡한 기능 개발

```
사용자 → orchestrator → planner → feature/ui/api → test → commit
```

### 라우팅 기준

```
UI 컴포넌트 요청      → ui
API/Server Action     → api
기능 개발 (단순)      → feature
기능 개발 (복잡)      → planner → feature
버그 수정             → feature
테스트 작성           → test
TDD 전체 사이클       → tdd
커밋/푸시             → commit
코드 리뷰             → agentCritic
멀티스텝 작업         → orchestrator
```

## 명령어

```bash
pnpm dev              # 개발 서버 (Turbopack)
pnpm build            # 프로덕션 빌드
pnpm type-check       # TypeScript 검사
pnpm lint             # ESLint
pnpm test             # Vitest
pnpm test:coverage    # Vitest + coverage (`CLAUDE.md`와 동일)
pnpm test:e2e         # Playwright E2E
pnpm format           # Prettier
```

## 코드 스타일 원칙

### Always Do

- Server Component 기본 사용
- Props는 interface로 정의
- Zod로 입력 유효성 검사
- 복잡한 비즈니스 로직만 한국어 주석
- cn()으로 클래스 병합

### Never Do

- any 타입 사용
- 섹션 구분 주석 (// ----, // ====)
- 중복 주석 (코드가 설명하는 것 반복)
- 불필요한 'use client' 남용
- 요청 없는 추상화/리팩토링

## 디렉토리 구조

```
src/
├── app/
│   ├── (routes)/       # 라우트 그룹
│   ├── api/            # Route Handlers
│   ├── actions/        # Server Actions
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/             # 범용 UI 컴포넌트
│   └── features/       # 기능별 컴포넌트
├── hooks/              # Custom Hooks
├── lib/                # 유틸리티, DB
├── types/              # TypeScript 타입
└── styles/
    └── globals.css
```

## 핸드오프 프로토콜

에이전트 간 핸드오프 형식:

```json
{
  "handoff": {
    "from": "planner",
    "to": "feature",
    "context": {
      "intent": "FEATURE_DEV",
      "requirements": [],
      "files_to_create": [],
      "files_to_modify": [],
      "architecture_decisions": []
    }
  }
}
```

## 성공 기준 (공통)

- ✅ TypeScript 오류 없음 (`pnpm type-check`)
- ✅ ESLint 통과 (`pnpm lint`)
- ✅ 기존 패턴과 일관성
- ✅ 요청 범위 내에서만 변경

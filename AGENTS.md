# ServerPulse Frontend AGENTS

## 목적

- 이 저장소는 `server-pulse` frontend 제품 코드 저장소예요.
- 새 채팅이 열려도 이슈, 브랜치, 커밋, PR 위치를 바로 판단할 수 있게 하는 package-local 안내예요.

## 세션 모드

- 기본 모드: `PKG_LOCAL(frontend)`
- 루트에서 내려온 `ROOT_ORCH` Work Order가 있으면 그 지시와 `integration_gate` 절을 우선합니다.

## 기본 규칙

- 새 작업이라고 해서 항상 issue를 먼저 만들지는 않아요.
- 버그, 기능, backend 계약 변경, cross-repo 작업처럼 **추적 가치가 큰 작업**이면 issue 생성을 먼저 제안해요.
- 오타, 작은 문구 수정, 명백한 잡수정처럼 **소규모 단발 수정**은 issue 없이 바로 진행할 수 있어요.
- issue가 필요한 작업이면 사용자에게 짧게 확인하고, 승인되면 이 저장소에 issue를 만든 뒤 브랜치/커밋/PR를 진행해요.
- frontend 기능, 버그, 테스트, 빌드 관련 작업은 **이 저장소에서** 이슈를 만들고 브랜치/커밋/PR를 진행해요.
- root 운영 문서, handoff, gate, harness, Codex/Claude 운영 자산 변경은 **`jumoooo/server-pulse-root-ops`** 에서 처리해요.
- backend API 계약이나 env가 함께 바뀌면 **root parent issue + backend child issue** 구조로 나눠서 진행해요.
- 같은 저장소 이슈를 닫을 때만 `Closes #번호`를 써요.
- root 상위 이슈는 `Refs jumoooo/server-pulse-root-ops#번호`로 연결해요.

## 운영 원칙

- 프론트 패키지 구현은 이 파일과 루트 [AGENTS.md](E:\MY_PROJECTS\NEXT_PROJECT\server-pulse\AGENTS.md)를 함께 따릅니다.
- 운영 정본은 `.ai/` (handoff/gate/harness) + `.codex/` (Codex rules/agents)입니다. `.cursor`는 자료 참고만 허용, 직접 의존 금지.
- 사용자 승인 없이 프론트/루트/백엔드의 미러 자산을 삭제·비우기·단순화하지 않습니다.

## 디자인 토큰 규칙 (⛔ HARD BLOCK)

직접 색상 사용 금지 — 반드시 시맨틱 토큰만 사용:

| 금지 | 허용 |
|------|------|
| `bg-gray-*`, `bg-white`, `bg-black` | `bg-bg-base`, `bg-bg-surface`, `bg-bg-elevated` |
| `text-gray-*`, `text-white`, `text-black` | `text-fg-base`, `text-fg-muted`, `text-fg-subtle` |
| `border-gray-*` | `border-border-default`, `border-border-subtle` |
| 모든 raw Tailwind 팔레트 (`bg-indigo-*`, `bg-red-*` 등) | `bg-interactive-*`, `bg-status-*`, `bg-severity-*` |
| hex 색상 (`#1f2937`, `#6b7280` 등) | CSS var (`--color-fg-muted`)를 `useCssVar` 훅으로 읽기 |

- Recharts/SVG DOM 속성: `useCssVar` 훅으로 CSS 변수 동적 읽기
- 상세 매핑 및 Before/After 예시: `.codex/rules/frontend-design-system.md`

## 이 저장소에서 처리하는 작업

- UI / 화면 / 레이아웃
- App Router 페이지와 Route Handler
- frontend 상태 관리, 컴포넌트, 훅
- frontend 테스트, 빌드, 배포 전 검증

## 구현 경계

- 백엔드 계약·포트·CORS·환경 키에 영향을 주면 루트 handoff와 `port/CORS/env` Evidence를 반드시 포함합니다.
- cross-package 변경은 Work Order Markdown + JSON 동쌍 없이 마감하지 않습니다.

## 작업 전 체크

- backend 응답 계약이 바뀌는지 확인해요.
- 교차 작업이면 `port / CORS / env` 정합 메모를 PR에 남겨요.
- 구현 PR에는 테스트나 빌드 결과를 함께 남겨요.

## 기본 점검

- `pnpm typecheck`
- `pnpm test`
- 필요 시 `pnpm build`
- 교차 패키지 작업 시 루트 [INTEGRATION_GATE.md](E:\MY_PROJECTS\NEXT_PROJECT\server-pulse\.ai\gates\INTEGRATION_GATE.md) 기준의 Port/CORS/Env 증빙

## 빠른 판단

| 변경 내용 | 작업 위치 |
|---|---|
| UI, 페이지, 컴포넌트, frontend 테스트 | `jumoooo/server-pulse` |
| API 계약, backend env, `/health` | `jumoooo/server-pulse-backend` |
| handoff, gate, Codex/Cursor 운영 문서 | `jumoooo/server-pulse-root-ops` |
| frontend + backend 동시 변경 | root parent issue + 각 저장소 child issue |

## 참조 경로

- 디자인 토큰 규칙: [.codex/rules/frontend-design-system.md](E:\MY_PROJECTS\NEXT_PROJECT\server-pulse\.codex\rules\frontend-design-system.md)
- 핸드오프 산출물: `.ai/handoffs/` (`schema_version: 2026-04-v1`)
- 통합 게이트: [INTEGRATION_GATE.md](E:\MY_PROJECTS\NEXT_PROJECT\server-pulse\.ai\gates\INTEGRATION_GATE.md)
- 저장소별 협업 기준: [REPOSITORY_WORKFLOW.md](E:\MY_PROJECTS\NEXT_PROJECT\server-pulse\docs\REPOSITORY_WORKFLOW.md)

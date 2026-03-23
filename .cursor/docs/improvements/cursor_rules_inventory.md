## .cursor 규칙·에이전트 인벤토리 (요약)

### 1. Agents (`.cursor/agents/*.md`)

- **Essential (핵심)**
  - `orchestrator.md`
  - `planner.md`
  - `featureImplementation.md`
  - `uiComponentBuilder.md`
  - `testCodeGenerator.md`
  - `commitAgent.md`

- **Useful (있으면 좋은)**
  - `cursorSetup.md`
  - `apiIntegration.md`
  - `uiStyleRefiner.md`
  - `deepDiscoveryAgent.md`

- **Heavy / Redundant (과도·중복 가능성)**
  - `agentCritic.md`
  - `contentConsistencyAgent.md`
  - `envOrchestratorArchitect.md`
  - `agentBuilder.md` (이 프로젝트 규모 기준에선 메타 수준)
  - ~~deprecated/codeChangeReviewer.md~~ (제거됨 → agentCritic Code Review Mode)
  - ~~deprecated/deepDiscoveryAgent_caching.md~~ (제거됨 → deepDiscoveryAgent 통합)

### 2. Rules (`.cursor/rules/*.mdc`)

- **Essential**
  - `code-style.mdc` – Dart/Flutter 코드 스타일 핵심 원칙
  - `flutter-test.mdc` – Hive/init, pumpAndSettle, async/await, 타이머 tearDown 등 재발 방지 규칙
  - `state-management.mdc` – UI 상태 vs 비즈니스 상태 분리 패턴
  - `flutter-animation.mdc` – 캘린더/애니메이션 flicker 방지 및 프레임 순서
  - `orchestrator.mdc` – Intent 분류/라우팅 규칙
  - `planner.mdc` – 계획 수립/feature_dev 연계 규칙

- **Useful**
  - `bilingual-docs.mdc` – 영문 Internal + 한글 사용자용 문서 규칙
  - `agent-builder.mdc` – Agent 생성/업그레이드 시 가이드
  - `agent-handoff.mdc` – planner → dev handoff 스키마/품질 게이트
  - `deep-discovery-agent.mdc` – deepDiscoveryAgent 자동 실행 전략
  - `env-orchestrator-architect.mdc` – 에이전트/환경 설계 시 지침

- **Heavy / Redundant**
  - ~~deprecated/calendar-ux.mdc~~ (제거됨 → flutter-animation/state-management로 대체)

### 3. Skills (`.cursor/skills/<name>/SKILL.md`)

2026-03-10 Agent Skills 표준 폴더 구조로 마이그레이션됨.

- **Essential**
  - `feature-implementation/SKILL.md`
  - `ui-component-builder/SKILL.md`
  - `test-code-generator/SKILL.md`

- **Useful**
  - `orchestrator-skills/SKILL.md`
  - `planner-skills/SKILL.md`
  - `commit-agent/SKILL.md`
  - `cursor-setup/SKILL.md`
  - `api-integration/SKILL.md`
  - `ui-style-refiner/SKILL.md`
  - `agent-builder/SKILL.md`
  - `agent-critic/SKILL.md`
  - `content-consistency/SKILL.md`
  - `deep-discovery-agent/SKILL.md`
  - `env-orchestrator-architect/SKILL.md`

- **Deprecated**
  - `deprecated/*.md` (Legacy flat format)

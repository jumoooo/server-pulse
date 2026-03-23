# Claude ↔ Cursor 정합 — Phase 0 인벤토리 부록

**근거**: [02_Phase별_상세_작업서.md](../../../p_docs/06_Cursor_Claude_공식_정합_계획/02_Phase별_상세_작업서.md) Phase 0  
**검증 일자**: 2026-03-23  
**리포 루트**: `new_pj`

## 1. Subagents — 파일 존재 (01 § 1.1 대조)

| name | `.cursor/agents` | `.claude/agents` | 비고 |
|------|------------------|------------------|------|
| orchestrator | ✅ | ✅ | `deprecated/` 는 매핑 대상 외 |
| planner | ✅ | ✅ | |
| feature | ✅ | ✅ | `.cursor`에 TDD 전담은 `tdd`로 위임 문구 추가 (2026-03-23) |
| ui | ✅ | ✅ | |
| api | ✅ | ✅ | |
| test | ✅ | ✅ | |
| commit | ✅ | ✅ | |
| agentCritic | ✅ | ✅ | |
| tdd | ✅ (이관 후) | ✅ | `.cursor/agents/tdd.md` 신규 — Claude 전용 YAML 제거 |

`.cursor`에만 존재 (merge 대상 아님): `agentBuilder`, `apiIntegration`, `commitAgent`, `contentConsistencyAgent`, `cursorLibraryExtract`, `cursorSetup`, `deepDiscoveryAgent`, `envOrchestratorArchitect`, `featureImplementation`, `testCodeGenerator`, `uiComponentBuilder`, `uiStyleRefiner`, `deprecated/README.md`

## 2. 스킬 이관 시 확정 폴더명 (01 § 2.1 → Phase 3용)

| `.claude/skills` | 목표 `.cursor/skills` 폴더명 | 이유 |
|------------------|------------------------------|------|
| `tdd` | `tdd` | 매핑표 권장 그대로 |
| `feature` | `next-feature` | Flutter `feature-implementation` 과 분리 |
| `plan` | (문서만) `planner-skills`에 요약 링크 추가 검토 | 통합 시 본문에 Next `/plan` 절 링크 |
| `orchestrate` | `orchestrator-skills`와 본문 통합 검토 | 중복 제거는 Phase 3 |
| `discover` | 역할 문서화 후 `deep-discovery-agent`와 병행 | 즉시 복제 대신 [01] 비고 준수 |
| `commit` | `next-commit` | `commit-agent` 이름 충돌 회피 |
| `review` | (이관 없음) `agent-critic` description 보강 | Phase 3 |
| `test` | `next-test` | `test-code-generator`(Flutter) 와 분리 |
| `mock` | `mock` | 매핑표 신규 |
| `api` | `next-api` | `api-integration`(Flutter) 와 분리 |
| `ui` | `next-ui` | `ui-component-builder`(Flutter) 와 분리 |

## 3. Rules `.mdc` 이관 (01 § 3.2 + 실제 경로)

| 소스 | 목표 파일 | glob / alwaysApply (초안) |
|------|-----------|-----------------------------|
| `typescript.md` | `next-typescript.mdc` | `**/*.{ts,tsx}` |
| `api.md` | `next-api-routes.mdc` | `src/app/api/**` (레포에 경로 존재 확인됨) |
| `components.md` | `next-react-components.mdc` | `src/components/**` |
| `testing.md` | `next-testing.mdc` | `**/*.{test,spec}.{ts,tsx}`, `e2e/**` 등 Phase 2에서 확정 |
| `tdd-workflow.md` | `next-tdd-workflow.mdc` | `alwaysApply: false`, Intelligent용 `description` |
| `mcp-usage.md` | `mcp-usage.mdc` | glob 어려우면 Intelligent 전용 |

## 4. Merge 우선순위 — 레포 적용 문장 (01 § 4)

본 레포에서 `.cursor` 정본화 시 **01 § 4** 세 줄을 그대로 적용한다: (1) Cursor 호환 frontmatter·경로·훅 이벤트 우선 (2) 동일 역할은 절차·예시가 구체적인 본문을 `.cursor`에 반영 (3) Flutter vs Next는 에이전트명·스킬 폴더·globs로 분리.

## 5. `name` = 폴더명 검증 (수동 절차)

Phase 3 완료 후: 각 `.cursor/skills/*/SKILL.md`의 YAML `name`과 부모 폴더명(kebab-case)이 일치하는지 디렉터리 순회로 확인한다.

---

## 6. 완료 요약 (2026-03-23)

- Next Project Rules → `.cursor/rules/next-*.mdc`, `mcp-usage.mdc`
- 스킬 → `tdd`, `next-feature`, `next-plan`, `next-orchestrate`, `discover`, `next-commit`, `next-review`, `next-test`, `mock`, `next-api`, `next-ui`
- 훅 → `.cursor/hooks.json` + JS 보조 스크립트; `.claude/settings.json`의 `hooks`는 `{}`로 비움
- 상세 로그 → `.cursor/docs/agent_upgrade/2026-03-23-claude-cursor-consolidation.md`

# Cursor × Claude 공식 정합 — 작업 연속용 TODO 📋

> **이 파일의 목적**: 새 채팅·새 세션에서도 **같은 맥락**으로 작업을 이어가기 위한 **단일 진행 메모**입니다.  
> 상세 설계·근거는 같은 폴더의 `00`~`06` 문서와 [README.md](./README.md)를 정본으로 두고, **완료/변경 시 이 TODO를 함께 갱신**합니다.

## 에이전트 준수 규칙 (필수) 🔒

- 본 파일을 작성·수정할 때는 **`.cursor/rules/todo-session-continuity.mdc`** 를 따릅니다.  
- 각 Phase는 **근거 문서 §** 를 명시하고, 원문의 **입력 / 작업 / 산출물 / DoD** 를 인용한 뒤 **원자 체크박스**로만 진행 상태를 관리합니다.

---

## 1. 전체 작업(Epic) 한 줄 요약

**`.claude`(Claude Code)에만 있거나 분산된 Next·워크플로 자산을 Cursor 공식 구조에 맞춰 `.cursor`로 모으고, 정본을 `.cursor`로 통일**한다.  
(Flutter·Next 공존 레포에서 Rules / Skills / Subagents / Hooks 중복·드리프트를 줄이는 것이 핵심.)

**근거**: [00_개요_및_공식_근거.md § 1 목적](./00_개요_및_공식_근거.md), [00 § 3 목표 아키텍처](./00_개요_및_공식_근거.md)

---

## 2. 지금 어디까지 / 무엇을 하고 있는가

| 항목 | 상태 |
|------|------|
| **문서(계획 산출물)** | ✅ `00`~`06`, `README` 작성됨 — 실행 가이드로 사용 가능 |
| **구현(리포지토리)** | ✅ Phase 0~5 완료 — Phase 6 **P0 시나리오 완료** (2026-03-23): A~D 전 항목 확인 + 로그 동기화 |
| **현재 권장 포커스** | **P7-M2 월간 재검증 루틴** 대기(다음 점검: 2026-04, 또는 Cursor 업데이트 직후) |

### 2.1 리포지토리 스냅샷 (마지막 확인: 2026-03-23)

| 검증 항목 | 경로 / 조건 | 결과 |
|-----------|-------------|------|
| Claude `tdd` 서브에이전트 | `.claude/agents/tdd.md` | ✅ 존재 |
| Cursor `tdd` 서브에이전트 | `.cursor/agents/tdd.md` | ✅ 존재 |
| Next 이관용 Project Rules | `.cursor/rules/next-*.mdc` + `mcp-usage.mdc` | ✅ 6+1 파일 |
| Next 이관 스킬 | `.cursor/skills/tdd/`, `next-*`, `discover`, `mock` | ✅ 이관·`.claude/skills` 본문 제거 |
| Hooks: Dart 포맷 | `afterFileEdit` → `format_dart.dart` | ✅ |
| Hooks: Prettier·가드·세션·stop·실패힌트 | `.cursor/hooks.json` + `.cursor/hooks/*.js` | ✅ 구현 ([03 § 5](./03_훅_클로드_Cursor_매핑.md) 체크 완료) |
| `.claude` 훅 중복 방지 | `.claude/settings.json` → `hooks: {}` | ✅ + [`.claude/README.md`](../../../.claude/README.md) |
| 운영 감시 대상 Rules | `.cursor/rules/next-*.mdc`, `.cursor/rules/mcp-usage.mdc` | ✅ P7-3 반영 |
| 운영 감시 대상 라우팅 | `.cursor/agents/tdd.md`, `.cursor/agents/orchestrator.md`, `.cursor/rules/orchestrator.mdc` | ✅ P7-4 반영 |

> 스냅샷은 관련 파일을 바꿀 때마다 **표 전체를 다시 확인**하고 날짜를 갱신합니다.

---

## 3. 문서 ↔ Phase 추적 매트릭스 (논쟁 방지용)

| Phase | 상세 작업서 (DoD 출처) | 필수 교차 참조 |
|-------|------------------------|----------------|
| 0 | [02 § Phase 0](./02_Phase별_상세_작업서.md) | [01 전체](./01_에이전트_스킬_룰_매핑표.md), [04 § 1~2](./04_Gap분석_리스크.md) |
| 1 | [02 § Phase 1](./02_Phase별_상세_작업서.md) | [01 § 1.1](./01_에이전트_스킬_룰_매핑표.md), [04 R5](./04_Gap분석_리스크.md) |
| 2 | [02 § Phase 2](./02_Phase별_상세_작업서.md) | [01 § 3.2](./01_에이전트_스킬_룰_매핑표.md), [bilingual-docs](mdc:.cursor/rules/bilingual-docs.mdc) |
| 3 | [02 § Phase 3](./02_Phase별_상세_작업서.md) | [01 § 2](./01_에이전트_스킬_룰_매핑표.md), [06](./06_claude_폴더_처리_정책.md) |
| 4 | [02 § Phase 4](./02_Phase별_상세_작업서.md) | [03 전체](./03_훅_클로드_Cursor_매핑.md), [04 R2~R3](./04_Gap분석_리스크.md) |
| 5 | [02 § Phase 5](./02_Phase별_상세_작업서.md) | [00 § 3](./00_개요_및_공식_근거.md), [06 README 템플릿](./06_claude_폴더_처리_정책.md) |
| 6 | [02 § Phase 6](./02_Phase별_상세_작업서.md) | [05 P0~P2](./05_검증_시나리오_체크리스트.md) |

**의존**: [02 § 의존 관계](./02_Phase별_상세_작업서.md) — Phase 1~4는 병렬 가능하나 **Hooks(Phase 4)** 는 스크립트 경로 확정 후 통합 검증 권장.

---

## 4. Phase 0 — 인벤토리 및 충돌 확정

**근거 문서**: [02_Phase별_상세_작업서.md — Phase 0 표](./02_Phase별_상세_작업서.md)

| 구분 | 원문 요구 (02) |
|------|----------------|
| **입력** | [01_에이전트_스킬_룰_매핑표.md](./01_에이전트_스킬_룰_매핑표.md), 실제 디렉터리 목록 |
| **작업** | 이름 충돌 나열; 태그 `병합` / `이관` / `신규` / `유지`; Next vs Flutter 경계 문장화 |
| **산출물** | 매핑표 갱신(체크박스); 필요 시 `.cursor/docs/improvements/` 인벤토리 부록 |
| **DoD** | 모든 `.claude` 에이전트·스킬·룰에 대해 `.cursor` 쪽 조치가 **한 줄 이상** 정의됨 |

### 4.1 원자 체크리스트 (Phase 0)

- [x] **P0-1** [01 § 1.1] 표의 각 `name`에 대해 `.cursor/agents/{name}.md` / `.claude/agents/{name}.md` 존재 여부를 리포 루트에서 확인하고, 표의 “갭/조치”와 실제가 다르면 **01 문서를 수정**한다. → 2026-03-23 확인·`tdd` 행 갱신.
- [x] **P0-2** [01 § 1.1] `tdd` 행: 조치가 **「`.cursor/agents/tdd.md` 신규」** 임을 표에 명시 유지; 완료 시 체크와 완료일을 주석 또는 [01 § 5](./01_에이전트_스킬_룰_매핑표.md) 산출물에 기록한다. → 완료 반영.
- [x] **P0-3** [01 § 2.1] `.claude/skills` 폴더 11개(`tdd`, `feature`, `plan`, `orchestrate`, `discover`, `commit`, `review`, `test`, `mock`, `api`, `ui`) 각각에 대해 **제안 `.cursor` 폴더명**(예: `next-api`, `next-ui`)을 한 줄로 확정하거나 **의도적 유지** 사유를 [01] 또는 부록에 적는다. → [인벤토리 §2](mdc:.cursor/docs/improvements/2026-03-23-claude-cursor-consolidation-inventory.md).
- [x] **P0-4** [01 § 3.2] `.claude/rules` 6파일(`typescript.md`, `api.md`, `components.md`, `testing.md`, `tdd-workflow.md`, `mcp-usage.md`) 각각 → **목표 `.mdc` 파일명 + glob + alwaysApply 여부**를 표로 정리한다(실제 `src/` 구조에 맞게 `api` glob 조정). → 인벤토리 §3 (`src/app/api/**` 확인).
- [x] **P0-5** [01 § 4] 병합 우선순위 3줄을 따르기로 **명시한 결정 문장**을 이 TODO §7 또는 `.cursor/docs/improvements/`에 남긴다. → 인벤토리 §4.
- [x] **P0-6** [01 § 5] 매핑표 산출물: (a)(b) 완료 — [01 § 5](./01_에이전트_스킬_룰_매핑표.md) 체크·이관 표 갱신 (2026-03-23).
- [x] **P0-7** [02 DoD] `.claude/agents`, `.claude/skills`, `.claude/rules` 각 목록에 대응하는 **`.cursor` 조치 한 줄**이 없는 항목이 없는지 최종 점검한다. → 인벤토리에 에이전트/스킬/룰 조치 한 줄씩 존재.

---

## 5. Phase 1 — Subagents (`.cursor/agents`)

**근거 문서**: [02_Phase별_상세_작업서.md — Phase 1](./02_Phase별_상세_작업서.md)

| 구분 | 원문 요구 (02) |
|------|----------------|
| **입력** | `.claude/agents/tdd.md`, 중복 이름 에이전트 쌍 |
| **작업** | `tdd.md` 추가 시 YAML에서 `tools`, `maxTurns` 제거; `model`은 공식 허용값만; `feature`/`ui`/`api` 등은 `.claude` 본문 중 유용한 TDD·검증 절차를 `.cursor`에 병합 검토 |
| **산출물** | `.cursor/agents/tdd.md`; 필요 시 갱신된 `feature.md` 등 |
| **DoD** | Cursor 서브에이전트 목록에 `tdd` 노출; `/tdd` 또는 자연어 위임 시 설명 필드로 라우팅 가능 |

**검토 포인트 (02 본문)**: `.cursor/agents/feature.md` 등 `model: auto` 가 공식과 다르면 `inherit` 등으로 통일.

### 5.1 원자 체크리스트 (Phase 1)

- [x] **P1-1** `.claude/agents/tdd.md`를 읽고, Cursor Subagents 스펙([00 § 2 Subagents 링크](./00_개요_및_공식_근거.md))에 맞게 **금지 필드 제거 목록**(`tools`, `maxTurns` 등)을 주석으로 확인한 뒤 `.cursor/agents/tdd.md`를 생성한다.
- [x] **P1-2** 새 `tdd.md` frontmatter: `name: tdd`, `model` ∈ {공식 허용값}, `description`에 **when 트리거** 명시 ([agent-builder 규칙](mdc:.cursor/rules/agent-builder.mdc) 형식 정렬).
- [x] **P1-3** [01 § 1.1] `feature` 행 조치: `.claude` vs `.cursor` `feature.md` **diff** 후, TDD·검증 절차 병합이 필요하면 **구체적 섹션 제목**을 적고 `.cursor/agents/feature.md`에 반영한다; 불필요하면 **의도적 유지**를 TODO §11에 기록한다. → **TDD 상세는 `tdd`에 위임** 문구만 추가(§11 참조).
- [x] **P1-4** 동일 방식으로 `ui.md`, `api.md`에 대해 **선택적 diff·병합** (변경 없을 시 P1-4-`ui` 등으로 의도적 유지 표기). → §11: 본문 TDD 전담과 무관, `model: inherit`만 정리.
- [x] **P1-5** [02 검토 포인트] `.cursor/agents/*.md` 전수에서 `model: auto` 검색 → 공식값으로 교체 또는 근거 있는 예외를 §7에 기록. → `orchestrator`, `planner`, `feature`, `api`, `ui`, `test`, `agentCritic` → **`model: inherit`** (2026-03-23).
- [x] **P1-6** [02 DoD] Cursor UI에서 `tdd` 서브에이전트 인지 여부 확인 절차를 [05 § B](./05_검증_시나리오_체크리스트.md)에 맞게 실행하고 결과를 §12 기록란에 적는다. → 2026-03-23 수동 확인: Settings → Agents에서 `tdd` 노출.

---

## 6. Phase 2 — Project Rules (`.claude/rules` → `.cursor/rules/*.mdc`)

**근거 문서**: [02_Phase별_상세_작업서.md — Phase 2](./02_Phase별_상세_작업서.md), [01 § 3.2](./01_에이전트_스킬_룰_매핑표.md)

| 구분 | 원문 요구 (02) |
|------|----------------|
| **입력** | `.claude/rules/*.md` 6종 |
| **작업** | 각 파일 `.mdc` 변환; `description` / `globs` / `alwaysApply`; 500줄 초과 시 분할; **영·한 병기** |
| **산출물** | 예: `next-typescript.mdc`, `next-api-routes.mdc`, `next-react-components.mdc`, `next-testing.mdc`, `next-tdd-workflow.mdc`(또는 testing 병합), `mcp-usage.mdc` |
| **DoD** | Cursor Settings → Rules 에서 신규 룰 인식; 대상 파일에 맞게 Specific files / Intelligent 동작 확인 |

### 6.1 원자 체크리스트 (Phase 2) — 소스별

- [x] **P2-ts** → `next-typescript.mdc` 생성.
- [x] **P2-api** → `next-api-routes.mdc` (`src/app/api/**`, actions, route.ts globs).
- [x] **P2-comp** → `next-react-components.mdc`.
- [x] **P2-test** → `next-testing.mdc`.
- [x] **P2-tdd** → `next-tdd-workflow.mdc` (별도 파일, testing과 역할 분리).
- [x] **P2-mcp** → `mcp-usage.mdc`.
- [x] **P2-DoD** [02 DoD] Cursor Settings → Rules 에서 신규 룰 노출 **수동** 확인. → 2026-03-23 재확인: `next-*`, `mcp-usage` 노출 확인.

---

## 7. Phase 3 — Skills (`.claude/skills` → `.cursor/skills`)

**근거 문서**: [02_Phase별_상세_작업서.md — Phase 3](./02_Phase별_상세_작업서.md), [01 § 2](./01_에이전트_스킬_룰_매핑표.md)

| 구분 | 원문 요구 (02) |
|------|----------------|
| **입력** | `.claude/skills/*/SKILL.md` |
| **작업** | `.cursor/skills/<folder>/SKILL.md`로 복사·정리; 폴더명 = frontmatter `name`; Flutter와 겹치면 `next-*` 접두사; `references/` 로 분할 |
| **산출물** | 이전된 스킬 폴더들 |
| **DoD** | Skills 목록에 **중복 이름 없음**; description에 “Use when …” |

### 7.1 원자 체크리스트 (Phase 3) — 폴더별 (Phase 0에서 확정한 대상명 사용)

- [x] **P3-tdd** ~ **P3-ui** → `.cursor/skills/` 에 스킬 생성, `name` = 폴더 kebab-case 일치.
- [x] **P3-plan** / **P3-orch** → `next-plan`, `next-orchestrate` + `planner-skills` / `orchestrator-skills` 에 교차 링크 문단 추가.
- [x] **P3-disc** → `discover/` + 스킬 본문에 deep-discovery 구분 문구.
- [x] **P3-claude-empty** → `.claude/skills/*/SKILL.md` 삭제, [`.claude/skills/README.md`](../../../.claude/skills/README.md) 매핑 표기.
- [x] **P3-DoD** → 생성 시 `name` 정합; 추후 폴더 rename 시 재검증.

---

## 8. Phase 4 — Hooks

**근거 문서**: [02_Phase별_상세_작업서.md — Phase 4](./02_Phase별_상세_작업서.md), [03_훅_클로드_Cursor_매핑.md](./03_훅_클로드_Cursor_매핑.md)

| 구분 | 원문 요구 (02) |
|------|----------------|
| **입력** | `.claude/settings.json` hooks, `.claude/hooks/prettier-format.js`, `.cursor/hooks.json`, `.cursor/hooks/format_dart.dart` |
| **작업** | [03] 이벤트 매핑에 따라 연결; TS/Prettier는 확장자·glob 분기로 Dart 훅과 충돌 없게 |
| **산출물** | 갱신 `.cursor/hooks.json`, 필요 시 `.cursor/hooks/*.js` |
| **DoD** | Hooks 탭 오류 없음; 샘플 편집 후 Prettier·Dart 각각 기대 경로에서 실행 |

### 8.1 원자 체크리스트 (Phase 4)

- [x] **P4-1**~**P4-4** → `.cursor/hooks.json` + `prettier-after-edit.js`, `shell-guard.js`, `session-start-context.js`, `stop-reminder.js`, `shell-failure-hint.js`; Prettier는 **`afterFileEdit`** + `file_path` stdin ([Cursor docs](https://cursor.com/docs/hooks)).
- [x] **P4-6** → `afterFileEdit`는 `file_path` 기준 (Dart 스크립트와 동일 필드).
- [x] **P4-5** [03 § 5] / [05 § C](./05_검증_시나리오_체크리스트.md) — **IDE에서 수동** 확인. (2026-03-23: Hooks 로드 + Dart/Prettier 저장 동작 확인)

---

## 9. Phase 5 — AGENTS.md · 변경 로그

**근거 문서**: [02_Phase별_상세_작업서.md — Phase 5](./02_Phase별_상세_작업서.md)

| 구분 | 원문 요구 (02) |
|------|----------------|
| **입력** | `.cursor/AGENTS.md`, (선택) 루트 요구사항 |
| **작업** | 루트 `AGENTS.md` 추가 여부; 요약만 두고 `.cursor/AGENTS.md` 링크 가능; `.cursor/docs/agent_upgrade/`에 changelog 1파일 |
| **산출물** | (선택) 루트 `AGENTS.md`, `YYYY-MM-DD-claude-cursor-consolidation.md` |
| **DoD** | 신규 기여자가 **정본이 `.cursor`** 임을 1분 내 이해 |

### 9.1 원자 체크리스트 (Phase 5)

- [x] **P5-1** 루트 `AGENTS.md` **미작성** 유지 (본 레포는 `.cursor/AGENTS.md` 단일); 결정은 §11 기록.
- [x] **P5-3** → `.cursor/docs/agent_upgrade/2026-03-23-claude-cursor-consolidation.md`
- [x] **P5-4** → `.cursor/AGENTS.md` 상단 **정본 문장** 추가.
- [x] **P5-2** — 해당 없음 (루트 AGENTS 없음).

---

## 10. Phase 6 — 검증

**근거 문서**: [02_Phase별_상세_작업서.md — Phase 6](./02_Phase별_상세_작업서.md), [05_검증_시나리오_체크리스트.md](./05_검증_시나리오_체크리스트.md)

| 구분 | 원문 요구 (02) |
|------|----------------|
| **입력** | [05](./05_검증_시나리오_체크리스트.md) |
| **작업** | 항목 전부 실행 후 결과 기록 |
| **산출물** | 체크리스트 완료 표시, 이슈 티켓(있을 경우) |
| **DoD** | **P0 시나리오 100% 통과** (2026-03-23 최종) |

### 10.1 원자 체크리스트 (Phase 6) — [05] 절별 복붙

**P0 — A. Rules / Skills 노출**

- [x] **P6-A1** [05 § P0 A-1] Settings → Rules 에 Next `.mdc` 노출. → 2026-03-23 최종 재확인: `next-*`, `mcp-usage` 노출 확인.
- [x] **P6-A2** [05 § P0 A-2] Skills 에 `.cursor/skills` 기준 중복 없음. → 2026-03-23: 각 `SKILL.md` frontmatter `name` 기준 **중복 없음** ([05 저장소 로그](./05_검증_시나리오_체크리스트.md)).
- [x] **P6-A3** [05 § P0 A-3] `@규칙` 또는 Manual 적용 가능(해당 룰을 Manual로 둔 경우). → 2026-03-23 수동 확인: 적용 동작 확인.

**P0 — B. Subagents**

- [x] **P6-B1** [05 § P0 B-1] `tdd.md` 추가 후 서브에이전트 목록 인지. → 2026-03-23 수동 확인: 목록 노출 정상.
- [x] **P6-B2** [05 § P0 B-2] “TDD로 구현해줘” / `/tdd` 라우팅 확인. → 2026-03-23 최종 재확인: 라우팅 정상 동작.

**P0 — C. Hooks**

- [x] **P6-C1** [05 § P0 C-1] Hooks 화면에 프로젝트 `hooks.json` 로드. → 2026-03-23 수동 확인.
- [x] **P6-C2** [05 § P0 C-2] `.dart` 편집 후 `format_dart` 오류 없음. → 2026-03-23 수동 확인.
- [x] **P6-C3** [05 § P0 C-3] Prettier 연결 시 `.ts`/`.tsx` 포맷 확인. → 2026-03-23 수동 확인.
- [x] **P6-C4** [05 § P0 C-4] 위험 쉘 시뮬레이션 시 가드 **exit 2** (후 롤백). → 2026-03-23: `shell-guard.js`에 `{"command":"rm -rf /"}` stdin 주입 시 **exit 2** 확인 (IDE `beforeShellExecution`과 동일 스크립트).

**P0 — D. 회귀**

- [x] **P6-D1** [05 § P0 D-1] Flutter 에이전트·스킬·룰 무손상. → 2026-03-23: Flutter용 스킬·에이전트 경로 존재·삭제 흔적 없음 ([05 저장소 로그](./05_검증_시나리오_체크리스트.md)).
- [x] **P6-D2** [05 § P0 D-2] `pnpm`/Next 명령이 `CLAUDE.md`·`.cursor/AGENTS.md` 와 일치. → 2026-03-23: `AGENTS.md`에 `pnpm test:coverage` 추가·Tailwind v3 문구로 `CLAUDE.md`와 정합; `package.json` scripts와 대응 확인.

**P1 / P2 (권장·선택)**

- [x] **P6-P1-1** [05 § P1] 세 항목 각각 확인. → `pnpm test --run` 확인 완료 + deep-discovery 과트리거 없음(정상) + 루트 `AGENTS.md` 없음(N/A).
- [x] **P6-P2-1** [05 § P2] 두 항목 각각 확인. → 2026-03-23: `/migrate-to-skills` 사용 흔적 없음(문서·레포 스캔), 원격 Rules 사용 구성 없음(로컬 `.cursor/rules/*.mdc` 중심)으로 판단.

- [x] **P6-log** [05 기록란] 검증 일자·Cursor 버전·비고 기입. → 2026-03-23: repo/수동 검증 반영 + Cursor 2.6.14 기입.

---

## 11. 의사결정 메모 (비워두지 말 것)

`.claude` 폴더 최종 옵션: **A 병행 / B 축소 / C 제거** — [06_claude_폴더_처리_정책.md](./06_claude_폴더_처리_정책.md)

| 날짜 | 선택 | 비고 |
|------|------|------|
| 2026-03-23 | **B (축소)** 에 가까움 | 훅은 `.cursor`로 이전·`.claude/settings.json` hooks 비움; 에이전트는 `.claude`에 유지(호환). 에이전트 동기화는 팀 정책에 따름. |

**의도적 유지 / 예외** (있을 시만 추가):

| ID | 항목 | 사유 | 근거 문서 § |
|----|------|------|-------------|
| P1-3-feature | `feature.md`에 `.claude` 수준 TDD 본문 전량 병합 | Red/Green/Refactor 상세는 `tdd` 서브에이전트가 담당; feature에는 **위임 안내**만 추가 | [01 § 1.1 feature](./01_에이전트_스킬_룰_매핑표.md) |
| P1-4-ui | `ui.md` 본문 | TDD 사이클과 무관; `model: inherit`만 반영 | [02 Phase 1](./02_Phase별_상세_작업서.md) |
| P1-4-api | `api.md` 본문 | 동일 | [02 Phase 1](./02_Phase별_상세_작업서.md) |

**부가 완료 (원자 id 외 추적)**:

- `orchestrator.md`·`orchestrator.mdc`: Intent **`TDD_WORKFLOW`** → 에이전트 **`tdd`** 라우팅 추가 (2026-03-23).

---

## 12. 세션 로그 (최근 위부터 기록)

| 날짜 | 한 일 (경로·id) | 다음에 할 일 (첫 미체크 원자 id) |
|------|-----------------|-----------------------------------|
| 2026-03-23 | Phase 0~1 (인벤토리, `tdd` 에이전트, orchestrator 라우팅) | Phase 2~ |
| 2026-03-23 | Phase 2~5 일괄: Next `.mdc` 6종, 스킬 11 이관·`.claude/skills` 정리, hooks 확장, `AGENTS`/changelog, `.claude/README` | **P1-6**, **P2-DoD**, **05 P0** 수동 검증 |
| 2026-03-23 | `AGENTS.md` 정합(`test:coverage`, Tailwind v3); `pnpm test --run`·shell-guard exit 2·스킬 `name` 중복 스캔; [05](./05_검증_시나리오_체크리스트.md) 저장소 로그 추가; TODO **P6-A2,C4,D1,D2,log** 반영 | **P1-6**, **P2-DoD**, **P4-5**, **P6-A1,A3,B1,B2,C1,C2,C3** — Cursor UI에서 확인 |
| 2026-03-23 | 사용자 수동 검증 반영: Rules Manual 적용(A3)·Agents `tdd` 노출(B1/P1-6)·Hooks 로드/포맷(C1~C3)·deep-discovery 과트리거 없음(P6-P1-1) 체크; Rules 노출(A1/P2-DoD)·TDD 라우팅(B2)는 미완 | **P2-DoD**, **P6-A1**, **P6-B2**, (선택) **P6-P2-1** |
| 2026-03-23 | 선택 항목 정리: P2 확인(마이그레이션/원격 룰) 완료 처리. 남은 블로커는 **Rules 노출(A1/P2-DoD)** 및 **TDD 라우팅(B2)** 두 가지로 축소 | **P2-DoD**, **P6-A1**, **P6-B2** |
| 2026-03-23 | 최종 재확인: Rules 노출(A1/P2-DoD) 정상, `/tdd`/자연어 라우팅(B2) 정상, Cursor 버전(2.6.14) 기록 반영 | ✅ Phase 6 완료 |
| 2026-03-23 | 다음 사이클 준비: **Phase 7 운영 안정화** 섹션 신설(재검증 주기/복구 순서/감시 목록/기록 템플릿) | **P7-1** |
| 2026-03-23 | Phase 7 완료: 재검증 주기/복구 순서 확정, 감시 목록 스냅샷 반영, 기록 템플릿 정리. 운영 반복 항목 `P7-M1` 추가 | **P7-M1** |
| 2026-03-23 | 운영 루틴 1회차 실행: `P7-M1` 완료 처리 + `05` 권장항목 루트 AGENTS N/A 반영 | **P7-M2** |

### 12.1 잔여 블로커 처리 순서 (A1/B2) — 종료됨

1. 2026-03-23 최종 재검증 완료: A1/P2-DoD/B2 모두 통과.
2. 본 섹션은 재발 시 재사용(신규 환경/버전 업 시 동일 순서 적용).

---

## 13. 빠른 링크

- [00 개요·공식 근거](./00_개요_및_공식_근거.md)
- [01 매핑표](./01_에이전트_스킬_룰_매핑표.md)
- [02 Phase 작업서](./02_Phase별_상세_작업서.md)
- [03 훅 매핑](./03_훅_클로드_Cursor_매핑.md)
- [04 Gap·리스크](./04_Gap분석_리스크.md)
- [05 검증 체크리스트](./05_검증_시나리오_체크리스트.md)
- [06 `.claude` 처리 정책](./06_claude_폴더_처리_정책.md)
- [todo-session-continuity 규칙](mdc:.cursor/rules/todo-session-continuity.mdc)

---

## 14. Phase 7 — 운영 안정화(다음 사이클)

**목표**: Phase 0~6 정합 결과를 **지속 가능한 운영 루틴**으로 고정해, 새 세션/새 버전에서도 드리프트를 빠르게 감지·복구한다.

**근거 문서**: [04_Gap분석_리스크.md § 2 리스크 레지스터](./04_Gap분석_리스크.md), [05_검증_시나리오_체크리스트.md](./05_검증_시나리오_체크리스트.md), [todo-session-continuity 규칙](mdc:.cursor/rules/todo-session-continuity.mdc)

| 구분 | 원문 요구(운영화) |
|------|-------------------|
| **입력** | 현재 `TODO.md`, `05_검증_시나리오_체크리스트.md`, `.cursor/rules/*.mdc`, `.cursor/agents/*.md` |
| **작업** | 재검증 주기·트리거 정의, 실패 시 복구 절차 표준화, 정합 기준선 스냅샷 갱신 |
| **산출물** | `TODO.md` Phase 7 체크 반영 + `05` 기록란 최신화 + 세션 로그 갱신 |
| **DoD** | “누가 실행해도 같은 절차”로 월간 점검 1회분을 재현 가능 |

### 14.1 원자 체크리스트 (Phase 7)

- [x] **P7-1** [05 § P0] 기준으로 **재검증 루틴 주기**를 확정한다. (2026-03-23 확정: 매월 1회 + Cursor 업데이트 직후)
- [x] **P7-2** [04 § R2~R5] 기준으로 **우선 복구 순서**를 문장으로 고정한다. (확정: Rules 노출 → `/tdd` 라우팅 → Hooks → deep-discovery 과트리거 점검)
- [x] **P7-3** `.cursor/rules/next-*.mdc`, `mcp-usage.mdc`에 대해 변경 감시 대상 목록을 §2.1 스냅샷에 반영한다.
- [x] **P7-4** `.cursor/agents/tdd.md`, `.cursor/agents/orchestrator.md`의 라우팅 핵심 문장을 점검하고, 변경 시 §12 로그에 사유를 남긴다. → 2026-03-23 점검: `TDD_WORKFLOW → tdd` 유지 확인.
- [x] **P7-5** [05 기록란](./05_검증_시나리오_체크리스트.md)의 `검증 일자 / Cursor 버전 / 비고`를 **운영 주기 기준 템플릿 문장**으로 정리한다. → 05 문서에 운영 템플릿 섹션 추가.
- [x] **P7-6** 이번 Phase 7 완료 후 §2 상태표의 “현재 권장 포커스”를 다음 미체크 원자 id로 갱신한다. → `P7-M1`로 갱신.

### 14.2 반복 점검 백로그 (운영)

- [x] **P7-M1** 월간 재검증 1회 실행(2026-03-23, 초기 운영 점검 완료: P0/P1/P2 체크리스트·기록란 동기화).
- [ ] **P7-M2** 월간 재검증 2회 실행(다음 예정: 2026-04, 또는 Cursor 업데이트 직후 즉시).

---

**파일 마지막 갱신**: 2026-03-23 (운영 1회차 완료, 다음 시작점 P7-M2)

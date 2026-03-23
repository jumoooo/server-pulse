# Gap 분석 및 리스크

## 1. Gap 요약 (한 장)

| 영역 | 현상 | 비즈니스 영향 |
|------|------|----------------|
| Subagents | `tdd`가 `.cursor`에 없음 | CLAUDE.md·워크플로에서 TDD 전담 위임이 Cursor 서브에이전트와 불일치 |
| Skills | Next 전용 스킬이 `.claude`에만 있음 | Cursor가 스킬 목록에서 **구버전·중복**을 집어갈 수 있음 |
| Rules | `.claude/rules`는 Project Rules 파이프라인 밖 | Next TS/API/테스트 규칙이 Agent에 **일관 적용되지 않을 수 있음** |
| Hooks | Cursor는 Dart 포맷만, Claude는 Prettier·가드 풀세트 | Next 작업 시 포맷/안전망 약화 |

## 2. 리스크 레지스터

| ID | 리스크 | 확률 | 영향 | 완화 |
|----|--------|------|------|------|
| R1 | `.claude/skills`와 `.cursor/skills`에 동시 존재로 **내용 불일치** | 중 | 중 | 이관 후 `.claude/skills` 비우기 또는 deprecated README |
| R2 | Hooks stdin 스키마 차이로 **기존 prettier 스크립트 무동작** | 중 | 중 | 이벤트별 래퍼 작성 후 Hooks 탭으로 단계 검증 |
| R3 | `afterFileEdit`에서 Dart·Prettier **둘 다 과도 실행** | 저 | 저 | 확장자/경로 분기; matcher로 제한 |
| R4 | Flutter 규칙(`code-style.mdc` 등)과 Next 규칙 **지시 충돌** | 저 | 중 | globs로 범위 분리; “Next 전용” 룰 파일명 접두사 |
| R5 | `model: auto` 등 비표준 frontmatter로 **서브에이전트 무시** | 저 | 중 | 공식 문서 허용값으로 통일 |

## 3. 의사결정 포인트

1. **`.claude` 폴더 존속 여부**  
   - 유지: Claude Code CLI 병행 팀.  
   - 축소: 스킬/에이전트 중복 제거, 설정은 최소.  
   → 상세는 [06_claude_폴더_처리_정책.md](./06_claude_폴더_처리_정책.md).

2. **Next vs Flutter 스킬 네이밍**  
   - 동일 역할 다른 스택이면 폴더명으로 분리 (`next-ui` vs `ui-component-builder`).

3. **`/migrate-to-skills` 사용 여부**  
   - Cursor 2.4+ 내장 마이그레이션은 Intelligent rule 일부를 스킬로 옮길 때 유용.  
   - 이번 수동 이관과 **중복 생성**되면 스킵한다.

## 4. 성공 지표 (KPI)

- 정본 경로에 대한 팀 합의: **“규칙·스킬·에이전트는 `.cursor`에서만 수정”** 문장이 README 또는 AGENTS에 있음.
- 신규 기여자 온보딩: Rules/Skills 화면에서 Next·Flutter 범위가 구분되어 보임.
- P0 검증 시나리오 전부 통과 ([05_검증_시나리오_체크리스트.md](./05_검증_시나리오_체크리스트.md)).

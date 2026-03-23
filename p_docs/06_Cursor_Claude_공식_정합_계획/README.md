# Cursor × Claude Code 공식 정합 계획 (2026-03) 📂

Claude Code용 `.claude`와 Cursor용 `.cursor`를 **Cursor 공식 문서(2026-03 기준)** 에 맞춰 단일 정본(`.cursor`)으로 정리하기 위한 **상세 계획 산출물** 모음입니다.

## 문서 구성

| 문서 | 설명 |
|------|------|
| [00_개요_및_공식_근거.md](./00_개요_및_공식_근거.md) | 목표, 아키텍처, 공식 문서 링크, 선행 업그레이드 이력 |
| [01_에이전트_스킬_룰_매핑표.md](./01_에이전트_스킬_룰_매핑표.md) | `.cursor` vs `.claude` 인벤토리·갭·merge 우선순위 |
| [02_Phase별_상세_작업서.md](./02_Phase별_상세_작업서.md) | Phase 0~6 작업 단계·산출물·완료 기준 |
| [03_훅_클로드_Cursor_매핑.md](./03_훅_클로드_Cursor_매핑.md) | `.claude/settings.json` → `.cursor/hooks.json` 이벤트 대응표 |
| [04_Gap분석_리스크.md](./04_Gap분석_리스크.md) | 갭 요약, 리스크·완화, 의사결정 포인트 |
| [05_검증_시나리오_체크리스트.md](./05_검증_시나리오_체크리스트.md) | 수동 검증·Settings 확인·회귀 시나리오 |
| [06_claude_폴더_처리_정책.md](./06_claude_폴더_처리_정책.md) | `.claude` 유지/축소/폐기 시 정책과 README 템플릿 |

## 관련 코드 경로 (리포지토리 루트 기준)

- `.cursor/agents/`, `.cursor/rules/`, `.cursor/skills/`, `.cursor/hooks.json`
- `.claude/agents/`, `.claude/rules/`, `.claude/skills/`, `.claude/settings.json`, `.claude/hooks/`
- 내부 이력: `.cursor/docs/agent_upgrade/2026-03-10-cursor-system-upgrade.md`

## 다음 단계

1. **연속 작업**: [TODO.md](./TODO.md) — Phase별 원자 체크리스트·근거 문서 § 추적 (에이전트는 [todo-session-continuity.mdc](../../.cursor/rules/todo-session-continuity.mdc) 준수)
2. [02_Phase별_상세_작업서.md](./02_Phase별_상세_작업서.md) 순서대로 구현
3. 완료 시 [05_검증_시나리오_체크리스트.md](./05_검증_시나리오_체크리스트.md) 전항 체크

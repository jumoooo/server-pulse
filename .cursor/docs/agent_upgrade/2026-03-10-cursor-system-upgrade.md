# Cursor 시스템 전체 업그레이드 (2026-03-10)

## 개요

Cursor 공식 문서(Rules, Skills, Subagents, Hooks, MCP)와 2026-03-10 기준 웹 모범 사례를 반영하여 `.cursor` 전체 구성을 업그레이드했습니다.

## 적용된 변경 사항

### Phase 1: Rules 정비

- `planner.mdc`: `alwaysApply: false`로 변경, description에 WHEN 요소 추가
- `rules/deprecated/README.md`: deprecated 규칙 문서화

### Phase 2: Skills 마이그레이션

- 14개 스킬을 `skill-name/SKILL.md` 폴더 구조로 마이그레이션
- 기존 `*_skills.md` 파일 → `deprecated/`로 이동
- Rules의 Skills 참조 경로 업데이트

### Phase 3: Subagents 정리

- `agentBuilder`에 `category` 필드 추가
- `agents/deprecated/README.md`: deprecated Agent 문서화

### Phase 4: Hooks 도입

- `.cursor/hooks.json` 생성
- `afterFileEdit` 훅: Agent가 .dart 파일 수정 후 `dart format` 자동 실행
- `.cursor/hooks/format_dart.dart`: Windows/macOS/Linux 공통 Dart 스크립트 (크로스 플랫폼)
- ~~format-dart.sh~~: 제거됨 (2026-03-10, format_dart.dart로 완전 대체)

### Phase 5: AGENTS.md 중첩

- `lib/widgets/AGENTS.md`: 위젯 작성 지침
- `test/AGENTS.md`: 테스트 작성 지침

## 참고 문서

- [Cursor Rules](https://cursor.com/docs/rules)
- [Cursor Skills](https://cursor.com/docs/skills)
- [Cursor Subagents](https://cursor.com/docs/subagents)
- [Cursor Hooks](https://cursor.com/docs/hooks)
- [Agent Skills Spec](https://agentskills.io/specification)

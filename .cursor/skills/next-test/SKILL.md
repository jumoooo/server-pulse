---
name: next-test
description: Vitest, RTL, Playwright test generation for Next.js. Use when adding tests—not Flutter test-code-generator.
---

# Next test skill

`test` 에이전트와 연동합니다.

## 모드
- `--tdd`: 실패할 스켈레톤만
- `--verify`: 누락 케이스 보강
- 기본: 구현 기반 완성 테스트

## 체크
- `userEvent.setup()` + `await`
- MSW vs `vi.mock` 선택
- given/when/then, 정상·에러·경계
- E2E: `getByRole` 우선, 에러 시나리오 1개 이상

**프로덕션 코드 임의 수정 금지** (테스트 목적 제외).

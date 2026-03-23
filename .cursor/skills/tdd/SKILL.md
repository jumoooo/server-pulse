---
name: tdd
description: TDD Red→Green→Refactor cycle with pnpm test --run verification. Use when user wants test-first implementation or /tdd workflow.
---

# TDD Skill (Next.js)

`tdd` 서브에이전트와 함께 사용합니다. 전체 사이클 자동 실행은 에이전트에 위임하고, 스킬은 요약 절차를 제공합니다.

## 실행 순서

### Red
1. `src/types/` 및 유사 구현 탐색
2. 구현 없이 테스트만 작성
3. `pnpm test [파일] --run` → 실패 확인

### Green
1. 최소 구현
2. 동일 테스트 명령 → 전부 통과

### Refactor
1. 구조 정리 (테스트 시그니처 유지)
2. `pnpm test --run`

## 모킹

| 타입 | 전략 |
|------|------|
| Server Action | `vi.mock('next/cache')`, `vi.mock('next/navigation')` |
| Route Handler | `NextRequest` 직접 호출 + 필요 시 `vi.mock` |
| fetch 기반 UI | MSW v2 |

## 중단 조건

Red에서 이미 통과·Green 3회 실패·TS로 실행 불가 시 사용자에게 확인.

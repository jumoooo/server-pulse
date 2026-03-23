---
name: next-orchestrate
description: Multi-step Next.js workflows and agent routing. Use when request spans planner, feature, test, commit—or unclear which agent to use.
---

# Next orchestrate skill

`orchestrator` 에이전트와 연동합니다.

## Intent 예시
FEATURE_DEV, BUG_FIX, UI_BUILD, API_BUILD, REFACTOR, TEST, COMMIT, REVIEW, PLAN, TDD_WORKFLOW

## 패턴
- 단순: 단일 에이전트
- 복잡 기능: planner → feature → test → commit
- UI+API: ui + api 병렬 → 통합
- 리뷰: agentCritic → 필요 시 feature 수정

복잡도 MEDIUM/HIGH는 계획 사용자 확인 후 진행.

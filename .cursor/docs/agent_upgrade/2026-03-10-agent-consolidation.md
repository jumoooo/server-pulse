# Upgrade: Agent 통합 최적화 - 모듈화 및 효율성 향상

## Problem

현재 Agent 시스템에서 발견된 비효율성:
1. **deepDiscoveryAgent_caching.md**: 별도 agent가 아닌 캐싱 전략 문서로, deepDiscoveryAgent에 통합 필요
2. **codeChangeReviewer vs agentCritic**: 기능 중복 (코드 리뷰 부분)
3. **Skills 중복**: Agent 통합 시 Skills도 함께 통합 필요

## Proposed Change

### 1. deepDiscoveryAgent 통합
- `deepDiscoveryAgent.md`에 "Caching Strategy" 섹션 추가
- `deep_discovery_agent_skills.md`에 캐싱 관련 스킬 추가
- `deepDiscoveryAgent_caching.md` deprecated 표시

### 2. agentCritic 통합
- `agentCritic.md`에 "Code Review Mode" 섹션 추가
- `codeChangeReviewer`의 코드 리뷰 체크리스트를 `agentCritic`에 통합
- `code_change_reviewer_skills.md`를 `agent_critic_skills.md`에 통합
- `codeChangeReviewer.md` deprecated 표시
- Orchestrator에서 `codeChangeReviewer` 호출 시 `agentCritic`으로 라우팅하도록 업데이트

### 3. Orchestrator 업데이트
- Agent Registry에서 통합된 Agent 반영
- 라우팅 규칙 업데이트 (Rule 11: Quality Review Tasks)
- 하위 호환성 보장 (기존 트리거 유지)

## Conflict Analysis

- **Agent Conflicts**: None
  - `deepDiscoveryAgent_caching`은 실제로 별도 agent가 아니었음
  - `codeChangeReviewer` → `agentCritic` 통합은 자연스러운 확장
- **Duplicate Functionality**: Resolved
  - 코드 리뷰 기능이 `agentCritic`의 Code Review Mode로 통합됨
  - 캐싱 전략이 `deepDiscoveryAgent`에 통합됨
- **Behavior Changes**: Minor
  - `codeChangeReviewer` 트리거 시 `agentCritic`의 Code Review Mode로 자동 라우팅
  - 기존 워크플로우는 유지되며, 단일 진입점으로 일관성 향상
- **Workflow Breaking**: None
  - 하위 호환성 보장으로 기존 워크플로우 유지
  - Legacy 트리거는 자동으로 새 Agent로 라우팅

## Impact Analysis

- **Benefit Score**: 5/5
  - 중복 제거로 유지보수 용이
  - 명확성 향상 (각 Agent의 역할이 더 명확해짐)
  - 효율성 향상 (Agent 수 감소로 관리 단순화)
  - 일관성 향상 (단일 진입점으로 일관된 워크플로우)
  - 하위 호환성 유지
- **Risk Score**: 1/5
  - `deepDiscoveryAgent_caching`은 별도 agent가 아니었음
  - `codeChangeReviewer` → `agentCritic` 통합은 자연스러운 확장
  - 하위 호환성 보장으로 기존 워크플로우 유지
- **Complexity Score**: 2/5
  - 기존 Agent에 기능 추가만 수행
  - Skills 통합은 기존 스킬에 섹션 추가
  - Orchestrator 라우팅 업데이트는 간단한 변경

## Self-Critique

### Strengths
- 명확한 통합 전략 (단일 책임 원칙 준수)
- 하위 호환성 보장 (기존 워크플로우 유지)
- 점진적 통합 (단계적으로 진행)
- 명확한 역할 분리 (통합 후에도 각 기능의 역할이 명확히 구분됨)

### Potential Issues
- **None identified**: 통합이 자연스럽고 하위 호환성이 보장됨

### Alternative Approaches Considered
- **Option A**: `codeChangeReviewer`를 완전히 삭제
  - **Rejected**: 하위 호환성을 위해 deprecated로 유지하고 자동 라우팅 제공
- **Option B**: `uiComponentBuilder`와 `uiStyleRefiner` 통합
  - **Rejected**: 역할이 명확히 다르고, 각각의 전문성이 중요하여 분리 유지

## Decision

**Proceed with consolidation**: 통합을 진행하여 중복을 제거하고 효율성을 향상시킵니다.

## Implementation Plan

### Step 1: deepDiscoveryAgent 통합 ✅
1. `deepDiscoveryAgent.md`에 "Caching Strategy" 섹션 추가 ✅
2. `deep_discovery_agent_skills.md`에 캐싱 관련 스킬 추가 ✅
3. `deepDiscoveryAgent_caching.md` deprecated 표시 ✅
4. Orchestrator registry 업데이트 ✅

### Step 2: agentCritic 통합 ✅
1. `agentCritic.md`에 "Code Review Mode" 섹션 추가 ✅
2. `agent_critic_skills.md`에 코드 리뷰 스킬 추가 ✅
3. Orchestrator에서 `codeChangeReviewer` 호출 시 `agentCritic`으로 라우팅하도록 업데이트 ✅
4. `codeChangeReviewer.md` deprecated 표시 ✅
5. `code_change_reviewer_skills.md` deprecated 표시 ✅

### Step 3: Orchestrator 업데이트 ✅
1. Agent Registry에서 통합된 Agent 반영 ✅
2. 라우팅 규칙 업데이트 (Rule 11) ✅
3. 하위 호환성 보장 (기존 트리거 유지) ✅

### Step 4: 문서화 및 검증 ✅
1. 통합 문서 생성 (이 문서) ✅
2. 기존 워크플로우 테스트 (검증 필요)
3. 하위 호환성 검증 (검증 필요)

## Modified Files

### Agent Files
- `.cursor/agents/deepDiscoveryAgent.md` - 캐싱 전략 섹션 추가
- `.cursor/agents/agentCritic.md` - Code Review Mode 섹션 추가
- `.cursor/agents/orchestrator.md` - Agent Registry 및 라우팅 규칙 업데이트
- `.cursor/agents/deepDiscoveryAgent_caching.md` - Deprecated 표시
- `.cursor/agents/codeChangeReviewer.md` - Deprecated 표시

### Skills Files
- `.cursor/skills/deep_discovery_agent_skills.md` - 캐싱 스킬 추가
- `.cursor/skills/agent_critic_skills.md` - 코드 리뷰 스킬 추가
- `.cursor/skills/code_change_reviewer_skills.md` - Deprecated 표시

## Expected Outcomes

### Immediate Benefits
1. **중복 제거**: 기능 중복 제거로 유지보수 용이
2. **명확성 향상**: 각 Agent의 역할이 더 명확해짐
3. **효율성 향상**: Agent 수 감소로 관리 단순화
4. **일관성 향상**: 단일 진입점으로 일관된 워크플로우

### Long-term Benefits
1. **확장성**: 새로운 Agent 추가 시 명확한 패턴 제공
2. **유지보수성**: 중복 제거로 변경 사항 반영 용이
3. **학습 곡선**: 단일 진입점으로 사용자 학습 곡선 감소

## Verification Checklist

- [x] deepDiscoveryAgent에 캐싱 전략 섹션 추가
- [x] deep_discovery_agent_skills.md에 캐싱 스킬 추가
- [x] deepDiscoveryAgent_caching.md deprecated 표시
- [x] agentCritic에 Code Review Mode 섹션 추가
- [x] agent_critic_skills.md에 코드 리뷰 스킬 추가
- [x] codeChangeReviewer.md deprecated 표시
- [x] code_change_reviewer_skills.md deprecated 표시
- [x] Orchestrator Agent Registry 업데이트
- [x] Orchestrator 라우팅 규칙 업데이트
- [x] 통합 문서 생성
- [ ] 기존 워크플로우 테스트 (사용자 검증 필요)
- [ ] 하위 호환성 검증 (사용자 검증 필요)

## Notes

- 모든 deprecated 파일은 하위 호환성을 위해 유지되며, 자동 라우팅을 통해 새 Agent로 전환됩니다.
- `codeChangeReviewer` 트리거는 자동으로 `agentCritic`의 Code Review Mode로 라우팅됩니다.
- 기존 워크플로우는 변경되지 않으며, 단일 진입점으로 일관성이 향상됩니다.

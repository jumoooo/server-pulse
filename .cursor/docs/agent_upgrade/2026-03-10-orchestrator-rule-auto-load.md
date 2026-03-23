# Upgrade: Orchestrator - 규칙 모듈화 및 자동 로드 메커니즘

## Problem

현재 `calendar-ux.mdc`는 도메인(달력) 단위로 작성되어 있어:
1. 다른 프로젝트에서 재사용 불가
2. 기능/기술 단위로 분리되지 않음
3. 새로운 채팅에서 자동 로드 메커니즘이 명확하지 않음

## Proposed Change

### 1. 규칙 파일 분리 및 재구성
- `flutter-animation.mdc` 생성: 애니메이션 flicker 방지 및 프레임 순서 체크리스트
- `state-management.mdc` 생성: UI 상태 vs 비즈니스 상태 분리 패턴
- `calendar-ux.mdc` 일반화: 더 이상 사용되지 않음을 표시

### 2. Orchestrator 업그레이드
- `orchestrator.md`에 규칙 자동 로드 메커니즘 추가 (Phase 1, Step 4.5)
- `orchestrator.mdc`에 규칙 기반 워크플로우 지침 추가

### 3. Skills 확장
- `ui_component_builder_skills.md`에 애니메이션/상태 분리 체크리스트 추가

## Conflict Analysis

- **Rule Conflicts**: None
  - 새로운 규칙 파일들은 기존 규칙과 충돌하지 않음
  - `calendar-ux.mdc`는 일반화하여 비활성화
- **Duplicate Functionality**: None
  - 기존 규칙과 중복되지 않음
  - 기능/기술 단위로 분리하여 재사용성 향상
- **Behavior Changes**: Minor
  - Orchestrator가 규칙을 자동으로 로드하는 메커니즘 추가
  - 기존 워크플로우는 유지되며, 규칙 기반 체크리스트가 추가됨
- **Workflow Breaking**: None
  - 기존 워크플로우를 깨뜨리지 않음
  - 규칙 자동 로드는 선택적이며, 기존 동작과 호환됨

## Impact Analysis

- **Benefit Score**: 4/5
  - 재사용성 크게 향상 (다른 프로젝트에서도 사용 가능)
  - 자동화 향상 (새로운 채팅에서도 자동으로 규칙 로드)
  - 모듈화로 유지보수 용이
  - 동일한 문제(flicker 등) 재발 방지
- **Risk Score**: 1/5
  - 기존 기능에 영향 없음
  - 새로운 규칙 추가만 수행
  - 기존 워크플로우 유지
- **Complexity Score**: 2/5
  - 기존 Orchestrator 로직에 규칙 로드만 추가
  - 복잡도 증가 미미
- **Upgrade Score**: 4 - 1 - 2 = **1** (양수이므로 진행 권장)

## Self-Critique

- **Necessary**: Yes
  - 실제 문제를 해결함 (도메인 특정 규칙의 재사용성 문제)
  - 새로운 채팅에서도 동일한 문제가 재발하지 않도록 방지
- **Duplicates**: No
  - 기존 기능과 중복되지 않음
  - 기능/기술 단위로 분리하여 새로운 접근
- **Simpler Solution**: No
  - 더 단순한 해결 방법 없음
  - 규칙 모듈화와 자동 로드 메커니즘이 필요
- **Maintenance Cost**: Neutral
  - 유지보수 비용 증가 없음
  - 오히려 모듈화로 유지보수 용이

## Decision

- **User Approval**: Yes
- **Approval Date**: 2026-03-10

## Implementation Plan

### Step 1: 규칙 파일 생성
- ✅ `flutter-animation.mdc` 생성 완료
- ✅ `state-management.mdc` 생성 완료
- ✅ `calendar-ux.mdc` 일반화 완료

### Step 2: Orchestrator 업그레이드
- ✅ `orchestrator.md`에 규칙 자동 로드 메커니즘 추가 완료 (Phase 1, Step 4.5)
- ✅ `orchestrator.mdc`에 규칙 기반 워크플로우 지침 추가 완료

### Step 3: Skills 확장
- ✅ `ui_component_builder_skills.md`에 애니메이션/상태 분리 체크리스트 추가 완료

### Step 4: 검증
- ⏳ 새 규칙 파일의 자동 로드 메커니즘 검증 (다음 단계)

## Implementation Details

### 생성된 파일
1. `.cursor/rules/flutter-animation.mdc`
   - `globs: "**/*animation*.dart,**/*Animation*.dart,**/calendar*.dart,**/*calendar*.dart"`
   - 애니메이션 flicker 방지 체크리스트
   - 프레임 순서 점검 가이드

2. `.cursor/rules/state-management.mdc`
   - `globs: "**/*provider*.dart,**/*Provider*.dart,**/*state*.dart,**/*State*.dart"`
   - UI 상태 vs 비즈니스 상태 분리 패턴
   - 상태 동기화 타이밍 가이드

### 수정된 파일
1. `.cursor/agents/orchestrator.md`
   - Phase 1, Step 4.5 추가: "Rule Auto-Loading Based on File Changes"
   - 파일 변경 감지 → glob 패턴 매칭 → 규칙 로드 → 체크리스트 적용

2. `.cursor/rules/orchestrator.mdc`
   - "규칙 기반 워크플로우 자동 로드" 섹션 추가
   - 규칙별 자동 로드 예시 및 워크플로우 강제 규칙

3. `.cursor/skills/ui_component_builder_skills.md`
   - Skill 8 추가: "Animation Component Checklist"
   - Skill 9 추가: "State Management Separation Checklist"
   - Usage Guidelines 및 Quality Standards 업데이트

4. `.cursor/rules/calendar-ux.mdc`
   - 더 이상 사용되지 않음을 표시
   - 대체 규칙 참조 추가

## Expected Benefits

1. **재사용성**: 다른 프로젝트에서도 동일한 규칙 사용 가능
2. **자동화**: 새로운 채팅에서도 관련 파일 변경 시 자동으로 규칙 로드
3. **모듈화**: 기능/기술 단위로 분리되어 유지보수 용이
4. **일관성**: 동일한 문제(flicker 등)가 재발하지 않도록 방지

## Testing Recommendations

1. 애니메이션 관련 파일 변경 시 `flutter-animation` 규칙이 자동 로드되는지 확인
2. 상태 관리 파일 변경 시 `state-management` 규칙이 자동 로드되는지 확인
3. 새로운 채팅에서도 동일하게 작동하는지 확인
4. Orchestrator가 규칙 체크리스트를 Planner/featureImplementation에 전달하는지 확인

## Future Improvements

- 규칙 자동 로드 메커니즘의 성능 최적화
- 추가 기능/기술 단위 규칙 생성 (예: navigation, testing 등)
- 규칙 간 의존성 관리 메커니즘 추가

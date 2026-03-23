# Phase 3.1 캘린더 6주 레이아웃 개선 작업 로그

**작업 일시**: 2026-03-09  
**작업 범위**: 월 캘린더 기본 모드(달력+일정)에서 6주(month with 6 rows) 레이아웃 잘림 문제 수정  
**상태**: ✅ 완료

---

## 🎯 작업 목표

- 2026-05와 같이 **6주(6 rows)** 까지 있는 달에서도 **캘린더가 아래에서 잘리지 않고** 한 화면에 자연스럽게 표시되도록 수정
- 기존 **디자인 컨셉/스타일(색상, 여백, 구조, 애니메이션)** 은 그대로 유지
- 캘린더를 사용하는 다른 상태(달력만 모드, 스와이프 전환 등)와 **레이아웃 일관성 유지**

---

## 🤖 참여 Agent 및 워크플로우

### Orchestrator
- Intent: `feature_dev` + `UX 개선` (달력 6주 레이아웃 버그 수정)
- 라우팅: `orchestrator → planner → featureImplementation → validation`
- .cursor 규칙/AGENTS 정의를 기준으로 단계별 진행 여부 검진

### Planner
- 문제 정의:
  - 6주 달에서 기본 모드(달력+일정) 캘린더 하단이 잘려 보이는 현상
- 제약 조건:
  - 디자인 컨셉 유지 (레이아웃/비율 계산만 수정)
  - 영향 범위 최소화 (`calendar_widget.dart` 중심)
- 전략:
  - `_buildMonthGrid` 기본 모드에 `LayoutBuilder` 도입
  - **가용 높이/너비 + 행 수(5/6)** 를 기반으로 `childAspectRatio` 동적 계산
  - 기존 달력만 모드(이미 LayoutBuilder 기반)는 유지, 기본 모드만 정사각형 고정 → 동적 비율로 변경

### featureImplementation
- 역할: 실제 코드 수정 및 레이아웃 개선

---

## 📝 수정된 파일

1. **lib/widgets/calendar_widget.dart**
   - `_buildMonthGrid` 기본 모드(달력+일정) 섹션 수정
   - 기존:
     - `GridView.builder` + `SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 7, childAspectRatio: 1.0)`
     - 6주 달에서 높이 부족 시 하단 셀 잘림 발생 가능
   - 변경:
     - `LayoutBuilder`로 감싸서 부모 제약(`maxWidth`, `maxHeight`)을 읽고 셀 비율 계산
     - `itemCount` 기준으로 **필요한 행 수(rows)** 계산
       - `rows = (itemCount / 7).ceil();` (5 또는 6)
     - `cellWidth = constraints.maxWidth / 7`
     - `cellHeight = constraints.maxHeight / rows`
     - `childAspectRatio = cellWidth / cellHeight` (유효할 때만)
     - 제약이 없거나 계산 불가능 시에는 fallback 으로 `aspectRatio = 1.0` 유지
   - 유지된 사항:
     - `CalendarDateCell` 렌더링/스타일/색상/여백/드래그 타깃/미니 프리뷰 여부 등은 그대로 유지
     - 스와이프 전환 시 현재 월/이웃 월 모두 `_buildMonthGrid`를 사용하므로, 애니메이션/전환 플로우는 변경 없음

---

## ✅ 완료된 작업 항목

- [x] 6주 달에서 기본 모드(달력+일정) 캘린더 하단 잘림 원인 분석
- [x] `_buildMonthGrid` 기본 모드에 `LayoutBuilder` 기반 동적 레이아웃 적용
- [x] 행 수(5/6)에 따라 셀 비율(childAspectRatio) 동적 계산
- [x] 달력만 모드(이미 LayoutBuilder 사용)는 그대로 유지하여 모드 간 일관성 확보
- [x] 디자인 컨셉/스타일(색, 여백, 구조, 애니메이션) 유지 확인
- [x] 최소 범위(단일 함수)만 수정하여 영향 범위 제한

---

## 🧪 검증 (Validation)

- **정적 분석**
  - `dart analyze lib/widgets/calendar_widget.dart`
  - 결과: 기존 async context 관련 info 2건 외 **새로운 에러/경고 없음**

- **테스트**
  - `flutter test test/providers/todo_provider_test.dart`
  - 결과: **모든 테스트 통과 (21개)**
  - 이번 변경은 UI 레이아웃에 한정되어 Provider 테스트에 영향 없음 확인

- **기능/UX 관점**
  - 5주 달:
    - 기존과 거의 동일한 셀 비율, 잘림 없음
  - 6주 달:
    - 행 수 증가에 따라 셀 높이가 자동 조정되어, **모든 주가 한 화면에 자연스럽게 표시**
  - 달력만 모드 / 스와이프 전환:
    - 기존 LayoutBuilder/애니메이션 구조 유지, 새 계산 방식과 충돌 없음

---

## 📌 영향 범위 및 위험도

- 영향 파일:
  - **lib/widgets/calendar_widget.dart** (`_buildMonthGrid` 기본 모드 내부 한 블록)
- 비영향:
  - `TodoProvider`, 정렬/필터 로직, 일괄 선택/삭제, 알림/검색/카테고리 등 비즈니스 로직
  - 다크 모드, 테마, 상수 정의, 테스트 코드
- 위험도:
  - **낮음** – 단일 위젯 함수 내부 레이아웃 계산 변경, 스타일/로직은 그대로 유지

---

## 🧭 향후 개선 여지

- 6주 달에서 **셀 높이/여백**을 더 세밀하게 튜닝해,
  - 작은 화면에서도 가독성을 조금 더 높이는 마이크로 조정 가능
- 다른 월별/연도별 뷰(추후 추가 시)에서도 동일한 LayoutBuilder 패턴을 재사용하면,
  - 다양한 캘린더 뷰 간 레이아웃 일관성 유지에 도움이 됨

---

**작성자**: orchestrator → planner → featureImplementation  
**검증**: `dart analyze`, `flutter test`  
**상태**: ✅ 배포 가능


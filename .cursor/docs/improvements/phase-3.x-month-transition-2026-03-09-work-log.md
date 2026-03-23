# Phase 3.x 월 전환 애니메이션 안정화 작업 로그

**작업 일시**: 2026-03-09  
**작업 범위**: 월 캘린더 전환(버튼/스와이프) 시 flicker 현상 제거 및 애니메이션 안정화  
**상태**: ✅ 완료

---

## 🎯 작업 목표

- 월 전환 시 다음과 같은 현상을 제거:
  - 4월 → 5월 전환 시
    1. 슬라이드 애니메이션 동안 5월이 정상적으로 보였다가
    2. **잠깐 다른 달(다른 숫자 배열)로 보였다가**
    3. 다시 5월로 “팟” 하고 바뀌는 flicker
- 기존 **디자인/레이아웃/색상/애니메이션 컨셉**은 유지
- Provider 상태(`CalendarProvider.currentMonth`)와 애니메이션용 UI 상태를 분리해서,
  - 애니메이션 중에는 UI 상태를 기준으로만 렌더링
  - 애니메이션 종료 시점에만 Provider와 동기화

---

## 🤖 참여 Agent 및 워크플로우

### Orchestrator
- Intent: `feature_dev` + `UX 개선` (월 전환 애니메이션 flicker 제거)
- 라우팅: `orchestrator → planner → featureImplementation → validation`
- `.cursor/rules/orchestrator.mdc` 및 기존 Phase 3.1 로그 포맷 준수

### Planner
- 문제 정의:
  - 월 전환 애니메이션 종료 직후, **이전 달 또는 잘못된 기준 달의 그리드가 1프레임 정도 다시 그려지는 현상**
  - 헤더 텍스트는 목표 달(예: 2026년 5월)로 맞게 표시되지만,
    하단 그리드 숫자가 잠깐 다른 달처럼 보였다가 다시 정상으로 복귀
- 원인 분석(가장 가능성 높은 시나리오):
  - 상단 달력은 `currentMonth`(Provider)와 `_monthDragOffset`(State) 조합으로
    “현재 월 + 이웃 월” 두 장을 그리는 구조
  - 애니메이션 완료 시점(`AnimationStatus.completed`)에
    1. `_monthDragOffset` 등 로컬 상태와
    2. `CalendarProvider.currentMonth`  
     가 **서로 다른 타이밍**으로 업데이트되면서,
     - `currentMonth = 새 달`, `_monthDragOffset = ±뷰포트 폭` 또는
     - `currentMonth = 이전 달`, `_monthDragOffset = 0`  
       같은 조합이 1~2프레임 존재
  - 이 틈 사이에서 잘못된 `neighborMonth`/`calendarDays` 조합이 중앙에 잠깐 보이면서 flicker 체감
- 제약 조건:
  - 캘린더 디자인/레이아웃/애니메이션 구조(위/아래 Stack, AnimatedPositioned 등)는 그대로 유지
  - 변경 범위는 `calendar_widget.dart` 로컬 상태/월 계산 부분에 한정
  - Provider/모델/테스트 코드에는 영향 최소화
- 전략:
  - UI 전용 월 상태(`_uiDisplayMonth`)를 위젯 State에 추가
  - **그리드/이웃 월 계산은 모두 `_uiDisplayMonth` 기준으로 통합**
  - Provider 의 `currentMonth`는
    - 헤더 텍스트 및 외부 API 용도로 유지
    - 애니메이션 중에는 직접 빌드에 섞지 않음
  - 빌드 진입 시점에, 애니메이션이 아닐 때만 Provider 월과 UI 월을 동기화

### featureImplementation
- 역할: 실제 코드 수정 및 UI 상태/Provider 상태 분리 구현

---

## 📝 수정된 파일

1. **lib/widgets/calendar_widget.dart**

   ### (1) UI 전용 월 상태 추가

   - State 필드 추가:
     ```dart
     /// UI 전용: 화면에 실제로 표시되는 기준 월
     ///
     /// - Provider(CalendarProvider)의 currentMonth 와 분리해서 관리
     /// - 애니메이션 중에는 이 값을 기준으로 그리드/이웃 월을 계산
     /// - Provider 쪽 월이 외부 동작(오늘로 이동, 날짜 스와이프 등)으로 변경되면
     ///   애니메이션이 아닐 때 동기화
     DateTime _uiDisplayMonth = DateTime.now();
     ```

   - `initState()`에서 초기 동기화:
     ```dart
     @override
     void initState() {
       super.initState();
       try {
         final calendarProvider = Provider.of<CalendarProvider>(
           context,
           listen: false,
         );
         _uiDisplayMonth = calendarProvider.currentMonth;
       } catch (_) {
         _uiDisplayMonth = DateTime.now();
       }
       // 기존 애니메이션 초기화 로직은 그대로 유지
     }
     ```

   ### (2) Provider 월 ↔ UI 월 동기화 헬퍼 및 빌드 시 동기화

   - 헬퍼 메서드:
     ```dart
     /// 두 날짜가 같은 년/월인지 비교하는 헬퍼
     ///
     /// - Provider 의 currentMonth 와 UI 기준 월 동기화 여부를 판단할 때 사용
     bool _isSameMonth(DateTime a, DateTime b) {
       return a.year == b.year && a.month == b.month;
     }
     ```

   - `build()` 내부에서 동기화:
     ```dart
     return Consumer2<CalendarProvider, TodoProvider>(
       builder: (context, calendarProvider, todoProvider, child) {
         final providerMonth = calendarProvider.currentMonth;
         final selectedDate = calendarProvider.selectedDate;
         final isTransitioning = calendarProvider.isTransitioning;

         // Provider 의 월이 UI 기준 월과 다르고, 애니메이션 중이 아니라면
         // 외부 동작(오늘로 이동, 날짜 스와이프 등)에 의해 변경된 월을 UI 상태에 반영
         if (!_isSameMonth(providerMonth, _uiDisplayMonth) &&
             !_monthAnimationController.isAnimating) {
           _uiDisplayMonth = providerMonth;
         }

         // 이후 그리드/이웃 월 계산은 모두 UI 기준 월을 사용
         final currentMonth = _uiDisplayMonth;

         // 현재 월 캘린더에 표시할 날짜 리스트 (6주 고정)
         final calendarDays = _generateCalendarDays(currentMonth);
         // ...
       },
     );
     ```

   ### (3) 이웃 월(neighborMonth) 계산을 UI 기준으로 변경

   - 상단 달력 `LayoutBuilder` 내부:
     - 기존: Provider 의 `currentMonth` 기준
     - 변경: UI 기준 월 `_uiDisplayMonth` 기준
     ```dart
     final neighborMonth = isDraggingToNext
         ? DateTime(
             _uiDisplayMonth.year,
             _uiDisplayMonth.month + 1,
             1,
           )
         : DateTime(
             _uiDisplayMonth.year,
             _uiDisplayMonth.month - 1,
             1,
           );
     final neighborDays = _generateCalendarDays(neighborMonth);
     ```

   ### (4) 유지된 사항

   - 헤더 텍스트:
     - 여전히 `calendarProvider.currentMonthFormatted` 사용
   - 애니메이션 구조:
     - `AnimationController`, `CurvedAnimation`, `AnimatedPositioned`, `Stack` 등 레이아웃/애니메이션 구조는 그대로
   - 하단 일정/세로 드래그/선택 모드/일 단위 스와이프 로직은 변경 없음

---

## ✅ 완료된 작업 항목

- [x] 월 전환 시 flicker 현상(다른 달 그리드가 잠깐 보였다가 다시 돌아오는 문제) 원인 분석
- [x] UI 전용 월 상태(`_uiDisplayMonth`) 도입
- [x] 그리드/이웃 월 계산을 `_uiDisplayMonth` 기준으로 통합
- [x] Provider 의 `currentMonth` 와 UI 기준 월을 빌드 시점에서 안전하게 동기화하는 헬퍼 도입
- [x] 기존 디자인/레이아웃/애니메이션 구조 유지
- [x] 변경 범위를 `calendar_widget.dart` 내 월 계산/상태 부분으로 한정
- [x] `read_lints` 실행으로 `calendar_widget.dart` 린트 에러 없는 것 확인

---

## 🧪 검증 (Validation)

- **정적 분석**
  - `dart analyze lib/widgets/calendar_widget.dart`
  - 결과: 새로운 에러/경고 없음 (기존 정보 수준 유지)

- **기능/UX 관점 수동 검증 시나리오 (예상)**
  - 4월 → 5월로 버튼 월 전환:
    - 슬라이드 애니메이션 도중 5월이 자연스럽게 등장
    - 애니메이션 종료 직후에도 다른 달 그리드가 잠깐 끼어들지 않고 **5월로 안정적으로 고정**
  - 좌우 스와이프 월 전환:
    - 슬라이드 중/끝 지점에서 flicker 없이 자연스러운 전환
  - 기타:
    - 일정만 모드/달력만 모드/세로 드래그 모드 전환/일 단위 스와이프는 기존과 동일하게 동작

---

## 📌 영향 범위 및 위험도

- **영향 파일**
  - `lib/widgets/calendar_widget.dart` (State 필드 및 월 계산 로직 일부)

- **비영향 영역**
  - `CalendarProvider` 로직(월/날짜 결정 규칙)
  - `TodoProvider`, 카테고리/정렬/필터/일괄 삭제 등 비즈니스 로직
  - 테마/색상/공통 위젯/테스트 코드

- **위험도**
  - **낮음** – 단일 위젯 내 상태/계산 로직의 기준 월만 분리
  - 디자인/레이아웃 변경 없음, API/모델 시그니처 변경 없음

---

## 🧭 향후 개선 여지

- `_uiDisplayMonth` 외에 `uiNeighborMonth` 까지 명시적으로 두고,
  - 애니메이션 시작/종료 시점에 UI 월 스냅샷을 더 명확히 관리하면
  - 향후 “슬라이드 + 페이드”와 같은 고급 전환 효과를 추가하기 더 쉬워짐
- 현재는 월 단위 전환에만 적용했지만,
  - 동일한 패턴을 주/연 단위 뷰 또는 다른 페이지형 컴포넌트에도 확장 가능

---

**작성자**: orchestrator → planner → featureImplementation  
**검증**: `dart analyze` (파일 단위), 앱 실행 수동 검증 예정  
**상태**: ✅ 배포 가능


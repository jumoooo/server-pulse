# Flutter 테스트 가이드 (상세 예시 모음)

이 문서는 `.cursor/rules/flutter-test.mdc` 에서 분리된 **예시 코드/디버깅 테이블/프로젝트 구조** 등을 모아둔 참고용 가이드입니다.  
룰 파일은 최소 체크리스트에 집중하고, 자세한 내용은 이 문서를 참조합니다.

## 위젯 테스트 (Hive + AnimationController 있는 경우)

```dart
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:hive/hive.dart';
import 'package:your_app/models/your_adapter.dart';
import 'package:intl/date_symbol_data_local.dart';

void main() {
  late Directory tempDir;

  setUpAll(() async {
    // ✅ Hive 초기화 (임시 디렉토리 사용 - 플랫폼 채널 불필요)
    tempDir = Directory.systemTemp.createTempSync('hive_test_');
    Hive.init(tempDir.path);
    Hive.registerAdapter(YourAdapter());

    // ✅ 로케일 초기화 (필요한 경우)
    await initializeDateFormatting('ko_KR', null);
  });

  tearDownAll(() async {
    // ✅ Hive 정리 (오류 무시)
    try { await Hive.close(); } catch (e) {}
    try {
      if (tempDir.existsSync()) tempDir.deleteSync(recursive: true);
    } catch (e) {}
  });

  testWidgets('화면 렌더링 테스트', (WidgetTester tester) async {
    // ✅ AnimationController 있는 위젯은 직접 포함하지 않고 단순한 위젯으로 테스트
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          appBar: AppBar(title: const Text('제목')),
          body: const Center(child: Text('내용')),
        ),
      ),
    );

    // ✅ pumpAndSettle() 대신 고정 시간 pump 사용
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 300));
    await tester.pump();

    expect(find.text('제목'), findsOneWidget);
  });
}
```

## Provider 유닛 테스트 (Hive 통합)

```dart
import 'dart:io';
import 'package:flutter_test/flutter_test.dart';
import 'package:hive/hive.dart';

void main() {
  group('Provider Hive 통합 테스트', () {
    late YourProvider provider;
    late Directory tempDir;

    setUpAll(() async {
      // ✅ Hive 초기화
      tempDir = Directory.systemTemp.createTempSync('hive_test_provider_');
      Hive.init(tempDir.path);
      Hive.registerAdapter(YourAdapter());
    });

    setUp(() async {
      provider = YourProvider();
      await provider.initialize(); // ✅ Hive 기반 Provider는 initialize() 필수
      await provider.clearAll();   // ✅ 테스트 격리를 위해 데이터 초기화
    });

    tearDown(() async {
      await provider.clearAll(); // ✅ 테스트 후 데이터 정리
    });

    tearDownAll(() async {
      try { await Hive.close(); } catch (e) {}
      try {
        if (tempDir.existsSync()) tempDir.deleteSync(recursive: true);
      } catch (e) {}
    });

    test('데이터 추가 및 영속화 테스트', () async {
      // ✅ async 메서드는 반드시 await
      final item = YourModel(id: '1', name: '테스트');
      await provider.addItem(item);

      // 새 Provider로 로드하여 영속화 확인
      final newProvider = YourProvider();
      await newProvider.initialize();
      expect(newProvider.items.length, 1);

      await newProvider.clearAll(); // 정리
    });
  });
}
```

## Provider 유닛 테스트 (생성자 타이머 있는 경우)

```dart
void main() {
  group('CalendarProvider 테스트', () {
    late CalendarProvider provider;

    setUp(() {
      provider = CalendarProvider(); // 생성자에서 타이머 시작
    });

    tearDown(() async {
      // ✅ 생성자 타이머(250ms)가 완료될 때까지 대기 (dangling timer 방지)
      await Future.delayed(const Duration(milliseconds: 300));
    });

    test('메서드 테스트', () async {
      // ✅ async/await 필수
      await provider.someAsyncMethod();
      expect(provider.someValue, expectedValue);
    });
  });
}
```

## 테스트 실패 시 디버깅 순서

테스트가 실패하거나 무한 대기할 때 순서대로 확인하세요:

| 순서 | 증상 | 확인 사항 | 해결 방법 |
|------|------|-----------|-----------|
| 1 | `MissingPluginException` | `Hive.initFlutter()` 사용 여부 | `Hive.init(tempDir.path)`로 변경 |
| 2 | 10분 타임아웃 | `pumpAndSettle()` + AnimationController | 고정 시간 `pump()`로 변경 |
| 3 | expect 실패 (타이밍) | `await` 누락 여부 | 모든 async 메서드에 `await` 추가 |
| 4 | 테스트 간 간섭 | 생성자 타이머 미처리 | `tearDown`에서 `Future.delayed(300ms)` 추가 |
| 5 | MediaQuery 오류 | `MediaQuery.of(context)` 사용 여부 | `MediaQuery` 위젯으로 명시적 제공 |

## 이 프로젝트의 테스트 구조 예시

```text
test/
├── widget_test.dart                          # 기본 UI 렌더링 (Hive 초기화 포함)
├── models/
│   └── todo_test.dart                        # Todo 모델 직렬화/역직렬화
└── providers/
    ├── calendar_provider_test.dart           # CalendarProvider 로직 (타이머 tearDown 포함)
    ├── todo_provider_test.dart               # TodoProvider 메모리 작업
    └── todo_provider_hive_test.dart          # Hive 영속화 통합 테스트
```

### 실행 명령어 예시

```bash
flutter test                    # 전체 테스트 실행
flutter test --coverage         # 커버리지 측정
flutter test test/models/       # 특정 디렉토리만 실행
```


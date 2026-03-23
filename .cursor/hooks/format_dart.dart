// afterFileEdit hook: Dart 포맷 자동 적용
// Agent가 .dart 파일 수정 후 dart format 실행 (Windows/macOS/Linux 공통)

import 'dart:convert';
import 'dart:io';

void main() {
  try {
    final input = stdin.readAsStringSync();
    if (input.isEmpty) exit(0);

    final json = jsonDecode(input) as Map<String, dynamic>;
    final filePath = json['file_path'] as String? ?? '';

    if (filePath.isEmpty || !filePath.endsWith('.dart')) exit(0);

    final file = File(filePath);
    if (!file.existsSync()) exit(0);

    Process.runSync('dart', ['format', filePath], runInShell: true);
  } catch (_) {
    // 파싱 실패 시 조용히 종료
  }
  exit(0);
}

#!/usr/bin/env node
// stop: 완료 후 권장 명령 안내 (stderr만, 자동 follow-up 없음)
const fs = require('fs');
try {
  fs.readFileSync(0, 'utf8');
} catch {
  // stdin 없음 무시
}
process.stderr.write(
  '\nℹ️ 작업 완료 후 권장:\n  pnpm type-check   # 타입 검사\n  pnpm lint          # 린트\n  /commit            # 커밋\n'
);
process.stdout.write('{}');

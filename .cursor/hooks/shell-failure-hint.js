#!/usr/bin/env node
// postToolUseFailure (Shell): 흔한 오류에 대한 힌트를 stderr에 출력
const fs = require('fs');

let d = {};
try {
  d = JSON.parse(fs.readFileSync(0, 'utf8') || '{}');
} catch {
  d = {};
}

const err = String(d.error_message || '');
if (err.includes('Cannot find module') || err.includes('Module not found')) {
  process.stderr.write('💡 패키지 미설치 가능성: pnpm install 실행 여부를 확인하세요.\n');
} else if (err.includes('Type error') || err.includes(' TS') || err.includes('error TS')) {
  process.stderr.write('💡 TypeScript 오류: pnpm type-check 로 전체를 확인하세요.\n');
}
process.stdout.write('{}');

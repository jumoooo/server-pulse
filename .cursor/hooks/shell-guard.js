#!/usr/bin/env node
// beforeShellExecution: 위험 패턴이면 exit 2로 차단 (Cursor 스펙)
const fs = require('fs');

let d = {};
try {
  d = JSON.parse(fs.readFileSync(0, 'utf8') || '{}');
} catch {
  process.exit(0);
}

const cmd = String(d.command || '');
const patterns = [
  ['rm -rf /', 'rm -rf /'],
  ['git push --force', 'git push --force'],
  ['git push -f', 'git push -f'],
  ['DROP TABLE', 'DROP TABLE'],
  ['DELETE FROM', 'DELETE FROM'],
  [':(){:|:&};:', 'fork bomb'],
];

for (const [needle, label] of patterns) {
  if (cmd.includes(needle)) {
    process.stderr.write(
      `⚠️ 위험한 명령어 차단: ${label}\n명시적으로 허용하려면 터미널에서 직접 실행하세요.\n`
    );
    process.exit(2);
  }
}
process.exit(0);

#!/usr/bin/env node
// afterFileEdit: TS/JS/JSON/CSS/MD에 Prettier 적용 (.dart는 format_dart.dart 담당)
const fs = require('fs');
const { execSync } = require('child_process');

let raw = '';
try {
  raw = fs.readFileSync(0, 'utf8');
} catch {
  process.exit(0);
}
if (!raw.trim()) process.exit(0);

let d;
try {
  d = JSON.parse(raw);
} catch {
  process.exit(0);
}

const fp = d.file_path || '';
if (!fp || fp.endsWith('.dart')) process.exit(0);

const ext = (fp.split('.').pop() || '').toLowerCase();
const ok = ['ts', 'tsx', 'js', 'jsx', 'json', 'css', 'md'].includes(ext);
if (!ok) process.exit(0);

const root =
  (Array.isArray(d.workspace_roots) && d.workspace_roots[0]) ||
  process.env.CURSOR_PROJECT_DIR ||
  process.env.CLAUDE_PROJECT_DIR ||
  process.cwd();

const safe = fp.replace(/"/g, '\\"');
try {
  execSync(`npx prettier --write "${safe}"`, { stdio: 'pipe', cwd: root });
} catch {
  // 포맷 실패 시에도 에이전트 루프는 막지 않음
}
process.exit(0);

#!/usr/bin/env node
// PostToolUse: Write|Edit 후 Prettier 자동 포맷
const d = JSON.parse(require('fs').readFileSync(0, 'utf8'));
const fp = (d.tool_input || {}).file_path || '';
const ext = fp.split('.').pop() || '';
const ok = ['ts', 'tsx', 'js', 'jsx', 'json', 'css', 'md'].includes(ext);

if (ok && fp) {
  try {
    require('child_process').execSync(
      `npx prettier --write "${fp.replace(/\\/g, '/').replace(/"/g, '\\"')}"`,
      { stdio: 'pipe', cwd: process.env.CLAUDE_PROJECT_DIR || process.cwd() }
    );
  } catch (_) {}
}

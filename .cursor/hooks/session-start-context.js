#!/usr/bin/env node
// sessionStart: 대화 시작 시 패키지명·Next 버전·슬래시 안내를 additional_context로 주입
const fs = require('fs');
const path = require('path');

let d = {};
try {
  d = JSON.parse(fs.readFileSync(0, 'utf8') || '{}');
} catch {
  d = {};
}

const root =
  (Array.isArray(d.workspace_roots) && d.workspace_roots[0]) ||
  process.env.CURSOR_PROJECT_DIR ||
  process.cwd();

let pkg = {};
try {
  pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
} catch {
  pkg = {};
}

const name = pkg.name || path.basename(root);
const nextV =
  (pkg.dependencies && pkg.dependencies.next) ||
  (pkg.devDependencies && pkg.devDependencies.next) ||
  '?';

const lines = [
  `[세션] **${name}** (Next.js ${nextV})`,
  '워크플로: `/plan` · `/feature` · `/ui` · `/api` · `/test` · `/tdd` · `/commit`',
  '**에이전트·스킬·Project Rules 정본은 `.cursor` 입니다.** (`.claude`는 선택 호환)',
];

process.stdout.write(JSON.stringify({ additional_context: lines.join('\n') }));

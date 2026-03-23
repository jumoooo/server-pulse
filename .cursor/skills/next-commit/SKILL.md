---
name: next-commit
description: Git status/diff analysis, Conventional Commits message, user-confirmed commit/push for Next repo. Use when user asks commit/push—not Flutter commit-agent automation.
---

# Next commit skill

`commit` 에이전트와 연동합니다.

## 순서
1. `git status --short`, `git diff --stat`
2. `.env*`, 시크릿, 충돌 확인 → 이상 시 중단
3. Conventional Commits 메시지 초안 (한국어 요약)
4. 사용자 **확인 후** `pnpm type-check` → `git add` → `git commit` → `git push`

**force push 금지. 확인 없이 커밋 금지.**

# .claude (compatibility)

This folder is optional. **Canonical agent, rule, skill, and hook definitions live under `.cursor/`.**

- Subagents: `.cursor/agents/`
- Skills: `.cursor/skills/`
- Project rules: `.cursor/rules/*.mdc`
- Hooks: `.cursor/hooks.json`

`settings.json` hooks were **cleared** to avoid double-running formatters/guards that now run via Cursor project hooks.

If you use **Claude Code CLI** only, you may re-add local hooks in `settings.local.json` (not committed) or copy patterns from `.cursor/hooks/`.

📌 **한글**: 이 폴더는 선택 사항입니다. **정본은 `.cursor`** 입니다. 훅은 Cursor `.cursor/hooks.json`으로 이전되어 `.claude/settings.json`의 `hooks`는 비워 두었습니다. Claude Code만 쓸 때는 로컬 `settings.local.json`에 필요한 훅을 두세요.

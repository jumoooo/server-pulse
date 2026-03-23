# Claude ↔ Cursor consolidation (2026-03-23)

## Summary

- **Canonical**: `.cursor/` for agents, skills (`*.mdc` rules), and `hooks.json`.
- **Subagent**: `tdd` added under `.cursor/agents/tdd.md` (Cursor-compatible frontmatter).
- **Project rules**: `.claude/rules` migrated to `.cursor/rules/next-*.mdc` + `mcp-usage.mdc` (bilingual Internal + 한글).
- **Skills**: `.claude/skills` bodies moved to `.cursor/skills` (`tdd`, `next-*`, `discover`, `mock`); `.claude/skills/*/SKILL.md` removed; see `.claude/skills/README.md`.
- **Hooks**: `.cursor/hooks.json` extended (session banner, Prettier after non-Dart edits, shell guard, shell failure hints, stop reminder). `.claude/settings.json` `hooks` emptied to avoid duplicate runs.
- **Docs**: `p_docs/06_Cursor_Claude_공식_정합_계획/TODO.md` tracks verification checkboxes.

## Paths

| Area | Location |
|------|----------|
| Hooks | `.cursor/hooks.json`, `.cursor/hooks/*.js`, `format_dart.dart` |
| Next rules | `next-typescript.mdc`, `next-api-routes.mdc`, `next-react-components.mdc`, `next-testing.mdc`, `next-tdd-workflow.mdc`, `mcp-usage.mdc` |
| Next skills | `tdd/`, `next-feature/`, `next-plan/`, `next-orchestrate/`, `discover/`, `next-commit/`, `next-review/`, `next-test/`, `mock/`, `next-api/`, `next-ui/` |

## Follow-up (manual)

- Cursor **Settings → Rules / Skills / Hooks**: confirm project files load; run `05_검증_시나리오_체크리스트.md` P0 items.
- **P1-6**: Confirm `tdd` appears in Subagents UI.

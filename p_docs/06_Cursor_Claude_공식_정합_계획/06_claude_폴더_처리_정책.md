# `.claude` 폴더 처리 정책

팀이 **Claude Code CLI**를 계속 쓰는지에 따라 아래 중 하나를 택한다.  
원칙: **내용의 정본은 `.cursor`** 이다.

## 옵션 A — 병행 유지 (권장: 과도기)

**조건**: 일부 구성원이 Claude Code로 동일 레포를 연다.

| 유지 | 조치 |
|------|------|
| `.claude/settings.json` | hooks는 Cursor로 이관했다면 **중복 실행 방지**를 위해 최소화하거나 비활성화 검토 |
| `.claude/agents` | 각 파일 상단에 “내용은 `.cursor/agents` 동명 파일과 동기화” 주석, 또는 심볼릭 링크(플랫폼 제약 주의) |
| `.claude/skills` | `README.md`만 두고 스킬 본문은 `.cursor/skills`로 이동했음을 명시 |

**장점**: 기존 Claude 워크플로 단절 최소화.  
**단점**: 두 벌 관리 부담 → 동기화 규칙 필수.

## 옵션 B — 축소 (Cursor 우선)

**조건**: 대부분이 Cursor만 사용.

- `.claude/agents`, `.claude/skills` **삭제 또는 빈 디렉터리 + README**
- `.claude/settings.json`은 로컬 전용 훅만 남기거나 제거
- `.claude/README.md`에 다음 안내 고정

## 옵션 C — 제거

**조건**: Claude Code를 레포에서 완전히 배제.

- `.claude` 전체 삭제 전에 Git 이력·CI에서 참조 여부 확인
- 문서에서 `/plan`, Claude 전용 명령 언급을 Cursor 기준으로 수정

---

## README 템플릿 (`.claude/README.md`용)

아래 블록을 복사해 사용한다.

```markdown
# .claude (compatibility)

This folder is optional. **Canonical agent, rule, skill, and hook definitions live under `.cursor/`.**

- Subagents: see `.cursor/agents/`
- Skills: see `.cursor/skills/`
- Project rules: see `.cursor/rules/`
- Hooks: see `.cursor/hooks.json`

If you use Claude Code CLI, keep local-only settings in `settings.local.json` and avoid duplicating hooks that are already configured for Cursor.

📌 **한글**: 이 폴더는 선택 사항입니다. 에이전트·룰·스킬·훅의 **정본은 `.cursor`** 입니다. Claude Code만 쓰는 로컬 설정은 `settings.local.json`에 두고, Cursor와 훅이 이중 실행되지 않도록 주의하세요.
```

---

## 결정 기록 템플릿

| 날짜 | 선택 옵션 | 결정자 | 비고 |
|------|-----------|--------|------|
| | A / B / C | | |

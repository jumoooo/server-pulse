# 훅: Claude Code → Cursor 매핑

Claude Code는 `.claude/settings.json`의 `hooks` 아래에 **PascalCase 이벤트**(`PostToolUse`, `PreToolUse`, …)를 쓰는 형태가 일반적이다.  
Cursor는 `.cursor/hooks.json`에서 **camelCase** 이벤트명을 사용한다.

공통: 훅 스크립트는 stdin JSON을 읽을 수 있으며, exit code `2`는 차단(deny) 의미로 호환 언급이 있다. 환경 변수 `CURSOR_PROJECT_DIR` / `CLAUDE_PROJECT_DIR`(별칭) 활용 가능.

## 1. 이벤트 대응표

| Claude (`settings.json` 관례) | Cursor (`hooks.json`) | 비고 |
|--------------------------------|----------------------|------|
| `SessionStart` | `sessionStart` | 세션 시작 배너·컨텍스트 주입 |
| (Claude에 없을 수 있음) | `sessionEnd` | Cursor 전용; 필요 시 추가 |
| `PreToolUse` (matcher: Bash) | `preToolUse` with matcher `Shell` 또는 `beforeShellExecution` | 위험 명령 차단은 **쉘 전용**이면 `beforeShellExecution`이 의미 명확 |
| `PostToolUse` (matcher: Write\|Edit) | `postToolUse` with matcher 또는 `afterFileEdit` | Prettier는 Write/Edit 직후가 자연스러움 |
| `PostToolUseFailure` (matcher: Bash) | `postToolUseFailure` | 에러 힌트 출력 |
| `Stop` | `stop` | 작업 완료 후 권장 명령 안내 |

> 실제 키 이름은 Cursor 버전의 `hooks.json` 스키마를 따른다. 공식 예시: `preToolUse`, `postToolUse`, `afterFileEdit`, `stop` 등.

## 2. 현재 프로젝트 소스

| 위치 | 내용 |
|------|------|
| `.claude/settings.json` | PostToolUse → Prettier; PreToolUse → 위험 bash 차단; SessionStart → 패키지/슬래시 안내; Stop → type-check/lint/commit 안내; PostToolUseFailure → 힌트 |
| `.claude/hooks/prettier-format.js` | 포맷 실행 로직 |
| `.cursor/hooks.json` | `afterFileEdit` → `dart .cursor/hooks/format_dart.dart` |
| `.cursor/hooks/format_dart.dart` | Dart 포맷 |

## 3. 이식 설계 원칙

1. **확장, 교체 금지**: Dart 훅은 그대로 두고, TS/JS/CSS 등에만 Prettier를 걸어 하이브리드 프로젝트를 보호한다.
2. **스크립트 분리**: 인라인 `node -e "..."`는 유지보수가 어려우므로 `.cursor/hooks/shell-guard.js`, `.cursor/hooks/session-banner.js` 등으로 분리 권장.
3. **matcher**: `postToolUse`에서 `Write`/`Edit`만 매칭해 불필요한 실행을 줄인다.
4. **검증**: Cursor Settings의 Hooks 탭·출력 채널로 실패 로그를 확인한다.

## 4. 제안 `hooks.json` 구조 (개념)

아래는 **설계 스케치**이며, 실제 구현 시 공식 스키마의 `matcher`·`command` 필드를 맞춘다.

```json
{
  "version": 1,
  "hooks": {
    "sessionStart": [{ "command": "node .cursor/hooks/session-banner.js" }],
    "afterFileEdit": [{ "command": "dart .cursor/hooks/format_dart.dart" }],
    "postToolUse": [
      {
        "matcher": "Write|Edit",
        "command": "node .cursor/hooks/prettier-on-edit.js"
      }
    ],
    "beforeShellExecution": [{ "command": "node .cursor/hooks/shell-guard.js" }],
    "postToolUseFailure": [
      {
        "matcher": "Shell",
        "command": "node .cursor/hooks/tool-failure-hint.js"
      }
    ],
    "stop": [{ "command": "node .cursor/hooks/stop-reminder.js" }]
  }
}
```

- `prettier-on-edit.js`는 기존 `.claude/hooks/prettier-format.js`를 **Cursor가 넘기는 stdin 형식**에 맞게 래핑하거나 통합한다.
- stdin 스키마가 Claude와 다르면 **공식 Hooks 문서의 해당 이벤트 입력 예시**를 기준으로 파싱을 수정한다.

## 5. 완료 체크

- [x] 세션 시작 시 배너(또는 의도적 비활성) 동작 — *2026-03-23: `session-start-context.js` → `sessionStart`*
- [x] `.dart` 저장/편집 시 `dart format` 경로 유지 — *`afterFileEdit` + `format_dart.dart`*
- [x] `.ts`/`.tsx` 등 편집 시 Prettier 동작 — *`afterFileEdit` + `prettier-after-edit.js`*
- [x] `rm -rf /` 등 위험 패턴 차단 시 exit 2 — *`beforeShellExecution` + `shell-guard.js`*
- [x] Stop 시 안내 메시지 출력 — *`stop-reminder.js`*
- [x] Shell 실패 힌트 — *`postToolUseFailure` + `shell-failure-hint.js`*

*(Cursor 실제 환경에서 Hooks 탭·로그로 한 번씩 확인 권장)*

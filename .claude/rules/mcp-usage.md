---
description: MCP(Model Context Protocol) 서버 사용 가이드. context7, sequential-thinking, github, playwright 각각의 용도와 에이전트별 사용 시점 정의.
globs: ["**/*.ts", "**/*.tsx", "**/*.md"]
alwaysApply: false
---

# MCP 사용 가이드

## 설치된 MCP 서버

| 서버                  | 역할                             | 주요 사용 에이전트                     |
| --------------------- | -------------------------------- | -------------------------------------- |
| `context7`            | 라이브러리 최신 공식 문서 조회   | planner, feature, ui, api, agentCritic |
| `sequential-thinking` | 복잡한 멀티스텝 추론             | orchestrator, planner                  |
| `github`              | GitHub 리포지토리, PR, 이슈 관리 | commit                                 |
| `playwright`          | 브라우저 자동화, E2E 테스트 지원 | test                                   |

---

## context7

### 도구 이름

- `mcp__context7__resolve-library-id` — 라이브러리 ID 검색
- `mcp__context7__get-library-docs` — 문서 내용 조회

### 언제 사용하나

- Next.js 15, React 19, Tailwind v4 등 버전별 최신 패턴 확인 필요 시
- 라이브러리 API가 업데이트되어 기존 패턴이 deprecated 되었는지 확인
- 구현 전 공식 권장 패턴 검색

### 사용 방법

```
1. mcp__context7__resolve-library-id
   query: "next.js" / "react" / "tailwind-css" / "zod"
   → libraryId 반환 (예: /vercel/next.js)

2. mcp__context7__get-library-docs
   libraryId: "/vercel/next.js"
   topic: "server actions" / "caching" / "app router"
   → 최신 공식 문서 반환
```

### 에이전트별 활용

- **planner**: 아키텍처 결정 시 최신 패턴 확인
- **feature**: 구현 전 Next.js 15 / React 19 패턴 검증
- **ui**: Tailwind v4 클래스, shadcn 패턴 확인
- **api**: Route Handler, Server Action 최신 패턴 확인
- **agentCritic**: 코드 리뷰 시 최신 공식 권장사항 기준으로 검토

---

## sequential-thinking

### 도구 이름

- `mcp__sequential-thinking__sequentialthinking`

### 언제 사용하나

- 요청이 모호하거나 여러 해결 접근법이 존재할 때
- 복잡한 아키텍처 결정 시 트레이드오프 분석
- 멀티 에이전트 워크플로우 설계 시
- 버그의 근본 원인을 단계별로 추적할 때

### 사용 방법

```
mcp__sequential-thinking__sequentialthinking
thought: "이 문제를 해결하기 위한 첫 번째 고려사항은..."
→ 단계별 사고 체인 생성
```

### 에이전트별 활용

- **orchestrator**: 복잡한 요청의 최적 워크플로우 설계
- **planner**: 아키텍처 결정 시 장단점 분석

---

## github

### 주요 도구

- `mcp__github__create_pull_request` — PR 생성
- `mcp__github__list_commits` — 커밋 히스토리 조회
- `mcp__github__get_file_contents` — 파일 내용 조회
- `mcp__github__search_repositories` — 리포지토리 검색
- `mcp__github__create_issue` — 이슈 생성

### 언제 사용하나

- 커밋 후 PR 자동 생성 요청 시
- GitHub 이슈 참조/생성 필요 시
- 리모트 브랜치와 비교 필요 시

### 사용 방법

```
mcp__github__create_pull_request
owner: "org-or-user"
repo: "repository-name"
title: "feat: 기능 제목"
body: "## Summary\n..."
head: "feature/branch-name"
base: "main"
```

### 환경 설정 필요

```bash
# .env.local 또는 시스템 환경변수
GITHUB_TOKEN=ghp_...
```

### 에이전트별 활용

- **commit**: 푸시 후 PR 생성 옵션 제공

---

## playwright

### 주요 도구

- `mcp__playwright__browser_navigate` — URL 이동
- `mcp__playwright__browser_screenshot` — 스크린샷 캡처
- `mcp__playwright__browser_click` — 요소 클릭
- `mcp__playwright__browser_type` — 텍스트 입력
- `mcp__playwright__browser_snapshot` — 접근성 트리 스냅샷

### 언제 사용하나

- E2E 테스트 작성 전 실제 UI 동작 확인 필요 시
- 테스트 셀렉터 파악 (접근성 트리로 정확한 역할/이름 확인)
- 구현된 기능의 시각적 결과 확인

### 사용 방법

```
1. mcp__playwright__browser_navigate
   url: "http://localhost:3000/page"

2. mcp__playwright__browser_snapshot
   → 접근성 트리로 버튼/입력 요소의 role, name 확인

3. → 확인된 정보로 Playwright 테스트 코드 작성
```

### 에이전트별 활용

- **test**: E2E 테스트 작성 시 실제 셀렉터 확인

---

## MCP 설치 확인

```bash
# Claude Code에서 MCP 상태 확인
/mcp

# 개별 MCP 테스트 실행
npx @upstash/context7-mcp@latest
npx @modelcontextprotocol/server-sequential-thinking
npx @modelcontextprotocol/server-github
npx @playwright/mcp@latest
```

## 주의사항

- MCP 도구는 Claude Code 재시작 후 활성화됨
- github MCP는 `GITHUB_TOKEN` 환경변수 필요
- playwright MCP는 `pnpm dev` 서버 실행 중인 상태에서 E2E 활용 효과적
- context7은 오프라인 상태에서 미작동 (WebFetch로 대체)

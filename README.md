# ServerPulse

AI 기반 게임 서버 관제 플랫폼입니다.  
실시간 서버 상태 모니터링, 알림 관리, Claude 기반 이상 징후 분석을 제공합니다.

## 🤝 협업 규칙

- 새 작업이라고 해서 항상 issue를 먼저 만들지는 않아요.
- 버그, 기능, backend 계약 변경, cross-repo 작업처럼 **추적 가치가 큰 작업**이면 issue 생성을 먼저 제안해요.
- 오타, 작은 문구 수정, 명백한 잡수정처럼 **소규모 단발 수정**은 issue 없이 바로 진행할 수 있어요.
- issue가 필요한 작업이면 사용자에게 짧게 확인하고, 승인되면 이 저장소에 issue를 만든 뒤 브랜치/커밋/PR를 진행해요.
- frontend 기능/버그 이슈, 브랜치, 커밋, PR는 **이 저장소에서** 진행해요.
- root 운영 문서, handoff, gate, harness, `.cursor`, `.codex`, `.agents` 변경은 **[`jumoooo/server-pulse-root-ops`](https://github.com/jumoooo/server-pulse-root-ops)** 에서 진행해요.
- backend API 계약이나 env가 함께 바뀌면 **root parent issue + package child issue** 구조로 나눠서 처리해요.
- 같은 저장소 이슈를 닫을 때는 `Closes #번호`를 쓰고, root 상위 이슈는 `Refs jumoooo/server-pulse-root-ops#번호`로 연결해요.

## 🌐 데모

- 대시보드 데모: [https://server-pulse-test.vercel.app/dashboard](https://server-pulse-test.vercel.app/dashboard)
- 이 링크는 이력서/포트폴리오용으로 `main` 브랜치의 README에서 항상 확인할 수 있습니다.
- 소스 개발은 데모용/개발용 브랜치로 분리 운영할 수 있으며, 공개 데모 진입점은 본 README를 기준으로 유지합니다.

## ✨ 주요 기능

- **대시보드** ` /dashboard `
  - 서버 상태 요약 카드
  - 전체 플레이어 추이 차트(24h)
  - 문제 서버 빠른 탐색
- **서버 목록** ` /servers `
  - 상태/지역 필터
  - 서버 카드 그리드
- **서버 상세** ` /servers/[id] `
  - CPU/메모리/RTT/에러율 지표 조회
  - AI 분석 결과 스트리밍 출력
- **알림 관리** ` /alerts `
  - severity/status 필터
  - 알림 상태 변경(open/acknowledged/resolved)

## 🧱 기술 스택

| 레이어 | 선택 |
| --- | --- |
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS v3 |
| State | TanStack Query v5 + Zustand v5 |
| Chart | Recharts |
| AI | Anthropic Claude (`@anthropic-ai/sdk`) |
| Test | Vitest + React Testing Library + Playwright |
| Package Manager | pnpm |

## 🚀 시작하기

### 1) 의존성 설치

```bash
pnpm install
```

### 2) 환경 변수 설정

```bash
cp .env.local.example .env.local
```

`.env.local`에 아래 값을 설정하세요.

```bash
ANTHROPIC_API_KEY=your_api_key_here
```

### 3) 개발 서버 실행

```bash
pnpm dev
```

- 기본 접속: [http://localhost:3000](http://localhost:3000)
- 루트(`/`) 접속 시 `/dashboard`로 리다이렉트됩니다.

## 📂 디렉터리 구조

```txt
src/
├─ app/
│  ├─ (main)/
│  │  ├─ dashboard/page.tsx
│  │  ├─ servers/page.tsx
│  │  ├─ servers/[id]/page.tsx
│  │  └─ alerts/page.tsx
│  ├─ api/
│  │  ├─ servers/...
│  │  ├─ alerts/...
│  │  └─ analyze/[id]/route.ts
│  ├─ layout.tsx
│  └─ page.tsx
├─ components/
│  ├─ dashboard/
│  ├─ servers/
│  ├─ alerts/
│  ├─ layout/
│  └─ common/
├─ hooks/
├─ lib/
├─ store/
└─ types/
```

## 🔌 API 엔드포인트

| Method | URL | 설명 |
| --- | --- | --- |
| GET | `/api/servers` | 서버 목록 |
| GET | `/api/servers/[id]` | 서버 상세 + 기본 지표 |
| GET | `/api/servers/[id]/metrics?range=1h\|6h\|24h` | 시계열 지표 |
| GET | `/api/alerts` | 알림 목록 |
| PATCH | `/api/alerts/[id]` | 알림 상태 변경 |
| POST | `/api/analyze/[id]` | AI 분석 스트리밍 |

응답 형식은 공통적으로 `ApiResponse<T>`(`success`, `data`, `error`)를 사용합니다.

## 🧠 데이터 흐름

- **조회(Read)**: TanStack Query (`useServers`, `useAlerts`, `useServerDetail`)
- **변경(Write)**: `useMutation` + 캐시 무효화 (`invalidateQueries`)
- **UI 상태**: Zustand (`useAppStore`)로 필터/사이드바 상태 관리
- **AI 분석**: `/api/analyze/[id]`에서 Anthropic SDK 스트림을 텍스트로 전달

## 🧪 테스트 & 품질

```bash
pnpm type-check   # TypeScript 검사
pnpm lint         # ESLint
pnpm test         # Vitest 단위/통합 테스트
pnpm test:coverage
pnpm test:e2e     # Playwright E2E
pnpm build        # 프로덕션 빌드 검증
```

## ⚙️ 개발 명령어

```bash
pnpm dev
pnpm build
pnpm start
pnpm format
```

## 📝 참고 사항

- 현재 서버/알림/지표 데이터는 목(mock) 데이터 기반으로 동작합니다.
- AI 분석 API는 `ANTHROPIC_API_KEY`가 없으면 `500` 에러를 반환합니다.
- 프로젝트는 App Router + React 19 패턴 기준으로 구성되어 있습니다.

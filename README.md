# ServerPulse — Frontend

게임 서버 모니터링 대시보드 웹 앱입니다.  
Next.js 15 App Router 기반으로 서버 상태 시각화, 알림 관리, AI 이상 징후 분석 기능을 제공합니다.

**[→ 데모 보기](https://server-pulse-test.vercel.app/dashboard)**

---

## 주요 화면

| 경로 | 설명 |
|------|------|
| `/dashboard` | 서버 상태 요약 카드, 24시간 플레이어 추이 차트, 문제 서버 목록 |
| `/servers` | 전체 서버 목록 (상태·지역 필터) |
| `/servers/[id]` | 서버 상세 — CPU·메모리·RTT·에러율 지표, AI 분석, 플레이어 목록 |
| `/alerts` | 알림 목록 — 심각도·상태별 필터, 상태 변경 |

---

## 기술 스택

| 레이어 | 선택 |
|--------|------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5.7 (strict) |
| Styling | Tailwind CSS v3 |
| 상태 관리 | TanStack Query v5 + Zustand v5 |
| 차트 | Recharts |
| AI | Anthropic Claude SDK |
| 테스트 | Vitest + React Testing Library + Playwright |
| 패키지 매니저 | pnpm |

---

## 시작하기

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 환경 변수 설정

```bash
cp .env.local.example .env.local
```

`.env.local` 파일에 아래 값을 입력합니다.

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000   # backend 주소
ANTHROPIC_API_KEY=sk-ant-...                     # AI 분석용 (없으면 fallback 동작)
```

### 3. 개발 서버 실행

```bash
pnpm dev
```

[http://localhost:3000](http://localhost:3000) 접속 시 `/dashboard`로 자동 이동합니다.

---

## 디렉터리 구조

```
src/
├── app/
│   ├── (main)/
│   │   ├── dashboard/        # 대시보드 페이지
│   │   ├── servers/          # 서버 목록 페이지
│   │   ├── servers/[id]/     # 서버 상세 페이지
│   │   └── alerts/           # 알림 관리 페이지
│   ├── api/
│   │   ├── servers/          # 서버 관련 Route Handler
│   │   ├── alerts/           # 알림 관련 Route Handler
│   │   └── analyze/[id]/     # AI 분석 스트리밍 Route Handler
│   └── layout.tsx
├── components/
│   ├── ui/                   # 공용 UI 컴포넌트 (Button, Badge, Card 등)
│   ├── dashboard/            # 대시보드 전용 컴포넌트
│   ├── servers/              # 서버 관련 컴포넌트
│   ├── alerts/               # 알림 관련 컴포넌트
│   └── layout/               # Header, Sidebar 등 레이아웃
├── hooks/                    # TanStack Query 커스텀 훅
├── lib/                      # 유틸리티, API 클라이언트
├── store/                    # Zustand 전역 상태
└── types/                    # TypeScript 타입 정의
```

---

## 개발 명령어

```bash
pnpm dev            # 개발 서버 실행 (Turbopack)
pnpm build          # 프로덕션 빌드
pnpm start          # 프로덕션 서버 실행
pnpm type-check     # TypeScript 타입 검사
pnpm lint           # ESLint
pnpm format         # Prettier 포맷
pnpm test           # Vitest 단위·통합 테스트
pnpm test:coverage  # 커버리지 리포트 (lines 80%, branches 75%)
pnpm test:e2e       # Playwright E2E 테스트
```

---

## 참고 사항

- `ANTHROPIC_API_KEY`가 없으면 AI 분석은 fallback 텍스트를 반환합니다.
- backend가 꺼져 있어도 서버 목록, 알림, AI 분석 기능은 정상 동작합니다.
- backend 연동 기능(실시간 헬스·트렌드 패널)은 `http://localhost:4000` 필요합니다.

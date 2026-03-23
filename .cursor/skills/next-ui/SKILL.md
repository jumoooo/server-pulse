---
name: next-ui
description: React + Tailwind UI for Next.js with a11y and TypeScript props. Use when building Next/React components—not Flutter ui-component-builder.
---

# Next UI skill

`ui` 에이전트와 연동합니다.

## 원칙
- 인터랙션 없으면 Server Component
- 이벤트/상태 필요 시 최소 범위로 `'use client'`
- `interface` Props, `cn()`, ARIA·시맨틱 HTML
- `className` prop 허용

## 산출물
컴포넌트 코드 (`src/components/ui/` 또는 `features/`), 사용 예시, Props 표.

`cn` 유틸이 없으면 `src/lib/utils.ts`부터 추가.

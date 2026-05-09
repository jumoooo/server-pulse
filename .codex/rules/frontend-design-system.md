# Frontend Design System Playbook

## 목적

이 파일은 Codex가 프론트엔드 파일을 수정할 때 **항상** 읽어야 하는 디자인 토큰 기준이에요.
핸드오프에 언급이 없어도, 이 규칙은 모든 frontend 작업에 적용돼요.

---

## ⛔ HARD BLOCK — 절대 사용 금지

아래 패턴이 `.tsx`, `.ts`, `.jsx`, `.js` 파일에 등장하면 **즉시 중단**하고 토큰으로 교체해요.

### 금지: Tailwind 팔레트 직접 사용

```
bg-slate-*    bg-gray-*    bg-zinc-*    bg-neutral-*  bg-stone-*
bg-red-*      bg-orange-*  bg-amber-*   bg-yellow-*   bg-lime-*
bg-green-*    bg-emerald-* bg-teal-*    bg-cyan-*     bg-sky-*
bg-blue-*     bg-indigo-*  bg-violet-*  bg-purple-*   bg-fuchsia-*
bg-pink-*     bg-rose-*

text-gray-*   text-white   text-black   (같은 팔레트 전체)
border-gray-* border-white border-black (같은 팔레트 전체)
```

### 금지: hex 색상 직접 사용

```tsx
// ❌
stroke="#1f2937"
fill="#6b7280"
color: '#6366f1'
```

### 허용: 시맨틱 토큰 (이것만 써요)

```
bg-bg-base       bg-bg-surface     bg-bg-elevated    bg-bg-input
text-fg-base     text-fg-muted     text-fg-subtle
border-border-default   border-border-subtle   border-border-focus
bg-interactive-*  text-interactive-*
bg-status-*       text-status-*     border-status-*
bg-severity-*     text-severity-*
```

---

## 전체 토큰 매핑표

| 하드코딩 클래스 | 치환 토큰 | CSS 변수 |
|----------------|-----------|----------|
| `bg-gray-950`, `bg-gray-950/80` | `bg-bg-base`, `bg-bg-base/80` | `--color-bg-base` |
| `bg-gray-900` | `bg-bg-surface` | `--color-bg-surface` |
| `bg-gray-800` | `bg-bg-elevated` | `--color-bg-elevated` |
| `bg-zinc-900`, `bg-zinc-950` | `bg-bg-input` | `--color-bg-input` |
| `text-white` | `text-fg-base` | `--color-fg-base` |
| `text-gray-300`, `text-gray-400` | `text-fg-muted` | `--color-fg-muted` |
| `text-gray-500`, `text-gray-600` | `text-fg-subtle` | `--color-fg-subtle` |
| `border-gray-700`, `border-gray-800` | `border-border-default` | `--color-border-default` |
| `border-gray-600` | `border-border-subtle` | `--color-border-subtle` |
| `hover:bg-gray-800` | `hover:bg-bg-elevated` | `--color-bg-elevated` |
| `hover:bg-gray-700` | `hover:bg-bg-elevated` | `--color-bg-elevated` |
| `bg-indigo-600`, `border-indigo-500/30` | `bg-interactive-accent`, `border-interactive-accent/30` | `--color-interactive-accent` |
| hex `#1f2937` | CSS var `--color-border-default` | `--color-border-default` |
| hex `#6b7280` | CSS var `--color-fg-muted` | `--color-fg-muted` |
| hex `#6366f1` | CSS var `--color-interactive-accent` | `--color-interactive-accent` |

---

## Recharts / SVG 특수 처리

Recharts는 DOM 속성(`stroke`, `fill`)에 색상이 들어가서 Tailwind 클래스를 직접 쓸 수 없어요.
`useCssVar` 훅으로 CSS 변수를 런타임에 읽어서 전달해요.

```ts
// src/hooks/useCssVar.ts
'use client'
import { useEffect, useState } from 'react'

export function useCssVar(varName: string, fallback: string): string {
  const [value, setValue] = useState(fallback)
  useEffect(() => {
    const resolved = getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim()
    if (resolved) setValue(resolved)
  }, [varName])
  return value
}
```

```tsx
// 사용 예 (PlayerChart.tsx)
const gridColor = useCssVar('--color-border-default',     '#374151')
const tickColor = useCssVar('--color-fg-muted',           '#9ca3af')
const lineColor = useCssVar('--color-interactive-accent', '#6366f1')

<CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
<XAxis tick={{ fill: tickColor, fontSize: 11 }} />
<Line stroke={lineColor} strokeWidth={2} />
```

---

## Before / After 예시

### 예시 1 — Header.tsx

```tsx
// ❌ Before
<header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm">
  <span className="text-white">Dashboard</span>
  <span className="text-gray-600">Game Server Observability</span>
</header>

// ✅ After
<header className="border-b border-border-default bg-bg-base/80 backdrop-blur-sm">
  <span className="text-fg-base">Dashboard</span>
  <span className="text-fg-subtle">Game Server Observability</span>
</header>
```

### 예시 2 — AlertList.tsx

```tsx
// ❌ Before
<div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
  <span className="text-white font-medium">서버 응답 없음</span>
  <span className="text-gray-400">CPU 사용량 초과</span>
  <span className="text-gray-600">2분 전</span>
</div>

// ✅ After
<div className="rounded-xl border border-border-default bg-bg-surface p-4">
  <span className="text-fg-base font-medium">서버 응답 없음</span>
  <span className="text-fg-muted">CPU 사용량 초과</span>
  <span className="text-fg-subtle">2분 전</span>
</div>
```

### 예시 3 — PlayerChart.tsx (Recharts)

```tsx
// ❌ Before
<CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
<XAxis tick={{ fill: "#6b7280", fontSize: 11 }} />
<Line stroke="#6366f1" strokeWidth={2} />

// ✅ After
const gridColor = useCssVar('--color-border-default', '#374151')
const tickColor = useCssVar('--color-fg-muted', '#9ca3af')
const lineColor = useCssVar('--color-interactive-accent', '#6366f1')

<CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
<XAxis tick={{ fill: tickColor, fontSize: 11 }} />
<Line stroke={lineColor} strokeWidth={2} />
```

---

## 구현 전 체크리스트

- [ ] 이 파일을 읽었다
- [ ] 수정할 파일에서 금지 패턴 검색: `bg-gray`, `text-gray`, `text-white`, `border-gray`, `#[0-9a-f]`
- [ ] Recharts/SVG 속성이 있으면 `useCssVar` 훅을 적용했다

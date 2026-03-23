---
paths:
  - "src/**/*.tsx"
  - "src/components/**"
  - "src/app/**/*.tsx"
---

# React/Next.js 컴포넌트 규칙

## Server vs Client Component 결정

```
Server Component (기본)          → 'use client' 추가
──────────────────────           ────────────────────────
DB/API 직접 접근                   useState, useEffect
환경변수 (서버 전용)                 브라우저 API
무거운 라이브러리                    이벤트 핸들러
SEO 중요 콘텐츠                     실시간 인터랙션
```

**원칙**: `'use client'`는 트리 최하단에 배치, 경계 최소화

## 컴포넌트 패턴

### Server Component
```tsx
// Props 타입 명시 필수
interface PageProps {
  params: Promise<{ id: string }>       // Next.js 15: params는 Promise
  searchParams: Promise<{ q?: string }>
}

export default async function Page({ params, searchParams }: PageProps) {
  const { id } = await params
  const { q } = await searchParams
  const data = await getData(id, q)

  if (!data) notFound()

  return <DataView data={data} />
}
```

### Client Component
```tsx
'use client'

import { useTransition } from 'react'

interface Props {
  onAction: (id: string) => Promise<void>
  label: string
  disabled?: boolean
}

export function ActionButton({ onAction, label, disabled = false }: Props) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      onClick={() => startTransition(() => onAction('id'))}
      disabled={isPending || disabled}
      className={cn('...', isPending && 'opacity-50')}
    >
      {isPending ? '처리 중...' : label}
    </button>
  )
}
```

### Form with Server Action (React 19)
```tsx
'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { createItemAction } from '@/app/actions/item'

function SubmitButton() {
  const { pending } = useFormStatus()
  return <button type="submit" disabled={pending}>{pending ? '저장 중...' : '저장'}</button>
}

export function ItemForm() {
  const [state, action] = useActionState(createItemAction, null)

  return (
    <form action={action}>
      {state?.error && <p role="alert" className="text-red-500">{state.error}</p>}
      <input name="title" required />
      <SubmitButton />
    </form>
  )
}
```

## Tailwind + cn() 규칙

```tsx
import { cn } from '@/lib/utils'

// ✅ 조건부 클래스는 cn() 사용
<div className={cn(
  'base-class',
  isActive && 'active-class',
  variant === 'primary' ? 'bg-blue-500' : 'bg-gray-200',
  className  // 외부 className 마지막에
)} />
```

## Props 패턴

```tsx
// HTML 속성 확장
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

// className 항상 허용
interface ComponentProps {
  children?: React.ReactNode
  className?: string
}
```

## 금지 사항
- 섹션 구분 주석 (`// ──`, `// ---`) 금지
- 코드와 중복되는 주석 금지
- 중첩 삼항 연산자 금지 (가독성 저해)
- `useEffect`로 데이터 페칭 금지 (Server Component 또는 SWR/Query 사용)

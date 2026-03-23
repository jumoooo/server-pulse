---
paths:
  - "**/*.test.ts"
  - "**/*.test.tsx"
  - "**/*.spec.ts"
  - "**/*.spec.tsx"
  - "e2e/**"
  - "tests/**"
---

# 테스트 작성 규칙

## 필수 규칙 (위반 시 즉시 수정)

| ❌ 금지                         | ✅ 올바른 방법                                             |
| ------------------------------- | ---------------------------------------------------------- |
| `userEvent.click(el)` 직접 호출 | `const user = userEvent.setup()` 후 `await user.click(el)` |
| `fireEvent` 사용                | `userEvent` 사용 (실제 사용자 행동 시뮬레이션)             |
| `await` 없이 async 메서드 호출  | 모든 Promise 반환 메서드에 `await`                         |
| 구현 세부사항 테스트            | 사용자 관점으로 테스트 (화면에 보이는 것)                  |
| 외부 서비스 실제 호출           | `vi.mock()` 또는 MSW로 모킹                                |

## 테스트 구조

```ts
// given / when / then 구조 필수
describe('ItemList', () => {
  it('아이템 목록이 렌더링되어야 합니다', async () => {
    // given
    const user = userEvent.setup()
    const items = [{ id: '1', title: '테스트 아이템' }]
    render(<ItemList items={items} onDelete={vi.fn()} />)

    // when
    await user.click(screen.getByRole('button', { name: '삭제' }))

    // then
    expect(screen.queryByText('테스트 아이템')).not.toBeInTheDocument()
  })
})
```

## Vitest + RTL 패턴

### 컴포넌트 테스트

```ts
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach } from 'vitest'

describe('Button', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('클릭 시 onClick이 호출되어야 합니다', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick} label="저장" />)

    await user.click(screen.getByRole('button', { name: '저장' }))

    expect(onClick).toHaveBeenCalledOnce()
  })

  it('disabled 상태에서 클릭이 무시되어야 합니다', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick} label="저장" disabled />)

    await user.click(screen.getByRole('button'))

    expect(onClick).not.toHaveBeenCalled()
  })
})
```

### Custom Hook 테스트

```ts
import { renderHook, act, waitFor } from "@testing-library/react";

describe("useCounter", () => {
  it("초기값이 설정되어야 합니다", () => {
    const { result } = renderHook(() => useCounter(5));
    expect(result.current.count).toBe(5);
  });

  it("increment 후 count가 증가해야 합니다", () => {
    const { result } = renderHook(() => useCounter(0));
    act(() => result.current.increment());
    expect(result.current.count).toBe(1);
  });
});
```

### Server Action 테스트

```ts
import { vi, describe, it, expect } from "vitest";

vi.mock("@/lib/db", () => ({
  item: { create: vi.fn().mockResolvedValue({ id: "1" }) },
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

describe("createItemAction", () => {
  it("유효한 데이터로 성공해야 합니다", async () => {
    const formData = new FormData();
    formData.set("title", "테스트");

    const result = await createItemAction(null, formData);
    expect(result).toEqual({ success: true });
  });

  it("빈 제목은 에러를 반환해야 합니다", async () => {
    const formData = new FormData();
    formData.set("title", "");

    const result = await createItemAction(null, formData);
    expect(result?.error).toBeDefined();
  });
});
```

### Playwright E2E 패턴

```ts
import { test, expect } from "@playwright/test";

test.describe("아이템 관리", () => {
  test("아이템을 생성할 수 있어야 합니다", async ({ page }) => {
    await page.goto("/items");
    await page.getByRole("button", { name: "추가" }).click();
    await page.getByLabel("제목").fill("새 아이템");
    await page.getByRole("button", { name: "저장" }).click();

    await expect(page.getByText("새 아이템")).toBeVisible();
  });
});
```

## TDD 사이클 (Red → Green → Refactor)

새 기능과 버그 수정은 반드시 이 순서를 따른다:

| 단계         | 목표                               | 완료 조건               |
| ------------ | ---------------------------------- | ----------------------- |
| **Red**      | 실패하는 테스트 작성               | `pnpm test` 실패 확인   |
| **Green**    | 테스트를 통과하는 최소 구현        | `pnpm test` 통과 확인   |
| **Refactor** | 구현 정리 (테스트는 건드리지 않음) | 테스트 여전히 통과 확인 |

Red 단계: 구현 파일 없이 테스트만 먼저 작성하며, 타입은 컴파일 통과, 런타임에서만 실패해야 한다.

## MSW v2 API 모킹 패턴

### 언제 MSW를 쓰는가

| 상황                                       | 도구        |
| ------------------------------------------ | ----------- |
| 클라이언트 컴포넌트가 `fetch()`로 API 호출 | MSW v2      |
| Server Action 직접 함수 호출               | `vi.mock()` |
| Route Handler 직접 함수 호출               | `vi.mock()` |

### 핸들러 파일 구조

```
src/__tests__/msw/
├── handlers.ts          # 도메인별 핸들러 조합 (진입점)
├── handlers/
│   ├── servers.ts       # /api/servers 핸들러
│   ├── metrics.ts       # /api/metrics 핸들러
│   └── alerts.ts        # /api/alerts 핸들러
└── server.ts            # Node 환경 MSW 서버 (Vitest용)
```

### 기본 핸들러 작성

```ts
import { http, HttpResponse } from "msw";

export const serverHandlers = [
  http.get("/api/servers", () =>
    HttpResponse.json({ success: true, data: { servers: mockServers } })
  ),
  http.get("/api/servers/:id", ({ params }) => {
    const found = mockServers.find((s) => s.id === params.id);
    if (!found) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json({ success: true, data: found });
  }),
];

// 에러 시나리오 핸들러 (테스트 내 server.use()로 오버라이드용)
export const serverErrorHandlers = {
  listFailed: http.get(
    "/api/servers",
    () => new HttpResponse(null, { status: 500 })
  ),
  networkError: http.get("/api/servers", () => HttpResponse.error()),
};
```

### 테스트 내 핸들러 오버라이드

```ts
import { server } from '@/__tests__/msw/server'
import { serverErrorHandlers } from '@/__tests__/msw/handlers/servers'

it('API 실패 시 에러 메시지를 표시해야 합니다', async () => {
  server.use(serverErrorHandlers.listFailed)

  render(<ServerList />)

  await expect(screen.findByRole('alert')).resolves.toBeInTheDocument()
})
```

## useActionState 테스트 패턴 (React 19)

```tsx
vi.mock("@/app/actions/servers", () => ({
  createServerAction: vi.fn(),
}));

it("제출 중 버튼이 비활성화되어야 합니다", async () => {
  const user = userEvent.setup();
  vi.mocked(createServerAction).mockImplementation(
    () => new Promise((resolve) => setTimeout(() => resolve(null), 100))
  );
  render(<ServerForm />);

  await user.click(screen.getByRole("button", { name: "저장" }));

  expect(screen.getByRole("button", { name: "저장" })).toBeDisabled();
});

it('Action 에러 반환 시 role="alert"로 표시되어야 합니다', async () => {
  const user = userEvent.setup();
  vi.mocked(createServerAction).mockResolvedValueOnce({
    error: "이미 존재하는 서버입니다",
  });
  render(<ServerForm />);

  await user.click(screen.getByRole("button", { name: "저장" }));

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "이미 존재하는 서버입니다"
  );
});
```

## Playwright E2E — 셀렉터 규칙

### 셀렉터 우선순위 (반드시 이 순서)

1. `getByRole(role, { name })` — 접근성 기반 (최우선)
2. `getByLabel(text)` — 폼 요소
3. `getByText(text)` — 표시된 텍스트
4. `getByTestId(id)` — `data-testid` (마지막 수단)

### 금지 셀렉터

```ts
// ❌ 금지
page.locator(".text-red-500");
page.locator('[class*="badge"]');
page.$(".btn-primary");

// ✅ 사용
page.getByRole("button", { name: "삭제" });
page.getByRole("status");
page.getByLabel("서버 이름");
```

### 에러 시나리오 의무 포함

모든 E2E describe 블록에는 Happy path 외에 최소 1개의 에러 시나리오를 포함한다:

```ts
test("API 실패 시 에러 상태를 표시해야 합니다", async ({ page }) => {
  await page.route("/api/servers", (route) =>
    route.fulfill({ status: 500, body: JSON.stringify({ success: false }) })
  );
  await page.goto("/servers");
  await expect(page.getByRole("alert")).toBeVisible();
});
```

### Playwright MCP로 셀렉터 확인

테스트 작성 전 `mcp__playwright__browser_snapshot`으로 접근성 트리를 확인하여 정확한 role/name을 파악한다.

## 커버리지 목표

- 비즈니스 로직 (hooks, lib, actions): ≥ 80%
- UI 컴포넌트: ≥ 70%
- Route Handlers: ≥ 80%

## 파일 위치

- 단위/통합 테스트: 대상 파일과 같은 위치 (`*.test.ts(x)`)
- E2E: `e2e/` 디렉토리 (별도)

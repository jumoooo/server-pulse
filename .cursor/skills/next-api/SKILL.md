---
name: next-api
description: Next.js Route Handlers and Server Actions with Zod and respond helpers. Use when creating Next API surfaces—not Flutter api-integration.
---

# Next API skill

`api` 에이전트와 연동합니다.

## 유형
- 외부 HTTP / 업로드 → `src/app/api/**/route.ts`
- 폼·페이지 변이 → `src/app/actions/*.ts`

## 필수
1. `@/lib/api` `respond` 패턴 (없으면 먼저 추가)
2. Zod 입력 검증
3. 인증 필요 시 세션 확인
4. try/catch, `revalidatePath` / `revalidateTag`

## 완료 후
엔드포인트 목록, 타입, 클라이언트 사용 예시.

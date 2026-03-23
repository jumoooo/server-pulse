---
name: mock
description: ServerPulse-style mocks, MSW handlers, fixtures, API route mocks for this Next repo. Use when user asks for mock data, MSW handlers, or dev seed data.
---

# Mock data skill (ServerPulse 도메인)

작업 전 `src/types/server.ts` 등 도메인 타입을 확인합니다.

## 유형
- `fixture` / `test` → `src/__tests__/fixtures/`
- `api` / `route` → `src/app/api/*/route.ts` 패턴
- `msw` / `handler` → `src/__tests__/msw/handlers/` + `handlers.ts` 등록

## 데이터 현실성
Server / MetricPoint / Alert 필드는 프로젝트 도메인에 맞게 분포·단위를 맞춥니다.

## 완료 보고
생성 경로, 건수, 포함 상태 요약.

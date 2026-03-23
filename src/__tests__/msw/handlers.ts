import type { RequestHandler } from "msw";

// 도메인별 핸들러를 여기서 조합
// 기능 추가 시:
//   import { xxxHandlers } from './handlers/xxx'
//   export const handlers = [...xxxHandlers]
export const handlers: RequestHandler[] = [];

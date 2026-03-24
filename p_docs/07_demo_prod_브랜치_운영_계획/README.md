# Demo/Prod 브랜치 운영 계획

## Internal Instructions (English)

This folder contains execution-ready planning artifacts for splitting deployment strategy into:

- `demo` branch: public, mock-data portfolio deployment
- `main` branch: production-ready branch integrated with `steam_mcp`

The planning baseline is derived from orchestrated multi-workstream analysis, with strong emphasis on:

1. Parallelizable workstreams
2. Stability and risk controls
3. Deployment gates and rollback procedures
4. Operational checklists

Artifacts:

- `01_병렬_실행_상세_계획서.md`: master execution plan

### Lane Gate Quick Usage

- ✅ Demo lane check: `pnpm gate:lane:demo`
- ✅ Prod lane check: `pnpm gate:lane:prod`
- ⚠️ Prod lane fails with non-zero exit when:
  - `DEMO_MODE=true`-like value is set
  - no configured `STEAM_MCP_*` environment variable exists

Gate scripts are intentionally provider-agnostic. They only validate lane env expectations.

## 사용자용 설명 (한글)

이 폴더는 프로젝트를 아래처럼 분리 운영하기 위한 실행 문서 모음입니다.

- `demo` 브랜치: 채용/포트폴리오 공개용 데모(목데이터)
- `main` 브랜치: `steam_mcp` 실서버 연동 실전 운영용

핵심 목적:

1. 병렬 작업 가능한 항목을 명확히 분리
2. 장애/리스크를 사전에 통제
3. 배포 게이트와 롤백 절차를 표준화
4. 실행 전/중/후 체크리스트로 안정성 확보

포함 산출물:

- `01_병렬_실행_상세_계획서.md`: 실제 실행 기준 문서

### 🚦 레인 게이트 빠른 사용법

- ✅ demo 레인 점검: `pnpm gate:lane:demo`
- ✅ prod 레인 점검: `pnpm gate:lane:prod`
- ⚠️ prod 레인은 아래 조건이면 **실패(비정상 종료 코드)** 합니다.
  - `DEMO_MODE=true` 계열 값이 켜져 있음
  - 설정된 `STEAM_MCP_*` 환경 변수가 없음

게이트 스크립트는 Provider 내부 구현과 분리된 **환경 규칙 검증 전용**입니다.

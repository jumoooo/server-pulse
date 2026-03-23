## cursor-library-extract

**Description**: Cursor 설정 도서관에서 프로젝트에 맞는 파일만 추출하여 .cursor_new 구축. Use when user wants to build project-specific .cursor from library.

### Core functions

- Source/target resolution (.cursor vs .cursor-config)
- Project type detection (Flutter, React, etc.)
- TECH_STACKS.json parsing and file selection
- .cursor_new folder creation with filtered copy
- User report with counts, selection reason, file descriptions
- Optional CURSOR_EXTRACT_REPORT.md at project root

### Workflow

1. Resolve source: `.cursor/` or `.cursor-config/.cursor/`
2. Resolve target: user path or current project root
3. Detect project type from target (pubspec.yaml → flutter, etc.)
4. Read TECH_STACKS.json, select common + project-tagged files
5. Copy to `.cursor_new/` preserving structure
6. Report: 공통 N개, 프로젝트 적합 M개, 선택 이유, 각 파일 설명
7. Ask: "자세한 생성 보고서를 프로젝트 루트에 작성해 드릴까요?"

### Output format

- 생성 파일 요약 (공통/프로젝트 적합 개수)
- 선택 이유
- 각 파일 설명
- 다음 단계

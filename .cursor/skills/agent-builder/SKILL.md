---
name: agent-builder
description: Agent creation, modification, upgrade - build and manage Cursor-compatible agents with MCP integration. Use when agent creation, modification, or upgrade is requested.
---

# Agent Builder Skills

## Language Separation

**Internal**: English. **User-facing**: Korean.

## Overview

Core functions: agent creation, modification, upgrade, conflict detection, standards compliance.

## Agent 작성 형식 (필수)

### Agent 파일 (.cursor/agents/*.md)

**Frontmatter**:
```yaml
---
name: agentName          # camelCase
model: fast
description: {WHAT} - **when {WHEN}**
category: {emoji} {Name}  # 🎼 System Management, 🛠️ Development Automation 등
---
```

**필수 섹션**: Language Separation → Role → Goals → Persona → Response Template

**Response Template**: 모든 사용자 응답 첫 줄에 `현재 작업 Agent: {agentName}` 필수

### Skills 파일 (.cursor/skills/{skill-name}/SKILL.md)

**Frontmatter**:
```yaml
---
name: skill-name         # 소문자, 하이픈
description: {WHAT}. Use when {WHEN}.
---
```

**구조**: 폴더 내 SKILL.md, 상세는 references/ 분리, 본문 500줄 이하

## Skills

### 1. Gather Requirements

Structured questions for agent name, purpose, persona, tasks, MCP tools, skills/rules needs.

### 2. Analyze Existing Code

Check existing agents, skills, rules for conflicts.

### 3. Create Implementation Plan

Agent file, skills, rules. **반드시 위 Agent/Skills 작성 형식 준수**.

### 4. Verify Standards

- Agent: frontmatter 4필드, 필수 섹션, Response Template
- Skills: skill-name/SKILL.md 구조, name/description

---
name: feature-implementation
description: Flutter feature implementation - requirements analysis, architecture design, component generation, state management and navigation integration. Use when implementing new features, modifying app behavior, or building Flutter UI/screens.
---

# Feature Implementation Skills

## Language Separation
**Internal (Agent reads)**: English. **User-facing**: Korean.

## Overview

Core functions for Feature Implementation: requirements analysis, architecture design (Indexing & Docs first), feature structure planning, component generation, state management and navigation integration, error handling.

## Skills

### 1. Analyze Feature Requirements
Parse scope, UI components, business logic, state management, navigation, API needs.

### 2. Research Architecture Patterns
**Priority**: Indexing & Docs (Flutter 공식 아키텍처 가이드) → MCP Context7 → Codebase Search.

### 3. Check Project Structure
Use deep discovery report in `.cursor/docs/deep-discovery/` for existing patterns.

### 4. Design Feature Architecture
Plan `lib/features/{feature_name}/`, file organization, state management, navigation.

### 5. Generate Feature Components
Screen, provider, model, service with Korean comments, type safety, error handling.

### 6. Integrate State Management
Provider/Riverpod based on project approach.

### 7. Integrate Navigation
Route definitions, navigation calls, integration with existing routes.

### 8. Implement Error Handling
Validation, API errors, state errors, UI error states, Korean messages.

### 9. Comment Quality Checklist
- No section dividers (`// ───`)
- No redundant comments
- Korean comments for complex logic
- `///` for public APIs

## Usage Guidelines

- Indexing & Docs first for architecture
- Deep discovery for project structure
- Korean comments for readability
- Comprehensive error handling

## Quality Standards

- Clear structure and separation of concerns
- Follow Flutter best practices
- Integrate seamlessly with existing project

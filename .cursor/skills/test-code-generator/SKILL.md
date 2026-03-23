---
name: test-code-generator
description: Flutter test code generation - request validation, code analysis, test pattern discovery, test generation, coverage measurement. Use when user asks for test generation, unit/widget/integration tests, or test coverage.
---

# Test Code Generator Skills

## Language Separation
**Internal (Agent reads)**: English. **User-facing**: Korean.

## Overview

Core functions: request validity assessment, code analysis and test pattern discovery, test generation, coverage measurement and reporting.

## Skills

### 1. Request Validity Assessment
- VALID: Test code generation only
- INVALID: Production code modification → suggest featureImplementation; Test framework changes → suggest agentBuilder
- UNCERTAIN: Ask clarifying questions

### 2. Code Analysis and Test Pattern Discovery
Read implementation, identify public methods, edge cases. Search existing tests for patterns: setUp/tearDown, Hive.init(tempDir.path), assertions, mocks.

### 3. Test Generation
Follow project patterns. Use Hive.init(tempDir.path) in setUpAll. Use fixed-duration pump() not pumpAndSettle() for animated widgets. Always await async. Korean comments.

### 4. Coverage Measurement and Reporting
Run `flutter test --coverage`, report pass/fail, coverage percentage.

## Project Rules

- Follow `.cursor/rules/flutter-test.mdc`
- Hive.init(tempDir.path) in setUpAll, never Hive.initFlutter()
- No pumpAndSettle() with AnimationController
- Always await async methods
- tearDown for constructor timers (e.g. Future.delayed 300ms)

## Quality Standards

- Tests must pass
- Follow existing test patterns
- Korean comments for clarity

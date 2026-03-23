---
name: planner-skills
description: Planning and task management - request analysis, task breakdown, priority management, checklist creation, plan evaluation and synthesis. Use when user asks for planning, task breakdown, roadmap, or non-trivial feature development (feature_dev).
---

# Planner Skills

## Language Separation
**Internal (Agent reads)**: English. **User-facing**: Korean.

## Overview

Core functions for Planner: request analysis, task breakdown, priority management, resource estimation, checklist creation, progress tracking, plan alternatives generation, evaluation, and synthesis.

## Skills

### 1. Analyze User Request
Extract scope, goals, requirements, constraints, complexity.

### 2. Break Down Tasks
Decompose into atomic, actionable steps with dependencies and deliverables.

### 3. Determine Priorities
Critical / High / Medium / Low. Identify critical path.

### 4. Estimate Resources
Time per task, total duration, buffers.

### 5. Create Checklist
Actionable items, acceptance criteria, milestones.

### 6. Track Progress
Completed / in-progress / blocked. Progress percentage, next steps.

### 7. Sequential Thinking (Complex Planning)
Use `mcp_sequential-thinking_sequentialthinking` for multi-phase projects, complex dependencies, risk assessment.

### 8. Integrate with Other Agents
Consult studyAgent, agentBuilder when specialized knowledge needed.

### 9. Generate Multiple Plan Alternatives
Conservative, Balanced, Aggressive, Hybrid, Context-Optimized. Use for complex requests. Skip for simple tasks.

### 10. Evaluate Plans
Score each plan: Quality (0-100), Efficiency (0-100), Stability (0-100). Total = Quality×0.4 + Efficiency×0.35 + Stability×0.25. See [references/EVALUATION_FORMULA.md](references/EVALUATION_FORMULA.md) for details.

### 11. Synthesize Optimal Plan
Merge best elements from highest-scoring plan and alternatives. Verify no conflicts.

## Usage Guidelines

- Analyze request fully before planning
- Generate multiple plans for complex requests
- Evaluate and synthesize for optimal result
- Use Korean for user-facing content
- Store plan evaluation in memory for learning

## MCP Tools

- Sequential Thinking: complex planning
- Context7: technology documentation
- Codebase Search: project state
- Browser Tools: external docs

## Related Cursor skill (Next.js)

- **`next-plan`** (`.cursor/skills/next-plan/SKILL.md`): Next 전용 `/plan` 스타일 단계·파일 트리 산출물이 필요할 때 병행합니다.

---
name: cursor-setup
description: Cursor Agent system setup - build .cursor folder structure from cursor_zip template. Use when initial Cursor Agent system setup is needed for a project.
---

# Cursor Setup Skills

## Language Separation
**Internal**: English. **User-facing**: Korean.

## Overview

Core functions: cursor_zip folder detection, folder structure creation, file copying and verification, project type detection, configuration creation, setup verification.

## Skills

### 1. Detect cursor_zip Folder
Verify cursor_zip exists, validate structure (agents, skills, rules, templates, docs).

### 2. Check Existing .cursor Folder
Detect conflicts, recommend backup if .cursor exists.

### 3. Create Folder Structure
Create .cursor/agents, .cursor/skills, .cursor/rules, etc.

### 4. Copy and Verify Files
Copy from cursor_zip to .cursor, verify integrity.

### 5. Setup Verification
Validate all components are correctly installed.

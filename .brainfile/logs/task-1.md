---
id: task-1
title: "Validator: treat column.tasks as optional in v2 board config"
description: |-
  The validator (`validateColumn` in validator.ts) unconditionally requires `column.tasks` to be an array. This is a v1 assumption — in v2, columns are config-only (`ColumnConfig`) and tasks live as individual files in `board/`. The linter fails on valid v2 board configs that omit `tasks: []` from columns.

  **Root cause chain:**
  1. `validator.ts:108` — `if (!Array.isArray(column.tasks))` errors on undefined
  2. `linter.ts:108` — calls `BrainfileValidator.validate(result.board)` with no v2 awareness
  3. `parser.ts:169` — `parseWithErrors` returns `Board` type even for v2 config-only files
  4. `workspace.ts:168-170` — already works around this with `if (!col.tasks) col.tasks = []`

  **Fix:** In `validateColumn`, treat `undefined` tasks the same as `[]`. This is always safe because v2 columns get populated from `board/` files by `buildBoardFromV2`. The workspace layer already does this workaround — the validator should match.

  **Bonus:** Consider adding a `validateBoardConfig` method that validates against `BoardConfig` (no tasks required) vs `Board` (tasks required), so the linter can pick the right one based on whether `.brainfile/board/` exists.
priority: high
tags:
  - bug
  - v2
  - validator
relatedFiles:
  - core/src/validator.ts
  - core/src/linter.ts
  - core/src/workspace.ts
  - core/src/types/board.ts
subtasks:
  - id: task-1-1
    title: Make validateColumn treat undefined tasks as empty array
    completed: false
  - id: task-1-2
    title: Add validator test for v2 column without tasks field
    completed: false
  - id: task-1-3
    title: "Verify linter passes on v2 board config without tasks: []"
    completed: false
createdAt: "2026-03-05T16:04:08.490Z"
assignee: codex
updatedAt: "2026-03-05T17:03:40.473Z"
contract:
  status: in_progress
  deliverables:
    - type: file
      path: core/src/validator.ts
      description: validateColumn treats undefined tasks as empty array
    - type: test
      path: core/src/__tests__/validator-v2.test.ts
      description: Tests for v2 column without tasks field
    - type: test
      path: core/src/__tests__/linter-v2.test.ts
      description: "Linter passes on v2 board config without tasks: []"
  validation:
    commands:
      - cd core && npm test
  constraints:
    - Only change the tasks check in validateColumn — do not restructure the validator
    - "v1 boards with tasks: [] must continue to validate identically"
    - "The fix is: if column.tasks is undefined, treat it as [] (not an error)"
  metrics:
    pickedUpAt: "2026-03-05T17:01:29.790Z"
    reworkCount: 0
completedAt: "2026-03-05T17:03:40.473Z"
---

## Description
The validator (`validateColumn` in validator.ts) unconditionally requires `column.tasks` to be an array. This is a v1 assumption — in v2, columns are config-only (`ColumnConfig`) and tasks live as individual files in `board/`. The linter fails on valid v2 board configs that omit `tasks: []` from columns.

**Root cause chain:**
1. `validator.ts:108` — `if (!Array.isArray(column.tasks))` errors on undefined
2. `linter.ts:108` — calls `BrainfileValidator.validate(result.board)` with no v2 awareness
3. `parser.ts:169` — `parseWithErrors` returns `Board` type even for v2 config-only files
4. `workspace.ts:168-170` — already works around this with `if (!col.tasks) col.tasks = []`

**Fix:** In `validateColumn`, treat `undefined` tasks the same as `[]`. This is always safe because v2 columns get populated from `board/` files by `buildBoardFromV2`. The workspace layer already does this workaround — the validator should match.

**Bonus:** Consider adding a `validateBoardConfig` method that validates against `BoardConfig` (no tasks required) vs `Board` (tasks required), so the linter can pick the right one based on whether `.brainfile/board/` exists.

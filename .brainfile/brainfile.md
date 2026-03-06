---
schema: https://brainfile.md/v2/board.json
title: "@brainfile/core"
agent:
  instructions:
    - Task files are individual .md files in board/
    - Completed tasks are in logs/
    - Preserve all IDs
    - Make minimal changes
    - "Build: npm run build"
    - "Test: npm test"
rules:
  context:
    - id: 1
      rule: "Core library for parsing and manipulating brainfile boards"
    - id: 2
      rule: "Publishes to npm as @brainfile/core"
    - id: 3
      rule: "Exports: BrainfileDoc, Task, parseBoard, serializeBoard"
columns:
  - id: todo
    title: To Do
  - id: in-progress
    title: In Progress
---

# @brainfile/core

Core TypeScript library for parsing and manipulating brainfile boards. Used by CLI, supervisor, and VS Code extension.

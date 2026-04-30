/**
 * Task file reader/writer for per-task file architecture (v2).
 *
 * Each task is a standalone `.md` file with YAML frontmatter + markdown body:
 *
 * ```markdown
 * ---
 * id: task-1
 * title: Implement feature
 * column: todo
 * ...
 * ---
 *
 * ## Description
 * Markdown body here...
 *
 * ## Log
 * - 2025-12-17T10:00:00Z: Started work
 * ```
 *
 * @packageDocumentation
 */
import type { Task, TaskDocument } from './types';
export { parseTaskContent, serializeTaskContent } from './taskContent';
/**
 * Read and parse a single task file from disk.
 *
 * @param filePath - Absolute path to the task `.md` file
 * @returns TaskDocument with metadata, body, and filePath; or null if file is invalid
 */
export declare function readTaskFile(filePath: string): TaskDocument | null;
/**
 * Write a task document to disk.
 *
 * @param filePath - Absolute path to write the task file
 * @param task - Task metadata (YAML frontmatter)
 * @param body - Markdown body content
 */
export declare function writeTaskFile(filePath: string, task: Task, body?: string): void;
/**
 * Read all task files from a directory.
 *
 * Scans for `.md` files, parses each as a task document, and returns
 * all successfully parsed tasks. Files that fail to parse are silently skipped.
 *
 * @param dirPath - Absolute path to the tasks directory
 * @returns Array of TaskDocument objects
 */
export declare function readTasksDir(dirPath: string): TaskDocument[];
/**
 * Get the expected filename for a task ID.
 * Convention: `{task-id}.md` (e.g., `task-42.md`)
 */
export declare function taskFileName(taskId: string): string;
//# sourceMappingURL=taskFile.d.ts.map
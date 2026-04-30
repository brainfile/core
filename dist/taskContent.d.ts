/**
 * Browser-safe task content parser/serializer.
 *
 * These helpers operate on raw strings only. Disk-backed helpers live in
 * `taskFile.ts`.
 *
 * @packageDocumentation
 */
import type { Task } from './types';
/**
 * Parse YAML frontmatter and markdown body from a task file's content string.
 *
 * @param content - Raw file content (string)
 * @returns Parsed task metadata and body, or null if frontmatter is missing/invalid
 */
export declare function parseTaskContent(content: string): {
    task: Task;
    body: string;
} | null;
/**
 * Serialize task metadata and body into a markdown string with YAML frontmatter.
 *
 * @param task - Task metadata
 * @param body - Markdown body content (can be empty string)
 * @returns Serialized file content
 */
export declare function serializeTaskContent(task: Task, body?: string): string;
//# sourceMappingURL=taskContent.d.ts.map
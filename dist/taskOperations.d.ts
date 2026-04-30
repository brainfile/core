/**
 * File-based task operations for per-task file architecture (v2).
 *
 * These functions operate on individual task files in `.brainfile/board/`
 * and `.brainfile/logs/`. Unlike the v1 board operations (operations.ts),
 * these have filesystem side effects (reading/writing/moving files).
 *
 * @packageDocumentation
 */
import type { Task, TaskDocument } from './types';
/**
 * Result of a file-based task operation
 */
export interface TaskOperationResult {
    success: boolean;
    task?: Task;
    filePath?: string;
    error?: string;
}
/**
 * Input for creating a new task file
 */
export interface TaskFileInput {
    id?: string;
    title: string;
    column: string;
    position?: number;
    description?: string;
    priority?: 'low' | 'medium' | 'high' | 'critical';
    tags?: string[];
    assignee?: string;
    dueDate?: string;
    relatedFiles?: string[];
    template?: 'bug' | 'feature' | 'refactor';
    subtasks?: string[];
    /** Optional parent task/document ID for first-class parent-child linking. */
    parentId?: string;
    /** Task IDs that must be completed before this task can run. */
    dependsOn?: string[];
    /** Document type (e.g., 'epic', 'adr'). When set, IDs use this as prefix (epic-1, adr-1). */
    type?: string;
}
/**
 * Filters for listing tasks
 */
export interface TaskFilters {
    column?: string;
    tag?: string;
    priority?: 'low' | 'medium' | 'high' | 'critical';
    assignee?: string;
    parentId?: string;
}
export interface CompleteTaskFileOptions {
    /** Keep legacy behavior: move completed task markdown file into logs/. */
    legacyMode?: boolean;
    summary?: string;
    filesChanged?: string[];
    columnHistory?: string[];
    validationAttempts?: number;
}
/**
 * Generate the next task ID by scanning an existing tasks directory.
 *
 * When `typePrefix` is provided (e.g., "epic"), generates IDs like `epic-1`
 * and only scans for IDs matching that prefix. Defaults to "task".
 *
 * @param boardDir - Path to the tasks directory
 * @param logsDir - Optional path to the logs directory (also scanned for used IDs)
 * @param typePrefix - Optional ID prefix (default: "task"). E.g., "epic" produces "epic-1".
 * @returns Next available ID (e.g., `task-42` or `epic-1`)
 */
export declare function generateNextFileTaskId(boardDir: string, logsDir?: string, typePrefix?: string): string;
/**
 * Add a new task file to the tasks directory.
 *
 * @param boardDir - Absolute path to `.brainfile/board/`
 * @param input - Task creation input
 * @param body - Optional markdown body content
 * @param logsDir - Optional logs directory to scan for used IDs
 * @returns TaskOperationResult with the created task
 */
export declare function addTaskFile(boardDir: string, input: TaskFileInput, body?: string, logsDir?: string): TaskOperationResult;
/**
 * Move a task to a different column by updating its frontmatter.
 *
 * @param taskPath - Absolute path to the task file
 * @param newColumn - New column ID
 * @param newPosition - Optional new position within the column
 * @returns TaskOperationResult
 */
export declare function moveTaskFile(taskPath: string, newColumn: string, newPosition?: number): TaskOperationResult;
/**
 * Complete a task by appending to `logs/ledger.jsonl` and removing board file.
 * Legacy mode can still move markdown files into logs/.
 *
 * @param taskPath - Absolute path to the task file in board/
 * @param logsDir - Absolute path to the logs directory
 * @param options - Optional completion behavior and ledger details
 * @returns TaskOperationResult with the completed task
 */
export declare function completeTaskFile(taskPath: string, logsDir: string, options?: CompleteTaskFileOptions): TaskOperationResult;
/**
 * Delete a task file from disk.
 *
 * @param taskPath - Absolute path to the task file
 * @returns TaskOperationResult
 */
export declare function deleteTaskFile(taskPath: string): TaskOperationResult;
/**
 * Append a timestamped log entry to a task file's ## Log section.
 *
 * If the `## Log` section does not exist, it is created at the end of the body.
 *
 * @param taskPath - Absolute path to the task file
 * @param entry - Log entry text
 * @param agent - Optional agent attribution
 * @returns TaskOperationResult
 */
export declare function appendLog(taskPath: string, entry: string, agent?: string): TaskOperationResult;
/**
 * List tasks from a directory, with optional filters.
 * Results are grouped by column and sorted by position.
 *
 * @param boardDir - Absolute path to the tasks directory
 * @param filters - Optional filters to apply
 * @returns Array of TaskDocument objects, sorted by column and position
 */
export declare function listTasks(boardDir: string, filters?: TaskFilters): TaskDocument[];
/**
 * Find a task by ID in a directory.
 *
 * First attempts direct file lookup by convention (`{taskId}.md`),
 * then falls back to scanning all files.
 *
 * @param boardDir - Absolute path to the tasks directory
 * @param taskId - Task ID to find
 * @returns TaskDocument or null if not found
 */
export declare function findTask(boardDir: string, taskId: string): TaskDocument | null;
/**
 * Search tasks by query string across title, description, and body.
 *
 * @param boardDir - Absolute path to the tasks directory
 * @param query - Search query (case-insensitive substring match)
 * @returns Array of matching TaskDocument objects
 */
export declare function searchTaskFiles(boardDir: string, query: string): TaskDocument[];
/**
 * Search completed task logs by query string.
 *
 * @param logsDir - Absolute path to the logs directory
 * @param query - Search query (case-insensitive substring match)
 * @returns Array of matching TaskDocument objects
 */
export declare function searchLogs(logsDir: string, query: string): TaskDocument[];
/**
 * Default mapping from contract status to column ID.
 * Pass `column` option to override per-call, or `false` to skip column sync.
 */
export declare const DEFAULT_CONTRACT_COLUMN_MAP: Readonly<Record<string, string>>;
export interface ContractTransitionOptions {
    /** Override target column ID, or `false` to skip column sync entirely. */
    column?: string | false;
}
export interface ContractTransitionWithFeedbackOptions extends ContractTransitionOptions {
    feedback?: string;
}
export interface CompleteContractOptions extends CompleteTaskFileOptions {
    /** Override target column, or `false` to skip column sync (task is archived regardless). */
    column?: string | false;
}
/**
 * Pickup a contract: set status to `in_progress`, apply pickup metrics,
 * and move the task column to `in-progress` (default) or a custom column.
 *
 * @param taskPath - Absolute path to the task file
 * @param options - Optional column override or `false` to skip column sync
 */
export declare function pickupTaskContract(taskPath: string, options?: ContractTransitionOptions): TaskOperationResult;
/**
 * Deliver a contract: set status to `delivered`, apply deliver metrics,
 * and move the task column to `review` (default) or a custom column.
 *
 * @param taskPath - Absolute path to the task file
 * @param options - Optional column override or `false` to skip column sync
 */
export declare function deliverTaskContract(taskPath: string, options?: ContractTransitionOptions): TaskOperationResult;
/**
 * Complete a contract: set status to `done`, then archive the task to logs via
 * `completeTaskFile()`. The task is removed from `board/` and recorded in the ledger.
 *
 * @param taskPath - Absolute path to the task file in board/
 * @param logsDir - Absolute path to the logs directory
 * @param options - Optional completion behavior and ledger details
 */
export declare function completeTaskContract(taskPath: string, logsDir: string, options?: CompleteContractOptions): TaskOperationResult;
/**
 * Fail a contract: set status to `failed`, add feedback,
 * and optionally move column to `blocked` or a custom column.
 *
 * @param taskPath - Absolute path to the task file
 * @param feedback - Failure reason / feedback for the agent
 * @param options - Optional column override or `false` to skip column sync
 */
export declare function failTaskContract(taskPath: string, feedback: string, options?: ContractTransitionOptions): TaskOperationResult;
/**
 * Returns the most relevant user-facing state for a task.
 * When a contract exists, its status takes priority over the column.
 */
export declare function getEffectiveState(task: Task): string;
//# sourceMappingURL=taskOperations.d.ts.map
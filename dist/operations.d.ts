/**
 * Pure board mutation operations
 * These functions return new board objects without side effects
 */
import type { Board, Rules } from './types';
type RuleCategory = keyof Rules;
/**
 * Input for creating a new task
 * Only title is required - all other fields are optional
 */
export interface TaskInput {
    title: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high' | 'critical';
    tags?: string[];
    blockedBy?: string[];
    assignee?: string;
    dueDate?: string;
    relatedFiles?: string[];
    template?: 'bug' | 'feature' | 'refactor';
    subtasks?: string[];
}
/**
 * Input for patching an existing task
 * All fields are optional - only provided fields are updated
 */
export interface TaskPatch {
    title?: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high' | 'critical' | null;
    tags?: string[] | null;
    blockedBy?: string[] | null;
    assignee?: string | null;
    dueDate?: string | null;
    relatedFiles?: string[] | null;
    template?: 'bug' | 'feature' | 'refactor' | null;
}
/**
 * Result of a board operation
 */
export interface BoardOperationResult {
    success: boolean;
    board?: Board;
    error?: string;
}
/**
 * Result of a single item in a bulk operation
 */
export interface BulkItemResult {
    id: string;
    success: boolean;
    error?: string;
}
/**
 * Result of a bulk operation
 */
export interface BulkOperationResult {
    success: boolean;
    board?: Board;
    results: BulkItemResult[];
    /** Number of successfully processed items */
    successCount: number;
    /** Number of failed items */
    failureCount: number;
}
/**
 * Move a task from one column to another at a specific index
 */
export declare function moveTask(board: Board, taskId: string, fromColumnId: string, toColumnId: string, toIndex: number): BoardOperationResult;
/**
 * Add a new task to a column
 * @param board - Board to modify
 * @param columnId - Target column ID
 * @param input - Task input (title required, all other fields optional)
 */
export declare function addTask(board: Board, columnId: string, input: TaskInput): BoardOperationResult;
/**
 * Update a task's title and description
 */
export declare function updateTask(board: Board, columnId: string, taskId: string, newTitle: string, newDescription: string): BoardOperationResult;
/**
 * Delete a task from a column
 */
export declare function deleteTask(board: Board, columnId: string, taskId: string): BoardOperationResult;
/**
 * Toggle a subtask's completed status
 */
export declare function toggleSubtask(board: Board, taskId: string, subtaskId: string): BoardOperationResult;
/**
 * Update board title
 */
export declare function updateBoardTitle(board: Board, newTitle: string): BoardOperationResult;
/**
 * Update stats configuration
 */
export declare function updateStatsConfig(board: Board, columns: string[]): BoardOperationResult;
/**
 * Archive a task (move from column to archive)
 */
export declare function archiveTask(board: Board, columnId: string, taskId: string): BoardOperationResult;
/**
 * Restore a task from archive to a column
 */
export declare function restoreTask(board: Board, taskId: string, toColumnId: string): BoardOperationResult;
/**
 * Patch a task with partial updates
 * Only provided fields are updated - undefined fields are unchanged
 * Fields set to null are removed from the task
 * @param board - Board to modify
 * @param taskId - Task ID to patch (searches all columns)
 * @param patch - Partial task updates
 */
export declare function patchTask(board: Board, taskId: string, patch: TaskPatch): BoardOperationResult;
/**
 * Add a subtask to a task
 * @param board - Board to modify
 * @param taskId - Parent task ID
 * @param title - Subtask title
 */
export declare function addSubtask(board: Board, taskId: string, title: string): BoardOperationResult;
/**
 * Delete a subtask from a task
 * @param board - Board to modify
 * @param taskId - Parent task ID
 * @param subtaskId - Subtask ID to delete
 */
export declare function deleteSubtask(board: Board, taskId: string, subtaskId: string): BoardOperationResult;
/**
 * Update a subtask's title
 * @param board - Board to modify
 * @param taskId - Parent task ID
 * @param subtaskId - Subtask ID to update
 * @param title - New subtask title
 */
export declare function updateSubtask(board: Board, taskId: string, subtaskId: string, title: string): BoardOperationResult;
/**
 * Set multiple subtasks to completed or incomplete
 * @param board - Board to modify
 * @param taskId - Parent task ID
 * @param subtaskIds - Array of subtask IDs to update
 * @param completed - Whether to mark as completed (true) or incomplete (false)
 */
export declare function setSubtasksCompleted(board: Board, taskId: string, subtaskIds: string[], completed: boolean): BoardOperationResult;
/**
 * Set all subtasks in a task to completed or incomplete
 * @param board - Board to modify
 * @param taskId - Parent task ID
 * @param completed - Whether to mark as completed (true) or incomplete (false)
 */
export declare function setAllSubtasksCompleted(board: Board, taskId: string, completed: boolean): BoardOperationResult;
/**
 * Add a rule entry to the board's guidelines
 * @param board - Board to modify
 * @param ruleType - Rule category (always, never, prefer, context)
 * @param ruleText - Rule description text
 */
export declare function addRule(board: Board, ruleType: RuleCategory, ruleText: string): BoardOperationResult;
/**
 * Remove a rule entry from the board
 * @param board - Board to modify
 * @param ruleType - Rule category (always, never, prefer, context)
 * @param ruleId - ID of the rule to remove
 */
export declare function deleteRule(board: Board, ruleType: RuleCategory, ruleId: number): BoardOperationResult;
/**
 * Move multiple tasks to a target column
 * Operations are applied sequentially - partial success is possible
 * @param board - Board to modify
 * @param taskIds - Array of task IDs to move
 * @param toColumnId - Target column ID
 */
export declare function moveTasks(board: Board, taskIds: string[], toColumnId: string): BulkOperationResult;
/**
 * Apply a patch to multiple tasks
 * Operations are applied sequentially - partial success is possible
 * @param board - Board to modify
 * @param taskIds - Array of task IDs to patch
 * @param patch - Patch to apply to all tasks
 */
export declare function patchTasks(board: Board, taskIds: string[], patch: TaskPatch): BulkOperationResult;
/**
 * Delete multiple tasks
 * Operations are applied sequentially - partial success is possible
 * @param board - Board to modify
 * @param taskIds - Array of task IDs to delete (searches all columns)
 */
export declare function deleteTasks(board: Board, taskIds: string[]): BulkOperationResult;
/**
 * Archive multiple tasks
 * Operations are applied sequentially - partial success is possible
 * @param board - Board to modify
 * @param taskIds - Array of task IDs to archive (searches all columns)
 */
export declare function archiveTasks(board: Board, taskIds: string[]): BulkOperationResult;
export {};
//# sourceMappingURL=operations.d.ts.map
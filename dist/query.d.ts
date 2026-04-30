/**
 * Query and finder functions for boards
 * These are pure read-only functions that don't modify the board
 */
import type { Board, Column, Task } from './types';
/**
 * Find a column by ID
 * @param board - Board to search
 * @param columnId - Column ID to find
 * @returns Column or undefined
 */
export declare function findColumnById(board: Board, columnId: string): Column | undefined;
/**
 * Find a column by title (case-insensitive)
 * @param board - Board to search
 * @param title - Column title to find
 * @returns Column or undefined
 */
export declare function findColumnByName(board: Board, title: string): Column | undefined;
/**
 * Find a task by ID across all columns
 * @param board - Board to search
 * @param taskId - Task ID to find
 * @returns Task and column info, or undefined if not found
 */
export declare function findTaskById(board: Board, taskId: string): {
    task: Task;
    column: Column;
    index: number;
} | undefined;
/**
 * Check if a task ID already exists in a board
 * @param board - Board to check
 * @param taskId - Task ID to look for
 * @returns True if task ID exists
 */
export declare function taskIdExists(board: Board, taskId: string): boolean;
/**
 * Get all tasks from a board (across all columns)
 * @param board - Board to query
 * @returns Array of all tasks
 */
export declare function getAllTasks(board: Board): Task[];
/**
 * Get tasks by tag
 * @param board - Board to query
 * @param tag - Tag to filter by
 * @returns Array of tasks with the specified tag
 */
export declare function getTasksByTag(board: Board, tag: string): Task[];
/**
 * Get tasks by priority
 * @param board - Board to query
 * @param priority - Priority level to filter by
 * @returns Array of tasks with the specified priority
 */
export declare function getTasksByPriority(board: Board, priority: 'low' | 'medium' | 'high' | 'critical'): Task[];
/**
 * Get tasks by assignee
 * @param board - Board to query
 * @param assignee - Assignee name to filter by
 * @returns Array of tasks assigned to the specified person
 */
export declare function getTasksByAssignee(board: Board, assignee: string): Task[];
/**
 * Search tasks by title or description (case-insensitive)
 * @param board - Board to search
 * @param query - Search query string
 * @returns Array of tasks matching the query
 */
export declare function searchTasks(board: Board, query: string): Task[];
/**
 * Get task count for a column
 * @param board - Board to query
 * @param columnId - Column ID
 * @returns Number of tasks in the column, or 0 if column not found
 */
export declare function getColumnTaskCount(board: Board, columnId: string): number;
/**
 * Get total task count across all columns
 * @param board - Board to query
 * @returns Total number of tasks
 */
export declare function getTotalTaskCount(board: Board): number;
/**
 * Check if a column exists
 * @param board - Board to check
 * @param columnId - Column ID to look for
 * @returns True if column exists
 */
export declare function columnExists(board: Board, columnId: string): boolean;
/**
 * Find the completion column in a board
 * Uses explicit completionColumn property if set, otherwise falls back to name-based detection
 * @param board - Board to search
 * @returns Completion column or undefined if not found
 */
export declare function findCompletionColumn(board: Board): Column | undefined;
/**
 * Check if a column is a completion column
 * @param board - Board to check
 * @param columnId - Column ID to check
 * @returns True if the column is the completion column
 */
export declare function isCompletionColumn(board: Board, columnId: string): boolean;
/**
 * Find tasks with incomplete subtasks
 * @param board - Board to query
 * @returns Array of tasks that have at least one incomplete subtask
 */
export declare function getTasksWithIncompleteSubtasks(board: Board): Task[];
/**
 * Find overdue tasks
 * @param board - Board to query
 * @param currentDate - Current date to compare against (defaults to now)
 * @returns Array of tasks past their due date
 */
export declare function getOverdueTasks(board: Board, currentDate?: Date): Task[];
//# sourceMappingURL=query.d.ts.map
/**
 * ID generation utilities for tasks and other entities
 */
import type { Board } from './types';
/**
 * Extract numeric ID from a prefixed ID string.
 * Also matches subtask IDs (e.g., "task-42-1" returns 42).
 * @param taskId - ID like "task-123", "task-42-1", or "epic-5"
 * @param prefix - Prefix to match (default: "task")
 * @returns Numeric portion or 0 if not parseable
 */
export declare function extractTaskIdNumber(taskId: string, prefix?: string): number;
/**
 * Get the highest task ID number from a board
 * @param board - Board to scan
 * @returns Highest task ID number found, or 0 if no tasks
 */
export declare function getMaxTaskIdNumber(board: Board): number;
/**
 * Generate the next task ID for a board
 * @param board - Board to generate ID for
 * @returns Next task ID like "task-42"
 */
export declare function generateNextTaskId(board: Board): string;
/**
 * Generate a subtask ID based on a task ID and index
 * @param taskId - Parent task ID
 * @param index - Subtask index
 * @returns Subtask ID like "task-42-1"
 */
export declare function generateSubtaskId(taskId: string, index: number): string;
/**
 * Generate the next subtask ID for a task
 * @param taskId - Parent task ID
 * @param existingSubtaskIds - Array of existing subtask IDs
 * @returns Next subtask ID
 */
export declare function generateNextSubtaskId(taskId: string, existingSubtaskIds: string[]): string;
/**
 * Validate task ID format.
 * Accepts "task-N" by default, or "{prefix}-N" when a prefix is provided.
 * @param taskId - Task ID to validate
 * @param prefix - Optional prefix (default: "task")
 * @returns True if valid format
 */
export declare function isValidTaskId(taskId: string, prefix?: string): boolean;
/**
 * Validate subtask ID format.
 * Accepts "task-N-M" by default, or "{prefix}-N-M" when a prefix is provided.
 * @param subtaskId - Subtask ID to validate
 * @param prefix - Optional prefix (default: "task")
 * @returns True if valid format
 */
export declare function isValidSubtaskId(subtaskId: string, prefix?: string): boolean;
/**
 * Extract parent task ID from subtask ID.
 * Accepts "task-N-M" by default, or "{prefix}-N-M" when a prefix is provided.
 * @param subtaskId - Subtask ID like "task-42-1" or "epic-3-2"
 * @param prefix - Optional prefix (default: "task")
 * @returns Parent task ID like "task-42", or undefined if invalid
 */
export declare function getParentTaskId(subtaskId: string, prefix?: string): string | undefined;
//# sourceMappingURL=idGen.d.ts.map
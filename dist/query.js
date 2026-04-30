"use strict";
/**
 * Query and finder functions for boards
 * These are pure read-only functions that don't modify the board
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.findColumnById = findColumnById;
exports.findColumnByName = findColumnByName;
exports.findTaskById = findTaskById;
exports.taskIdExists = taskIdExists;
exports.getAllTasks = getAllTasks;
exports.getTasksByTag = getTasksByTag;
exports.getTasksByPriority = getTasksByPriority;
exports.getTasksByAssignee = getTasksByAssignee;
exports.searchTasks = searchTasks;
exports.getColumnTaskCount = getColumnTaskCount;
exports.getTotalTaskCount = getTotalTaskCount;
exports.columnExists = columnExists;
exports.findCompletionColumn = findCompletionColumn;
exports.isCompletionColumn = isCompletionColumn;
exports.getTasksWithIncompleteSubtasks = getTasksWithIncompleteSubtasks;
exports.getOverdueTasks = getOverdueTasks;
/**
 * Find a column by ID
 * @param board - Board to search
 * @param columnId - Column ID to find
 * @returns Column or undefined
 */
function findColumnById(board, columnId) {
    return board.columns.find((col) => col.id === columnId);
}
/**
 * Find a column by title (case-insensitive)
 * @param board - Board to search
 * @param title - Column title to find
 * @returns Column or undefined
 */
function findColumnByName(board, title) {
    const normalizedTitle = title.toLowerCase();
    return board.columns.find((col) => col.title.toLowerCase() === normalizedTitle);
}
/**
 * Find a task by ID across all columns
 * @param board - Board to search
 * @param taskId - Task ID to find
 * @returns Task and column info, or undefined if not found
 */
function findTaskById(board, taskId) {
    for (const column of board.columns) {
        const index = column.tasks.findIndex((t) => t.id === taskId);
        if (index !== -1) {
            return { task: column.tasks[index], column, index };
        }
    }
    return undefined;
}
/**
 * Check if a task ID already exists in a board
 * @param board - Board to check
 * @param taskId - Task ID to look for
 * @returns True if task ID exists
 */
function taskIdExists(board, taskId) {
    return board.columns.some((col) => col.tasks.some((t) => t.id === taskId));
}
/**
 * Get all tasks from a board (across all columns)
 * @param board - Board to query
 * @returns Array of all tasks
 */
function getAllTasks(board) {
    return board.columns.flatMap((col) => col.tasks);
}
/**
 * Get tasks by tag
 * @param board - Board to query
 * @param tag - Tag to filter by
 * @returns Array of tasks with the specified tag
 */
function getTasksByTag(board, tag) {
    return getAllTasks(board).filter((task) => task.tags?.includes(tag));
}
/**
 * Get tasks by priority
 * @param board - Board to query
 * @param priority - Priority level to filter by
 * @returns Array of tasks with the specified priority
 */
function getTasksByPriority(board, priority) {
    return getAllTasks(board).filter((task) => task.priority === priority);
}
/**
 * Get tasks by assignee
 * @param board - Board to query
 * @param assignee - Assignee name to filter by
 * @returns Array of tasks assigned to the specified person
 */
function getTasksByAssignee(board, assignee) {
    return getAllTasks(board).filter((task) => task.assignee === assignee);
}
/**
 * Search tasks by title or description (case-insensitive)
 * @param board - Board to search
 * @param query - Search query string
 * @returns Array of tasks matching the query
 */
function searchTasks(board, query) {
    const normalizedQuery = query.toLowerCase();
    return getAllTasks(board).filter((task) => task.title.toLowerCase().includes(normalizedQuery) ||
        task.description?.toLowerCase().includes(normalizedQuery));
}
/**
 * Get task count for a column
 * @param board - Board to query
 * @param columnId - Column ID
 * @returns Number of tasks in the column, or 0 if column not found
 */
function getColumnTaskCount(board, columnId) {
    const column = findColumnById(board, columnId);
    return column ? column.tasks.length : 0;
}
/**
 * Get total task count across all columns
 * @param board - Board to query
 * @returns Total number of tasks
 */
function getTotalTaskCount(board) {
    return board.columns.reduce((sum, col) => sum + col.tasks.length, 0);
}
/**
 * Check if a column exists
 * @param board - Board to check
 * @param columnId - Column ID to look for
 * @returns True if column exists
 */
function columnExists(board, columnId) {
    return board.columns.some((col) => col.id === columnId);
}
/**
 * Find the completion column in a board
 * Uses explicit completionColumn property if set, otherwise falls back to name-based detection
 * @param board - Board to search
 * @returns Completion column or undefined if not found
 */
function findCompletionColumn(board) {
    if (!board.columns || board.columns.length === 0)
        return undefined;
    // First, check for explicit completionColumn property
    const explicitColumn = board.columns.find((col) => col.completionColumn === true);
    if (explicitColumn)
        return explicitColumn;
    // Fall back to name-based detection (common completion column patterns)
    const completionPatterns = [/done/i, /complete/i, /finished/i, /closed/i];
    for (const pattern of completionPatterns) {
        const match = board.columns.find((col) => pattern.test(col.title) || pattern.test(col.id));
        if (match)
            return match;
    }
    // Fall back to the last column (common Kanban convention)
    return board.columns[board.columns.length - 1];
}
/**
 * Check if a column is a completion column
 * @param board - Board to check
 * @param columnId - Column ID to check
 * @returns True if the column is the completion column
 */
function isCompletionColumn(board, columnId) {
    const completionCol = findCompletionColumn(board);
    return completionCol?.id === columnId;
}
/**
 * Find tasks with incomplete subtasks
 * @param board - Board to query
 * @returns Array of tasks that have at least one incomplete subtask
 */
function getTasksWithIncompleteSubtasks(board) {
    return getAllTasks(board).filter((task) => task.subtasks && task.subtasks.some((st) => !st.completed));
}
/**
 * Find overdue tasks
 * @param board - Board to query
 * @param currentDate - Current date to compare against (defaults to now)
 * @returns Array of tasks past their due date
 */
function getOverdueTasks(board, currentDate = new Date()) {
    return getAllTasks(board).filter((task) => {
        if (!task.dueDate)
            return false;
        const dueDate = new Date(task.dueDate);
        return dueDate < currentDate;
    });
}
//# sourceMappingURL=query.js.map
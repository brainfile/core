"use strict";
/**
 * Pure board mutation operations
 * These functions return new board objects without side effects
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveTask = moveTask;
exports.addTask = addTask;
exports.updateTask = updateTask;
exports.deleteTask = deleteTask;
exports.toggleSubtask = toggleSubtask;
exports.updateBoardTitle = updateBoardTitle;
exports.updateStatsConfig = updateStatsConfig;
exports.archiveTask = archiveTask;
exports.restoreTask = restoreTask;
exports.patchTask = patchTask;
exports.addSubtask = addSubtask;
exports.deleteSubtask = deleteSubtask;
exports.updateSubtask = updateSubtask;
exports.setSubtasksCompleted = setSubtasksCompleted;
exports.setAllSubtasksCompleted = setAllSubtasksCompleted;
exports.addRule = addRule;
exports.deleteRule = deleteRule;
exports.moveTasks = moveTasks;
exports.patchTasks = patchTasks;
exports.deleteTasks = deleteTasks;
exports.archiveTasks = archiveTasks;
const query_1 = require("./query");
const idGen_1 = require("./idGen");
/**
 * Move a task from one column to another at a specific index
 */
function moveTask(board, taskId, fromColumnId, toColumnId, toIndex) {
    const fromColumn = (0, query_1.findColumnById)(board, fromColumnId);
    if (!fromColumn) {
        return { success: false, error: `Source column ${fromColumnId} not found` };
    }
    const toColumn = (0, query_1.findColumnById)(board, toColumnId);
    if (!toColumn) {
        return { success: false, error: `Target column ${toColumnId} not found` };
    }
    const taskIndex = fromColumn.tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) {
        return { success: false, error: `Task ${taskId} not found in column ${fromColumnId}` };
    }
    const task = fromColumn.tasks[taskIndex];
    // Create new columns with task moved
    const newColumns = board.columns.map((col) => {
        if (col.id === fromColumnId && col.id === toColumnId) {
            // Same column - reorder
            const tasks = [...col.tasks];
            tasks.splice(taskIndex, 1);
            tasks.splice(toIndex, 0, task);
            return { ...col, tasks };
        }
        else if (col.id === fromColumnId) {
            // Remove from source
            return { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) };
        }
        else if (col.id === toColumnId) {
            // Add to target
            const tasks = [...col.tasks];
            tasks.splice(toIndex, 0, task);
            return { ...col, tasks };
        }
        return col;
    });
    return { success: true, board: { ...board, columns: newColumns } };
}
/**
 * Add a new task to a column
 * @param board - Board to modify
 * @param columnId - Target column ID
 * @param input - Task input (title required, all other fields optional)
 */
function addTask(board, columnId, input) {
    const column = (0, query_1.findColumnById)(board, columnId);
    if (!column) {
        return { success: false, error: `Column ${columnId} not found` };
    }
    if (!input.title || input.title.trim() === '') {
        return { success: false, error: 'Task title is required' };
    }
    const newTaskId = (0, idGen_1.generateNextTaskId)(board);
    // Generate subtasks with auto-generated IDs
    const subtasks = input.subtasks?.map((title, index) => ({
        id: `${newTaskId}-${index + 1}`,
        title: title.trim(),
        completed: false,
    }));
    const newTask = {
        id: newTaskId,
        title: input.title.trim(),
        ...(input.description && { description: input.description.trim() }),
        ...(input.priority && { priority: input.priority }),
        ...(input.tags && input.tags.length > 0 && { tags: input.tags }),
        ...(input.blockedBy && input.blockedBy.length > 0 && { blockedBy: input.blockedBy }),
        ...(input.assignee && { assignee: input.assignee }),
        ...(input.dueDate && { dueDate: input.dueDate }),
        ...(input.relatedFiles && input.relatedFiles.length > 0 && { relatedFiles: input.relatedFiles }),
        ...(input.template && { template: input.template }),
        ...(subtasks && subtasks.length > 0 && { subtasks }),
    };
    const newBoard = {
        ...board,
        columns: board.columns.map((col) => {
            if (col.id !== columnId)
                return col;
            return { ...col, tasks: [...col.tasks, newTask] };
        }),
    };
    return { success: true, board: newBoard };
}
/**
 * Update a task's title and description
 */
function updateTask(board, columnId, taskId, newTitle, newDescription) {
    const column = (0, query_1.findColumnById)(board, columnId);
    if (!column) {
        return { success: false, error: `Column ${columnId} not found` };
    }
    const taskIndex = column.tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) {
        return { success: false, error: `Task ${taskId} not found in column ${columnId}` };
    }
    // Create new board with updated task
    const newBoard = {
        ...board,
        columns: board.columns.map((col) => {
            if (col.id !== columnId)
                return col;
            return {
                ...col,
                tasks: col.tasks.map((task) => {
                    if (task.id !== taskId)
                        return task;
                    return { ...task, title: newTitle, description: newDescription };
                }),
            };
        }),
    };
    return { success: true, board: newBoard };
}
/**
 * Delete a task from a column
 */
function deleteTask(board, columnId, taskId) {
    const column = (0, query_1.findColumnById)(board, columnId);
    if (!column) {
        return { success: false, error: `Column ${columnId} not found` };
    }
    const taskExists = column.tasks.some((t) => t.id === taskId);
    if (!taskExists) {
        return { success: false, error: `Task ${taskId} not found in column ${columnId}` };
    }
    const newBoard = {
        ...board,
        columns: board.columns.map((col) => {
            if (col.id !== columnId)
                return col;
            return {
                ...col,
                tasks: col.tasks.filter((t) => t.id !== taskId),
            };
        }),
    };
    return { success: true, board: newBoard };
}
/**
 * Toggle a subtask's completed status
 */
function toggleSubtask(board, taskId, subtaskId) {
    const taskInfo = (0, query_1.findTaskById)(board, taskId);
    if (!taskInfo) {
        return { success: false, error: `Task ${taskId} not found` };
    }
    const { task, column } = taskInfo;
    if (!task.subtasks || task.subtasks.length === 0) {
        return { success: false, error: `Task ${taskId} has no subtasks` };
    }
    const subtaskIndex = task.subtasks.findIndex((st) => st.id === subtaskId);
    if (subtaskIndex === -1) {
        return { success: false, error: `Subtask ${subtaskId} not found` };
    }
    const newBoard = {
        ...board,
        columns: board.columns.map((col) => {
            if (col.id !== column.id)
                return col;
            return {
                ...col,
                tasks: col.tasks.map((t) => {
                    if (t.id !== taskId)
                        return t;
                    return {
                        ...t,
                        subtasks: t.subtasks.map((st) => {
                            if (st.id !== subtaskId)
                                return st;
                            return { ...st, completed: !st.completed };
                        }),
                    };
                }),
            };
        }),
    };
    return { success: true, board: newBoard };
}
/**
 * Update board title
 */
function updateBoardTitle(board, newTitle) {
    return {
        success: true,
        board: { ...board, title: newTitle },
    };
}
/**
 * Update stats configuration
 */
function updateStatsConfig(board, columns) {
    return {
        success: true,
        board: {
            ...board,
            statsConfig: { columns },
        },
    };
}
/**
 * Archive a task (move from column to archive)
 */
function archiveTask(board, columnId, taskId) {
    const column = (0, query_1.findColumnById)(board, columnId);
    if (!column) {
        return { success: false, error: `Column ${columnId} not found` };
    }
    const task = column.tasks.find((t) => t.id === taskId);
    if (!task) {
        return { success: false, error: `Task ${taskId} not found in column ${columnId}` };
    }
    const newBoard = {
        ...board,
        columns: board.columns.map((col) => {
            if (col.id !== columnId)
                return col;
            return {
                ...col,
                tasks: col.tasks.filter((t) => t.id !== taskId),
            };
        }),
        archive: [...(board.archive || []), task],
    };
    return { success: true, board: newBoard };
}
/**
 * Restore a task from archive to a column
 */
function restoreTask(board, taskId, toColumnId) {
    if (!board.archive || board.archive.length === 0) {
        return { success: false, error: 'Archive is empty' };
    }
    const task = board.archive.find((t) => t.id === taskId);
    if (!task) {
        return { success: false, error: `Task ${taskId} not found in archive` };
    }
    const toColumn = (0, query_1.findColumnById)(board, toColumnId);
    if (!toColumn) {
        return { success: false, error: `Target column ${toColumnId} not found` };
    }
    const newBoard = {
        ...board,
        columns: board.columns.map((col) => {
            if (col.id !== toColumnId)
                return col;
            return {
                ...col,
                tasks: [...col.tasks, task],
            };
        }),
        archive: board.archive.filter((t) => t.id !== taskId),
    };
    return { success: true, board: newBoard };
}
/**
 * Patch a task with partial updates
 * Only provided fields are updated - undefined fields are unchanged
 * Fields set to null are removed from the task
 * @param board - Board to modify
 * @param taskId - Task ID to patch (searches all columns)
 * @param patch - Partial task updates
 */
function patchTask(board, taskId, patch) {
    const taskInfo = (0, query_1.findTaskById)(board, taskId);
    if (!taskInfo) {
        return { success: false, error: `Task ${taskId} not found` };
    }
    const { task, column } = taskInfo;
    // Build updated task, handling null values as deletions
    const updatedTask = { ...task };
    if (patch.title !== undefined) {
        updatedTask.title = patch.title.trim();
    }
    if (patch.description !== undefined) {
        if (patch.description === null) {
            delete updatedTask.description;
        }
        else {
            updatedTask.description = patch.description.trim();
        }
    }
    if (patch.priority !== undefined) {
        if (patch.priority === null) {
            delete updatedTask.priority;
        }
        else {
            updatedTask.priority = patch.priority;
        }
    }
    if (patch.tags !== undefined) {
        if (patch.tags === null || patch.tags.length === 0) {
            delete updatedTask.tags;
        }
        else {
            updatedTask.tags = patch.tags;
        }
    }
    if (patch.blockedBy !== undefined) {
        if (patch.blockedBy === null || patch.blockedBy.length === 0) {
            delete updatedTask.blockedBy;
        }
        else {
            updatedTask.blockedBy = patch.blockedBy;
        }
    }
    if (patch.assignee !== undefined) {
        if (patch.assignee === null) {
            delete updatedTask.assignee;
        }
        else {
            updatedTask.assignee = patch.assignee;
        }
    }
    if (patch.dueDate !== undefined) {
        if (patch.dueDate === null) {
            delete updatedTask.dueDate;
        }
        else {
            updatedTask.dueDate = patch.dueDate;
        }
    }
    if (patch.relatedFiles !== undefined) {
        if (patch.relatedFiles === null || patch.relatedFiles.length === 0) {
            delete updatedTask.relatedFiles;
        }
        else {
            updatedTask.relatedFiles = patch.relatedFiles;
        }
    }
    if (patch.template !== undefined) {
        if (patch.template === null) {
            delete updatedTask.template;
        }
        else {
            updatedTask.template = patch.template;
        }
    }
    const newBoard = {
        ...board,
        columns: board.columns.map((col) => {
            if (col.id !== column.id)
                return col;
            return {
                ...col,
                tasks: col.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
            };
        }),
    };
    return { success: true, board: newBoard };
}
/**
 * Add a subtask to a task
 * @param board - Board to modify
 * @param taskId - Parent task ID
 * @param title - Subtask title
 */
function addSubtask(board, taskId, title) {
    const taskInfo = (0, query_1.findTaskById)(board, taskId);
    if (!taskInfo) {
        return { success: false, error: `Task ${taskId} not found` };
    }
    if (!title || title.trim() === '') {
        return { success: false, error: 'Subtask title is required' };
    }
    const { task, column } = taskInfo;
    const existingIds = task.subtasks?.map((st) => st.id) || [];
    const newSubtaskId = (0, idGen_1.generateNextSubtaskId)(taskId, existingIds);
    const newSubtask = {
        id: newSubtaskId,
        title: title.trim(),
        completed: false,
    };
    const newBoard = {
        ...board,
        columns: board.columns.map((col) => {
            if (col.id !== column.id)
                return col;
            return {
                ...col,
                tasks: col.tasks.map((t) => {
                    if (t.id !== taskId)
                        return t;
                    return {
                        ...t,
                        subtasks: [...(t.subtasks || []), newSubtask],
                    };
                }),
            };
        }),
    };
    return { success: true, board: newBoard };
}
/**
 * Delete a subtask from a task
 * @param board - Board to modify
 * @param taskId - Parent task ID
 * @param subtaskId - Subtask ID to delete
 */
function deleteSubtask(board, taskId, subtaskId) {
    const taskInfo = (0, query_1.findTaskById)(board, taskId);
    if (!taskInfo) {
        return { success: false, error: `Task ${taskId} not found` };
    }
    const { task, column } = taskInfo;
    if (!task.subtasks || task.subtasks.length === 0) {
        return { success: false, error: `Task ${taskId} has no subtasks` };
    }
    const subtaskExists = task.subtasks.some((st) => st.id === subtaskId);
    if (!subtaskExists) {
        return { success: false, error: `Subtask ${subtaskId} not found` };
    }
    const newBoard = {
        ...board,
        columns: board.columns.map((col) => {
            if (col.id !== column.id)
                return col;
            return {
                ...col,
                tasks: col.tasks.map((t) => {
                    if (t.id !== taskId)
                        return t;
                    const remainingSubtasks = t.subtasks.filter((st) => st.id !== subtaskId);
                    if (remainingSubtasks.length === 0) {
                        const { subtasks, ...taskWithoutSubtasks } = t;
                        return taskWithoutSubtasks;
                    }
                    return { ...t, subtasks: remainingSubtasks };
                }),
            };
        }),
    };
    return { success: true, board: newBoard };
}
/**
 * Update a subtask's title
 * @param board - Board to modify
 * @param taskId - Parent task ID
 * @param subtaskId - Subtask ID to update
 * @param title - New subtask title
 */
function updateSubtask(board, taskId, subtaskId, title) {
    const taskInfo = (0, query_1.findTaskById)(board, taskId);
    if (!taskInfo) {
        return { success: false, error: `Task ${taskId} not found` };
    }
    if (!title || title.trim() === '') {
        return { success: false, error: 'Subtask title is required' };
    }
    const { task, column } = taskInfo;
    if (!task.subtasks || task.subtasks.length === 0) {
        return { success: false, error: `Task ${taskId} has no subtasks` };
    }
    const subtaskExists = task.subtasks.some((st) => st.id === subtaskId);
    if (!subtaskExists) {
        return { success: false, error: `Subtask ${subtaskId} not found` };
    }
    const newBoard = {
        ...board,
        columns: board.columns.map((col) => {
            if (col.id !== column.id)
                return col;
            return {
                ...col,
                tasks: col.tasks.map((t) => {
                    if (t.id !== taskId)
                        return t;
                    return {
                        ...t,
                        subtasks: t.subtasks.map((st) => {
                            if (st.id !== subtaskId)
                                return st;
                            return { ...st, title: title.trim() };
                        }),
                    };
                }),
            };
        }),
    };
    return { success: true, board: newBoard };
}
/**
 * Set multiple subtasks to completed or incomplete
 * @param board - Board to modify
 * @param taskId - Parent task ID
 * @param subtaskIds - Array of subtask IDs to update
 * @param completed - Whether to mark as completed (true) or incomplete (false)
 */
function setSubtasksCompleted(board, taskId, subtaskIds, completed) {
    const taskInfo = (0, query_1.findTaskById)(board, taskId);
    if (!taskInfo) {
        return { success: false, error: `Task ${taskId} not found` };
    }
    const { task, column } = taskInfo;
    if (!task.subtasks || task.subtasks.length === 0) {
        return { success: false, error: `Task ${taskId} has no subtasks` };
    }
    // Validate all subtask IDs exist before making changes (atomic)
    for (const subtaskId of subtaskIds) {
        const exists = task.subtasks.some((st) => st.id === subtaskId);
        if (!exists) {
            return { success: false, error: `Subtask ${subtaskId} not found` };
        }
    }
    const subtaskIdSet = new Set(subtaskIds);
    const newBoard = {
        ...board,
        columns: board.columns.map((col) => {
            if (col.id !== column.id)
                return col;
            return {
                ...col,
                tasks: col.tasks.map((t) => {
                    if (t.id !== taskId)
                        return t;
                    return {
                        ...t,
                        subtasks: t.subtasks.map((st) => {
                            if (!subtaskIdSet.has(st.id))
                                return st;
                            return { ...st, completed };
                        }),
                    };
                }),
            };
        }),
    };
    return { success: true, board: newBoard };
}
/**
 * Set all subtasks in a task to completed or incomplete
 * @param board - Board to modify
 * @param taskId - Parent task ID
 * @param completed - Whether to mark as completed (true) or incomplete (false)
 */
function setAllSubtasksCompleted(board, taskId, completed) {
    const taskInfo = (0, query_1.findTaskById)(board, taskId);
    if (!taskInfo) {
        return { success: false, error: `Task ${taskId} not found` };
    }
    const { task, column } = taskInfo;
    if (!task.subtasks || task.subtasks.length === 0) {
        return { success: false, error: `Task ${taskId} has no subtasks` };
    }
    const newBoard = {
        ...board,
        columns: board.columns.map((col) => {
            if (col.id !== column.id)
                return col;
            return {
                ...col,
                tasks: col.tasks.map((t) => {
                    if (t.id !== taskId)
                        return t;
                    return {
                        ...t,
                        subtasks: t.subtasks.map((st) => ({ ...st, completed })),
                    };
                }),
            };
        }),
    };
    return { success: true, board: newBoard };
}
/**
 * Add a rule entry to the board's guidelines
 * @param board - Board to modify
 * @param ruleType - Rule category (always, never, prefer, context)
 * @param ruleText - Rule description text
 */
function addRule(board, ruleType, ruleText) {
    if (!ruleText || ruleText.trim() === '') {
        return { success: false, error: 'Rule text is required' };
    }
    const trimmedRule = ruleText.trim();
    const existingRules = board.rules?.[ruleType] ?? [];
    const nextId = existingRules.reduce((maxId, rule) => Math.max(maxId, rule.id), 0) + 1;
    const newRule = {
        id: nextId,
        rule: trimmedRule,
    };
    const updatedRulesForType = [...existingRules, newRule];
    const updatedRules = {
        ...(board.rules ?? {}),
        [ruleType]: updatedRulesForType,
    };
    return {
        success: true,
        board: {
            ...board,
            rules: updatedRules,
        },
    };
}
/**
 * Remove a rule entry from the board
 * @param board - Board to modify
 * @param ruleType - Rule category (always, never, prefer, context)
 * @param ruleId - ID of the rule to remove
 */
function deleteRule(board, ruleType, ruleId) {
    const rulesForType = board.rules?.[ruleType];
    if (!rulesForType || rulesForType.length === 0) {
        return { success: false, error: `Rule type ${ruleType} has no entries` };
    }
    const exists = rulesForType.some((rule) => rule.id === ruleId);
    if (!exists) {
        return { success: false, error: `Rule ${ruleId} not found in ${ruleType}` };
    }
    const updatedRulesForType = rulesForType.filter((rule) => rule.id !== ruleId);
    const updatedRules = { ...(board.rules ?? {}) };
    if (updatedRulesForType.length > 0) {
        updatedRules[ruleType] = updatedRulesForType;
    }
    else {
        delete updatedRules[ruleType];
    }
    const hasAnyRules = Object.values(updatedRules).some((collection) => collection !== undefined && collection.length > 0);
    return {
        success: true,
        board: {
            ...board,
            rules: hasAnyRules ? updatedRules : undefined,
        },
    };
}
// =============================================================================
// BULK OPERATIONS
// =============================================================================
/**
 * Move multiple tasks to a target column
 * Operations are applied sequentially - partial success is possible
 * @param board - Board to modify
 * @param taskIds - Array of task IDs to move
 * @param toColumnId - Target column ID
 */
function moveTasks(board, taskIds, toColumnId) {
    const results = [];
    let currentBoard = board;
    // Validate target column exists first
    const toColumn = (0, query_1.findColumnById)(board, toColumnId);
    if (!toColumn) {
        return {
            success: false,
            results: taskIds.map((id) => ({ id, success: false, error: `Target column ${toColumnId} not found` })),
            successCount: 0,
            failureCount: taskIds.length,
        };
    }
    for (const taskId of taskIds) {
        const taskInfo = (0, query_1.findTaskById)(currentBoard, taskId);
        if (!taskInfo) {
            results.push({ id: taskId, success: false, error: `Task ${taskId} not found` });
            continue;
        }
        // Skip if already in target column
        if (taskInfo.column.id === toColumnId) {
            results.push({ id: taskId, success: true });
            continue;
        }
        const targetColumn = (0, query_1.findColumnById)(currentBoard, toColumnId);
        const toIndex = targetColumn ? targetColumn.tasks.length : 0;
        const result = moveTask(currentBoard, taskId, taskInfo.column.id, toColumnId, toIndex);
        if (result.success && result.board) {
            currentBoard = result.board;
            results.push({ id: taskId, success: true });
        }
        else {
            results.push({ id: taskId, success: false, error: result.error });
        }
    }
    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.filter((r) => !r.success).length;
    return {
        success: failureCount === 0,
        board: currentBoard,
        results,
        successCount,
        failureCount,
    };
}
/**
 * Apply a patch to multiple tasks
 * Operations are applied sequentially - partial success is possible
 * @param board - Board to modify
 * @param taskIds - Array of task IDs to patch
 * @param patch - Patch to apply to all tasks
 */
function patchTasks(board, taskIds, patch) {
    const results = [];
    let currentBoard = board;
    for (const taskId of taskIds) {
        const result = patchTask(currentBoard, taskId, patch);
        if (result.success && result.board) {
            currentBoard = result.board;
            results.push({ id: taskId, success: true });
        }
        else {
            results.push({ id: taskId, success: false, error: result.error });
        }
    }
    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.filter((r) => !r.success).length;
    return {
        success: failureCount === 0,
        board: currentBoard,
        results,
        successCount,
        failureCount,
    };
}
/**
 * Delete multiple tasks
 * Operations are applied sequentially - partial success is possible
 * @param board - Board to modify
 * @param taskIds - Array of task IDs to delete (searches all columns)
 */
function deleteTasks(board, taskIds) {
    const results = [];
    let currentBoard = board;
    for (const taskId of taskIds) {
        const taskInfo = (0, query_1.findTaskById)(currentBoard, taskId);
        if (!taskInfo) {
            results.push({ id: taskId, success: false, error: `Task ${taskId} not found` });
            continue;
        }
        const result = deleteTask(currentBoard, taskInfo.column.id, taskId);
        if (result.success && result.board) {
            currentBoard = result.board;
            results.push({ id: taskId, success: true });
        }
        else {
            results.push({ id: taskId, success: false, error: result.error });
        }
    }
    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.filter((r) => !r.success).length;
    return {
        success: failureCount === 0,
        board: currentBoard,
        results,
        successCount,
        failureCount,
    };
}
/**
 * Archive multiple tasks
 * Operations are applied sequentially - partial success is possible
 * @param board - Board to modify
 * @param taskIds - Array of task IDs to archive (searches all columns)
 */
function archiveTasks(board, taskIds) {
    const results = [];
    let currentBoard = board;
    for (const taskId of taskIds) {
        const taskInfo = (0, query_1.findTaskById)(currentBoard, taskId);
        if (!taskInfo) {
            results.push({ id: taskId, success: false, error: `Task ${taskId} not found` });
            continue;
        }
        const result = archiveTask(currentBoard, taskInfo.column.id, taskId);
        if (result.success && result.board) {
            currentBoard = result.board;
            results.push({ id: taskId, success: true });
        }
        else {
            results.push({ id: taskId, success: false, error: result.error });
        }
    }
    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.filter((r) => !r.success).length;
    return {
        success: failureCount === 0,
        board: currentBoard,
        results,
        successCount,
        failureCount,
    };
}
//# sourceMappingURL=operations.js.map